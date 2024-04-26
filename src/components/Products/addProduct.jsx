import React, { useEffect } from "react";

import FormNumber from "../../form/FormNumber";
import FormText from "../../form/FormText";
import FormBtnIcon from "../../form/FormBtnIcon";
import FormSelect from "../../form/FormSelect";
import { Plus, X } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
const AddProduct = () => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
  };

  useEffect(() => {}, []);
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      //   closeModal();
    }
  };
  const { t, language } = useI18nContext();
  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`overflow-y-auto overflow-x-hidden duration-200 ease-linear
        absolute top-1/2 -translate-x-1/2 -translate-y-1/2
        z-50 justify-center items-center  left-1/2
         bg-opacity-40 w-full h-full `}
      >
      {/* ${modal ? "left-1/2" : "-left-[100%]"} */}
        <div
          className={`CreateCenter p-4 w-full max-w-2xl pb-10 bg-white
           dark:bg-gray-800 rounded-r-lg duration-200 ease-linear
           absolute left-0
           h-screen overflow-auto`}
          dir="rtl"
        >
        {/* ${modal ? "absolute left-0" : "absolute -left-[100%]"} */}
          <div className="relative p-4 bg-white dark:bg-gray-800 sm:p-5">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
                {t("ExpensesForm.createExpenses")}
              </h3>
              <button
                type="button"
                // onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <X size={18} weight="bold" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form
            // onSubmit={createGroup}
            >
              <div className="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2">
                <FormSelect
                  selectLabel={t("ExpensesForm.date")}
                  handleChange={handleChange}
                  options={[
                    { value: "day1", label: t("ExpensesForm.day1") },
                    { value: "day2", label: t("ExpensesForm.day2") },
                    { value: "day3", label: t("ExpensesForm.day3") },
                    { value: "day4", label: t("ExpensesForm.day4") },
                    { value: "day5", label: t("ExpensesForm.day5") },
                    { value: "day6", label: t("ExpensesForm.day6") },
                    { value: "day7", label: t("ExpensesForm.day7") },
                  ]}
                />

                <FormNumber
                  label={t("ExpensesForm.money")}
                  name="students"
                  //   value={formData.money}
                  placeholder={t("ExpensesForm.money")}
                  required=""
                  onChange={handleChange}
                />

                <FormSelect
                  selectLabel={t("ExpensesForm.reason")}
                  name="students"
                  onChange={handleChange}
                  options={[
                    { value: "rent", label: t("ExpensesForm.rent") },
                    {
                      value: "Electricity",
                      label: t("ExpensesForm.Electricity"),
                    },
                    {
                      value: "maintenance",
                      label: t("ExpensesForm.maintenance"),
                    },
                    { value: "equipment", label: t("ExpensesForm.equipment") },
                    { value: "tool", label: t("ExpensesForm.tool") },
                  ]}
                />

                <FormText
                  label={t("ExpensesForm.Exchange")}
                  name="Exchange"
                  //   value={formData.manager}
                  placeholder={t("ExpensesForm.Exchange")}
                  required=""
                  onChange={handleChange}
                />
                <FormText
                  label={t("ExpensesForm.manager")}
                  name="manager"
                  //   value={formData.manager}
                  placeholder={t("ExpensesForm.manager")}
                  required=""
                  onChange={handleChange}
                />
              </div>

              <FormBtnIcon
                label={t("ExpensesForm.ExpensesAdd")}
                icon={<Plus size={18} weight="bold" />}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
