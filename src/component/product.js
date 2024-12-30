import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import DM1 from './image/dm1.png'

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const navigate = useNavigate();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
                setError('Token tidak ditemukan, silakan login kembali');
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
                setError('Terjadi kesalahan saat menghapus produk');
                closeDeleteDialog();
            }
        }
    };

    const updateProduct = async () => {
        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
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
            setError('Gagal memperbarui produk');
        } finally {
            setLoading2(false);
        }
    };

    const createProduct = async () => {
        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
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
        } catch (error) {
            console.error("Error creating product:", error);
            setError('Gagal menambahkan produk');
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
            const index = name.split('[')[1].split(']')[0];
            const key = name.split('.')[1];
            const updatedSizes = [...productToEdit.product_size];
            updatedSizes[index][key] = value;
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

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
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
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setProducts(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                } else {
                    setError('Gagal mendapatkan data produk');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError('Terjadi kesalahan saat mengambil data produk');
                setLoading(false);
            });
    }, [currentPage]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-blue-300 text-3xl mt-20">Produk</h1>
            <button
                onClick={openCreateDialog}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded-lg mt-10"
            >
                Tambah Product
            </button>
            <div className="p-4 border-2 border-gray-200 rounded-lg mt-10">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className="text-xs text-white uppercase bg-blue-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Nama Produk</th>
                                <th scope="col" className="px-6 py-3">Harga</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3">{product.name}</td>
                                    <td className="px-6 py-3">{new Intl.NumberFormat().format(product.price)}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditDialog(product)} // Fungsi untuk membuka dialog edit
                                                className="text-white bg-blue-300 hover:bg-blue-500 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(product)}
                                                className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center">
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openDetailDialog(product)}
                                                className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                    ? "bg-blue-500 text-white"
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
                    <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={closeDetailDialog}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition duration-200"
                            aria-label="Close"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-bold mb-4">Detail Produk</h2>

                        <div className="mb-4">
                            <strong>Nama Produk:</strong> {selectedProduct.name}
                        </div>
                        <div className="mb-4">
                            <strong>Harga:</strong> Rp {new Intl.NumberFormat().format(selectedProduct.price)}
                        </div>
                        <div className="mb-4">
                            <strong>Deskripsi:</strong> {selectedProduct.description || "Tidak ada deskripsi"}
                        </div>
                        <div className="mb-4">
                            <strong>Kategori:</strong> {selectedProduct.category}
                        </div>
                        <div className="mb-4">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover mb-4" />
                        </div>

                        <h3 className="text-lg font-bold mb-4">Ukuran & Stok</h3>
                        <div>
                            {selectedProduct.product_size.map(size => (
                                <div key={size.id} className="mb-2">
                                    <p><strong>Ukuran:</strong> {size.size}</p>
                                    <p><strong>Deskripsi:</strong> {size.description}</p>
                                    <p><strong>Stok:</strong> {size.stock}</p>
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-medium mb-4">Tambah Produk</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nama Produk"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <textarea
                                name="description"
                                placeholder="Deskripsi Produk"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Harga Produk"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Kategori Produk"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="w-full p-2 border rounded mb-2"
                            />

                            <div className="mt-4">
                                <h3 className="text-lg">Ukuran dan Stok</h3>
                                {newProduct.product_size.map((size, index) => (
                                    <div key={index} className="flex gap-4">
                                        <input
                                            type="number"
                                            name={`product_size[${index}].stock`}
                                            placeholder={`Stok Ukuran ${size.size}`}
                                            value={size.stock}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <input
                                            type="text"
                                            name={`product_size[${index}].description`}
                                            placeholder={`Deskripsi Ukuran ${size.size}`}
                                            value={size.description}
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
                                            className="w-full md:w-auto py-3 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={closeCreateDialog}
                                            className="w-full md:w-auto py-3 px-6 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
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
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-medium mb-4">Update Produk</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nama Produk"
                                value={productToEdit.name}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <textarea
                                name="description"
                                placeholder="Deskripsi Produk"
                                value={productToEdit.description}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Harga Produk"
                                value={productToEdit.price}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Kategori Produk"
                                value={productToEdit.category}
                                onChange={handleInputChangeEdit}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChangeEdit}
                                className="w-full p-2 border rounded mb-2"
                            />

                            <div className="mt-4">
                                <h3 className="text-lg">Ukuran dan Stok</h3>
                                {productToEdit.product_size.map((size, index) => (
                                    <div key={index} className="flex gap-4">
                                        <input
                                            type="number"
                                            name={`product_size[${index}].stock`}
                                            placeholder={`Stok Ukuran ${size.size}`}
                                            value={size.stock}
                                            onChange={handleInputChangeEdit}
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <input
                                            type="text"
                                            name={`product_size[${index}].description`}
                                            placeholder={`Deskripsi Ukuran ${size.size}`}
                                            value={size.description}
                                            onChange={handleInputChangeEdit}
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
                                            onClick={updateProduct}
                                            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
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

        </div>
    );
};

export default Product;
