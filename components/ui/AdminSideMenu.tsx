import { useSearchMenu } from "@/hooks";
import { AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined } from "@mui/icons-material"
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"

const AdminSideMenu = () => {
    const { navigateTo } = useSearchMenu();
    return (
        <>
            <Divider />
            <ListSubheader>Admin Panel</ListSubheader>

            <ListItemButton onClick={() => navigateTo('/admin')}>
                <ListItemIcon>
                    <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
            </ListItemButton>

            <ListItemButton onClick={() => navigateTo('/admin/products')}>
                <ListItemIcon>
                    <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={'Productos'} />
            </ListItemButton>

            <ListItemButton onClick={() => navigateTo('/admin/orders')}>
                <ListItemIcon>
                    <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
            </ListItemButton>

            <ListItemButton onClick={() => navigateTo('/admin/users')}>
                <ListItemIcon>
                    <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
            </ListItemButton>
        </>
    )
}

export default AdminSideMenu