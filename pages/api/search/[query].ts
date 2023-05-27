import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';

type Data =
    | { message: string }
    | { error: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    let { query = '' } = req.query;

    if (query.length === 0) return res.status(400).json({ message: 'Debe especificar el query de búsqueda' })

    query = query.toString().toLowerCase();

    try {
        await db.connect();

        const products = await Product.find({
            $text: { $search: query }
        }).select('title images price inStock slug -_id').limit(10).skip(0).lean();

        await db.disconnect();

        return res.status(200).json(products);
    } catch (error: any) {
    
        console.log(error);
    
        await db.disconnect();

        return res.status(500).json({ message: `Revise logs del servidor`, error: error.message  });
    }


}
