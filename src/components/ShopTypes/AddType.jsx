import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import axios from "axios";
import Cookies from "js-cookie";
import FormText from "../../form/FormText";


export default function AddType({ closeModal, role, modal }) {
  useEffect(() => {}, []);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const { t, language } = useI18nContext();
  const token = Cookies.get("token");
  const [typeAr, setTypeAr] = useState("");
  const [typeEn, setTypeEn] = useState("");
  const handleAddType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://store-system-api.gleeze.com/api/shopTypes",
        {
          type_ar: typeAr,
          type_en: typeEn,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );  
      window.location.href = "/shopTypes";
      console.log("Type added successfully:", response.data);
      closeModal(); 
    } catch (error) {
      console.error("Error adding type:", error);
    }
  };

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
          fixed top-1/2 -translate-x-1/2 -translate-y-1/2
          z-50 justify-center items-center ${
            modal ? "-right-1/2" : "-left-[100%]"
          }
           w-full h-full `}
      >
        <div
          className={`w-full max-w-min 
             sideModal duration-200 ease-linear
             ${
               language === "ar"
                 ? "absolute left-0 rounded-r-xl"
                 : "absolute right-0 rounded-l-xl"
             }
             h-screen overflow-y-auto overflow-x-hidden`}
        >
          <div className="relative p-4 sideModal sm:p-5">
            <div
              dir="rtl"
              className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600"
            >
              <h3 className="text-xl font-bold mr-3 text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                Add Type
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="w-fit text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <X size={18} weight="bold" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form
              onSubmit={handleAddType}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormText
                label="Type In Arabic"
                name="typeAn"
                onChange={(e) => {
                  setTypeAr(e.target.value);
                }}
                placeholder="Type AR"
                value={typeAr}
              />
              <FormText
                label="Type In English"
                name="typeEn"
                onChange={(e) => {
                  setTypeEn(e.target.value);
                }}
                placeholder="Type EN"
                value={typeEn}
              />

              <div className="col-span-2 flex justify-center">
                <button
                  disabled={
                    !typeAr||!typeEn
                  }
                  className="secondaryBtn w-1/2 h-12 rounded-md  fw-bold text-xl "

                >
                  Add Type
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
