import { FC, useEffect, useState } from 'react';
import { NextPage } from 'next';

import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { PeopleOutlined } from "@mui/icons-material";

import { useUsers } from '@/hooks';
import { AdminLayout } from "@/components/layouts";
import { IUser } from '@/interfaces';
import { closetApi } from '@/closetApi';

const UsersPage:NextPage = () => {

    const { data, error } = useUsers();

    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {

        if (data) {
            setUsers(data);
        }

    }, [data])


    if (!data && !error) return <></>;

    const onRoleUpdated = async (userId: string, newRole: string) => {
        const previosUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);
        try {
            await closetApi.put(`/admin/users`, { userId, role: newRole })

        } catch (error) {
            setUsers(previosUsers);
            console.log({ error })
            alert('No se pudo actualizar el role del usuario')
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre Completo', width: 300 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label='Rol'
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="super-user">Super-user</MenuItem>
                        <MenuItem value="SEO">SEO</MenuItem>

                    </Select>
                )
            }
        },
    ]

    const row = users.map(({ _id, email, name, role }) => ({
        id: _id,
        email,
        name,
        role
    }))

    return (
        <AdminLayout title={"Usuarios"} subTitle={"Mantenimiento de usuarios"} icon={<PeopleOutlined />}>

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

export default UsersPage