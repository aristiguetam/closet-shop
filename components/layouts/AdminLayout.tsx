import Head from "next/head"
import { SideMenu } from "../ui";
import { AdminNavbar } from "../admin";
import { Box, Typography } from "@mui/material";

interface Props {
    title: string;
    children: JSX.Element | JSX.Element[];
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout = ({ title, subTitle, icon, children }: Props) => {
    return (
        <>
            <nav>
                <AdminNavbar />
            </nav>

            <SideMenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0px 30px',
            }}>
                <Box display='flex' flexDirection='column'>
                    <Typography variant="h1" component='h1'>
                        {icon}
                        {""} {title}
                    </Typography>
                    <Typography variant="h2" sx={{ mb: 1 }}>
                        {subTitle}
                    </Typography>
                </Box>

                <Box className='fadeIn'>
                    {children}
                </Box>

            </main>

        </>
    )
}
