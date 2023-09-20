import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  try{
    const PAGE_SIZE = 10;
    const page = parseInt(req.query.page || "0");
    const total = await Order.countDocuments({});
    //   aca trigo las ordenes, en orden decendente la mas nueva al principio. Veo en postman y en la base como es la estructura 
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page)
    res.json({
      orders,
      totalPages: Math.ceil(total / PAGE_SIZE)
    });
  }catch(error){
    console.log(error)
  }
  
}