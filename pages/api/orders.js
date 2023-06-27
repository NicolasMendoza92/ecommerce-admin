import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";


export default async function handler(req,res) {
  await mongooseConnect();
//   aca trigo las ordenes, en orden decendente la mas nueva al principio. Veo en postman y en la base como es la estructura 
  res.json(await Order.find().sort({createdAt:-1}));
}