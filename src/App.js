import React, { useEffect, useState } from "react";
import { LanguageProvider } from "translate-easy";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyComponent from "./components/MyComponent.jsx";
import Category from "./components/Category/Category.jsx";
import Home from "./components/Home/Home.jsx";
import Products from "./components/Products/Products.jsx";
import Bills from "./components/Bills/Bills.jsx";
 import Login from "./components/Login/Login.jsx";
import { jwtDecode } from "jwt-decode";
import Update from "./components/Category/Update.jsx";
import UpdateProduct from "./components/Products/updateProduct.jsx";
import MainComponent from "./components/Aside/MainComponent.jsx";
import ForgotPassword1 from "./components/ForgetPass/ForgetPass1.jsx";
import ForgotPassword2 from "./components/ForgetPass/ForgetPass2.jsx";
import ForgotPassword3 from "./components/ForgetPass/ForgetPass3.jsx";
import CategoryProducts from './components/Category/specificProducs';
 import ProfilePage from "./components/profile/Profile.jsx";
import ChangPassword from "./components/profile/ChangPassword.jsx";
 import CreateBillForm from "./components/Bills/createBills.jsx";
   
 
const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isTokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp < Date.now() / 1000;

      if (isExpired) {
        setTokenExpired(true);
        localStorage.removeItem('token');
      } else {
        setLoggedIn(true);
        if (window.location.pathname === '/') {
          window.location.href = '/home';
        }
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <MyComponent />
        <Routes>
        <Route path="/forgotPassword1" element={<ForgotPassword1 />} />
        <Route path="/forgotPassword2" element={<ForgotPassword2 />} />
        <Route path="/forgotPassword3" element={<ForgotPassword3 />} />
        {isLoggedIn && !isTokenExpired ? (
          <>
              <Route path="/home" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/update/:id" element={<Update />} />
              <Route path="/updateProduct/:id" element={<UpdateProduct />} />
              <Route path="/products" element={<Products />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/CreateBillForm" element={<CreateBillForm/>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/Profile" element={<ChangPassword/>} />
              <Route path="/category/:id/products" element={<CategoryProducts />} />
            </>
          ) : (
            <Route path="/*" element={<Login />} />
          )}
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;



 