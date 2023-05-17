import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces';

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

export const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
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
        if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
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

    const addParoductToCart = (product: ICartProduct) => {

        // const productInCart = state.cart.some(p => p._id === product._id);
        // if (!productInCart) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

        const productInCartButDifferenteSize = state.cart.some(p => p._id === product._id && p.sizes === product.sizes);
        if (!productInCartButDifferenteSize) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] });

        const updatedProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.sizes !== product.sizes) return p;

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
        const deleteCart = state.cart.filter(c => !(c._id === product._id && c.sizes === product.sizes));
        dispatch({ type: '[Cart] - Remove product in cart', payload: deleteCart })
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addParoductToCart,
            removeCartProduct,
            updateCartQuantity,
        }}>
            {children}
        </CartContext.Provider>
    )
}







//  dispatch({ type: '[Cart] - Add Product', payload: product });
//  const productInCart = state.cart.filter(p => p._id !== product._id && p.sizes !== product.sizes);
//  dispatch({ type: '[Cart] - Add Product', payload: [...productInCart, product] })