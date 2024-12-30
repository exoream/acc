import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from 'js-cookie';
import Loading from './loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faExchangeAlt, faBox, faDollarSign } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            fetch('https://skripsi-api-859835962101.asia-southeast2.run.app/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setData(data.data))
                .catch((error) => console.error('Error fetching dashboard data:', error));
        }
    }, []);

    if (!data) return <Loading />;

    const chartData = data.monthly_transactions.map((item) => ({
        month: item.month,
        total: item.total,
    }));

    return (
        <div className="p-4 sm:ml-64">
            <h1 className="font-medium text-blue-300 text-3xl mt-20 mb-10">Dashboard</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-10">Transaksi Bulanan</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.monthly_transactions}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#3ABEF9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-4 flex-grow">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="mr-4 text-blue-500 text-4xl" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                            <p className="text-3xl font-bold">{data.total_users}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <FontAwesomeIcon icon={faExchangeAlt} className="mr-4 text-blue-500 text-4xl" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">Total Transactions</h3>
                            <p className="text-3xl font-bold">{data.total_transactions}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <FontAwesomeIcon icon={faBox} className="mr-4 text-blue-500 text-4xl" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">Total Products</h3>
                            <p className="text-3xl font-bold">{data.total_products}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <FontAwesomeIcon icon={faDollarSign} className="mr-4 text-blue-500 text-4xl" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-700">Total Revenue</h3>
                            <p className="text-3xl font-bold">{data.total_revenue}</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-white p-4 mt-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Ranking Pengguna</h2>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className="text-xs text-white uppercase bg-blue-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">No</th>
                                <th scope="col" className="px-6 py-3">Nama</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.user_ranking.map((user, index) => (
                                <tr key={user.id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3">{user.name}</td>
                                    <td className="px-6 py-3">{user.email}</td>
                                    <td className="px-6 py-3">{user.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
