import { GetServerSideProps, NextPage } from 'next';

import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { dbOrders } from '@/database';
import { CartList, OrderSummary } from "@/components/cart";
import { AdminLayout } from "@/components/layouts";
import { IOrder } from '@/interfaces';

interface Props {
    order: IOrder;
}

const OrderAdminPage: NextPage<Props> = ({ order }: Props) => {

    const { isPaid, _id, numberOfItems, ShippingAddress, orderItems, subTotal, tax, total } = order;
    const { firstname, lastName, city, address2, address, phone, country, zip } = ShippingAddress;



    return (
        <AdminLayout title={`Resumen de la orden`}  subTitle={`ordenId: ${_id}`} icon={<AirplaneTicketOutlined/>} >

            {/* <Typography variant="h1" component='h1'>
                Orden: {_id}
            </Typography> */}

            {
                isPaid ? (
                    <Chip
                        sx={{ my: 2 }}
                        label='La orden ya fue pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />
                ) :
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label='Pendiente de pago'
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }

            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList products={orderItems} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({numberOfItems} {numberOfItems > 1 ? 'Productos' : 'Producto'} )</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{firstname} {lastName}</Typography>
                            <Typography>{address} {address2 ? `,${address2}` : ''} </Typography>
                            <Typography>{city}, {zip}</Typography>
                            <Typography>{country}</Typography>
                            <Typography>{phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{
                                    numberOfItems,
                                    subTotal,
                                    tax,
                                    total,
                                }}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>

                                <Box sx={{ display:'flex', flex: 1 }} flexDirection='column'>
                                {
                                    isPaid ?
                                        (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label='La orden ya fue pagada'
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        ) :
                                        (

                                            <Chip
                                            sx={{ my: 2 }}
                                            label='Pendiente de Pago'
                                            variant='outlined'
                                            color='error'
                                            icon={<CreditScoreOutlined />}
                                        />
                                        )
                                }
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = "" } = query;

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }


    return {
        props: {
            order
        }
    }
}



export default OrderAdminPage;