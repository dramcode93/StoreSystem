import React, { useEffect, useState } from "react";
import Header from "./Header/header";
import { useI18nContext } from "../context/i18n-context";
import { Translate } from "@phosphor-icons/react";
import LogOut from "../LogOut/LogOut";
import Cookies from "js-cookie";
import axios from "axios";
import { MdProductionQuantityLimits } from "react-icons/md";
import CartHover from "../BestSeller/CartHover";
import Logo from "./logo/Black-and-Gold-Sophisticated-Traditional-Fashion-Logo-(1).svg";
const MyComponent = ({ openSideBar, }) => {
  const { t, language, changeLanguage } = useI18nContext();
  const token = Cookies.get("token");
  const [role, setRole] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const handleOpenSideBar = () => {
    openSideBar();
  };
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
          if (
            error.response &&
            error.response.data.message === "jwt malformed"
          ) {
            Cookies.remove("token");
          }
          setRole("shop");
        }
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <div
      className="z-40 fixed w-100 box dark:bg-gray-900 px-6 pt-2"
      dir={language === "ar" ? "rtl" : "ltr"}
      style={{ backgroundColor: "var(--back)" }}
    >
      <div className="d-flex justify-between">
        <div className="d-flex">

          <h3
            className="text-gray-900 dark:text-gray-100 font flex justify-content-center gap-2 min-w-max"
            onClick={() => handleOpenSideBar}
          >
            <img src={Logo} alt="Logo" className="h-20 w-32 object-cover" title="Gleam Goods"
/>
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="w-25 flex items-center justify-content-center">
            {role === "customer" && (
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  type="button"
                  className="relative bg-transparent rounded-full p-1 ms-3 text-gray-500 dark:hover:text-white focus:outline-none hover:text-slate-500 w-fit"
                  title={t("Home.Cart")}
                >
                  <span className="absolute -inset-1.5" />
                  <MdProductionQuantityLimits
                    className="h-6 w-10"
                    aria-hidden="true"
                  />
                </button>
                {isHovered && (
                  <div className="absolute top-full left-0 mt-2 bg-white border w-64 border-gray-300 shadow-lg p-2 rounded">
                    <CartHover />
                  </div>
                )}
              </div>
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
