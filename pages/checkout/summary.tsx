import NextLink from 'next/link';

import { Button, Card, CardContent, Divider, Grid, Typography, Box, Link } from "@mui/material"

import { ShopLayout } from "@/components/layouts"
import { CartList, OrderSummary } from "@/components/cart"

const SummaryPage = () => {
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
                            <Typography variant="h2">Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>


                            <Typography>Pedro Aristigueta</Typography>
                            <Typography>Salamanca Ate</Typography>
                            <Typography>1522</Typography>
                            <Typography>Perú</Typography>
                            <Typography>+51 959734026</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end' sx={{mb:1}}>
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