import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import Cookies from 'js-cookie';
import { Button, Card, CardContent, Divider, Grid, Typography, Box, Link, Chip } from "@mui/material"

import { CartContext } from '@/context';
import { ShopLayout } from "@/components/layouts"
import { CartList, OrderSummary } from "@/components/cart"
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

const SummaryPage = () => {

    const router = useRouter();
    const { numberOfItems, shippingAddress, createrOrder } = useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!Cookies.get('firstname')) {
            router.push('/checkout/address');
        }
    }, [router])

    const onCreateOrder = async () => {
        setIsPosting(true);

        const { hasError, message } = await createrOrder();

        if (hasError) {
            setIsPosting(false)
            setErrorMessage(message);
            return
        }

        router.replace(`/orders/${message}`)
    }

    if (!shippingAddress) {
        return <></>
    }

    const { address, address2, city, country, firstname, lastName, phone, zip } = shippingAddress


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
                            <Typography>{country}</Typography>
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

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirmar Orden
                                </Button>

                                <Chip
                                    color='error'
                                    label={errorMessage}
                                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>

    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
    const session = await getServerSession(req, res, authOptions);

    const { p = '/auth/login' } = query;
   
        if (!session) {
            return {
                redirect: {
                    destination: p.toString(),
                    permanent: false
                }
            }
        }


    return {
        props: {

        }
    }
}

export default SummaryPage

