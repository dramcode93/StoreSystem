import React from "react";
import Header from "./Header/header";
import { useI18nContext } from "./context/i18n-context";
import { Bell, SketchLogo, Translate } from "@phosphor-icons/react";
import LogOut from "./LogOut/LogOut";
import { jwtDecode } from "jwt-decode";

import Cookies from 'js-cookie';

const MyComponent = () => {

  const token = Cookies.get('token');
  let decodedToken = null;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const {t, language, changeLanguage } = useI18nContext();

  return (
    <div className="fixed w-100 shadow shadow-gray-200 dark:shadow-gray-900  bg-gray dark:bg-gray-900 p-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex  items-center justify-content-between" >
        <h3 className="text-gray-900  dark:text-gray-100 font flex justify-content-center gap-2 " ><SketchLogo /> {t(`Home.salesManagement`)}  </h3>

        <div className="w-50 flex items-center justify-content-center">
          <LogOut />
          <button
            type="button"
            className="relative bg-transparent rounded-full p-1 ms-3
                     text-gray-500  dark:hover:text-white focus:outline-none
                    hover:text-slate-500 w-fit"
            onClick={() => {
              changeLanguage(language === "en" ? "ar" : "en");
            }}
          >
            <span className="absolute -inset-1.5" />
            <Translate className="h-6 w-10" aria-hidden="true" />
          </button>
          <Header />
          <button
            type="button"
            className="relative bg-transparent rounded-full p-1 
                     text-gray-500  dark:hover:text-white focus:outline-none
                    hover:text-slate-500 w-fit">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-10" aria-hidden="true" />
          </button>
        </div>
        <div className='userName w-25 text-center text-gray-900 dark:text-gray-100'>
          {t(`Home.Username`)}   : {decodedToken ? decodedToken.name : ''}
        </div>
      </div>
    </div>
 
  );
}

export default MyComponent;
