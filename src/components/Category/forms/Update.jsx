import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../../context/i18n-context";
import FormText from "../../../form/FormText";
import { X } from "@phosphor-icons/react";

function UpdateCategory({ closeModal, role, modal, categoryData }) {
  const token = Cookies.get("token");
  const [newCategoryName, setNewCategoryName] = useState(
    categoryData?.name || ""
  );
  const { language } = useI18nContext();
  console.log("categoryData", categoryData);

  useEffect(() => {
    if (modal) {
      setNewCategoryName(categoryData.name);
    }
  }, [categoryData, modal]);
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://store-system-api.gleeze.com/api/categories/${categoryData._id}`,
        {
          name: newCategoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.href = "/category";
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  return (
    <div>
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
                Edit Category
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
              onSubmit={handleUpdateCategory}
              className="fs-6 tracking-wider mt-4 p-0 gap-4 grid-cols-2"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <FormText
                label="Name"
                name="name"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                }}
                placeholder="Name"
              />
              <div className="col-span-2 flex justify-center">
                <button
                  disabled={!newCategoryName}
                  // className="bg-yellow-900 w-1/2 h-12 rounded-md hover:bg-yellow-800 fw-bold text-xl"
                  className="secondaryBtn w-1/2 h-12 rounded-md  fw-bold text-xl "

                >
                  Edit Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateCategory;
