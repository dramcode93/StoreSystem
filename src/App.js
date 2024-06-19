import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Products from "./components/Products/Products.jsx";
import Login from "./components/Login/Login.jsx";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./components/Dashboard/Dashboard.jsx"
import ForgotPassword1 from "./components/ForgetPass/ForgetPass1.jsx";
import ForgotPassword2 from "./components/ForgetPass/ForgetPass2.jsx";
import ForgotPassword3 from "./components/ForgetPass/ForgetPass3.jsx";
import ChangPassword from "./components/profile/ChangPassword.jsx";
import UserTable from "./components/profile/UserTable.jsx";
import ChangeUserPassword from "./components/profile/changeUserPassword.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import { useI18nContext } from "./components/context/i18n-context.jsx";
import Category from "./components/Category/Category.jsx";
import Shop from "./components/Shop/Shop.jsx";
import Customers from "./components/Customers/Customers.jsx";
import UserBills from "./components/Bills/forms/UserBills.jsx";
import Bills from "./components/Bills/Bills.jsx";
import { UserInfo } from "./components/profile/UserInfo.jsx";
import User from "./components/profile/Users.jsx";
import UserBill from "./components/Bills/UserBill.jsx";
import SignUp from "./components/Signup/Signup.jsx";
 import PreviewProduct from "./components/BestSeller/PreviewProduct.jsx";
import Cart from "./components/BestSeller/Cart.jsx";
import Shops from "./components/BestSeller/Shops.jsx";
import ShopProduct from "./components/BestSeller/ShopProduct.jsx";
import MyComponent from "./components/Navbar/MyComponent.jsx";
import SalesTable from "./components/Sales/SalesTable.jsx";
import FinancialTransactions from "./components/deposit/Deposit.jsx";
import ShopInformation from "./components/Shop/ShopInformation.jsx";
import Order from "./components/orders/Order.jsx";
import OrdersTable from "./components/orders/OrdersTable.jsx";
import CouponsTable from "./components/copouns/copounsTable.jsx";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isTokenExpired, setTokenExpired] = useState(false);
  const [role, setRole] = useState("");
  const token = Cookies.get('token');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://store-system-api.gleeze.com/api/Users/getMe",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRole(response.data.data.role)
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };
    fetchUserData();
  }, [token]);

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

          const expirationThreshold = 24 * 60 * 60;
          if (decodedToken.exp - Date.now() / 1000 < expirationThreshold) {
            try {
              const response = await axios.get('https://store-system-api.gleeze.com/api/auth/refreshToken', { headers: { Authorization: `Bearer ${token}` } });
              const newToken = response.data.token;
              const tokenTime = 2
              Cookies.set('token', newToken, { expires: tokenTime, secure: true, sameSite: 'strict' });
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

    const refreshInterval = 6 * 60 * 60 * 1000;
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
            <Route path="/signup" element={<SignUp />} />

            {isLoggedIn && !isTokenExpired && (
              <>
                {role === "customer" ? <Route path="/home" element={<Shops />} />
                  : <Route path="/home" element={<Home />} />}
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/shopInformation" element={<ShopInformation />} />
                <Route path="/order" element={<Order />} />
                <Route path="/orders" element={<OrdersTable />} />
                <Route path="/coupons" element={<CouponsTable />} />
                <Route path="/category" element={<Category />} />
                <Route path="/changeUserPassword/:id" element={<ChangeUserPassword />} />
                <Route path="/previewProduct/:id" element={<PreviewProduct />} />
                <Route path="/shopProduct/:id" element={<ShopProduct />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/SalesTable" element={<SalesTable />} />
                <Route path="/FinancialTransactions" element={<FinancialTransactions />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/information" element={<UserInfo />} />
                <Route path="/change-password" element={<ChangPassword />} />
                <Route path="/Profile/Users" element={<UserTable />} />
                <Route path="/users" element={<User />} />
                <Route path="/users/:id/userBills" element={<UserBills />} />
                <Route path="/:id/userBill" element={<UserBill />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;