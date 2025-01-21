import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import User from "./component/user";
import Navbar from './component/navbar';
import Product from './component/product';
import Voucher from './component/voucher';
import Transaction from './component/transaction';
import Login from './component/login';
import Dashboard from './component/dashboard';
import Cookies from 'js-cookie';

function PrivateRoute({ children }) {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      Cookies.remove("token");
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    Cookies.remove("token");
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  const checkTokenExpiration = () => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          Cookies.remove("token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Cookies.remove("token");
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login */}
        <Route path="/" element={<Login />} />

        {/* Routes yang dilindungi */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <User />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/product"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Product />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/voucher"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Voucher />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Transaction />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;