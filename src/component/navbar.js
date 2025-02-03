import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DM2 from './image/dm2.png';
import DM1 from './image/dm1.png';
import DM3 from './image/dm3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faExchangeAlt, faBox, faGift, faSignOutAlt, faChartPie } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
                            <div className='flex items-center gap-4'>
                                <div className='h-6 w-2 bg-[#3ABEF9] rounded-lg'></div>
                                <h1 className='text-lg font-bold text-gray-700 flex items-center'>
                                    Alni Accessories
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
                                to="/dashboard"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/dashboard" ? "bg-[#3ABEF9] text-white" : "text-gray-600 hover:bg-blue-200"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faChartPie} className="h-5 w-5" />
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/user"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/user" ? "bg-[#3ABEF9] text-white" : "text-gray-600 hover:bg-blue-200"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                                <span className="ms-3">Manajemen Pengguna</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/transaction"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/transaction" ? "bg-[#3ABEF9] text-white" : "text-gray-600 hover:bg-blue-200"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faExchangeAlt} className="h-5 w-5" />
                                <span className="ms-3">Manajemen Transaksi</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/product"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/product" ? "bg-[#3ABEF9] text-white" : "text-gray-600 hover:bg-blue-200"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faBox} className="h-5 w-5" />
                                <span className="ms-3">Manajemen Produk</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/voucher"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/voucher" ? "bg-[#3ABEF9] text-white" : "text-gray-600 hover:bg-blue-200"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faGift} className="h-5 w-5" />
                                <span className="ms-3">Manajemen Voucher</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="absolute bottom-5 w-full px-4">
                        <button
                            onClick={openLogoutDialog}
                            className="flex items-center p-2 text-gray-600 rounded-lg bg-[#3ABEF9] hover:bg-blue-500 group w-full justify-center transition duration-300"
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
