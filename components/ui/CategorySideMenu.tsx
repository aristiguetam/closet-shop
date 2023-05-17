import { EscalatorWarningOutlined, FemaleOutlined, MaleOutlined } from "@mui/icons-material"
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useSearchMenu } from "@/hooks"

export const CategorySideMenu = () => {

    const { navigateTo } = useSearchMenu()
    return (
        <>
            <ListItemButton
                onClick={() => navigateTo('/category/men')}
                sx={{ display: { xs: '', sm: 'none' } }}>
                <ListItemIcon>
                    <MaleOutlined />
                </ListItemIcon>
                <ListItemText primary={'Hombres'} />
            </ListItemButton>

            <ListItemButton
                onClick={() => navigateTo('/category/women')}
                sx={{ display: { xs: '', sm: 'none' } }}>
                <ListItemIcon>
                    <FemaleOutlined />
                </ListItemIcon>
                <ListItemText primary={'Mujeres'} />
            </ListItemButton>

            <ListItemButton
                onClick={() => navigateTo('/category/kid')}
                sx={{ display: { xs: '', sm: 'none' } }}>
                <ListItemIcon>
                    <EscalatorWarningOutlined />
                </ListItemIcon>
                <ListItemText primary={'Niños'} />
            </ListItemButton>
        </>
    )
}
