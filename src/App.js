import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyComponent from "./components/MyComponent.jsx";
import Home from "./components/Home/Home.jsx";
import Products from "./components/Products/Products.jsx";
import Bills from "./components/Bills/Bills.jsx";
import Login from "./components/Login/Login.jsx";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./components/Dashboard/Dashboard.jsx"
import ForgotPassword1 from "./components/ForgetPass/ForgetPass1.jsx";
import ForgotPassword2 from "./components/ForgetPass/ForgetPass2.jsx";
import ForgotPassword3 from "./components/ForgetPass/ForgetPass3.jsx";
import ProfilePage from "./components/profile/Profile.jsx";
import ChangPassword from "./components/profile/ChangPassword.jsx";
import CreateBillForm from "./components/Bills/createBills.jsx";
import UpdateBills from "./components/Bills/UpdateBills.jsx";
import Users from "./components/profile/Users.jsx";
import ChangeUserPassword from "./components/profile/changeUserPassword.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import FormAdd from "./components/profile/formAdd.jsx";
import UserBills from "./components/Bills/UserBills.jsx";
import { useI18nContext } from "./components/context/i18n-context.jsx";
import Information from "./components/profile/Information.jsx";
import Category from "./components/Category/Category.jsx";
import Customers from "./components/Customers/Customers.jsx";
const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isTokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const isExpired = decodedToken.exp < Date.now() / 1000;

          if (isExpired) {
            setTokenExpired(true);
            Cookies.remove('token');
            return 0;
          } else {
            setLoggedIn(true);
            if (window.location.pathname === '/') {
              window.location.href = '/home';
            }
          }

          const expirationThreshold = 24 * 60 * 60; // 24 hours in seconds
          if (decodedToken.exp - Date.now() / 1000 < expirationThreshold) {
            try {
              const response = await axios.get('https://store-system-api.gleeze.com/api/auth/refreshToken', { headers: { Authorization: `Bearer ${token}` } });
              const newToken = response.data.token;
              const tokenTime = 2
              Cookies.set('token', newToken, { expires: tokenTime, secure: true, sameSite: 'strict' }); // Set the new token with a 1-day expiration
            } catch (error) { console.error('Error refreshing token:', error); }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setTokenExpired(true);
          Cookies.remove('token');
        }
      }
    };

    checkToken();

    const refreshInterval = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const intervalId = setInterval(checkToken, refreshInterval);

    return () => clearInterval(intervalId);
  }, []);
  const { language } = useI18nContext();

  return (
    <BrowserRouter>
      <MyComponent />
      <div className="flex items-start justify-center" dir={language === "ar" ? "rtl" : "ltr"}>
        {isLoggedIn && !isTokenExpired && <Dashboard dir={language === "ar" ? "rtl" : "ltr"} />}
        <div className="flex-grow">
          <Routes>
            <Route path="/forgotPassword1" element={<ForgotPassword1 />} />
            <Route path="/forgotPassword2" element={<ForgotPassword2 />} />
            <Route path="/forgotPassword3" element={<ForgotPassword3 />} />
            <Route path="/" element={<Login />} />
            {isLoggedIn && !isTokenExpired && (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/category" element={<Category />} />
                <Route path="/changeUserPassword/:id" element={<ChangeUserPassword />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/UpdateBills/:id" element={<UpdateBills />} />
                <Route path="/CreateBillForm" element={<CreateBillForm />} />
                 <Route path="/profile" element={<ProfilePage />} />
                 <Route path="/Profile" element={<ChangPassword />} />
                <Route path="/information" element={<Information />} />
                <Route path="/change-password" element={<ChangPassword />} />
                <Route path="/Profile/Users" element={<Users />} />
                <Route path="/users/addUser" element={<FormAdd />} />
                <Route path="/users/:id/userBills" element={<UserBills />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );

  // return (
  //   <BrowserRouter dir={language === "ar" ? "rtl" : "ltr"}>
  //     <MyComponent />
  //     <Routes>
  //       <Route path="/forgotPassword1" element={<ForgotPassword1 />} />
  //       <Route path="/forgotPassword2" element={<ForgotPassword2 />} />
  //       <Route path="/forgotPassword3" element={<ForgotPassword3 />} />
  //       {isLoggedIn && !isTokenExpired ? (

  //         <Route element={<Dashboard />}>
  //           <Route path="/" element={<Home />} />
  //           <Route path="/category" element={<Dina />} />
  //           <Route path="/update/:id" element={<Update />} />
  //           <Route path="/updateProduct/:id" element={<UpdateProduct />} />
  //           <Route path="/changeUserPassword/:id" element={<ChangeUserPassword />} />
  //           <Route path="/products" element={<Products />} />
  //           <Route path="/bills" element={<Bills />} />
  //           <Route path="/UpdateBills/:id" element={<UpdateBills />} />
  //           <Route path="/CreateBillForm" element={<CreateBillForm />} />
  //           <Route path="/profile" element={<ProfilePage />} />
  //           <Route path="/Profile" element={<ChangPassword />} />
  //           <Route path="/Profile/Users" element={<Users />} />
  //           <Route path="/users/addUser" element={<FormAdd />} />
  //           <Route path="/users/:id/userBills" element={<UserBills />} />
  //           <Route path="/category/:id/products" element={<CategoryProducts />} />
  //         </Route>

  //       ) : (
  //         <Route path="/*" element={<Login />} />
  //       )}
  //     </Routes>
  //   </BrowserRouter>
  // );
};

export default App;