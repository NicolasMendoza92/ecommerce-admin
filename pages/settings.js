import Spinner from "@/components/Spinner";
import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";


export default function Settings() {

  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeatureProductId] = useState('');
  const [shippingFee, setShippingFee] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    await Swal.fire({
      title: 'Changes saved',
      icon: 'success',
    });
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-center ">
        <div className="  m-1 px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 text-center">
          <h1>Settings</h1>
          {isLoading && (
            <Spinner />
          )}

          {!isLoading && (
            <>
              <label>Choose featrued product</label>
              <select className="m-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                value={featuredProductId}
                multiple={false}
                onChange={(e) => setFeatureProductId(e.target.value)}>

                {products.length > 0 && products.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
              <div>
                <label>Shipping price USD</label>
                <input className="m-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
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