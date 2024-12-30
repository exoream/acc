import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DM2 from './image/dm2.png';
import DM1 from './image/dm1.png';
import DM3 from './image/dm3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faExchangeAlt, faBox, faGift, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const Navbar = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    const openLogoutDialog = () => {
        setOpenDialog(true);
    };

    const closeLogoutDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <nav className="fixed top-0 z-20 w-full bg-white border-b border-gray-200">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center justify-start rtl:justify-end">
                            </div>
                            <div className='flex items-center gap-4 p-3 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-lg shadow-md'>
                                <div className='h-6 w-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg'></div>
                                <h1 className='text-lg font-bold text-gray-700 flex items-center'>
                                    <span className='mr-2'>🎉</span> Selamat datang, Admin!
                                </h1>
                            </div>
                            <img src={DM3} className='h-10 mr-10' />
                        </div>
                    </div>
                </div>
            </nav>
            <aside
                id="logo-sidebar"
                className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full overflow-y-auto bg-white">
                    <Link to="/dashboard" className="flex mt-5 justify-center">
                        <img
                            src={DM1}
                            className="h-8 me-3 spin-on-hover"
                        />
                    </Link>

                    <hr className='mt-5 mx-5 border-2 border-gray-300' />
                    <ul className="space-y-2 px-4 mt-5">
                        <li>
                            <Link
                                to="/user"
                                className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-blue-200 group"
                            >
                                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-gray-600" />
                                <span className="ms-3">Manajemen Pengguna</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/transaction"
                                className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-blue-200 group"
                            >
                                <FontAwesomeIcon icon={faExchangeAlt} className="h-5 w-5 text-gray-600" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Manajemen Transaksi</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/product"
                                className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-blue-200 group"
                            >
                                <FontAwesomeIcon icon={faBox} className="h-5 w-5 text-gray-600" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Manajemen Produk</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/voucher"
                                className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-blue-200 group"
                            >
                                <FontAwesomeIcon icon={faGift} className="h-5 w-5 text-gray-600" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Manajemen Voucher</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="absolute bottom-5 w-full px-4">
                        <button
                            onClick={openLogoutDialog}
                            className="flex items-center p-2 text-gray-600 rounded-lg bg-blue-500 hover:bg-blue-600 group w-full justify-center"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-white" />
                            <span className="ms-3 text-white">Logout</span>
                        </button>
                    </div>
                    <img src={DM2} className='h-48 mt-20' />
                </div>
            </aside>

            {openDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">Apakah Anda yakin ingin Logout?</h3>
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={closeLogoutDialog}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
