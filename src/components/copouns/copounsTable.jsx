import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CiSearch } from "react-icons/ci";
import {
  CaretLeft,
  CaretRight,
  DotsThree,
  NotePencil,
  TrashSimple,
} from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import Loading from "../Loading/Loading";
import ConfirmationModal from "../Category/ConfirmationModel";

const API_Coupons = "https://store-system-api.gleeze.com/api/coupon";

const CouponsTable = ({ openEdit, openPreview, openCreate, role }) => {
  const token = Cookies.get("token");
  const [coupons, setCoupons] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPageData, setNextPageData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const couponsResponse = await axios.get(`${API_Coupons}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedCoupons = couponsResponse.data.data.map((coupon) => ({
          ...coupon,
          createdAt: new Date(coupon.createdAt).toLocaleDateString("en-GB"),
          expire: new Date(coupon.expire).toLocaleDateString("en-GB"),
          updatedAt: new Date(coupon.updatedAt).toLocaleDateString("en-GB"),
        }));
        setCoupons(formattedCoupons);
        setPagination({
          currentPage: pagination.currentPage,
          totalPages: couponsResponse.data.paginationResult.numberOfPages,
        });
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, pagination.currentPage]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, pagination.currentPge, fetchData]);

  useEffect(() => {
    if (pagination.currentPge < pagination.totalPages) {
      axios
        .get(
          `${API_Coupons}?sort=coupon name&search=${searchTerm}&page=${
            pagination.currentPge + 1
          }&limit=2`,
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

  const handleDeleteCoupon = (couponId) => {
    setSelectedCouponId(couponId);
    setShowConfirmation(true);
  };

  const confirmDelete = useCallback(() => {
    if (!selectedCouponId) {
      console.error("No coupon ID selected for deletion.");
      return;
    }

    axios
      .delete(`${API_Coupons}/${selectedCouponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchData())
      .catch((error) => console.error("Error deleting coupon:", error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedCouponId(null);
      });
  }, [selectedCouponId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedCouponId(null);
  }, []);

  const handlePageChange = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPage: newPage,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const { t, language } = useI18nContext();

  const handleEditCoupon = (coupon) => {
    openEdit(coupon);
  };

  const toggleEditDropdown = (couponId) => {
    setSelectedCouponId((prevCouponId) =>
      prevCouponId === couponId ? null : couponId
    );
  };

  const dropdownRefs = useRef({});

  const MAX_DISPLAY_PAGES = 5;

  const startPage = Math.max(
    1,
    Math.min(
      pagination.currentPage - Math.floor(MAX_DISPLAY_PAGES / 2),
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
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const handleClickOutside = (event) => {
    const isOutsideDropdown = Object.values(dropdownRefs.current).every(
      (ref) => ref && !ref.contains(event.target)
    );
    if (isOutsideDropdown) {
      setSelectedCouponId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section
      className={`secondary mx-10 pt-2 absolute top-32 -z-50 w-3/4 ${
        language === "ar" ? "left-10" : "right-10"
      }`}
    >
      <ConfirmationModal
        item="coupon"
        show={showConfirmation}
        onCancel={cancelDelete}
        onConfirm={() => {
          if (selectedCouponId) {
            confirmDelete();
          }
          setShowConfirmation(false);
        }}
      />

      <div className="flex justify-between">
        <div className="relative w-96 m-3">
          <input
            className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-500"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder={t("Products.Search")}
          />
          <CiSearch
            className={`absolute top-2 text-gray-900 dark:text-gray-50 text-xl ${
              language === "ar" ? "left-3" : "right-3"
            } cursor-pointer`}
            onClick={handleSearch}
          />
        </div>
        <div>
          {role === "user" ? (
            ""
          ) : (
            <button
              className="secondaryBtn w-28 rounded-md m-3 fw-bold"
              onClick={openCreate}
            >
              {t("Products.Add")}{" "}
            </button>
          )}
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
          <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
            <th scope="col" className="px-5 py-4">
              {t("Coupon.ID")}
            </th>
            <th scope="col" className="px-5 py-4">
              {t("Coupon.Name")}
            </th>

            <th scope="col" className="px-5 py-4">
              {t("Coupon.Discount")}
            </th>
            <th scope="col" className="px-5 py-4">
              {t("Coupon.Expire")}
            </th>

            <th scope="col" className="px-4 py-3">
              <span className="sr-only">{t("Coupon.Actions")}</span>
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
              {coupons.length === 0 && (
                <tr className="text-xl text-center">
                  <td colSpan="7" style={{ lineHeight: 3 }}>
                    {t("Coupon.NoCoupons")}
                  </td>
                </tr>
              )}
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                  >
                    {coupon._id.slice(-4)}
                  </th>
                  <td className="px-4 py-4">{coupon.name}</td>
                  <td className="px-4 py-4">{coupon.discount}</td>
                  <td className="px-4 py-4">{coupon.expire}</td>
                  <td className="px-4 py-3 flex items-center justify-end">
                  {role === "user" ? (
                            ""
                          ) : (
                            <>       <button
                      className="inline-flex items-center text-sm font-medium p-1.5 text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                      type="button"
                      onClick={() => toggleEditDropdown(coupon._id)}
                      ref={(el) => (dropdownRefs.current[coupon._id] = el)}
                    >
                      <DotsThree
                        size={25}
                        weight="bold"
                        className="hover:bg-slate-300  dark:hover:bg-gray-600 w-10 rounded-lg"
                      />
                    </button>
                    <div
                      className="absolute z-10"
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <div
                        id={`coupon-dropdown-${coupon._id}`}
                        className={`${
                          selectedCouponId === coupon._id
                            ? `absolute -top-3 ${
                                language === "en" ? "right-full" : "left-full"
                              } overflow-auto`
                            : "hidden"
                        } z-10 w-44  rounded divide-y divide-gray-100 shadow secondary `}
                      >
                        <ul className="text-sm bg-transparent pl-0 mb-0">
                          <li className="">
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                              onClick={() => handleEditCoupon(coupon)}
                            >
                              <NotePencil size={18} weight="bold" />
                              {t("Coupon.Edit")}
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                              onClick={() => handleDeleteCoupon(coupon._id)}
                            >
                              <TrashSimple size={18} weight="bold" />
                              {t("Coupon.Delete")}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div></>)}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
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
                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                  pagination.currentPge === page
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
    </section>
  );
};

export default CouponsTable;
