import React, { useCallback, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Cookies from "js-cookie";

import {
  CaretLeft,
  CaretRight,
  DotsThree,
  Eye,
  NotePencil,
  TrashSimple,
} from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import Loading from "../Loading/Loading";
import axios from "axios";
import ConfirmationDelete from "./ConfirmationDelete";

const CustomersTable = ({ openEdit, openCreate, openPreview }) => {
 

  const token = Cookies.get("token");
  const [customers, setCustomers] = useState([]);
   const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPageData, setNextPageData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPge: 1,
    totalPages: 1,
  });
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(
          `https://store-system-api.gleeze.com/api/customers?sort=name&search=${searchInput}&page=${pagination.currentPge}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers(response.data.data);
        setPagination({
          currentPge: pagination.currentPge,
          totalPages: response.data.paginationResult.numberOfPages,
        });      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, pagination.currentPge, searchInput]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, pagination.currentPge, token, fetchData]);

  useEffect(() => {
    if (pagination.currentPge < pagination.totalPages) {
      axios
        .get(
          `https://store-system-api.gleeze.com/api/customers?sort=name&search=${searchInput}&page=${pagination.currentPge}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setNextPageData(response.data.data);
        })
        .catch((error) => {
          console.error("Error preloading next page:", error);
        });
    }
  }, [pagination.currentPge, pagination.totalPages, searchTerm, token]);

  const handleDeleteCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setShowConfirmation(true);
  };

  const confirmDelete = useCallback(() => {
    axios
      .delete(
        `https://store-system-api.gleeze.com/api/customers/${selectedCustomerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => fetchData())
      .catch((error) => console.error("Error deleting product:", error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedCustomerId(null);
      });
  }, [selectedCustomerId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedCustomerId(null);
  }, []);

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const { t, language } = useI18nContext();
  const lang = localStorage.getItem("language");
  
  const toggleEditDropdown = (customerId) => {
    setSelectedCustomerId((prevCustomerId) =>
      prevCustomerId === customerId ? null : customerId
    );
  };
  const dropdownRefs = useRef({});
  const handleEditCustomer = (customer) => {
    openEdit(customer);
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
    <section className=" bg-gray-700 bg-opacity-25  mx-10 rounded-md pt-2 absolute top-32 w-3/4 ">
      <ConfirmationDelete
        show={showConfirmation}
        onCancel={cancelDelete}
        onConfirm={() => {
          confirmDelete();
          setShowConfirmation(false);
        }}
      />
      <div className="flex justify-between">
         <div className="relative w-96 m-3">
           <input
            className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder={t("Products.Search")}
          />
          <CiSearch
            className={`absolute top-2 text-white text-xl ${language === "ar" ? "left-3" : "right-3"
              } cursor-pointer`}
            onClick={handleSearch}
          /> 
        </div>
        <div>
          <button
            className="bg-yellow-900 w-28 rounded-md m-3 hover:bg-yellow-800 fw-bold"
            onClick={openCreate}
          >
            {t("Products.Add")}{" "}
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
        <thead className="text-xm text-gray-200 uppercase">
          <tr className="text-center fs-6 bg-gray-500 tracking-wide  bg-opacity-25 transition ease-out duration-200">
            <th scope="col" className="px-4 py-4">
              Id
            </th>
            <th scope="col" className="px-4 py-4">
              Name
            </th>
            <th scope="col" className="px-4 py-4">
              Address
            </th>
            <th scope="col" className="px-4 py-4">
              Phone Number
            </th>
            <th scope="col" className="px-4 py-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className=" fs-4 text-center mb-5 pb-3">
                <Loading />
              </td>
            </tr>
          ) : (
            <>
              {customers.length === 0 && (
                <tr className="text-xl text-center">
                  <td colSpan="5">No Customers available</td>
                </tr>
              )}
              {customers.map((customer) => (
                <tr
                  key={customer._id}
                  className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium text-gray-900whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                  >
                    {" "}
                    {customer._id.slice(-4)}
                  </th>
                  <td className="px-4 py-4">{customer.name}</td>
                  <td className="px-4 py-4">
                    {customer.address.map((address) => (
                      <div key={address.id}>
                        {`${address.street},
                        ${
                          language === "ar"
                            ? address.city.city_name_ar
                            : address.city.city_name_en
                        },
                        ${
                          language === "ar"
                            ? address.governorate.governorate_name_ar
                            : address.governorate.governorate_name_en
                        }`}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4">
                    {customer.phone.map((phone, index) => (
                      <div key={index}>{phone}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3 flex items-center justify-end">
                    <button
                      className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                      type="button"
                      onClick={() => toggleEditDropdown(customer._id)}
                      ref={(el) => (dropdownRefs.current[customer._id] = el)}
                    >
                      <DotsThree
                        size={25}
                        weight="bold"
                        className=" hover:bg-gray-700 w-10 rounded-lg"
                      />
                    </button>
                    <div
                      className="absolute z-50"
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <div
                        className={`${
                          selectedCustomerId === customer._id
                          ? `absolute -top-3 me-5 -right-10 overflow-auto ${
                                lang === "en" ? "right-full" : "left-full"
                              } overflow-auto`
                            : "hidden"
                          } z-10 w-44 bg-gray-900 rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                      >
                        <ul className="text-sm bg-transparent pl-0 mb-0">
                          <li className="">
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <NotePencil size={18} weight="bold" />
                              {t("Category.Edit")}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                            >
                              <Eye size={18} weight="bold" />
                              {t("Category.Preview")}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                              onClick={() => handleDeleteCustomer(customer._id)}
                            >
                              <TrashSimple size={18} weight="bold" />

                              {t("Category.Delete")}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 gap-8 "
        dir="rtl"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ">
          {"      "} {t("Products.appear")}
          {"   "}
          <span
            className="font-semibold text-gray-900 dark:text-white m-2"
            dir="ltr"
          >
            {"     "} 1-10 {"      "}
          </span>{" "}
          {"  "}
          {"   "}
          {t("Products.from")}
          <span className="font-semibold text-gray-900 dark:text-white m-2">
            {"   "}1000 {"   "}
          </span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px" dir="ltr">
          <li>
            <button
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-gray-700 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                    : "text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-gray-700 rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={handleNextPage}
            >
              <span className="sr-only">Next</span>
              <CaretRight size={18} weight="bold" />
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default CustomersTable;
