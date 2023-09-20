import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {

    // le pedimos que traiga toda la info que solicito , con req y lo  
    const { method } = req;
    // me conecto con mongoose, para que figure en mi base de datos como una coleccion, donde pueda editar los objetos. 
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        // si tenemos ese especifico id del producto
        try {
            if (req.query?.id) {
                res.json(await Product.findOne({ _id: req.query.id }));
            } else {
                const PAGE_SIZE = 12;
                const page = parseInt(req.query.page || "0");
                const total = await Product.countDocuments({});
                const products = await Product.find({})
                    .limit(PAGE_SIZE)
                    .skip(PAGE_SIZE * page)
                res.json({
                    products,
                    totalPages: Math.ceil(total / PAGE_SIZE)
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).send('Hubo un error');
        }
    }

    if (method === 'POST') {
        try {
            const { title, description, price, images, category, properties, belongsCat } = req.body;
            const productDoc = await Product.create({
                title, description, price, images, category, properties, belongsCat
            })
            res.json(productDoc);
        } catch (error) {
            console.log(error);
            res.status(400).send('Hubo un error');
        }
    }

    if (method === 'PUT') {
        const { title, description, price, images, _id, category, properties, belongsCat } = req.body;
        // los nombres de las propiedades son las mismas que las vbles, ahi ponogo lo que quiere actualizar (definimos dos parametros, el ID (identifica) y las prop que queremos cambiar)
        await Product.updateOne({ _id }, { title, description, price, images, category, properties, belongsCat });
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}
