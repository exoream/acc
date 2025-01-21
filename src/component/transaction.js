import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faTrash, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactionToView, setTransactionToView] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [noReceipt, setNoReceipt] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }

        axios.get('https://skripsi-api-859835962101.asia-southeast2.run.app/transaction', {
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
                    setTransactions(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                    setError(null);
                } else {
                    setTransactions([]);
                    setTotalPages(1);
                    setError(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setTransactions([]);
                setError('Terjadi kesalahan saat mengambil data');
                setLoading(false);
            });
    }, [currentPage, searchTerm]);

    // const openDialog = (transaction) => {
    //     setTransactionToDelete(transaction);
    //     setIsDialogOpen(true);
    // };

    // const closeDialog = () => {
    //     setTransactionToDelete(null);
    //     setIsDialogOpen(false);
    // };

    // const deleteTransaction = () => {

    // };

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setStatusFilter('');
        setCurrentPage(1);
    };

    const resetSearch = () => {
        setSearchTerm('');
        setSearchInput('');
        setStatusFilter('');
        setCurrentPage(1);
    };

    const handleStatusFilter = (status) => {
        setSearchTerm(status);
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const openEditDialog = (transaction) => {
        setTransactionToEdit(transaction);
        setNoReceipt(transaction.no_receipt || '');
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setTransactionToEdit(null);
        setIsEditDialogOpen(false);
    };

    const openDetailDialog = (transaction) => {
        setTransactionToView(transaction);
        setIsDetailDialogOpen(true);
    };

    const closeDetailDialog = () => {
        setTransactionToView(null);
        setIsDetailDialogOpen(false);
    };


    const updateResi = () => {
        if (!transactionToEdit) return;

        const token = Cookies.get('token');
        if (!token) {
            setError('Token tidak ditemukan, silakan login kembali');
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }

        axios.patch(
            `https://skripsi-api-859835962101.asia-southeast2.run.app/transaction/${transactionToEdit.id}`,
            { no_receipt: noReceipt },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(() => {
                alert('Nomor Resi berhasil diperbarui!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Gagal memperbarui no resi:', error);
                alert('Terjadi kesalahan saat memperbarui nomor resi.');
            });
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-300 text-yellow-800';
            case 'Dibayar':
                return 'bg-blue-300 text-blue-800';
            case 'Selesai':
                return 'bg-green-300 text-green-800';
            default:
                return 'bg-gray-300 text-gray-800';
        }
    };

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-blue-300 text-3xl mt-20">Transaksi</h1>
            <div className="p-4 border-2 border-gray-200 rounded-lg mt-10">
                <div className="relative overflow-x-auto sm:rounded-lg p-4">
                    <div className="relative flex mb-8 items-center gap-10">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari transaksi..."
                                value={searchInput}
                                onChange={handleSearchInput}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </form>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleStatusFilter('Pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Pending'
                                    ? 'bg-blue-300 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleStatusFilter('Dibayar')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Dibayar'
                                    ? 'bg-blue-300 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Dibayar
                            </button>
                            <button
                                onClick={() => handleStatusFilter('Dikirim')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Dikirim'
                                    ? 'bg-blue-300 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Dikirim
                            </button>
                            <button
                                onClick={() => handleStatusFilter('Selesai')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'Selesai'
                                    ? 'bg-blue-300 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className="text-xs text-white uppercase bg-blue-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">No Transaksi</th>
                                <th scope="col" className="px-6 py-3">Nama</th>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id} className="odd:bg-white even:bg-gray-50 border-b">
                                        <td className="px-6 py-3">{transaction.no_transaction}</td>
                                        <td className="px-6 py-3">{transaction.address_name}</td>
                                        <td className="px-6 py-3">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-2">
                                                {/* <button
                                                onClick={() => openDialog(transaction)}
                                                className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </button> */}
                                                <button
                                                    onClick={() => openDetailDialog(transaction)}
                                                    className="text-white bg-blue-300 hover:bg-blue-600 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditDialog(transaction)}
                                                    className="text-white bg-yellow-500 hover:bg-yellow-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-gray-500 text-lg font-medium">Data belum tersedia</p>
                                            {searchTerm && (
                                                <p className="text-gray-400 mt-2">
                                                    Tidak ada transaksi yang sesuai dengan pencarian "{searchTerm}"
                                                </p>
                                            )}
                                            <button
                                                onClick={resetSearch}
                                                className="px-4 py-2 bg-blue-300 hover:bg-blue-500 rounded-lg flex items-center gap-2 mt-4"
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {transactions.length > 0 && (
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
                )}
            </div>

            {/* {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <p>Apakah Anda yakin ingin menghapus transaksi ini?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={deleteTransaction}
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={closeDialog}
                                className="bg-gray-300 hover:bg-gray-500 px-4 py-2 rounded-lg"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {isEditDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg text-blue-300 font-bold mb-4">Edit Transaksi</h2>

                        <div className="mb-4">
                            <h4 className="block text-sm font-semibold mb-2">Nomor Resi</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={noReceipt}
                                    onChange={(e) => setNoReceipt(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <button
                                    onClick={updateResi}
                                    className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={closeEditDialog}
                                className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded-lg"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDetailDialogOpen && transactionToView && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-8 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-10">
                        <h1 className="text-lg text-blue-300 font-bold mb-8">Detail Transaksi</h1>
                        <div className='flex gap-10 mb-4'>
                            <div>
                                <h4 className='mb-2 font-semibold'>No Transaksi:</h4><p className='bg-blue-300 p-2 rounded-md text-sm'>{transactionToView.no_transaction}</p>
                            </div>
                            <div>
                                <h4 className='mb-2 font-semibold'>No Resi:</h4>
                                <p className='bg-blue-300 p-2 rounded-md text-center text-sm'>  {transactionToView.no_receipt.trim() === '' ? '-' : transactionToView.no_receipt}
                                </p>
                            </div>
                            <div>
                                <h4 className='mb-2 font-semibold'>Status:</h4><p className='bg-blue-300 p-2 rounded-md text-sm'>{transactionToView.status}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Nama Penerima:</h4>
                            <input
                                type="text"
                                value={transactionToView.address_name}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Nama Kurir:</h4>
                            <input
                                type="text"
                                value={transactionToView.courier_name}
                                readOnly
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-8">
                            <h4 className='mb-2 font-semibold'>Detail Produk:</h4>
                            <ul>
                                {transactionToView.transaction_details.map((detail) => (
                                    <div key={detail.id} className='flex ml-2 gap-6'>
                                        <img src={detail.image} alt={detail.product_name} className="w-20 h-20 rounded-md" />
                                        <div className='text-sm'>
                                            <div>{detail.product_name}</div>
                                            <div>Size: {detail.size}</div>
                                            <div>Quantity: {detail.quantity}</div>
                                            <div>Harga: Rp {detail.total_price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h4 className="mb-2 font-semibold">Detail Harga:</h4>
                            <div className=''>
                                <div className='mb-1'>
                                    <h6 className="text-sm">Harga Original:</h6>
                                    <input
                                        type="text"
                                        value={transactionToView.original_price.toLocaleString()}
                                        readOnly
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div className='mb-1'>
                                    <h6 className="text-sm">Jumlah Diskon:</h6>
                                    <input
                                        type="text"
                                        value={transactionToView.discount_amount.toLocaleString()}
                                        readOnly
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div className='mb-1'>
                                    <h6 className="text-sm">Poin Digunakan:</h6>
                                    <input
                                        type="text"
                                        value={transactionToView.point_used.toLocaleString()}
                                        readOnly
                                        className="w-full border rounded-lg p-2 mb-1"
                                    />
                                </div>
                                <div className='mb-1'>
                                    <h6 className="text-sm">Harga Total:</h6>
                                    <input
                                        type="text"
                                        value={transactionToView.total_price.toLocaleString()}
                                        readOnly
                                        className="w-full border rounded-lg p-2 mb-1"
                                    />
                                </div>
                            </div>
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
        </div>
    );
};

export default Transaction;
