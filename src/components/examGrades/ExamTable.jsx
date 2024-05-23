import React, { useState, useRef, useEffect } from "react";
import {
   Plus,
} from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";

export default function SalesTable() {
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("day");  

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  
  const handleShowTable = () => {
    if (selectedOption === "day") {
    const response=  axios.get("https://store-system-api.gleeze.com/api/sales/daily");
    console.log('object',response)
        
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else if (selectedOption === "month") {
     } else if (selectedOption === "year") {
     }
  };


  const handleClickOutside = (event, SalesId) => {
    const dropdown = dropdownRefs.current[SalesId];

    if (
      dropdown &&
      !dropdown.contains(event.target) &&
      !event.target.classList.contains("edit-button")
    ) {
      setSelectedSalesId(null);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      handleClickOutside(event, selectedSalesId);
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedSalesId]);

  return (
    <div>
      <section className={`bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 -z-50 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
        <div className="mx-auto max-w-screen-xl">
          <div className="">
            <div
              className=" dark:bg-gray-800 relative shadow-md rounded-lg d-flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 pb-0 "
            >
              <div className="w-full md:w-1/2">
                <form className="d-flex items-center">
                  <div className=" w-full  sm:grid-cols-3 ">
                    <div>
                      <FormSelect
                        selectLabel={t("ExamGradesForm.day")}
                        options={[
                          { value: "day", label: t("ExamGradesForm.day") },
                          { value: "month", label: t("ExamGradesForm.month") },
                          { value: "year", label: t("ExamGradesForm.year") },
                        ]}
                        handleChange={handleSelectChange} // Pass the handleChange function
                        value={selectedOption}
                        headOption="Select an option" // Head option text
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0  md:items-center justify-end md:space-x-3">
                <button
                  type="button"
                  onClick={handleShowTable}
                  className="d-flex gap-2 items-center justify-center duration-150 ease-linear
                    text-white bg-orange-500 hover:bg-orange-700 
                    focus:ring-4 focus:ring-orange-300 
                    font-medium rounded-lg text-sm px-4 py-2 
                    dark:bg-orange-300 dark:hover:bg-orange-500 dark:text-orange-800
                    dark:hover:text-white
                    focus:outline-none dark:focus:ring-orange-800"
                >
                  <Plus size={18} weight="bold" />
                  {t("ExamGradesForm.Search")}
                </button>
              </div>
            </div>
            <div
              className="overflow-x-auto bg-white dark:bg-gray-800 relative shadow-md rounded-lg "
              style={{ display: "none" }}
              id="table"
            >
              {/* Table Content */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
