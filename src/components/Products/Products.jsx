import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { CiSearch } from "react-icons/ci";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
import Modal from "react-modal";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import FormText from "../../form/FormText";
const API_URL = "https://store-system-api.gleeze.com/api/products";
const API_category = "https://store-system-api.gleeze.com/api/categories/list";

const Products = () => {
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
          `${API_URL}?search=${searchTerm}&page=${pagination.currentPge}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(productsResponse.data.data);
        console.log("products", products);
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
  }, [searchTerm, pagination.currentPge, fetchData, products]);

  const handleDeleteProduct = (productId) => {
    setSelectedProductsId(productId);
    setShowConfirmation(true);
  };
  console.log("products:", products);
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
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Add Product Modal"
        className={` w-1/2 bg-gray-700 p-3
            rounded-r-lg duration-200 ease-linear
           absolute left-0 top-0
           h-screen overflow-auto
           
           `}
        overlayClassName="Overlay"
      >
        <>
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-lg font-semibold flex-grow- text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear">
              {t("ExpensesForm.createExpenses")}
            </h3>
            <button
              type="button"
              onClick={handleCloseModal}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X size={18} weight="bold" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="">
            <FormText label="Code" name="Code" onChange={()=>{}} placeholder='Code'  />
            <FormText label="Code" name="Code" onChange={()=>{}} placeholder='Code'  />
            <FormText label="Code" name="Code" onChange={()=>{}} placeholder='Code'  />
            <FormText label="Code" name="Code" onChange={()=>{}} placeholder='Code'  />
            <FormText label="Code" name="Code" onChange={()=>{}} placeholder='Code'  />
            <FormText label="Code" name="Code" onChange={()=>{}} placeholder='Code'  />
          </form>
        </>
      </Modal>
      <div>
        <section className=" bg-gray-700 bg-opacity-25  mx-10 rounded-md pt-2 absolute top-40 w-3/4 ">
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
                className={`absolute top-2 text-white text-xl ${
                  language === "ar" ? "left-3" : "right-3"
                } `}
              />{" "}
            </div>
            <div>
              <button
                className="bg-yellow-900 w-28 rounded-md m-3 hover:bg-yellow-800 fw-bold"
                onClick={handleOpenModal}
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
                  {t("Products.Price")}
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
                  <td colSpan="7" className=" fs-4 text-center mb-5 pb-3">
                    <Loading />
                  </td>
                </tr>
              ) : (
                <>
                  {products.length === 0 && (
                    <tr className="text-xl text-center">
                      <td colSpan="7">No Products available</td>
                    </tr>
                  )}
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 font-medium text-gray-900
                         whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                      >
                        {product._id}
                      </th>
                      <td className="px-4 py-4">{product.name}</td>
                      <td className="px-4 py-4">{product._id.slice(-4)}</td>
                      <td className="px-4 py-4">{product.category.name}</td>
                      <td className="px-4 py-4">{product.quantity}</td>
                      <td className="px-4 py-4">{product.price}</td>
                      <td className="px-4 py-4">{product.sold}</td>
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
    </>
  );
};

export default Products;
