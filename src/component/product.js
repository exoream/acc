import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import DM1 from './image/dm1.png'

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [indexPage, setIndexPage] = useState(1);
    const availableSizes = ['S', 'M', 'L', 'X'];

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        product_size: [
            { size: 'S', stock: '', description: '' },
            { size: 'M', stock: '', description: '' },
            { size: 'L', stock: '', description: '' },
            { size: 'X', stock: '', description: '' },
        ],
    });

    const [productToEdit, setProductToEdit] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        product_size: []
    });

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formattedSearchTerm = searchInput
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
        setSearchTerm(formattedSearchTerm);
        setCurrentPage(1);
    };

    const resetSearch = () => {
        setSearchTerm('');
        setSearchInput('');
        setCurrentPage(1);
    };

    const openCreateDialog = () => setIsCreateDialogOpen(true);
    const closeCreateDialog = () => setIsCreateDialogOpen(false);

    const openDetailDialog = (product) => {
        setSelectedProduct(product);
        setIsDetailDialogOpen(true);
    };

    const closeDetailDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedProduct(null);
    };

    const openDeleteDialog = (product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const openEditDialog = (product) => {
        setProductToEdit(product);
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setProductToEdit(null);
    };

    const deleteProduct = async () => {
        if (productToDelete) {
            const token = Cookies.get('token');
            if (!token) {
                setTimeout(() => {
                    navigate('/');
                }, 200);
                return;
            }

            try {
                await axios.delete(`https://skripsi-api-859835962101.asia-southeast2.run.app/products/${productToDelete.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setProducts(products.filter(product => product.id !== productToDelete.id));
                closeDeleteDialog();
            } catch (error) {
                console.error("Error deleting product:", error);
                setErrorMessage(error.response.data.message);
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                closeDeleteDialog();
            }
        }
    };

    const updateProduct = async () => {
        const token = Cookies.get('token');
        if (!token) {
            return;
        }

        const formData = new FormData();
        Object.keys(productToEdit).forEach((key) => {
            if (key === 'product_size') {
                productToEdit[key].forEach((size, index) => {
                    formData.append(`product_size[${index}].size`, size.size);
                    formData.append(`product_size[${index}].description`, size.description);
                    formData.append(`product_size[${index}].stock`, size.stock);
                });
            } else if (key === 'image') {
                formData.append(key, productToEdit[key]);
            } else {
                formData.append(key, productToEdit[key]);
            }
        });

        setLoading2(true);

        try {
            await axios.put(`https://skripsi-api-859835962101.asia-southeast2.run.app/products/${productToEdit.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProducts(products.map(product =>
                product.id === productToEdit.id ? productToEdit : product
            ));
            closeEditDialog();
        } catch (error) {
            console.error("Error updating product:", error);
            setErrorMessage(error.response.data.message);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000);
        } finally {
            setLoading2(false);
        }
    };

    const createProduct = async () => {
        const token = Cookies.get('token');
        if (!token) {
            return;
        }

        const formData = new FormData();
        Object.keys(newProduct).forEach((key) => {
            if (key === 'product_size') {
                newProduct[key].forEach((size, index) => {
                    formData.append(`product_size[${index}].size`, size.size);
                    formData.append(`product_size[${index}].description`, size.description);
                    formData.append(`product_size[${index}].stock`, size.stock);
                });
            } else if (key === 'image') {
                formData.append(key, newProduct[key]);
            } else {
                formData.append(key, newProduct[key]);
            }
        });

        setLoading2(true);

        try {
            await axios.post('https://skripsi-api-859835962101.asia-southeast2.run.app/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProducts([...products, newProduct]);
            closeCreateDialog();
            window.location.reload();
        } catch (error) {
            console.error("Error creating product:", error);
            setErrorMessage(error.response.data.message);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000);
        } finally {
            setLoading2(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('product_size')) {
            const index = parseInt(name.split('.')[0].split('[')[1].split(']')[0]);
            const key = name.split('.')[1];
            const updatedSizes = [...newProduct.product_size];
            updatedSizes[index][key] = value;
            setNewProduct({ ...newProduct, product_size: updatedSizes });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProduct({ ...newProduct, image: file });
        }
    };

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        if (name.includes('product_size')) {
            const sizeKey = name.split('[')[1].split(']')[0];
            const key = name.split('.')[1];

            let updatedSizes = [...productToEdit.product_size];

            const sizeIndex = updatedSizes.findIndex((item) => item.size === sizeKey);

            if (sizeIndex !== -1) {
                updatedSizes[sizeIndex][key] = value;
            } else {
                updatedSizes.push({
                    size: sizeKey,
                    stock: key === 'stock' ? value : 0,
                    description: key === 'description' ? value : '',
                });
            }

            setProductToEdit({ ...productToEdit, product_size: updatedSizes });
        } else {
            setProductToEdit({ ...productToEdit, [name]: value });
        }
    };

    const handleImageChangeEdit = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductToEdit({ ...productToEdit, image: file });
        }
    };

    const getIndex = (index) => {
        return (indexPage - 1) * 10 + index + 1;
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }

        axios.get('https://skripsi-api-859835962101.asia-southeast2.run.app/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: currentPage,
                limit: 10,
                search: searchTerm
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setProducts(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                } else {
                    setProducts([]);
                    setTotalPages(1);
                }
                setLoading(false);
                setIndexPage(currentPage);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
                alert(error.response.data.message);
                setLoading(false);
            });
    }, [currentPage, searchTerm]);


    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-[#3ABEF9] text-3xl mt-20">Produk</h1>
            <div className="p-4 border-2 border-gray-200 rounded-lg mt-10">
                <div className="overflow-x-auto sm:rounded-lg p-4">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </div>
                            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchInput}
                                    onChange={handleSearchInput}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ABEF9] focus:border-transparent"
                                />
                            </form>
                        </div>
                        <button
                            onClick={openCreateDialog}
                            className="px-4 py-2 bg-[#3ABEF9] hover:bg-blue-800 text-white rounded-lg"
                        >
                            Tambah Product
                        </button>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border border-gray-200">

                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="text-xs text-white uppercase bg-[#3ABEF9]">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No</th>
                                    <th scope="col" className="px-6 py-3">Nama Produk</th>
                                    <th scope="col" className="px-6 py-3">Harga</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product, index) => (
                                        <tr key={product.id} className="odd:bg-white even:bg-gray-50 border-b">
                                            <td className="px-6 py-3">{getIndex(index)}</td>
                                            <td className="px-6 py-3">{product.name}</td>
                                            <td className="px-6 py-3">{new Intl.NumberFormat().format(product.price)}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openDetailDialog(product)}
                                                        className="text-white bg-[#3ABEF9] hover:bg-blue-500 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditDialog(product)}
                                                        className="text-white bg-yellow-500 hover:bg-yellow-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteDialog(product)}
                                                        className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center">
                                                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-gray-500 text-lg font-medium">Data belum tersedia</p>
                                                {searchTerm && (
                                                    <p className="text-gray-400 mt-2">
                                                        Tidak ada produk yang sesuai dengan pencarian "{searchTerm}"
                                                    </p>
                                                )}
                                                <button
                                                    onClick={resetSearch}
                                                    className="px-4 py-2 bg-[#3ABEF9] hover:bg-blue-500 rounded-lg flex items-center gap-2 mt-4"
                                                >
                                                    <FontAwesomeIcon icon={faArrowLeft} className='text-white' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {products.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-lg ${page === currentPage
                                        ? "bg-[#3ABEF9] text-white"
                                        : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </div>

            {isDeleteDialogOpen && productToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <p>Apakah Anda yakin ingin menghapus produk {productToDelete.name}?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={deleteProduct}
                                className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={closeDeleteDialog}
                                className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDetailDialogOpen && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-10">
                        <button
                            onClick={closeDetailDialog}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition duration-200"
                            aria-label="Close"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg text-[#3ABEF9] font-bold mb-8">Detail Produk</h2>
                        <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Nama Produk:</h4>
                            <input
                                type="text"
                                value={selectedProduct.name}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Harga:</h4>
                            <input
                                type="text"
                                value={`Rp ${new Intl.NumberFormat().format(selectedProduct.price)}`}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Deskripsi:</h4>
                            <textarea
                                value={selectedProduct.description || "Tidak ada deskripsi"}
                                readOnly
                                rows={5}
                                className="w-full border rounded-lg p-2"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Kategori:</h4>
                            <input
                                type="text"
                                value={selectedProduct.category}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-8">
                            <h4 className="mb-2 font-semibold">Gambar :</h4>
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-64 h-64 object-cover mb-4 rounded-lg"
                            />
                        </div>

                        <h3 className="mb-4 font-semibold">Ukuran & Stok</h3>
                        <div>
                            {selectedProduct.product_size.map(size => (
                                <div key={size.id} className="mb-8">
                                    <h4 className="mb-2">Ukuran:</h4>
                                    <input
                                        type="text"
                                        value={size.size}
                                        readOnly
                                        className="w-full border rounded-lg p-2 mb-2"
                                    />
                                    <h4 className="mb-2">Deskripsi:</h4>
                                    <textarea
                                        value={size.description}
                                        readOnly
                                        rows={5}
                                        className="w-full border rounded-lg p-2 mb-2"
                                    />
                                    <h4 className="mb-2">Stok:</h4>
                                    <input
                                        type="text"
                                        value={size.stock}
                                        readOnly
                                        className="w-full border rounded-lg p-2 mb-4"
                                    />
                                    <hr className="border-t-4" />
                                </div>

                            ))}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={closeDetailDialog}
                                className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>

            )}

            {isCreateDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
                    <div className="relative bg-white p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-[#3ABEF9] mb-8">Tambah Produk</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <h4 className='mb-2 font-semibold'>Nama Produk</h4>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Deskripsi</h4>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Harga</h4>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Kategori</h4>
                            <input
                                type="text"
                                name="category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Gambar</h4>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <div>
                                <h3 className="mb-2 font-semibold">Ukuran dan Stok</h3>
                                {newProduct.product_size.map((size, index) => (
                                    <div key={index}>
                                        <h4 className='mb-2 text-sm'>{size.size}</h4>
                                        <input
                                            type="number"
                                            name={`product_size[${index}].stock`}
                                            placeholder={`Stok Ukuran ${size.size}`}
                                            value={size.stock}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <textarea
                                            type="text"
                                            name={`product_size[${index}].description`}
                                            placeholder={`Deskripsi Ukuran ${size.size}`}
                                            value={size.description}
                                            rows={5}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-4 mt-4">
                                {loading2 ? (
                                    <div className="flex justify-center items-center mt-5">
                                        <div className="animate-spin-3d h-24 w-24">
                                            <img src={DM1} alt="Loading" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={createProduct}
                                            className="bg-[#3ABEF9] hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={closeCreateDialog}
                                            className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
                                        >
                                            Batal
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditDialogOpen && productToEdit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-[#3ABEF9] mb-8">Update Produk</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <h4 className='mb-2 font-semibold'>Nama Produk:</h4>
                            <input
                                type="text"
                                name="name"
                                value={productToEdit.name}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Deskripsi:</h4>
                            <textarea
                                name="description"
                                value={productToEdit.description}
                                onChange={handleInputChangeEdit}
                                rows={5}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Harga:</h4>
                            <input
                                type="number"
                                name="price"
                                value={productToEdit.price}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Kategori:</h4>
                            <input
                                type="text"
                                name="category"
                                value={productToEdit.category}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <h4 className='mb-2 font-semibold'>Gambar:</h4>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChangeEdit}
                                className="w-full p-2 border rounded mb-4"
                            />

                            <div className="mt-4">
                                <h3 className="mb-2 font-semibold">Ukuran dan Stok</h3>
                                {availableSizes.map((size, index) => {
                                    const existingSize = productToEdit.product_size.find((s) => s.size === size) || {
                                        size,
                                        stock: 0,
                                        description: '',
                                    };

                                    return (
                                        <div key={index}>
                                            <h4 className="mb-2 text-sm">{size}</h4>
                                            <input
                                                type="number"
                                                name={`product_size[${size}].stock`}
                                                placeholder={`Stok Ukuran ${size}`}
                                                value={existingSize.stock}
                                                onChange={handleInputChangeEdit}
                                                className="w-full p-2 border rounded mb-2"
                                            />
                                            <textarea
                                                type="text"
                                                name={`product_size[${size}].description`}
                                                placeholder={`Deskripsi Ukuran ${size}`}
                                                value={existingSize.description}
                                                rows={5}
                                                onChange={handleInputChangeEdit}
                                                className="w-full p-2 border rounded mb-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center gap-4 mt-4">
                                {loading2 ? (
                                    <div className="flex justify-center items-center mt-5">
                                        <div className="animate-spin-3d h-24 w-24">
                                            <img src={DM1} alt="Loading" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={updateProduct}
                                            className="bg-[#3ABEF9] hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={closeEditDialog}
                                            className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
                                        >
                                            Batal
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50">
                    {errorMessage}
                </div>
            )}

        </div>
    );
};

export default Product;
