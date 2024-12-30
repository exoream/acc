import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Alni from './image/alni.png';
import DM3 from './image/dm3.png';
import DM1 from './image/dm1.png';
import '../App.css';

const Login = () => {
    let navigate = useNavigate();

    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setInput({ ...input, [name]: value });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setLoading(true);

        let { email, password } = input;
        axios.post(`https://skripsi-api-859835962101.asia-southeast2.run.app/admin/login`, { email, password })
            .then((res) => {
                let token = res.data.data.token;
                Cookies.set('token', token, { expires: 1 });
                navigate('/dashboard');
                alert("Berhasil login");
            })
            .catch((error) => {
                console.error("Error Response:", error.response);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex h-screen w-screen">
            <div className="flex-1 bg-blue-300 flex items-center justify-center">
                <img src={Alni} alt="Logo" className="max-w-full max-h-full" />
            </div>

            <div className="flex-1 flex items-center justify-center p-5 relative">
                <img
                    src={DM3}
                    alt="Small Icon"
                    className="absolute top-0 right-0 h-10 m-2"
                />
                <form className="w-full max-w-md" onSubmit={handleLogin}>
                    <h1 className="text-3xl font-bold text-blue-300 mb-10">Login</h1>
                    <p className="text-gray-300 mb-10">
                        Login terlebih dahulu untuk mengakses halaman Admin
                    </p>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-500">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                            onChange={handleChange}
                            value={input.email}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-500">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                            onChange={handleChange}
                            value={input.password}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white mb-5 bg-blue-300 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                        disabled={loading}
                    >
                        Login
                    </button>
                    {loading && (
                        <div className="flex justify-center items-center mt-5">
                            <div className="animate-spin-3d h-24 w-24">
                                <img src={DM1} alt="Loading" />
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default Login;
