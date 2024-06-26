import React, { useState, useRef, useEffect } from "react";
import { useI18nContext } from "../context/i18n-context";
import FormSelect from "../../form/FormSelect";
import axios from "axios";
import Cookies from "js-cookie";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import Actions from "./Actions";
import Loading from "../Loading/Loading";

export default function FinancialTransactions() {
  const [selectedOption, setSelectedOption] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubShop, setSelectedSubShop] = useState("");
  const [subShops, setSubShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPge: 1,
    totalPages: 1,
  });

  const dropdownRefs = useRef({});
  const { t, language } = useI18nContext();

  useEffect(() => {
    const fetchSubShops = async () => {
      try {
        const response = await axios.get(
          "https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name",
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setSubShops(response.data.data);
      } catch (error) {
        console.error("Failed to fetch sub shops:", error);
      }
    };

    fetchSubShops();
  }, []);

  const fetchTransactions = async (option, subShopId = "", page = 1) => {
    setLoading(true);
    let url = "https://store-system-api.gleeze.com/api/financialTransactions";

    const params = [`page=${page}`];

    if (option === "deposit") {
      params.push("transaction=deposit");
    } else if (option === "withdraw") {
      params.push("transaction=withdraw");
    }

    if (subShopId && subShopId !== "all") {
      params.push(`subShop=${encodeURIComponent(subShopId)}`);
    }

    url += "?" + params.join("&");

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.data && response.data.data) {
        setTransactionData(response.data.data);
        setPagination({
          currentPge: page,
          totalPages: response.data.paginationResult.numberOfPages,
        });
        setError(null);
        document.getElementById("table").style.display = "table";
      } else {
        setError("No data found");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error fetching transactions. Please try again later.");
    } finally {
      setLoading(false);
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
    await fetchTransactions(selectedOption, subShopId);
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
    return date.toLocaleDateString("en-GB");
  };

  const [openCreate, setOpenCreate] = useState(false);
  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPge: page });
    fetchTransactions(selectedOption, page);

   };

  const MAX_DISPLAY_PAGES = 5;

  const startPage = Math.max(
    1,
    Math.min(
      pagination.currentPge - Math.floor(MAX_DISPLAY_PAGES / 2),
      pagination.totalPages - MAX_DISPLAY_PAGES + 1
    )
  );

  const endPage = Math.min(
    startPage + MAX_DISPLAY_PAGES - 1,
    pagination.totalPages
  );

  const pageButtons = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const handlePreviousPage = () => {
    if (pagination.currentPge > 1) {
      handlePageChange(pagination.currentPge - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPge < pagination.totalPages) {
      handlePageChange(pagination.currentPge + 1);
    }
  };
  return (
    <div>
      <Actions closeModal={toggleOpenCreateModal} modal={openCreate} />
      <section
        className={`mx-10  py-2 absolute top-32 -z-50 w-3/4  ${language === "ar" ? "left-10" : "right-10"
          }`}
      >
        <div className="mx-auto max-w-screen-xl">
          <div>
            <div className="h-36 w-full  secondary relative shadow-md d-flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 pb-8">
              <div className="w-full md:w-1/2">
                <form className="d-flex items-center">
                  <div className="w-full sm:grid-cols-3">
                    <div className="flex items-center justify-content-evenly gap-5 w-full sm:grid-cols-3">
                      <div className="min-w-60">
                        <FormSelect
                          selectLabel={t("Sales.subShop")}
                          headOption={t("Sales.SelectAnOption")}
                          options={[
                            {
                              value: "all",
                              label: t("Transactions.AllSubShops"),
                            },
                            ...subShops.map((shop) => ({
                              value: shop._id,
                              label: shop.name,
                            })),
                          ]}
                          handleChange={handleSubShopChange}
                          value={selectedSubShop}
                        />
                      </div>
                      <div className="min-w-60">
                        <FormSelect
                          selectLabel={t("Transactions.type")}
                          headOption={t("Transactions.SelectAnOption")}
                          options={[
                            { value: "all", label: t("Transactions.all") },
                            {
                              value: "deposit",
                              label: t("Transactions.deposit"),
                            },
                            {
                              value: "withdraw",
                              label: t("Transactions.withdraw"),
                            },
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
                  className="secondaryBtn rounded-md fw-bold d-flex items-center gap-2"
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

            {((selectedSubShop && selectedOption) ||
              (!selectedSubShop && selectedOption) ||
              (selectedSubShop === "all" && !selectedOption)) && (
                <div
                  className="overflow-x-auto w-full mt-4 secondary relative shadow-md"
                  id="table"
                  style={{ display: "table" }}
                >
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                      <tr className="text-center fs-6 bg-gray-700 tracking-wide transition ease-out duration-200">
                        <th scope="col" className="px-4 py-4">
                          {t("Transactions.Id")}
                        </th>
                        <th scope="col" className="px-4 py-4">
                          {t("Transactions.date")}
                        </th>
                        <th scope="col" className="px-4 py-3">
                          {t("Transactions.Money")}
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Transaction
                        </th>
                        <th scope="col" className="px-4 py-3">
                          {t("Transactions.Reason")}
                        </th>
                        <th scope="col" className="px-4 py-3">
                          {t("Transactions.subShop")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="fs-4 text-center mb-5 pb-3">
                            <Loading />
                          </td>
                        </tr>
                      ) : transactionData.length === 0 &&
                        (selectedSubShop || selectedOption) ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-xl">
                            No Transactions yet
                          </td>
                        </tr>
                      ) : (
                        transactionData.map((transaction, index) => (
                          <tr
                            key={index}
                            className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                          >
                            <td className="px-4 py-3">{transaction._id}</td>
                            <td className="px-4 py-3">
                              {formatDate(transaction.createdAt)}
                            </td>
                            <td className="px-4 py-3">{transaction.money}</td>
                            <td className="px-4 py-3">{transaction.transaction}</td>
                            <td className="px-4 py-3">{transaction.reason}</td>
                            <td className="px-4 py-3">
                              {transaction.subShop
                                ? transaction.subShop.name
                                : t("Transactions.shop")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

        
                  {transactionData.length > 0 && (
                    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 gap-8">
                      <ul className="inline-flex items-stretch -space-x-px" dir="ltr">
                        <li>
                          <button
                            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={handlePreviousPage}
                          >
                            <span className="sr-only">Previous</span>
                            <CaretLeft size={18} weight="bold" />
                          </button>
                        </li>
                        {pageButtons.map((page) => (
                          <li key={page}>
                            <button
                              className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${pagination.currentPge === page
                                ? "bg-gray-200 text-gray-800"
                                : "text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li>
                          <button
                            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500  rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={handleNextPage}
                          >
                            <span className="sr-only">Next</span>
                            <CaretRight size={18} weight="bold" />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );

}
