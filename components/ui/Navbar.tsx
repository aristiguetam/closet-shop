import NextLink from "next/link"

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { useSearchMenu } from "@/hooks/useSearchMenu";

export const Navbar = () => {

    const {
        asPath,
        isSearchVisible,
        searchTerm,
        onSearchTermNavbar,
        setSearchTerm,
        setIsSearchVisible,
        toggleSideMenu
    } = useSearchMenu()

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center' >
                        <Typography variant='h6' color='black'>Closet |</Typography>
                        <Typography sx={{ ml: 0.5 }} color='black'>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
                    <NextLink href='/category/men' passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/men' ? 'primary' : 'info'}> Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/women' ? 'primary' : 'info'} >Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {
                    isSearchVisible
                        ? (<Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            className="fadeIn"
                            autoFocus
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTermNavbar() : null}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsSearchVisible(false)}
                                    >
                                        <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        )
                        : (
                            <IconButton
                                className="fadeIn"
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                onClick={() => setIsSearchVisible(true)}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                {/* Pantallas Pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart' passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={2} color={"secondary"}>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button
                    onClick={toggleSideMenu}
                >
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}
