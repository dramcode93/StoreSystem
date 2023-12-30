import React, { useEffect, useState } from "react";
import { LanguageProvider } from "translate-easy";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyComponent from "./components/MyComponent.jsx";
import Category from "./components/Category/Category.jsx";
import Home from "./components/Home/Home.jsx";
import Products from "./components/Products/Products.jsx";
import Bills from "./components/Bills/Bills.jsx";
import Customer from "./components/Customer/Customer.jsx";
import Login from "./components/Login/Login.jsx";
import { jwtDecode } from "jwt-decode";
 
    const App = () => {
      const [isLoggedIn, setLoggedIn] = useState(false);
      const [isTokenExpired, setTokenExpired] = useState(false);
      useEffect(() => {
        const token=localStorage.getItem('token');

      //   setIsLogged(!!token)
      if (token) {
        // Decode the token
        const decodedToken = jwtDecode(token);
  
        // Check if the token has expired
        const isExpired = decodedToken.exp < Date.now() / 1000;
  
        if (isExpired) {
          // Token has expired
          setTokenExpired(true);
          localStorage.removeItem('token'); // Remove the expired token
        } else {
          // Token is valid
          setLoggedIn(true);
          if (window.location.pathname === '/') {
            window.location.href = '/home';
         }
        }
      }
       }, []);
       if (!isLoggedIn || isTokenExpired) {
        return <Login />;
      }
      // if (!isLogged) {
      //   return <Login/>
      // }
    return (
    <BrowserRouter>
    <LanguageProvider>
    <MyComponent />
       <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/home" element={<Home />} />
           <Route path="/home/category" element={<Category />} />
           <Route path="/home/products" element={<Products />} />
           <Route path="/home/bills" element={<Bills />} />
           <Route path="/home/customer" element={<Customer />} />
          </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
};


export default App;