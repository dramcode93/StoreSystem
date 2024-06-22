import React, { useState, useRef, useEffect } from "react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import Cookies from "js-cookie";
import { Plus } from "@phosphor-icons/react";
import Actions from "./Actions";

export default function FinancialTransactions() {
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubShop, setSelectedSubShop] = useState("");
  const [subShops, setSubShops] = useState([]);

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  useEffect(() => {
    const fetchSubShops = async () => {
      try {
        const response = await axios.get("https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name");
        setSubShops(response.data.data);
      } catch (error) {
        console.error("Failed to fetch sub shops:", error);
      }
    };

    fetchSubShops();
  }, []);

  const fetchTransactions = async (option, subShops = "") => {
    let url;
    if (option === "all") {
      url = "https://store-system-api.gleeze.com/api/financialTransactions";
    } else if (option === "deposit") {
      url = "https://store-system-api.gleeze.com/api/financialTransactions?transaction=deposit";
    } else if (option === "withdraw") {
      url = "https://store-system-api.gleeze.com/api/financialTransactions?transaction=withdraw";
    }

    if (subShops) {
      url += `&subShop=${encodeURIComponent(subShops)}`;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setTransactionData(response.data.data);
        setError(null);
        document.getElementById("table").style.display = "table";
      } else {
        setError("No data found");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError("Error fetching transactions. Please try again later.");
    }
  };

  const handleSelectChange = async (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    await fetchTransactions(value, selectedSubShop);
  };

  const handleSubShopChange = async (event) => {
    const subShopId = event.target.value;
    setSelectedSubShop(subShopId);

    const selectedSubShopObject = subShops.find((shop) => shop._id === subShopId);
    const subShopName = selectedSubShopObject ? selectedSubShopObject.name : "";

    await fetchTransactions(selectedOption, subShopName);
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

  const [openCreate, setOpenCreate] = useState(false);
  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };

  return (
    <div>
      <Actions closeModal={toggleOpenCreateModal} modal={openCreate} />
      <section className={`mx-10 rounded-md py-2 absolute top-32 -z-50 w-3/4 ${language === "ar" ? "left-10" : "right-10"}`}>
        <div className="mx-auto max-w-screen-xl">
          <div>
            <div className="h-32 dark:bg-gray-800 relative shadow-md rounded-lg d-flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 pb-0">
              <div className="w-full md:w-1/2">
                <form className="d-flex items-center">
                  <div className="w-full sm:grid-cols-3">
                    <div className="flex items-center justify-content-evenly gap-5 w-full sm:grid-cols-3">
                      <div>
                        <FormSelect
                          selectLabel={t("Sales.subShop")}
                          headOption={t("Sales.SelectAnOption")} selectedOption
                          options={subShops.map((shop) => ({
                            value: shop._id,
                            label: shop.name,
                          }))}
                          handleChange={handleSubShopChange}
                          value={selectedSubShop}
                        />
                      </div>
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
                  </div>
                </form>
              </div>
              <div className="w-full  md:w-auto flex md:flex-row space-y-2 md:space-y-0 md:items-center justify-end md:space-x-3">
                <button
                  type="button"
                  onClick={toggleOpenCreateModal}
                  className="d-flex items-center fw-bold fs-6 justify-center duration-150 ease-linear
                    text-white bg-orange-500 hover:bg-orange-700 
                    focus:ring-4 focus:ring-orange-300 
                    font-medium rounded-lg text-sm px-4 py-2 
                    dark:bg-orange-300 dark:hover:bg-orange-500 dark:text-orange-800
                    dark:hover:text-white
                    focus:outline-none dark:focus:ring-orange-800"
                >
                  {t(`Shop.Actions`)}
                  <Plus size={18} weight="bold" />
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-500 text-white p-4 rounded-md">
                {error}
              </div>
            )}
            <div
              className="overflow-x-auto w-100 mt-4 dark:bg-gray-800 relative shadow-md rounded-lg"
              id="table"
              style={{ display: "table" }}
            >
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
                    <th scope="col" className="px-5 py-3">
                      {t("Transactions.subShop")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((transaction, index) => (
                    <tr
                      key={index}
                      className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                    >
                      <td className="px-5 py-3">{transaction._id}</td>
                      <td className="px-5 py-3">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-5 py-3">{transaction.money}</td>
                      <td className="px-5 py-3">{transaction.reason}</td>
                      <td className="px-5 py-3">
                        {transaction.subShop ? transaction.subShop.name : t("Transactions.shop")}
                      </td>
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
