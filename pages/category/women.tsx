import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

const WomenPage = () => {

  const { isLoading, products } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={"Closet-Shop - Women"} pageDescription={"Todos los productos de Mujeres"}>
      <Typography variant="h1" component="h1">Mujeres</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos para ellas</Typography>
      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default WomenPage