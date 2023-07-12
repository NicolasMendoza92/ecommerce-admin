import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/layout";
import Spinner from "@/components/Spinner";

export default function OrdersPage() {

  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  function refresh() {
    getOrders();
  }

  const getOrders = async () => {
    setIsLoading(true);
    await axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Layout>
      <div className="flex">
        <h1 className="me-2">Orders</h1>
        <button onClick={refresh} className='btn-default'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
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
          <tr>
            <td colSpan={5}>
              {isLoading && (
                <div className="w-full flex justify-center py-4">
                  <Spinner />
                </div>
              )}
            </td>
          </tr>
          {orders?.map(order => (
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
                  <Fragment key={item.id}>
                    {item.price_data?.product_data.name} x
                    {item.quantity}<br />
                  </Fragment>
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
