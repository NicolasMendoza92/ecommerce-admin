import ProductForm from '@/components/ProductForm';
import Layout from '@/components/layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditProductPage() {

  // traemos la informacion del producto 
  const [productInfo, setProductInfo] = useState(null);

  const router = useRouter();
  // traemos la propiedad id, de router.query, ya que nos fiamos previamente con un console log donde estaba el file [...id]  que creamos con console.log({router});
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id=' + id).then(response => {
      setProductInfo(response.data);
    })
  }, [id]);

  function goBack() {
    router.push('/products');
  }

  return (
    <Layout>
      <div className="flex justify-between content-center">
        <div>
          <h1> Edit Product </h1>
        </div>
        <div>
          <button onClick={goBack} className='bg-gray-500 rounded-md text-white hover:bg-gray-400 py-2 px-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>
      </div>
      {productInfo && (
        <ProductForm {...productInfo} />
      )}

    </Layout>
  );
}
