import { useContext, useState } from "react";
import { GetServerSideProps, NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { ProductSlideShow, SizeSelector } from "@/components/products";
import { ShopLayout } from "@/components/layouts";
import { ItemCounter } from "@/components/ui";

import { dbProducts } from "@/database";
import { ICartProduct, IProduct, ISize } from "@/interfaces";
import { CartContext } from "@/context";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const router = useRouter();

  const { addParoductToCart } = useContext(CartContext);

  const [temCartProduct, setTemCartProduct] = useState<ICartProduct>({
    _id: product._id,
    images: product.images[0],
    price: product.price,
    sizes: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const selectedSize = (size: ISize) => {
    setTemCartProduct(currentProduct => ({
      ...currentProduct,
      sizes: size
    }));
  }

  const updatedQuantityValue = (value: number) => {
    setTemCartProduct(currentProduct => ({
      ...currentProduct,
      quantity: value
    }))
  }

  const onAddProduct = () => {
    if (!temCartProduct.sizes) return;
    
    addParoductToCart(temCartProduct)
    
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>

        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            <Typography variant="h1" component='h1'>{product.title}</Typography>
            <Typography variant="subtitle1" component='h2'>${product.price}</Typography>

            {/* cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2" component='h3'>Cantidad</Typography>
              <ItemCounter
                currentValue={temCartProduct.quantity}
                updatedQuantity={updatedQuantityValue}
                maxValue={product.inStock}
              />
              <SizeSelector
                selectedSize={temCartProduct.sizes}
                sizes={product.sizes}
                onSelectedSize={selectedSize}
              />

            </Box>


            {/* Agregar al carrito */}
            {
              (product.inStock > 0)
                ? (
                  <Button

                    onClick={onAddProduct}
                    color="secondary"
                    className="circular-btn">
                    {
                      temCartProduct.sizes
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                  </Button>
                )
                :
                (
                  <Chip label='No hay disponibles' color="error" variant="outlined" />
                )
            }

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const allSlug = await dbProducts.getAllProductSlugs()

  return {
    paths: allSlug.map(({ slug }) => ({
      params: { slug }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string }

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}






//   const { query } = useRouter();
//  const { isLoading, products: product } = useProducts(`products/${query.slug}`);

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug = "" } = params as { slug: string }

//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }


export default ProductPage