
import NextLink from 'next/link';

import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from '@/components/layouts'
import { Grid, Typography, Chip, Button, Link } from '@mui/material';

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
                <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
                    <Link underline='always'>
                        Orders
                    </Link>
                </NextLink>
            )
        }
    }

]

const row = [
    { id: 1, paid: false, fullname: 'Pedro Aristigueta', },
    { id: 2, paid: true, fullname: 'Deiralyn Gonzalez', },
    { id: 3, paid: false, fullname: 'Alexander Gomez', },
    { id: 4, paid: false, fullname: 'Eduardo Lara', },
    { id: 5, paid: true, fullname: 'Romulo Herrera', },
    { id: 6, paid: false, fullname: 'Luciano Moran', },
    { id: 7, paid: true, fullname: 'Victor Drija', },
]

const HistoryPage = () => {
    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>

            <Typography variant='h1' component='h1'>
                Historial de ordenes
            </Typography>

            <Grid container>
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

export default HistoryPage