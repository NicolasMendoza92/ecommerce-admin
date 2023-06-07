// hago una ruta diferente para manejar las categorias, asi como hice con imagenes. 

import {Category} from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";
import { isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'));
  }

  if (method === 'POST') {
    const {name,parentCategory,properties} = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const {name,parentCategory,properties,_id} = req.body;
    // definimos dos parametros, definimos el objeto que lo identifica, como el id, y luego las propiedades del objeto que queremos actualizar
    const categoryDoc = await Category.updateOne({_id},{
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Category.deleteOne({_id});
    res.json('ok');
  }
}