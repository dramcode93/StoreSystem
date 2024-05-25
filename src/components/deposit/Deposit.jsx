import React, { useState, useRef, useEffect } from "react";
import { Plus } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import Cookies from "js-cookie";

export default function FinancialTransactions() {
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(""); 
  const [transactionData, setTransactionData] = useState([]);
  const [error, setError] = useState(null);

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleShowTable = async () => {
    let url;
    if (selectedOption === "all") {
      url = "https://store-system-api.gleeze.com/api/financialTransactions";
    } else if (selectedOption === "deposit") {
      url = "https://store-system-api.gleeze.com/api/financialTransactions?transaction=deposit";
    } else if (selectedOption === "withdraw") {
      url = "https://store-system-api.gleeze.com/api/financialTransactions?transaction=withdraw";
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log('objectt',response.data.data)
      setTransactionData(response.data.data);
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
    return date.toLocaleDateString();
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
                        selectLabel={t("Transactions.type")}
                        headOption={t("Transactions.SelectAnOption")}
                        options={[
                          { value: "all", label: t("Transactions.all") },
                          { value: "deposit", label: t("Transactions.deposit") },
                          { value: "withdraw", label: t("Transactions.withdraw") },
                        ]}
                        handleChange={handleSelectChange}
                        value={selectedOption}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="w-full  md:w-auto flex md:flex-row space-y-2 md:space-y-0 md:items-center justify-end md:space-x-3">
                <button
                  type="button"
                  onClick={handleShowTable}
                  className="d-flex items-center fw-bold fs-6 justify-center duration-150 ease-linear
                    text-white bg-orange-500 hover:bg-orange-700 
                    focus:ring-4 focus:ring-orange-300 
                    font-medium rounded-lg text-sm px-4 py-2 
                    dark:bg-orange-300 dark:hover:bg-orange-500 dark:text-orange-800
                    dark:hover:text-white
                    focus:outline-none dark:focus:ring-orange-800"
                  disabled={!selectedOption}
                >
                  {t("Transactions.Search")}
                  <Plus size={18} weight="bold" />
                </button>
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
                      {t("Transactions.Id")}
                     </th>
                    <th scope="col" className="px-5 py-4">
                      {t("Transactions.date")}
  
                    </th>
                    <th scope="col" className="px-5 py-3">
                      {t("Transactions.Money")}
                    </th>
                    <th scope="col" className="px-5 py-3">
                      {t("Transactions.Reason")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((transaction, index) => (
                    <tr key={index} className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
                      <td className="px-5 py-3">{transaction._id}</td>
                      <td className="px-5 py-3">{formatDate(transaction.createdAt)}</td>
                      <td className="px-5 py-3">{transaction.money}</td>
                      <td className="px-5 py-3">{transaction.reason}</td>
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
