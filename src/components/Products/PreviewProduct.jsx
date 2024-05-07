import { TrashSimple, X } from "@phosphor-icons/react";

import {   useState } from "react";
 import { useI18nContext } from "../context/i18n-context";
import ProductFormPreview from "./ProductFormPreview";

export default function PreviewProduct({ closeModal, assistantData,images }) {
  const { t } = useI18nContext();
   const [loading, setLoading] = useState(false);

  console.log("assistantData",assistantData)

  const headers = {
    code: "Product Code",
    name: "Product Name",
    description:"Description",
    category: "Category",
    quantity:"Quantity",
    productPrice:"Product Price",
    sellingPrice:"Selling Price",
    sold:"Sold",
    images:"Images"
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
    absolute top-1/2 -translate-x-1/2 -translate-y-1/2
    z-50 justify-center items-center left-1/2
     bg-opacity-40 w-full h-full `}
    >
      <div
        className={`PreviewUser max-w-2xl 
       dark:bg-gray-800 rounded-xl duration-200 ease-linear
       absolute top-2/3 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full
       min-h-screen overflow-auto p-3 `}
      >
        <div className="relative dark:bg-gray-800 sm:p-5">
          <div
            dir="rtl"
            className="flex justify-between items-center w-full mb-3 rounded "
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
          {/* <form
          // onSubmit={handleAddCategory}
          className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
          // dir={language === "ar" ? "rtl" : "ltr"}
        >
        </form> */}
          <div
            className={`text-lg text-white bg-themeColor md:text-xl mx-auto text-center
               dark:text-white dark:bg-themeColor p-1 mb-4 rounded-md `}
          >
            <h3 className="font-semibold ">{t("previewForm.title")}</h3>
          </div>
          <ProductFormPreview t={t} details={assistantData} headers={headers} loading={loading} />
          <div className="flex justify-between items-center mt-14">
            <div className="flex items-center">
              <button
                type="button"
                className="gap-2 text-white inline-flex items-center justify-center bg-themeColor
                   hover:bg-orange-700 focus:ring-4 focus:outline-none duration-100 ease-linear
                   focus:ring-primary-300 font-medium rounded-lg text-sm px-5 
                   py-2.5 text-center dark:focus:ring-themeColor"
              >
                <span className="font-bold text-base">
                  {t("previewForm.edit")}
                </span>
              </button>
            </div>
            <button
              type="button"
              className="gap-2 inline-flex items-center 
                text-white bg-red-600 hover:bg-red-700 
                focus:ring-4 focus:outline-none 
                focus:ring-red-300 font-medium duration-100 ease-linear
                rounded-lg text-sm px-5 py-2.5 text-center 
                dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900 max-w-min"
            >
              <TrashSimple size={18} weight="bold" />
              <span className="font-bold text-base">
                {t("previewForm.delete")}{" "}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
