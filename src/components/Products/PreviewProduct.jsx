import { TrashSimple, X } from "@phosphor-icons/react";

import { useState } from "react";
import { useI18nContext } from "../context/i18n-context";
import ProductFormPreview from "./ProductFormPreview";

export default function PreviewProduct({ closeModal, assistantData }) {
  const { t } = useI18nContext();
  // const [loading, setLoading] = useState(false);
  // const { images } = assistantData;

  // console.log("images", `${images.map((img) => img).join("\n")} \n`);
  // console.log(
  //   "images",
  //   `${images.map((img) => img.replace(/\s/g, "%20")).join("\n")} \n`
  // );
  // console.log(assistantData)
  const headers = {
    code: "Product Code",
    name: "Product Name",
    description: "Description",
    category: "Category",
    quantity: "Quantity",
    productPrice: "Product Price",
    sellingPrice: "Selling Price",
    sold: "Sold",
    images: "Images",
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
      w-full h-full `}
    >
      <div
        className={`w-full max-w-2xl 
        rounded-2xl duration-200 ease-linear
       absolute top-2/3 sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
       h-screen overflow-y-auto sideModal overflow-x-hidden `}
      >
        <div className="relative sideModal sm:p-5">
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
             className={`text-lg md:text-xl mx-auto text-center
              secondaryBtn p-1 mb-4 rounded-md `}
          >
            <h3 className="font-semibold ">{t("previewForm.title")}</h3>
          </div>
          <ProductFormPreview t={t} details={assistantData} headers={headers} />
          {/* <div className="flex justify-between items-center mt-14">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
