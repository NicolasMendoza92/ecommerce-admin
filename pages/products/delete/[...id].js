
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/layout";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();

    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);

    function goBack() {
        router.push('/products');
    }

    async function deleteProduct() {
        await axios.delete('/api/products?id=' + id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete{productInfo?.title}?</h1>
            <div className="flex gap-2 justify-center">
                <button
                    onClick={deleteProduct}
                    className="bg-red-900 rounded-md text-white hover:bg-red-800 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-600 py-2 px-2 mt-2">
                    Yes
                </button>
                <button
                    className="bg-blue-900 rounded-md text-white hover:bg-blue-800 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-600 py-2 px-2 mt-2"
                    onClick={goBack}>
                    NO
                </button>
            </div>
        </Layout>
    );
}