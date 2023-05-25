import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL || "");

import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';

type Data =
    | { message: string }
    | IProduct[]
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'POST':
            return createProduct(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' })

    }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();

    const products = await Product.find().sort({ title: 'asc' }).lean();

    await db.disconnect();

    const updatedProducts = products.map((product) => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })
        return product;
    })


    res.status(200).json(updatedProducts);
}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El íd no es valido' })
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' })
    }

    //TODO posiblemente tendremos un localhosrt:3000/products/fdfhsjdfhjsdf.jpg


    try {

        await db.connect();

        const product = await Product.findById(_id);

        if (!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese Id' })
        }

        //TODO: elminar fotos en cloudinary
        // https://res.cloudinary.com/dqarieowd/image/upload/v1685039534/xa3nwoycdzh7wd0udlkj.webp

        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, Extension] = image.substring(image.lastIndexOf('/') + 1).split('.')
                console.log({ image, fileId, Extension });
                await cloudinary.uploader.destroy(fileId);
            }
        })

        await product.updateOne(req.body);
        await db.disconnect();

        return res.status(200).json(product);

    } catch (error) {
        console.log({ error })
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' })

    }

}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes' })
    }

    //TODO : posiblemente tendremos un localhost:300/products/jsakjdsk.jpg

    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug }).lean()

        if (productInDB) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' })
        }

        const product = new Product(req.body);
        await product.save();
        await db.disconnect();

        return res.status(201).json(product);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'revisar logs del servidor' })

    }
}

