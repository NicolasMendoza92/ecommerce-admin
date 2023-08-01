import Spinner from "@/components/Spinner";
import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";


function Settings({ swal }) {

  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeatureProductId] = useState([]);
  const [shippingFee, setShippingFee] = useState('');

  const [email, setEmail] = useState('');
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function deleteUser(_id) {
    swal.fire({
      title: 'Do you want to delete this user?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        await axios.delete('/api/admins?_id=' + _id).then(() => {
          swal.fire({
            title: 'Admin created',
            icon: 'success',
          })
          getAdminEmails();
        });

      }
    });
  }

  function addAdmin(e) {
    e.preventDefault(e);
    // necesitamos guardar los admin en nuestra base de datos
    axios.post('/api/admins', { email }).then(res => {
      swal.fire({
        title: 'Admin created',
        icon: 'success',
      })
      setEmail('');
      getAdminEmails();
    }).catch(err => {
      swal.fire({
        title: 'Something happened',
        text: err.response.data.message,
        icon: 'error',
      })
    })
  }

  const getAdminEmails = async () => {
    setIsLoading(true);
    axios.get('/api/admins').then(response => {
      setAdminEmails(response.data);
      setIsLoading(false);
    })
  }

  useEffect(() => {
    getAdminEmails();
  }, []);

  // funciones para settings

  const getInfoSettings = async () => {

    await axios.get('/api/products').then(res => {
      setProducts(res.data);
    });
    await axios.get('/api/settings?name=featuredProductId').then(res => {
      setFeatureProductId(res.data.value);
    });
    await axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res.data.value);
    });

  }

  useEffect(() => {
    setIsLoading(true);
    getInfoSettings().then(() => {
      setIsLoading(false)
    });
  }, []);

  async function saveSettings() {
    setIsLoading(true);
    await axios.put('/api/settings', {
      name: 'featuredProductId',
      value: featuredProductId,
    });
    await axios.put('/api/settings', {
      name: 'shippingFee',
      value: shippingFee,
    });
    setIsLoading(false);
    await swal.fire({
      title: 'Changes saved',
      icon: 'success',
    });
  }

  return (
    <Layout>
      <div className="flex content-center justify-around">
        <div className="basis-1 md:basis-1/2 m-1 block px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 text-center">
          <h1>Admins</h1>
          <h2 className="text-start">Add a new Admin</h2>
          <form onSubmit={addAdmin}>
            <div className="flex">
              <input
                className=" block w-full px-1 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                type="text"
                placeholder="google email"
                value={email}
                onChange={e => setEmail(e.target.value)} />
              <button type="submit" className="border bg-blue-600 text-white px-3 py-1 ms-1 rounded shadow-sm hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400">Save</button>
            </div>
          </form>
          <table className="basic">
            <thead>
              <tr>
                <th>Date</th>
                <th>Admin Email</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  {isLoading && (
                    <div className="w-full flex justify-center py-4">
                      <Spinner />
                    </div>
                  )}
                </td>
              </tr>
              {adminEmails.length > 0 && adminEmails.map(adminEmail => (
                <tr key={adminEmail._id}>
                  <td>
                    {(new Date(adminEmail.createdAt)).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td>
                    {adminEmail.email}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(adminEmail._id)}
                      className="btn-red"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>

                    </button>
                  </td>
                </tr>
              ))}
              {adminEmails.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    No user admin registered.
                  </td>
                </tr>

              )}
            </tbody>
          </table>
        </div>
        <div className=" basis-1 md:basis-1/2 m-1 block px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 text-center">
          <h1>Settings</h1>
          {isLoading && (
            <Spinner />
          )}

          {!isLoading && (
            <>
              <label>Choose featrued product</label>
              <select className="m-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                value={featuredProductId}
                onChange={(e) => setFeatureProductId(e.target.value)}>

                {products.length > 0 && products.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
              <div>
                <label>Shipping price USD</label>
                <input className="m-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)} />
              </div>
              <div>
                <button onClick={saveSettings} className="btn-primary">Save changes</button>
              </div>
            </>
          )}
        </div>

      </div>
    </Layout>
  );
}

export default withSwal(({ swal }) => (
  <Settings swal={swal} />
));