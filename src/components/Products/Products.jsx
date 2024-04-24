import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./Products.module.css";
import { Translate, useLanguage } from "translate-easy";
import LogOut from "../LogOut/LogOut";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import ConfirmationModal from "../Category/ConfirmationModel";
import MainComponent from "../Aside/MainComponent";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { CiSearch } from "react-icons/ci";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
const API_URL = "https://store-system-api.gleeze.com/api/products";
const API_category = "https://store-system-api.gleeze.com/api/categories/list";

const Products = () => {
  const token = Cookies.get("token");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProductsId, setSelectedProductsId] = useState(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({});
  const decodedToken = jwtDecode(token);
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const productsResponse = await axios.get(
          `${API_URL}?search=${searchTerm}&page=${pagination.currentPge}&limit=20`,
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
    console.log("products:", products);
    fetchData();
  }, [searchTerm, pagination.currentPge, fetchData,products]);

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

  const confirmAddProduct = useCallback(() => {
    axios
      .post(
        `${API_URL}`,
        {
          name: newProductName,
          price: newProductPrice,
          quantity: newProductQuantity,
          category: selectedCategoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => fetchData())
      .catch((error) => console.error("Error adding product:", error))
      .finally(() => {
        setNewProductName("");
        setNewProductQuantity(0);
        setNewProductPrice("");
        setSelectedCategoryId(null);
      });
  }, [
    newProductName,
    newProductPrice,
    newProductQuantity,
    selectedCategoryId,
    token,
    fetchData,
  ]);

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

  return (
    <>
     {/* <div>
      <LogOut />
      <MainComponent />
      <div className={styles.container2}>
        <form className={styles.AddSection}>
          {decodedToken.role === "admin" && (
            <>
              <select
                name="category"
                className={styles.inputField}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option disabled selected value="">
                  <Translate>Select Category</Translate>
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="name"
                className={styles.inputField}
                placeholder="إسم المنتج"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
              <input
                type="text"
                name="price"
                className={styles.inputField}
                placeholder="السعر"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
              />
              <input
                type="text"
                name="quantity"
                className={styles.inputField}
                placeholder="الكمية"
                value={newProductQuantity}
                onChange={(e) => setNewProductQuantity(e.target.value)}
              />
            </>
          )}
          <div className="flex">
            <input
              type="text"
              name="search"
              className={styles.inputsearch}
              placeholder="إبحث"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-primary py-2" onClick={handleSearch}>
              <Translate>A Search</Translate>
            </button>
          </div>
        </form>
        {decodedToken.role === "admin" && (
          <button onClick={confirmAddProduct} className={styles.addButton}>
            <Translate translations={{ ar: "ضيف", en: "Add" }}>
              {selectedLanguage === "ar" ? "ضيف" : "Add"}
            </Translate>
          </button>
        )}
      </div>
      <div className={styles.container}>
        {loading && (
          <div className="m-5 fs-3">
            <Loading />
          </div>
        )}
        {!loading && (
          <>
            <div className={styles.categoryTable}>
              <table>
                <thead>
                  <tr>
                    <th>
                      <Translate>ID</Translate>
                    </th>
                    <th>
                      <Translate>Name</Translate>
                    </th>
                    <th>
                      <Translate>Category</Translate>
                    </th>
                    <th>
                      <Translate>Quantity</Translate>
                    </th>
                    <th>
                      <Translate>Price</Translate>
                    </th>
                    <th>
                      <Translate>Sold</Translate>
                    </th>
                    {decodedToken.role === "admin" && (
                      <th className="px-5">
                        <Translate>Actions</Translate>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id.slice(-4)}</td>
                      <td>{product.name}</td>
                      <td>{product.category.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                      <td>{product.sold}</td>
                      {decodedToken.role === "admin" && (
                        <td>
                          <Link
                            to={`/updateProduct/${product._id}`}
                            className={styles.updateBtn}
                          >
                            <Translate
                              translations={{ ar: "تعديل", en: "update" }}
                            >
                              {selectedLanguage === "ar" ? "تعديل" : "update"}
                            </Translate>
                          </Link>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Translate
                              translations={{ ar: "حذف", en: "Delete" }}
                            >
                              {selectedLanguage === "ar" ? "حذف" : "Delete"}
                            </Translate>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <ConfirmationModal
                show={showConfirmation}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
              />
              {products.length === 0 && <p>No Products available</p>}
            </div>
          </>
        )}
      </div>
      <div className={styles.flex}>
        {pagination.prev && (
          <button
            onClick={() => handlePageChange(pagination.prev)}
            className={styles.paginationNext}
          >
            {pagination.prev}
          </button>
        )}
        <button className={styles.paginationNext}>
          <Translate>Page</Translate> {pagination.currentPge}
        </button>
        {pagination.next && (
          <button
            className={styles.paginationNext}
            onClick={() => handlePageChange(pagination.next)}
          >
            {pagination.next}
          </button>
        )}
      </div>
    </div>  */}
    <div>
      <section className=" bg-gray-700 bg-opacity-25  mx-10 rounded-md pt-2">
        <div className="flex justify-between">
          {" "}
          <div className="relative w-96 m-3">
            {" "}
            <input
              className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
              type="text"
              placeholder="Search"
              // value={searchTerm}
              // onChange={handleChange}
            />{" "}
            {/* left-3 */}
            <CiSearch className={`absolute top-2 text-white text-xl ${language === "ar" ? "left-3" :"right-3"} `}  />{" "}
          </div>
          <div>
            <button className="bg-orange-700 w-28 rounded-md m-3 hover:bg-white hover:text-orange-700">Add </button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead lassName="text-xs text-gray-700 uppercase">
            <tr className="text-center bg-gray-500 bg-opacity-25 transition ease-out duration-200">
              <th scope="col" className="px-4 py-4">
                Id
              </th>
              <th scope="col" className="px-4 py-4">
                Name
              </th>
              <th scope="col" className="px-4 py-4">
              Category
              </th>
              <th scope="col" className="px-4 py-4">
              Quantity
              </th>
              <th scope="col" className="px-4 py-4">
              Price
              </th>
              <th scope="col" className="px-4 py-4">
              Sold
              </th>
              <th scope="col" className="px-4 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
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
          {products.length === 0 && <tr className="text-xl text-center">
            <td colSpan="7" >No Products available</td>
          </tr>}
            {/* <tr className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
              <th
                scope="row"
                className="px-4 py-4 font-medium text-gray-900
                         whitespace-nowrap dark:text-white max-w-[5rem] truncate"
              >
                1
              </th>
              <td className="px-4 py-4">Mahmoud</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">...</td>
            </tr>
            <tr className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
              <th
                scope="row"
                className="px-4 py-4 font-medium text-gray-900
                         whitespace-nowrap dark:text-white max-w-[5rem] truncate"
              >
                1
              </th>
              <td className="px-4 py-4">Mahmoud</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">...</td>
            </tr>
            <tr className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200">
              <th
                scope="row"
                className="px-4 py-4 font-medium text-gray-900
                         whitespace-nowrap dark:text-white max-w-[5rem] truncate"
              >
                1
              </th>
              <td className="px-4 py-4">Mahmoud</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">bla bla</td>
              <td className="px-4 py-4">...</td>
            </tr> */}

          </tbody>
        </table>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 gap-8 "
          dir="rtl"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ">
            {"      "} from {"   "}
            <span className="font-semibold text-gray-900 dark:text-white m-2">
              {"   "} 1-10 {"   "}
            </span>
            {"   "} viewed
            <span
              className="font-semibold text-gray-900 dark:text-white m-2"
              dir="ltr"
            >
              {"     "} 1000 {"      "}
            </span>{" "}
            {"  "}
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
