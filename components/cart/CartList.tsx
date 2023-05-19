import { FC, useContext } from 'react';
import NextLink from 'next/link';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"

import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';

interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart: carts, updateCartQuantity, removeCartProduct, } = useContext(CartContext);

    const onNewQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product)
    }

    const productsToShow = products ? products : carts

    return (
        <>
            {
                productsToShow.map(product => (
                    <Grid container key={product.slug + product.size} spacing={2} sx={{ mb: 1 }}>

                        <Grid item xs={3}>
                            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            component='img'
                                            image={`/products/${product.image}`}
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{product.title}</Typography>
                                <Typography variant='body1'>Talla: <strong>{product.size}</strong> </Typography>

                                {/* condicional */}

                                {
                                    editable
                                        ? (
                                            <ItemCounter
                                                currentValue={product.quantity}
                                                maxValue={10}
                                                updatedQuantity={(value) => onNewQuantityValue(product as ICartProduct, value)} />
                                        )
                                        : (
                                            <Typography variant='h5'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>

                                        )
                                }

                            </Box>
                        </Grid>

                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'> ${product.price}</Typography>

                            {
                                editable && (
                                    // <NextLink href={carts.length === 1 ? '/cart/empty' : ''} passHref legacyBehavior>
                                    // <Link>
                                    <Button
                                        onClick={() => removeCartProduct(product as ICartProduct)}
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