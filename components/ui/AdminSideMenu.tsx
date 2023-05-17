import { AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined } from "@mui/icons-material"
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"

const AdminSideMenu = () => {
    return (
        <>
            <Divider />
            <ListSubheader>Admin Panel</ListSubheader>
            <ListItemButton>
                <ListItemIcon>
                    <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={'Productos'} />
            </ListItemButton>

            <ListItemButton>
                <ListItemIcon>
                    <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
            </ListItemButton>

            <ListItemButton>
                <ListItemIcon>
                    <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
            </ListItemButton>
        </>
    )
}

export default AdminSideMenu