import React from "react";
import { LanguageProvider } from "translate-easy";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyComponent from "./components/MyComponent.jsx";
import Category from "./components/Category/Category.jsx";
import Home from "./components/Home/Home.jsx";
import Products from "./components/Products/Products.jsx";
import Bills from "./components/Bills/Bills.jsx";
import Customer from "./components/Customer/Customer.jsx";
import Login from "./components/Login/Login.jsx";

    const App = () => {
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