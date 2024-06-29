import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CiSearch } from "react-icons/ci";
import Loading from "../Loading/Loading";
import {
  CaretLeft,
  CaretRight,
  DotsThree,
  Eye,
  NotePencil,
  TrashSimple,
} from "@phosphor-icons/react";
import ConfirmationModal from "../Category/ConfirmationModel";
import { useI18nContext } from "../context/i18n-context";

const API_URL = "https://store-system-api.gleeze.com/api/shopTypes";

const TypesTable = ({
  openEdit,
  openCreate,
}) => {
  const token = Cookies.get("token");
  const [types, setTypes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPge: 1,
    totalPages: 1,
  });
  const { t, language } = useI18nContext();
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const productsResponse = await axios.get(
          `${API_URL}?sort=category name&search=${searchTerm}&page=${pagination.currentPge}&limit=15`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTypes(productsResponse.data.data);
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalPages: productsResponse.data.paginationResult.numberOfPages,
        }));
      } else {
        console.error("No token found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, pagination.currentPge, fetchData]);

  const handlePageChange = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      currentPge: newPage,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const toggleEditDropdown = (typeId) => {
    setSelectedTypeId((prevTypeId) => 
      prevTypeId === typeId ? null : typeId
  );
  };


  const pageButtons = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1
  );

  const handleDeleteType = (typeId) => {
    setShowConfirmation(true);
    setSelectedTypeId(typeId);
  };

  
  const confirmDelete = useCallback(() => {
    console.log("object",selectedTypeId)

    axios
      .delete(`https://store-system-api.gleeze.com/api/shopTypes/${selectedTypeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchData())
      .catch((error) => console.error("Error deleting type:", error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedTypeId(null);
      });
  }, [selectedTypeId, token, fetchData]);

  // Cancel deletion
  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedTypeId(null);
  }, []);

  const dropdownRefs = useRef({});

  const handleEditType = (type) => {
    openEdit(type);
  };
  const handleClickOutside = (event) => {
    const isOutsideDropdown = Object.values(dropdownRefs.current).every(
      (ref) => ref && !ref.contains(event.target)
    );
    // if (isOutsideDropdown) {
    //   setSelectedTypeId(null);
    // }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year}<br>${hours}:${minutes}`;
    // return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  return (
    <div>
      <section
        className={`secondary mx-10 pt-2 absolute top-32 -z-50 w-3/4 ${
          language === "ar" ? "left-10" : "right-10"
        }`}
      >
        {" "}
        <ConfirmationModal
          item="Type"
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
            <button
              className="secondaryBtn w-28 rounded-md m-3 fw-bold"
              onClick={openCreate}
            >
              {t("Products.Add")}{" "}
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
            <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
              <th scope="col" className="px-4 py-4">
                Code
              </th>
              <th scope="col" className="px-4 py-4">
                Type AR
              </th>
              <th scope="col" className="px-4 py-4">
                Type EN
              </th>
              <th scope="col" className="px-4 py-4">
                Created At
              </th>
              <th scope="col" className="px-4 py-4">
                Updated At
              </th>
              <th scope="col" className="px-4 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className=" fs-4 text-center mb-5 pb-3">
                  <Loading />
                </td>
              </tr>
            ) : (
              <>
                {types.length === 0 && (
                  <tr className="text-xl text-center">
                    <td colSpan="8" style={{lineHeight: 3}}>No Types available</td>
                  </tr>
                )}
                {types.map((type) => (
                  <tr
                    key={type._id}
                    className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-900whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                    >
                      {" "}
                      {type._id.slice(-4)}
                    </th>
                    <td className="px-4 py-4">{type.type_ar}</td>
                    <td className="px-4 py-4">{type.type_en}</td>
                    <td
                      className="px-4 py-4"
                      dangerouslySetInnerHTML={{
                        __html: formatDate(type.createdAt),
                      }}
                    ></td>
                    <td
                      className="px-4 py-4"
                      dangerouslySetInnerHTML={{
                        __html: formatDate(type.updatedAt),
                      }}
                    ></td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                        type="button"
                        onClick={() => toggleEditDropdown(type._id)}
                        ref={(el) => (dropdownRefs.current[type._id] = el)}
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
                          className={`${
                            selectedTypeId === type._id
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
                                onClick={() => handleEditType(type)}
                              >
                                <NotePencil size={18} weight="bold" />
                                {t("Category.Edit")}
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                onClick={() => handleDeleteType(type._id)}
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
        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 gap-8 ">
          <ul className="inline-flex items-stretch -space-x-px" dir="ltr">
            <li>
              <button
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handlePageChange(pagination.currentPge - 1)}
                disabled={pagination.currentPge === 1}
              >  
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
              onClick={() => handlePageChange(pagination.currentPge + 1)}
                disabled={pagination.currentPge === pagination.totalPages}
              >
                <CaretRight size={18} weight="bold" />
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default TypesTable;
