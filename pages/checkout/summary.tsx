import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import Cookies from 'js-cookie';
import { Button, Card, CardContent, Divider, Grid, Typography, Box, Link } from "@mui/material"

import { CartContext } from '@/context';
import { ShopLayout } from "@/components/layouts"
import { CartList, OrderSummary } from "@/components/cart"
import { countries } from '@/utils';

const SummaryPage = () => {

    const router = useRouter();
    const { numberOfItems, shippingAddress } = useContext(CartContext);

    useEffect(() => {
        if (!Cookies.get('firstname')) {
            router.push('/checkout/address');
        }
    }, [router])

    if (!shippingAddress) {
        return <></>
    }

    const { address, address2, city, country, firstname, lastName, phone, zip } = shippingAddress

    // const countryName = countries.filter(ctr => {
    //     if(ctr.code === country) {
    //         return ctr.name
    //     }
    // })

    return (
        <ShopLayout title={"Resumen de orden"} pageDescription={"Resumen de la orden"}>

            <Typography variant="h1" component='h1'>
                Resumen de orden
            </Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({numberOfItems > 1 ? `${numberOfItems} productos` : `${numberOfItems} producto`})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>


                            <Typography>{firstname} {lastName}</Typography>
                            <Typography>{address} {address2 ? `,${address2}` : ''} </Typography>
                            <Typography> {city}, {zip} </Typography>
                            {/* <Typography>{countryName[0].name}</Typography> */}
                            <Typography>{country}</Typography>
                            {/* <Typography>{countries.find(ctr => ctr.code === country)?.name}</Typography> */}
                            <Typography>{phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                                <NextLink href='/cart' passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button color="secondary" className="circular-btn" fullWidth>
                                    Confirmar Orden
                                </Button>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>

    )
}

export default SummaryPage