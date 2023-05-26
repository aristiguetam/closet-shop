import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";

import { authOptions } from '../api/auth/[...nextauth]';
import { AuthContext } from '@/context';
import { AuthLayout } from "@/components/layouts"
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
    name: string,
    email: string,
    password: string,
};

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async ({ email, name, password }: FormData) => {
        setShowError(false);

        const { hasError, message } = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => setShowError(false), 3000)
            return;
        }

        await signIn('credentials', { email, password })
        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination);
    }

    return (
        <AuthLayout title={"Registrate"}>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>

                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component='h1'>Crear Cuenta</Typography>
                            <Chip
                                label={errorMessage}
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Nombre completo'
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label='Correo'
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label='Contraseña'
                                type="password"
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                size="large"
                                fullWidth
                                className="circular-btn">
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
                                passHref legacyBehavior>
                                <Link underline="always">
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                    </Grid>

                </Box>
            </form>

        </AuthLayout>

    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
    const session = await getServerSession( req, res, authOptions );

    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}

export default RegisterPage;