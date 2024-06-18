import React from "react";
import Header from "./Header/header";
import { useI18nContext } from "../context/i18n-context";
import { Bell, SketchLogo, Translate } from "@phosphor-icons/react";
import LogOut from "../LogOut/LogOut";

const MyComponent = () => {
  const { t, language, changeLanguage } = useI18nContext();

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
