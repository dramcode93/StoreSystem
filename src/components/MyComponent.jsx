import React  from "react";
  import Header from "./Header/header";
import { useI18nContext } from "./context/i18n-context";
import { Translate } from "@phosphor-icons/react";
import LogOut from "./LogOut/LogOut";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

const MyComponent = () => {
  
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const { language, changeLanguage} = useI18nContext();

  return (
    <div className="flex items-center shadow-lg shadow-gray-900	 justify-content-around bg-gray-900 p-6 ">
      <div className='userName text-center'>
        User Name : {decodedToken.name}
      </div>
      <h3 className="text-gray-100 font">Sales Management</h3>

      <div className="flex items-center justify-content-center">
      <LogOut />
        <button
          type="button"
          className="relative rounded-full dark:bg-gray-900 p-1 ms-3
                    dark:text-gray-400 dark:hover:text-white focus:outline-none
                    hover:text-slate-500 w-fit"
          onClick={() => {
            changeLanguage(language === "en" ? "ar" : "en");
          }}
        >
          <span className="absolute -inset-1.5" />
          <Translate className="h-6 w-10" aria-hidden="true"/>
        </button>

      <Header />
      </div>
    </div>
  );
}

export default MyComponent;
