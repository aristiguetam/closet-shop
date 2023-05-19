import {  useContext } from "react";

import { Box,  Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { AccountCircleOutlined, ConfirmationNumberOutlined, LoginOutlined,  SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"

import { useSearchMenu } from "@/hooks/useSearchMenu";
import { AuthContext } from "@/context";
import AdminSideMenu from "./AdminSideMenu";
import { CategorySideMenu } from "./CategorySideMenu";

export const SideMenu = () => {

    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const {
        isMenuOpen,
        searchTerm,
        asPath,
        setSearchTerm,
        toggleSideMenu,
        onSearchTerm,
        navigateTo,
    } = useSearchMenu()

    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: { xs: 5, sm: 2 } }}>

                <List>
                    <ListItem>
                        <Input
                            sx={{ display: { xs: '', sm: 'none' } }}
                            autoFocus
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>
                    {
                        isLoggedIn && (
                            <>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircleOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItemButton>

                                <ListItemButton onClick={() => navigateTo('/orders/history')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItemButton>
                            </>
                        )
                    }

                    <CategorySideMenu />

                    {
                        isLoggedIn ? (
                            <ListItemButton onClick={logout}>
                                <ListItemIcon>
                                    <LoginOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItemButton>
                        ) :
                            (
                                <ListItemButton onClick={() => navigateTo(`/auth/login?p=${asPath}`)} >
                                    <ListItemIcon>
                                        <VpnKeyOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingresar'} />
                                </ListItemButton>

                            )
                    }

                    {/* Admin */}
                    {
                        isLoggedIn && user?.role === 'admin' && (
                            <AdminSideMenu />
                        )
                    }

                </List>
            </Box>
        </Drawer>
    )
}