import { FC, useContext } from 'react';
import NextLink from 'next/link';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"

import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct } from '@/interfaces';

interface Props {
    editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {

    const { cart: carts, updateCartQuantity, removeCartProduct, } = useContext(CartContext);

    const onNewQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product)
    }

    return (
        <>
            {
                carts.map(cart => (
                    <Grid container key={cart.slug + cart.sizes} spacing={2} sx={{ mb: 1 }}>

                        <Grid item xs={3}>
                            <NextLink href={`/product/${cart.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            component='img'
                                            image={`/products/${cart.images}`}
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{cart.title}</Typography>
                                <Typography variant='body1'>Talla: <strong>{cart.sizes}</strong> </Typography>

                                {/* condicional */}

                                {
                                    editable
                                        ? (
                                            <ItemCounter
                                                currentValue={cart.quantity}
                                                maxValue={10}
                                                updatedQuantity={(value) => onNewQuantityValue(cart, value)} />
                                        )
                                        : (
                                            <Typography variant='h5'>{cart.quantity} {cart.quantity > 1 ? 'productos' : 'producto'}</Typography>

                                        )
                                }

                            </Box>
                        </Grid>

                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'> ${cart.price}</Typography>

                            {
                                editable && (
                                    // <NextLink href={carts.length === 1 ? '/cart/empty' : ''} passHref legacyBehavior>
                                        // <Link>
                                            <Button
                                                onClick={() => removeCartProduct(cart)}
                                                variant='text'
                                                color='secondary'>
                                                Remover
                                            </Button>
                                        // </Link>
                                    // </NextLink>
                                )
                            }

                        </Grid>
                    </Grid>
                ))
            }

        </>

    )
}
// href={carts.length === 1 ? '/cart/empty' : ''}