import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { faEdit, faTrash, faEye, faArrowLeft, faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            setTimeout(() => {
                navigate('/');
            }, 200);
            return;
        }
        axios.get('https://skripsi-api-859835962101.asia-southeast2.run.app/users', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: currentPage,
                limit: 10,
                search: searchTerm
            }
        })
            .then((response) => {
                if (response.data.status) {
                    setUsers(response.data.data);
                    setTotalPage(response.data.pagination.last_page);
                } else {
                    setUsers([]);
                    setTotalPage(1);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setUsers([]);
                setErrorMessage(error.response.data.message);
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                setLoading(false);
            });
    }, [currentPage, searchTerm]);

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setCurrentPage(1);
    };

    const resetSearch = () => {
        setSearchTerm('');
        setSearchInput('');
        setCurrentPage(1);
    };

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
            <h1 className="font-medium text-[#3ABEF9] text-3xl mt-20">Pengguna</h1>
            <div className="p-4 border-2 border-gray-200 rounded-lg mt-10">
                <div className="relative overflow-x-auto sm:rounded-lg p-4">
                    <div className="relative flex-1 max-w-md mb-8">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari pengguna..."
                                value={searchInput}
                                onChange={handleSearchInput}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ABEF9] focus:border-transparent"
                            />
                        </form>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left rtl:text-right">
                            <thead className="text-xs text-white uppercase bg-[#3ABEF9] rounded-t-lg">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No</th>
                                    <th scope="col" className="px-6 py-3">Nama</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.id} className="odd:bg-white even:bg-gray-50 border-b last:rounded-b-lg">
                                            <td className="px-6 py-3">{(currentPage - 1) * 10 + index + 1}</td>
                                            <td className="px-6 py-3">{user.name}</td>
                                            <td className="px-6 py-3">{user.email}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="text-white bg-[#3ABEF9] hover:bg-blue-500 font-medium rounded-lg text-sm px-3 py-2 flex items-center"
                                                        onClick={() => openDetailDialog(user)}
                                                    >
                                                        <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
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
                                                        Tidak ada pengguna yang sesuai dengan pencarian "{searchTerm}"
                                                    </p>
                                                )}
                                                <button
                                                    onClick={resetSearch}
                                                    className="px-4 py-2 bg-blue-300 hover:bg-blue-500 rounded-lg flex items-center gap-2 mt-4"
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
                {users.length > 0 && (
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
                                        ? "bg-[#3ABEF9] text-white"
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
                )}
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm p-12">
                        <h2 className="text-lg font-bold text-[#3ABEF9] mb-8">Detail Pengguna</h2>
                        {userDetail && (
                            <div className="text-left">
                                <div className="mb-4">
                                    <h4 className="mb-2 font-semibold">Nama:</h4>
                                    <input
                                        type="text"
                                        value={userDetail.name}
                                        readOnly
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <h4 className="mb-2 font-semibold">Username:</h4>
                                    <input
                                        type="text font-semibold"
                                        value={userDetail.username}
                                        readOnly
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <h4 className="mb-2 font-semibold">Email:</h4>
                                    <input
                                        type="text"
                                        value={userDetail.email}
                                        readOnly
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <h4 className="mb-2 font-semibold">Poin:</h4>
                                    <input
                                        type="text"
                                        value={userDetail.point}
                                        readOnly
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
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
            {error && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default User;
