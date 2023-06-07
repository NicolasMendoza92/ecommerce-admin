
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import Layout from "@/components/layout";



function Categories({ swal }) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    // esti actualiza la tabla - es la consulta get a las categorias. 
    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
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
        swal.fire({
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
            <div className="flex content-center">
                <label>
                    {editedCategory
                        ? `Edit category ${editedCategory.name}`
                        : 'Create new category'
                    }
                </label>
                {editedCategory &&
                    <button onClick={cancelEdit} className='bg-gray-500 rounded-md text-white hover:bg-gray-400 px-2 ms-1'>
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
                        className="bg-gray-600 text-white px-2 py-1 ms-1 rounded shadow-sm hover:bg-gray-500  focus:outline-none focus:ring focus:ring-gray-600"
                        onClick={addProperty}>
                        Add Property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
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
                    className="bg-blue-900 rounded-md text-white hover:bg-blue-800 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-600 py-2 px-2 mt-2">
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
                            {categories.length > 0 && categories.map(category => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td className="flex">
                                        <button
                                            onClick={() => editCategory(category)}
                                            className="btn-default"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className="btn-red">Delete</button>
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

// segun la libreria de sweet alert, tenemos que poner toda mi page, dentro de un componente. as following. 
export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));