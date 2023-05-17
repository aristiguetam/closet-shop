import { IUser, IUserLogin } from '@/interfaces';
import { createContext } from 'react';

interface ContextProps {
    isLoggedIn: boolean;
    user?: IUserLogin;
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string; }>;
    logout: () => void
}

export const AuthContext = createContext({} as ContextProps);