import { useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react"

import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, authReducer } from './';
import { IUser, IUserLogin } from '@/interfaces';
import { closetApi } from '@/closetApi';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUserLogin;
}

export const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

interface Props {
    children: JSX.Element;
}

export const AuthProvider = ({ children }: Props) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            // console.log({ user: data.user })
            dispatch({ type: '[Auth] - Login', payload: data.user as IUser })
        }
    }, [status, data])



    // useEffect(() => {
    //     checkToken();
    // }, [])

    // const checkToken = async () => {

    //     if (!Cookies.get('token')) {
    //         return;
    //     }

    //     try {
    //         const { data } = await closetApi.get('/user/validate-jwt');
    //         const { token, user } = data as { user: IUserLogin, token: string };
    //         Cookies.set('token', token);
    //         dispatch({ type: '[Auth] - Login', payload: user })
    //     } catch (error) {
    //         Cookies.remove('token')
    //     }
    // }

    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await closetApi.post('/user/login', { email, password });
            const { token, user } = data as { user: IUserLogin, token: string };
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user })
            return true;
        } catch (error) {
            return false;
        }
    }

    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await closetApi.post('/user/register', { name, email, password });
            const { token, user } = data as { user: IUserLogin, token: string };
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user })
            return {
                hasError: false
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstname');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('city');
        Cookies.remove('zip');
        Cookies.remove('country');
        Cookies.remove('phone');

        signOut();
        // router.reload();
        // Cookies.remove('token');
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            loginUser,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}