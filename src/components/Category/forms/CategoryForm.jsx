import { useEffect, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import FormInput from "../../../form/FormInput";
import { useI18nContext } from "../../context/i18n-context";
import FormBtnIcon from "../../../form/FormBtnIcon";

export default function CreateCategory({ closeModal, role, modal }) {
  const [formData, setFormData] = useState({
    name: "",
  });
  useEffect(() => {}, []);
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: Array.isArray(value) ? value : [value],
    }));
  };
  const { t } = useI18nContext();
  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
        absolute top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center ${modal ? "left-1/2" : "-left-[100%]"}
         bg-opacity-40 w-full h-full `}
      >
        <div
          className={`CreateCenter p-4 w-full max-w-2xl pb-10 
           dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
           ${modal ? "absolute left-0" : "absolute -left-[100%]"}
           h-screen overflow-auto`}
          dir="rtl"
        >
          <div className="relative p-4 dark:bg-gray-800 sm:p-5">
            <div className="flex justify-between items-center w-full pb-4  rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                {t("Category.createCategory")}
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
            <form>
              <div className="fs-6 tracking-wider -mt-5 p-2 ">
                <FormInput
                  label={t("Category.Name")}
                  name="name"
                  value={formData.name}
                  placeholder={t("Category.Name")}
                  required=""
                  onChange={handleChange}
                />
              </div>
              <FormBtnIcon
                label={t("Category.addCategory")}
                icon={<Plus size={18} weight="bold" />}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
