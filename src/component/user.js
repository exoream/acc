import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { faEdit, faTrash, faEye, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
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
        axios.get(`https://skripsi-api-859835962101.asia-southeast2.run.app/users?page=${currentPage}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setUsers(response.data.data);
                    setTotalPage(response.data.pagination.last_page);
                } else {
                    setError('Gagal mendapatkan data');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError('Terjadi kesalahan saat mengambil data');
                setLoading(false);
            });
    }, [currentPage]);

    const openDialog = (user) => {
        setUserToDelete(user);
        setShowDialog(true);
    };

    const closeDialog = () => {
        setUserToDelete(null);
        setShowDialog(false);
    };

    const deleteUser = () => {
        console.log('Menghapus user:', userToDelete);
        closeDialog();
    };

    const openDetailDialog = (user) => {
        setUserDetail(user);
        setShowDetailDialog(true);
    };

    const closeDetailDialog = () => {
        setUserDetail(null);
        setShowDetailDialog(false);
    };

    const nextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-blue-300 text-3xl mt-20">Pengguna</h1>
            <div className="p-4 border-2 border-gray-200 rounded-lg mt-10">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className="text-xs text-white uppercase bg-blue-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Nama</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3">{user.name}</td>
                                    <td className="px-6 py-3">{user.email}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                className="text-white bg-green-500 hover:bg-green-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                onClick={() => openDetailDialog(user)}
                                            >
                                                <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openDialog(user)}
                                                className="text-white bg-red-500 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
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
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    {[...Array(totalPage)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
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
                        onClick={nextPage}
                        disabled={currentPage === totalPage}
                        className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus data pengguna?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={deleteUser}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={closeDialog}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDetailDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                        <h2 className="text-lg font-semibold mb-4">Detail Pengguna</h2>
                        {userDetail && (
                            <div className="text-left">
                                <p><strong>Nama:</strong> {userDetail.name}</p>
                                <p><strong>Username:</strong> {userDetail.username}</p>
                                <p><strong>Email:</strong> {userDetail.email}</p>
                                <p><strong>Point:</strong> {userDetail.point}</p>
                            </div>
                        )}
                        <button
                            onClick={closeDetailDialog}
                            className="mt-6 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
