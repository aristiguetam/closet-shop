
import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

const MenPage = () => {

    const { isLoading, products } = useProducts('/products?gender=men')

    return (
        <ShopLayout title={"Closet-Shop - Men"} pageDescription={"Todos los productos de hombres"}>
            <Typography variant="h1" component="h1">Hombres</Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos para ellos</Typography>

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }

        </ShopLayout>
    )
}

export default MenPage