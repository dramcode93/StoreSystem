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

const API_URL = "https://store-system-api.gleeze.com/api/products";
const API_category = "https://store-system-api.gleeze.com/api/categories/list";

const ProductsTable = ({ openEdit, openCreate, openPreview }) => {
  const token = Cookies.get("token");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const {t,language} = useI18nContext();
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const productsResponse = await axios.get(
          `${API_URL}?sort=name name&search=${searchTerm}&page=${pagination.currentPage}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(productsResponse.data.data);
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalPages: productsResponse.data.paginationResult.numberOfPages,
        }));
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
  }, [token, searchTerm, pagination.currentPage]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, pagination.currentPage, fetchData]);




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

  const toggleEditDropdown = (productId) => {
    setSelectedProductId((prevProductId) =>
      prevProductId === productId ? null : productId
    );
  };

  const pageButtons = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1
  );

  const handleDeleteProduct = (productId) => {
    setShowConfirmation(true);
    setSelectedProductId(productId);
  };
  const confirmDelete = useCallback(() => {
    axios
      .delete(`${API_URL}/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchData())
      .catch((error) => console.error("Error deleting product:", error))
      .finally(() => {
        setShowConfirmation(false);  
        setSelectedProductId(null);  
      });
  }, [selectedProductId, token, fetchData]);

  // Cancel deletion
  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);  
    setSelectedProductId(null);  
  }, []);
   
  const dropdownRefs = useRef({});
  const handleEditProduct = (product) => {
    openEdit(product);
  };

  const handlePreviewCategory = (product) => {
    openPreview(product);
  };
  return (
    <div>
      <section className=" bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-32 left-10 -z-3 w-3/4">
        <ConfirmationModal
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
                          className={`${selectedProductId === product._id
                              ? `absolute -top-3 ${language === "en" ? "right-full" : "left-full"
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
                                onClick={() => handlePreviewCategory(product)}
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
            {`Products appear 1-10 from ${products.length}`}
          </span>
          <ul className="inline-flex items-stretch -space-x-px" dir="ltr">
            <li>
              <button
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-gray-700 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <CaretLeft size={18} weight="bold" />
              </button>
            </li>
            {pageButtons.map((page) => (
              <li key={page}>
                <button
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${pagination.currentPage === page
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
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
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

export default ProductsTable;
