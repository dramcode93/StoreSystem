import { TrashSimple, X } from "@phosphor-icons/react";

import { useState } from "react";
import { useI18nContext } from "../context/i18n-context";
import CustomerFormPreview from "./CustomerFormPreview";

export default function PreviewCustomer({ closeModal, assistantData }) {
  const { t } = useI18nContext();
  const headers = {
    code: "Customer Code",
    name: "Customer Name",
    address:"Customer Address",
    phone:"Customer Phone",
    bills:"Bills"
  };
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
    fixed top-1/2 -translate-x-1/2 -translate-y-1/2
    z-50 justify-center items-center left-1/2
     bg-opacity-40 w-full h-full `}
    >
      <div
        className={`PreviewUser max-w-2xl 
       dark:bg-gray-800 rounded-2xl duration-200 ease-linear
       absolute top-2/3 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full
       min-h-screen overflow-auto`}
      >
        <div className="relative dark:bg-gray-800 sm:px-4">
          <div
            dir="rtl"
            className="flex justify-between items-center w-full my-2 rounded "
          >
            <button
              type="button"
              onClick={closeModal}
              className="w-fit text-gray-400 bg-transparent hover:bg-gray-200 
              hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X size={18} weight="bold" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div
            className={`text-lg text-white bg-themeColor md:text-xl mx-auto text-center
               dark:text-white dark:bg-themeColor p-1 mb-4  rounded-md `}
          >
            <h3 className="font-semibold ">{t("previewForm.title")}</h3>
          </div>
          <CustomerFormPreview t={t} details={assistantData} headers={headers} />
        </div>
      </div>
    </div>
  );
}
