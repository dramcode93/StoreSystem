import React, { useCallback, useEffect, useState } from "react";
import PrintButton from "./PrintButton";
import Loading from "../Loading/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import { useI18nContext } from "../context/i18n-context";
import { CiSearch } from "react-icons/ci";
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

  return (
    <div>
      <section className="bg-gray-700 bg-opacity-25 mx-10 rounded-md absolute top-40 w-3/4 z-2">
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
              className={`absolute top-2 text-white text-xl ${language === "ar" ? "left-3" : "right-3"
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
                {t("Products.Code")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.Name")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.Category")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.Quantity")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.ProductPrice")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.SellingPrice")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.Sold")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Products.Actions")}
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
                    <td className="px-4 py-4">{bill.name}</td>
                    <td className="px-4 py-4">{bill.category.name}</td>
                    <td className="px-4 py-4">{bill.quantity}</td>
                    <td className="px-4 py-4">{bill.productPrice}</td>
                    <td className="px-4 py-4">{bill.sellingPrice}</td>
                    <td className="px-4 py-4">{bill.sold}</td>
                    <td className="px-4 py-4">
                      <PrintButton /> {/* Consider how PrintButton should function */}
                    </td>
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
