import React, { useCallback, useEffect, useRef, useState } from "react";
import { useI18nContext } from "../context/i18n-context";
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
import ConfirmationDelete from "./ConfirmationDelete";

const API_URL = "https://store-system-api.gleeze.com/api/products";
const API_category = "https://store-system-api.gleeze.com/api/categories/list";
const ProductsTable = ({ openEdit, openCreate, openPreview }) => {
  const token = Cookies.get("token");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProductsId, setSelectedProductsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({});

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const productsResponse = await axios.get(
          `${API_URL}?sort=category name&search=${searchTerm}&page=${pagination.currentPge}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(productsResponse.data.data);
        setPagination(productsResponse.data.paginationResult);

        const categoriesResponse = await axios.get(`${API_category}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoriesResponse.data.data);
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

  const handleDeleteProduct = (productId) => {
    setSelectedProductsId(productId);
    setShowConfirmation(true);
  };


  const confirmDelete = useCallback(() => {
    axios
      .delete(`${API_URL}/${selectedProductsId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchData())
      .catch((error) => console.error("Error deleting product:", error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedProductsId(null);
      });
  }, [selectedProductsId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedProductsId(null);
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

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };
  const lang = localStorage.getItem("language");
  const toggleEditDropdown = (productId) => {
    setSelectedProductsId((prevProductId) =>
      prevProductId === productId ? null : productId
    );
  };
  const dropdownRefs = useRef({});
  const handleEditProduct = (product) => {
    openEdit(product);
  };
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
          {" "}
          <div className="relative w-96 m-3">
            {" "}
            <input
              className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
              type="text"
              onClick={handleSearch}
              placeholder={t("Products.Search")}
            />{" "}
            <CiSearch
              className={`absolute top-2 text-white text-xl ${language === "ar" ? "left-3" : "right-3"
                } `}
            />{" "}
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
                {products.length === 0 && (
                  <tr className="text-xl text-center">
                    <td colSpan="8">No Products available</td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-900whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                    >
                      {" "}
                      {product._id.slice(-4)}
                      {/* {console.log(product._id)} */}
                    </th>
                    <td className="px-4 py-4">{product.name}</td>
                    <td className="px-4 py-4">{product.category.name}</td>
                    <td className="px-4 py-4">{product.quantity}</td>
                    <td className="px-4 py-4">{product.productPrice}</td>
                    <td className="px-4 py-4">{product.sellingPrice}</td>
                    <td className="px-4 py-4">{product.sold}</td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                        type="button"
                        onClick={() => toggleEditDropdown(product._id)}
                        ref={(el) => (dropdownRefs.current[product._id] = el)}
                      >
                        <DotsThree
                          size={25}
                          weight="bold"
                          className=" hover:bg-gray-700 w-10 rounded-lg"
                        />
                      </button>
                      <div
                        className="absolute z-10"
                        dir={language === "ar" ? "rtl" : "ltr"}
                      >
                        <div
                          className={`${selectedProductsId === product._id
                              ? `absolute -top-3 ${lang === "en" ? "right-full" : "left-full"
                              } overflow-auto`
                              : "hidden"
                            } z-10 bg-gray-900 rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                        >
                          <ul className="text-sm bg-transparent pl-0 mb-0">
                            <li className="">
                              <button
                                type="button"
                                className="flex w-44 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                                onClick={() => handleEditProduct(product)}
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
                                onClick={() => handleDeleteProduct(product._id)}
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
              <a
                href="/"
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-gray-700 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <CaretLeft size={18} weight="bold" />
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="/"
                aria-current="page"
                className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-gray-700 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                ...
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                100
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-gray-700 rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <CaretRight size={18} weight="bold" />
              </a>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default ProductsTable;
