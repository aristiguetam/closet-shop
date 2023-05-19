import { GetServerSideProps, NextPage } from 'next'

import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { Grid, Typography, Chip, Button, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

import { dbOrders } from '@/database';
import { ShopLayout } from '@/components/layouts'
import { IOrder } from '@/interfaces';

interface Props {
    orders: IOrder[]
}
const HistoryPage: NextPage<Props> = ({ orders }) => {

    const columns: GridColDef[] = [
        { field: "id", headerName: 'ID', width: 100 },
        { field: "fullname", headerName: 'Nombre Completo', width: 300 },

        {
            field: 'paid',
            headerName: 'Pagada',
            description: 'Muestra información si esta pagada la orden o no',
            width: 200,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    params.row.paid
                        ? <Chip color='success' label='Pagada' variant='outlined' />
                        : <Chip color='error' label='No Pagada' variant='outlined' />
                )
            }
        },

        {
            field: 'redirect', headerName: 'Ver orden', sortable: false, width: 200, renderCell: (params: GridRenderCellParams) => {
                return (
                    <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                        <Link underline='always'>
                            Orders
                        </Link>
                    </NextLink>
                )
            }
        }

    ]

    const row = orders.map((order, index) => ({   
            id: index + 1,
            fullname: `${order.ShippingAddress.firstname} ${order.ShippingAddress.lastName}`,
            paid: order.isPaid,
            orderId: order._id
    }))

return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>

        <Typography variant='h1' component='h1'>
            Historial de ordenes
        </Typography>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={row}
                    autoPageSize
                />
            </Grid>
        </Grid>

    </ShopLayout>
)
}



export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);


    return {
        props: {
            orders
        }
    }
}

export default HistoryPage;