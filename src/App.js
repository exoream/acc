import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import User from "./component/user";
import Navbar from './component/navbar';
import Product from './component/product';
import Voucher from './component/voucher';
import Transaction from './component/transaction';
import Login from './component/login';
import Dashboard from './component/dashboard';
import Cookies from 'js-cookie';

function App() {
  const checkTokenExpiration = () => {
    const token = Cookies.get('token');

    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        Cookies.remove('token');
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/user"
          element={
            <>
              <Navbar />
              <User />
            </>
          }
        />
        <Route
          path="/product"
          element={
            <>
              <Navbar />
              <Product />
            </>
          }
        />
        <Route
          path="/voucher"
          element={
            <>
              <Navbar />
              <Voucher />
            </>
          }
        />
        <Route
          path="/transaction"
          element={
            <>
              <Navbar />
              <Transaction />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
