import React, { useEffect, useState } from "react";
import Header from "./Header/header";
import { useI18nContext } from "../context/i18n-context";
import { Bell, SketchLogo, Translate } from "@phosphor-icons/react";
import LogOut from "../LogOut/LogOut";
import Cookies from 'js-cookie';
import axios from "axios";
import { MdProductionQuantityLimits } from "react-icons/md";

const MyComponent = () => {
  const { t, language, changeLanguage } = useI18nContext();
  const token = Cookies.get('token');
  const [role, setRole] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/Users/getMe",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRole(response.data.data.role || "shop");
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (error.response && error.response.data.message === "jwt malformed") {
            Cookies.remove('token');
          }
          setRole("shop");
          console.log(role)
        }
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <div
      className="z-50 fixed w-100 box dark:bg-gray-900 p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
      style={{ backgroundColor: 'var(--back)' }}
    >
      <div className="flex items-center justify-content-between">
        <h3 className="text-gray-900 dark:text-gray-100 font flex justify-content-center gap-2">
          <SketchLogo /> {t(`Home.GleamGoods`)}
        </h3>
        <div className="w-25 flex items-center justify-content-center">

          {role == "customer" && <button
            type="button"
            className="relative bg-transparent rounded-full p-1 ms-3 text-gray-500 dark:hover:text-white focus:outline-none hover:text-slate-500 w-fit"
            onClick={() => {
              changeLanguage(language === "en" ? "ar" : "en");
            }}
            title={t("Home.Cart")}
          >
            <span className="absolute -inset-1.5" />
            <MdProductionQuantityLimits className="h-6 w-10" aria-hidden="true" />
          </button>}

          <LogOut />

          <button
            type="button"
            className="relative bg-transparent rounded-full p-1 ms-3 text-gray-500 dark:hover:text-white focus:outline-none hover:text-slate-500 w-fit"
            onClick={() => {
              changeLanguage(language === "en" ? "ar" : "en");
            }}
            title={t("Home.Translate")}
          >
            <span className="absolute -inset-1.5" />
            <Translate className="h-6 w-10" aria-hidden="true" />
          </button>
          <Header />
          <button
            type="button"
            className="relative bg-transparent rounded-full p-1 text-gray-500 dark:hover:text-white focus:outline-none hover:text-slate-500 w-fit"
            title={t("Home.Notifications")}
          >
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-10" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyComponent;
