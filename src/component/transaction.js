import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
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
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [currentPage]);

    const fetchTransactions = () => {
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
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setTransactions(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                } else {
                    setError('Gagal mendapatkan data transaksi');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching transactions:", error);
                setError('Terjadi kesalahan saat mengambil data transaksi');
                setLoading(false);
            });
    };

    const openDialog = (transaction) => {
        setTransactionToDelete(transaction);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setTransactionToDelete(null);
        setIsDialogOpen(false);
    };

    const deleteTransaction = () => {

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
                fetchTransactions();
                alert('Nomor Resi berhasil diperbarui!');
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
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="px-6 py-3">{transaction.no_transaction}</td>
                                    <td className="px-6 py-3">{transaction.user_id}</td>
                                    <td className="px-6 py-3">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditDialog(transaction)}
                                                className="text-white bg-blue-300 hover:bg-blue-500 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openDialog(transaction)}
                                                className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openDetailDialog(transaction)}
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

            {isDialogOpen && (
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
                                className="bg-gray-300hover:bg-gray-500 px-4 py-2 rounded-lg"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Transaksi</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Nomor Resi</label>
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
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Detail Transaksi</h2>

                        <div className="mb-4">
                            <strong>No Transaksi:</strong> {transactionToView.no_transaction}
                        </div>
                        <div className="mb-4">
                            <strong>Status:</strong> {transactionToView.status}
                        </div>
                        <div className="mb-4">
                            <strong>Total Harga:</strong> Rp {transactionToView.total_price.toLocaleString()}
                        </div>
                        <div className="mb-4">
                            <strong>Voucher:</strong> {transactionToView.voucher_id}
                        </div>
                        <div className="mb-4">
                            <strong>Alamat Pengiriman:</strong> {transactionToView.address_id}
                        </div>
                        <div className="mb-4">
                            <strong>Detail Produk:</strong>
                            <ul>
                                {transactionToView.transaction_details.map((detail) => (
                                    <li key={detail.id}>
                                        <img src={detail.image} alt={detail.product_name} className="w-16 h-16" />
                                        <div>{detail.product_name}</div>
                                        <div>Size: {detail.size}</div>
                                        <div>Quantity: {detail.quantity}</div>
                                        <div>Total Harga: Rp {detail.total_price.toLocaleString()}</div>
                                    </li>
                                ))}
                            </ul>
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
