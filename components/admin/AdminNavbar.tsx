import NextLink from "next/link"

import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';
import { useSearchMenu } from "@/hooks";

export const AdminNavbar = () => {

    const { toggleSideMenu } = useSearchMenu();

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

                <Button
                    onClick={toggleSideMenu}
                >
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}

// href={cart.length === 0 ? '/cart/empty' : '/cart'}