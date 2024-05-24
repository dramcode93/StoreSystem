import React, { useState, useRef, useEffect } from "react";
import { Plus } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import Cookies from "js-cookie";
import FormText from "../../form/FormText";

export default function SalesTable() {
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("day");
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleShowTable = async () => {
    let url;
    if (selectedOption === "day") {
      url = "https://store-system-api.gleeze.com/api/sales/daily";
    } else if (selectedOption === "month") {
      url = "https://store-system-api.gleeze.com/api/sales/monthly";
    } else if (selectedOption === "year") {
      url = "https://store-system-api.gleeze.com/api/sales/yearly";
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log('object',response.data.data)
      setSalesData(response.data.data);
      setError(null);
      document.getElementById("table").style.display = "table"; // Show the table
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError("You are not logged in! Please log in to get access.");
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
      <section className={` mx-10 rounded-md py-2 absolute top-32 -z-50 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
        <div className="mx-auto max-w-screen-xl">
          <div>
            <div
              className="h-32 dark:bg-gray-800 relative shadow-md rounded-lg d-flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 pb-0"
            >
              <div className="w-full md:w-1/2">
                <form className="d-flex items-center">
                  <div className="w-full sm:grid-cols-3">
                    <div>
                      <FormSelect
                        selectLabel={t("ExamGradesForm.day")}
                        headOption="Select an option"
                        options={[
                          { value: "day", label: t("ExamGradesForm.day") },
                          { value: "month", label: t("ExamGradesForm.month") },
                          { value: "year", label: t("ExamGradesForm.year") },
                        ]}
                        handleChange={handleSelectChange}
                        value={selectedOption}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex md:flex-row space-y-2 md:space-y-0 md:items-center justify-end md:space-x-3">
                <button
                  type="button"
                  onClick={handleShowTable}
                  className="d-flex items-center justify-center duration-150 ease-linear
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
            {error && (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {error}
              </div>
            )}
            <div
              className="overflow-x-auto mt-4 dark:bg-gray-800 relative shadow-md rounded-lg"
              style={{ display: "none" }}
              id="table"
            >
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                  <tr className="text-center">
                    <th scope="col" className="px-4 py-4">
                      Created At
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Earnings
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Sales
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Shop
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Updated At
                    </th>
                    <th scope="col" className="px-4 py-3">
                      ID
                    </th>
                    {/* Additional table headers if needed */}
                  </tr>
                </thead>
                <tbody>

                  {salesData.map((sale, index) => (
                    <tr key={index} 
                      className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                    >
                      <td className="px-4 py-3">{sale.createdAt}</td>
                      <td className="px-4 py-3">{sale.earnings}</td>
                      <td className="px-4 py-3">{sale.sales}</td>
                      <td className="px-4 py-3">{sale.shop}</td>
                      <td className="px-4 py-3">{sale.updatedAt}</td>
                      <td className="px-4 py-3">{sale._id}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
