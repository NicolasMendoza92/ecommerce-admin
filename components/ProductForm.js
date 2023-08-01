import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

// este form es usadao para new y para edit product 
export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) {

    const router = useRouter();
    // creamos los usestate para manejar las variables y los inputs. (los estados pueden tomar el valor, del existente o vacio, en el caso de que toque edit)
    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // trato de poner esta vble para ver si puedo filtrar por categoria en el front. 
    const selectedCateg = categories.find(({ _id }) => _id === category)


    // necesito usar useefect para traer las categorias de otro lugar, guardarlas en un estado con useState y poder plasmarlas en el select del productForm
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(e) {
        e.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            category,
            properties: productProperties,
            belongsCat: selectedCateg.name,
        }
        if (_id) {
            // update  - traemos la informacion que tiene data (...data) y ademas le inclumimos como parametro el id. 
            await axios.put('/api/products', { ...data, _id });
        } else {
            // create 
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts === true) {
        router.push('/products')
    }

    // 1ro consoleamos el evento, para ver como es cuando cargo una imagen- vemos el array en la consola, y vamos a "target" y dentro de target a "files" y eso es lo que tengo que traer. Una vez que cargo la imagen, luego la debo incluir a mis propiedaes de objeto. 
    async function upLoadImages(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data);
            //   creamos un nuevo array que tenga ls links viejos y los nuevos
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    // con el console.log de los "arguments", podemos ver el orden del array - y con un click en el front podemos arrastrar y cambiamos imagenes orden. 
    // solo tenemos que setear las imagenes, con el useState y le enviamos el parametro images.
    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    // si el producto tiene parent categories, las traigo y si dentreo hay propiedades tambien las traigo. 
    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        // mientras tengamos una categoria seleccionada entonces => 
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <>
            <form onSubmit={saveProduct}>
                <label> Product name</label>
                <input className="mt-1 block w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    type="text"
                    placeholder="product name" />
                <label>Category</label>
                <select
                    className="mt-1 block w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                    value={category}
                    onChange={e => setCategory(e.target.value)}>
                    <option value="">Uncategorized</option>
                    {/* traemos las categorias posibles para seleccionar, las que creamos en la page de categorias */}
                    {categories.length > 0 && categories.map(categ => (
                        <option key={categ._id} value={categ._id}>{categ.name}</option>
                    ))}
                </select>
                {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div key={p.name} className="gap-1">
                        {/* aca ponemos la primera letra posicion 0, con mayuscula y el resto chico */}
                        <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                        <select
                            className="mt-1 block w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                            value={productProperties[p.name]}
                            onChange={e => setProductProp(p.name, e.target.value)}
                        >
                            <option value="none" disabled>selct one</option>
                            {/* por cada prop, creo una opción */}
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <label> Photos</label>
                <div className="mb-2 flex flex-wrap gap-1">
                    {/* es una extension que nos sirve para ordenrar el array o tablas */}
                    <ReactSortable
                        list={images}
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-1">
                        {!!images?.length && images.map(link => (
                            <div key={link} className=" flex h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                                <img src={link} alt="" className="rounded-lg" />
                                {/* <span className="swym-delete-img">x</span> */}
                            </div>
                        ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 bg-gray-200 border text-center flex flex-col items-center justify-center gap-1 cursor-pointer ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>
                            Upload
                        </div>
                        <input type="file" className="hidden" onChange={upLoadImages} />
                    </label>

                </div>
                <label> Description</label>
                <textarea className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <label> Price in USD</label>
                <input className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    type="number"
                    placeholder="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)} />
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 ms-1 mt-1 rounded shadow-sm hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400">
                    Save
                </button>
            </form>
        </>
    );
}
