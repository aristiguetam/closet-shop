import { NextPage } from 'next';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Chip, Grid } from "@mui/material"

import { useOrders } from '@/hooks';
import { AdminLayout } from "@/components/layouts"
import { IUser } from '@/interfaces';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 250 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        width: 150,
        renderCell: ({ row }: GridRenderCellParams) => {
            return row.isPaid
                ? (<Chip variant='outlined' label='Pagada' color='success' />)
                : (<Chip variant='outlined' label='Pendiente' color='error' />)
        }
    },
    { field: 'noProductos', headerName: 'No.Productos', align: 'center', width: 150 },

    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
                    Ver orden
                </a>
            )

        }
    },
    { field: 'createdAt', headerName: 'Creada en', align: 'center', width: 300 },


]

const OrdersPage: NextPage = () => {

    const { data, error } = useOrders();

    if (!data && !error) return <></>

    const row = data!.map((order) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProductos: order.numberOfItems,
        createdAt: order.createdAt,

    }));

    return (
        <AdminLayout title={"Ordenes"} subTitle={"Mantenimiento de ordenes"} icon={<ConfirmationNumberOutlined />}>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={row}
                        autoPageSize
                    />
                </Grid>
            </Grid>


        </AdminLayout>
    )
}

export default OrdersPage