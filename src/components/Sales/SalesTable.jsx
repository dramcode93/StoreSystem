import React, { useState, useRef, useEffect } from "react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import Cookies from "js-cookie";

export default function SalesTable() {
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  const handleSelectChange = async (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    // Fetch data based on the selected option
    await handleShowTable(value);
  };

  const handleShowTable = async (option) => {
    let url;
    if (option === "day") {
      url = "https://store-system-api.gleeze.com/api/sales/daily";
    } else if (option === "month") {
      url = "https://store-system-api.gleeze.com/api/sales/monthly";
    } else if (option === "year") {
      url = "https://store-system-api.gleeze.com/api/sales/yearly";
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSalesData(response.data.data);
      setError(null);
      document.getElementById("table").style.display = "table";
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (selectedOption === "day") {
      return date.toLocaleDateString();
    } else if (selectedOption === "month") {
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (selectedOption === "year") {
      return date.getFullYear();
    }
  };

  return (
    <div>
      <section className={`mx-10 rounded-md py-2 absolute top-32 -z-50 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
        <div className="mx-auto max-w-screen-xl">
          <div>
            <div className="h-32 dark:bg-gray-800 relative shadow-md rounded-lg d-flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 pb-0">
              <div className="w-full md:w-1/2">
                <form className="d-flex items-center">
                  <div className="w-full sm:grid-cols-3">
                    <div>
                      <FormSelect
                        selectLabel={t("Sales.date")}
                        headOption={t("Sales.SelectAnOption")}
                        options={[
                          { value: "day", label: t("Sales.day") },
                          { value: "month", label: t("Sales.month") },
                          { value: "year", label: t("Sales.year") },
                        ]}
                        handleChange={handleSelectChange}
                        value={selectedOption}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {error && (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {error}
              </div>
            )}
            <div className="overflow-x-auto w-100 mt-4 dark:bg-gray-800 relative shadow-md rounded-lg" id="table" style={{ display: "none" }}>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                  <tr className="text-center fs-6 bg-gray-500 bg-opacity-25 dark:bg-gray-500 tracking-wide dark:bg-opacity-25 transition ease-out duration-200">
                    <th scope="col" className="px-5 py-4">
                      {t("Sales.Id")}
                    </th>
                    <th scope="col" className="px-5 py-4">
                      {t("Sales.date")}
                    </th>
                    <th scope="col" className="px-5 py-3">
                      {t("Sales.Earnings")}
                    </th>
                    <th scope="col" className="px-5 py-3">
                      {t("Sales.Sales")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sale, index) => (
                    <tr key={index} className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
                      <td className="px-5 py-3">{sale._id}</td>
                      <td className="px-5 py-3">{formatDate(sale.createdAt)}</td>
                      <td className="px-5 py-3">{sale.earnings}</td>
                      <td className="px-5 py-3">{sale.sales}</td>
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
