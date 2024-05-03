import React, { useCallback, useEffect, useRef, useState } from "react";
import PrintButton from "./PrintButton";
import Loading from "../Loading/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import { CiSearch } from "react-icons/ci";
import { DotsThree, Eye, NotePencil, Printer, TrashSimple } from "@phosphor-icons/react";
import ConfirmationDelete from "./ConfirmationDelete";
const API_Bills = "https://store-system-api.gleeze.com/api/Bills";

const BillsTable = ({ openEdit, openCreate, openPreview }) => {
  const token = Cookies.get("token");
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const response = await axios.get(
          `${API_Bills}?search=${searchInput}&page=${pagination.currentPage}&limit=20`, // Corrected currentPage
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBills(response.data.data);
        console.log(response.data.data);
        setPagination(response.data.paginationResult);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  }, [token, searchInput, pagination.currentPage]); // Corrected currentPage

  useEffect(() => {
    fetchData();
  }, [fetchData, searchInput, pagination.currentPage]); // Corrected currentPage

  const handleDeleteBill = useCallback((billId) => {
    setSelectedBillId(billId);
    setShowConfirmation(true);
  }, []);
  const confirmDelete = useCallback(() => {
    axios
      .delete(`${API_Bills}/${selectedBillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchData())
      .catch((error) => console.error("Error deleting bill:", error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedBillId(null);
      });
  }, [selectedBillId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedBillId(null);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: newPage, // Corrected currentPage
    }));
  }, []);

  const handleSearch = () => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: 1, // Reset currentPage to 1 on search
    }));
    setSearchInput(searchTerm);
  };

  const { t, language } = useI18nContext();
  const toggleEditDropdown = (billId) => {
    setSelectedBillId((prevBillId) =>
      prevBillId === billId ? null : billId
    );
  };
  const dropdownRefs = useRef({});
  const handleEditBill = (bill) => {
    openEdit(bill);
  };

  const lang = localStorage.getItem("language");

  return (
    <div>
      <section className=" bg-gray-700 bg-opacity-25  mx-10 rounded-md pt-2 absolute top-40 w-3/4 ">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("Products.Search")}
            />
            <CiSearch
              className={`absolute top-2 text-white text-xl ${
                language === "ar" ? "left-3" : "right-3"
              }`}
            />
          </div>
          <div>
            <button
              className="bg-yellow-900 w-28 rounded-md m-3 hover:bg-yellow-800 fw-bold"
              onClick={openCreate}
            >
              {t("Products.Add")}
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xm text-gray-200 uppercase">
            <tr className="text-center bg-gray-500 bg-opacity-25 transition ease-out duration-200">
              <th scope="col" className="px-4 py-4">
                Code
              </th>
              <th scope="col" className="px-4 py-4">
                Customer
              </th>
              <th scope="col" className="px-4 py-4">
                Phone
              </th>
              <th scope="col" className="px-4 py-4">
                Created At
              </th>
              <th scope="col" className="px-4 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="fs-4 text-center mb-5 pb-3">
                  <Loading />
                </td>
              </tr>
            ) : (
              <>
                {bills.length === 0 && (
                  <tr className="text-xl text-center">
                    <td colSpan="7">No Bills available</td>
                  </tr>
                )}
                {console.log("bills", bills)}
                {bills.map((bill) => (
                  <tr
                    key={bill._id}
                    className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-900whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                    >
                      {bill._id.slice(-4)}
                    </th>
                    <td className="px-4 py-4">{bill.customer.name}</td>
                    <td className="px-4 py-4">
                      {bill.customer.phone.map((phone, index) => (
                        <div key={index}>{phone}</div>
                      ))}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(bill.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end">
                    <button
                      className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                      type="button"
                      onClick={() => toggleEditDropdown(bill._id)}
                      ref={(el) => (dropdownRefs.current[bill._id] = el)}
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
                          selectedBillId === bill._id
                            ? `absolute -top-3 ${
                                lang === "en" ? "right-full" : "left-full"
                              } overflow-auto`
                            : "hidden"
                        } z-10 bg-gray-900 rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                      >
                        <ul className="text-sm bg-transparent pl-0 mb-0">
                          <li className="">
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                              onClick={() => handleEditBill(bill)}
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
                              onClick={() => handleDeleteBill(bill._id)}
                            >
                              <TrashSimple size={18} weight="bold" />

                              {t("Category.Delete")}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                              // onClick={() => handleDeleteCustomer(bill._id)}
                            >
                              <Printer size={18} weight="bold" />
                              A Print
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                    {/* <td className="px-4 py-4">
                      <PrintButton />
                    </td> */}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default BillsTable;