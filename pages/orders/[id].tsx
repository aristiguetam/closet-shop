import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { PayPalButtons } from "@paypal/react-paypal-js";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { closetApi } from '@/closetApi';
import { dbOrders } from '@/database';
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { IOrder } from '@/interfaces';

export type OrderResponseBody = {
    id: string;
    status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED'

}

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }: Props) => {

    const router = useRouter();
    const { isPaid, _id, numberOfItems, ShippingAddress, orderItems, subTotal, tax, total } = order;
    const { firstname, lastName, city, address2, address, phone, country, zip } = ShippingAddress;
    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async (details: OrderResponseBody) => {

        if (details.status !== 'COMPLETED') {
            return alert('No hay pago en Paypal')
        }

        setIsPaying(true);
        try {
            const { data } = await closetApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id,
            });

            router.reload();
        } catch (error) {
            setIsPaying(false)
            console.log(error)
            alert('Error')
        }


    }

    return (
        <ShopLayout title={`Resumen de la orden`} pageDescription={"Resumen de la orden"}>

            <Typography variant="h1" component='h1'>
                Orden: {_id}
            </Typography>

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

                                <Box
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                    display='flex'
                                    justifyContent='center'
                                    className='fadeIn'>
                                    <CircularProgress />
                                </Box>

                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column'>
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

                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details: any) => {
                                                        onOrderCompleted(details);
                                                        // console.log({ details })
                                                        // const name = details.payer.name.given_name;
                                                        // alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                        )
                                }
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = "" } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    if (order.user !== session.user._id) {
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



export default OrderPage;