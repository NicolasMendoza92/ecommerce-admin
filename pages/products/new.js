import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";
import { useRouter } from "next/router";


export default function NewProduct() {

    const router = useRouter();

    function goBack() {
        router.push('/products');
    }
    return (
        <Layout>
            <div className="flex justify-between content-center">
                <div>
                    <h1> New Product </h1>
                </div>
                <div>
                    <button onClick={goBack} className='bg-gray-500 rounded-md text-white hover:bg-gray-400 py-2 px-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                    </button>
                </div>
            </div>
            <ProductForm />
        </Layout>
    );
}
