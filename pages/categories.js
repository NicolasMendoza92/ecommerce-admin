
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/layout";
import Spinner from "@/components/Spinner";
// esto es un npm packgage para poner id y quitar el error de map.
import { v4 } from "uuid";
import Swal from "sweetalert2";




export default function Categories() {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // esti actualiza la tabla - es la consulta get a las categorias. 
    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories() {
        setIsLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setIsLoading(false);
        });
    }

    // funcion submit cuando todo esta puesto. 
    async function saveCategory(e) {
        e.preventDefault();
        // mandamos la propiedad "properties" como un array, por que asi lo definimos en su modelo "Category.js"
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            }))
        };

        // si ya hay una cateogria utilizo "put" si no hay, utilizo metodo "post" - igual que el manage de api/products
        if (editedCategory) {
            // no podemos incluir con ...data + id, por que no lo estamos nombrando como parametro en la fn if, entonces tenemos que sumarlo a data con edited category, linea sig. 
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        // pongo el "?" para que verifique el objeto, parent es un obj.
        setParentCategory(category.parent?._id);
        // por cada propiedad (name y value) yo devuelvo un obeto que tenga el nombre y los valores como string unidos por coma
        console.log(properties)
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            }))
        );
    }

    function deleteCategory(category) {
        // agrego los botones y opciones segun la libreria sweet
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            // hacemos console log del result y vemos que opcion es cada una. 
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    // esto es el manejo de las propiedades,  propiedades de la categoria 
    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    function cancelEdit() {
        setEditedCategory(null);
        setName('');
        setParentCategory('');
        setProperties([]);
    }

    return (
        <Layout>
            <h1>Categories</h1>
            {/* ponemos algo de condicionales JS CSS para simplificar el edit en una sola page */}
            <div className="flex content-center justify-between">
                <label>
                    {editedCategory
                        ? `Edit category ${editedCategory.name}`
                        : 'Create new category'
                    }
                </label>
                {editedCategory &&
                    <button onClick={cancelEdit} className='btn-default'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                    </button>
                }
            </div>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                        type="text"
                        placeholder={'Category name'}
                        onChange={e => setName(e.target.value)}
                        value={name} />
                    <select
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                        onChange={e => setParentCategory(e.target.value)}
                        value={parentCategory}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>

                </div>
                <div>
                    <label className="block m-1">Properties</label>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-3 rounded-sm border border-gray-200 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-400 flex items-center"
                        onClick={addProperty}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={v4()} className="flex gap-1 mb-2">
                            <input
                                className="mt-1 block w-full px-1 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                                type="text"
                                value={property.name}
                                onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}
                                placeholder="property name (example:color)" />
                            <input
                                className="mt-1 block w-full px-1 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                                type="text"
                                value={property.values}
                                onChange={(e) => handlePropertyValuesChange(index, property, e.target.value)}
                                placeholder="values (comma separate)" />
                            <button
                                onClick={() => removeProperty(index)}
                                className="btn-red">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 ms-1 mt-1 rounded shadow-sm hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400">
                    Save
                </button>
            </form>

            {!editedCategory && (
                <>
                    <h1 className="mt-2">Categorie's list</h1>
                    <table className="basic mt-4">
                        <thead>
                            <tr>
                                <td>Category name</td>
                                <td>Parent Category</td>
                                <td>Options</td>
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
                            {categories.length > 0 && categories.map(category => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td className="flex">
                                        <button
                                            onClick={() => editCategory(category)}
                                            className="flex btn-default"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className="flex btn-red">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </Layout>
    );
}
