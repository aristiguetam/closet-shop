import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { closetApi } from '@/closetApi';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress

}

export const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

interface Props {
    children: JSX.Element;
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookiesProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookiesProducts })

        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })

        }
    }, [])

    useEffect(() => {
        if (Cookie.get('firstname')) {
            const cookiesAddress = {
                firstname: Cookie.get('firstname') || "",
                lastName: Cookie.get('lastName') || "",
                address: Cookie.get('address') || "",
                address2: Cookie.get('address2') || "",
                zip: Cookie.get('zip') || "",
                city: Cookie.get('city') || "",
                country: Cookie.get('country') || "",
                phone: Cookie.get('phone') || "",
            }

            dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: cookiesAddress })
        }

    }, [])


    useEffect(() => {
        if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
        // Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])

    useEffect(() => {

        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }
        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
    }, [state.cart])

    const addProductToCart = (product: ICartProduct) => {

        const productInCartButDifferenteSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if (!productInCartButDifferenteSize) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

        const updatedProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            p.quantity += product.quantity
            return p;
        })

        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product })
    }

    const removeCartProduct = (product: ICartProduct) => {
        // const deleteCart = state.cart.filter(c => c.sizes !== product.sizes);
        const deleteCart = state.cart.filter(c => !(c._id === product._id && c.size === product.size));
        dispatch({ type: '[Cart] - Remove product in cart', payload: deleteCart })
    }

    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstname', address.firstname)
        Cookie.set('lastName', address.lastName)
        Cookie.set('address', address.address)
        Cookie.set('address2', address.address2 || "")
        Cookie.set('city', address.city)
        Cookie.set('zip', address.zip)
        Cookie.set('country', address.country)
        Cookie.set('phone', address.phone)

        dispatch({ type: '[Cart] - Update Address', payload: address });
    }

    const createrOrder = async (): Promise<{ hasError: boolean; message: string }> => {

        if (!state.shippingAddress) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            ShippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try {

            const { data } = await closetApi.post<IOrder>('/orders', body);

            dispatch({ type: '[Cart] - Order complete' });
            Cookie.set('cart', JSON.stringify([]));
            return {
                hasError: false,
                message: data._id!
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
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            removeCartProduct,
            updateCartQuantity,
            updateAddress,
            createrOrder,
        }}>
            {children}
        </CartContext.Provider>
    )
}







//  dispatch({ type: '[Cart] - Add Product', payload: product });
//  const productInCart = state.cart.filter(p => p._id !== product._id && p.sizes !== product.sizes);
//  dispatch({ type: '[Cart] - Add Product', payload: [...productInCart, product] })