import { useEffect, useState } from 'react';

import useSWR from 'swr';
import { Grid, Typography } from '@mui/material'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'

import { AdminLayout } from '@/components/layouts'
import { SummaryTile } from '@/components/admin'
import { DasboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {

    const { data, error } = useSWR<DasboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000,
    })

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Tick')
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    if (!error && !data) {
        return <></>;
    }

    if (error) {
        console.log(error)
        return <Typography>Error al cargar la información</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders,
    } = data!;


    return (
        <AdminLayout
            title={'Dashboard'}
            subTitle={'Estadisticas generales'}
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>

                <SummaryTile
                    title={numberOfOrders}
                    subTitlte={'Ordenes totales'}
                    icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={paidOrders}
                    subTitlte={'Ordenes Pagadas'}
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={notPaidOrders}
                    subTitlte={'Ordenes pendientes'}
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />} />


                <SummaryTile
                    title={numberOfClients}
                    subTitlte={'Clientes'}
                    icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />} />


                <SummaryTile
                    title={numberOfProducts}
                    subTitlte={'Productos'}
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={productsWithNoInventory}
                    subTitlte={'Sin existencias '}
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={lowInventory}
                    subTitlte={'Bajo inventario '}
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />} />

                <SummaryTile
                    title={refreshIn}
                    subTitlte={'Actulización en: '}
                    icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />} />

            </Grid>

        </AdminLayout>

    )
}

export default DashboardPage