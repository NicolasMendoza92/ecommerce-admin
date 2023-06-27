import {useEffect, useState} from "react";
import axios from "axios";
import Layout from "@/components/layout";

export default function OrdersPage() {

  const [orders,setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {orders.length > 0 && orders.map(order => (
          <tr key={order._id}>
            <td>{(new Date(order.createdAt)).toLocaleString()}
            </td>
            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
              {order.paid ? 'YES' : 'NO'}
            </td>
            <td>
              {order.name} {order.email}<br />
              {order.city} {order.postalCode} {order.country}<br />
              {order.streetAddress}
            </td>
            <td>
              {order.line_items.map(item => (
                <>
                  {item.price_data?.product_data.name} x
                  {item.quantity}<br />
                </>
              ))}
            </td>
            <td>
              ${order.total}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Layout>
  );
}
