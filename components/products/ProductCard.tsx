import { FC, useMemo, useState } from "react";
import NextLink from "next/link";

import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material"

import { IProduct } from "@/interfaces"
import zIndex from "@mui/material/styles/zIndex";

interface Props {
    product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {

    const [isHover, setIsHover] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const productImage = useMemo(() => {
        return isHover
            ? product.images[1]
            : product.images[0]
    }, [isHover, product.images])

    return (
        <Grid
            item
            xs={6}
            sm={4}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Card>
                <NextLink
                    href={`/product/${product.slug}`}
                    passHref
                    prefetch={false}
                    legacyBehavior>
                    <Link>


                        <CardActionArea>
                            {
                                (product.inStock === 0) && (
                                    <Chip
                                        color="primary"
                                        label='No hay disponibles'
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                                    />
                                )
                            }
                            <CardMedia
                                className="fadeIn"
                                component='img'
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className="fadeIn">
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>

        </Grid>
    )
}
