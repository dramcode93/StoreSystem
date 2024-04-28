import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import ConfirmationModal from "../Category/ConfirmationModel";
import PrintButton from "./PrintButton";
import Loading from "../Loading/Loading";
import axios from "axios";
import { Translate } from "translate-easy";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { handlePrint } from "./handlePrint";
import { DotsThree, NotePencil, TrashSimple,Eye } from "@phosphor-icons/react";
import { useI18nContext } from "../context/i18n-context";
const API_Bills = "https://store-system-api.gleeze.com/api/bills";

const Bills = () => {
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});
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
          `${API_Bills}?search=${searchInput}&page=${pagination.currentPge}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBills(response.data.data);
        console.log("bills:",bills)
        setPagination(response.data.paginationResult);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  }, [token, searchInput, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [fetchData, searchInput, pagination.currentPge]);

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
      currentPge: newPage,
    }));
  }, []);

  const handleSearch = () => {
    setPagination((prevState) => ({
      ...prevState,
      currentPge: 1,
    }));
    setSearchInput(searchTerm);
  };
  const { t, language } = useI18nContext();
  const [products, setProducts] = useState([
    {
      _id: "1",
      name: "majjjj",
      category: {
        name: "catname",
      },
      quantity: "2",
      price: "52$",
      sold: "yes",
    },
  ]);
  return (
    <div>
      {/* <div className={styles.billsContainer}>
          <div className='flex gap-5'>
            <Link className='btn btn-primary px-5 my-3 fs-5 text-light' to='/CreateBillForm'>
              <span><Translate>Create bill</Translate></span>
            </Link>
            <div>
              <input type="search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className='btn btn-primary' onClick={handleSearch}>
                <Translate>A Search</Translate>
              </button>
            </div>
          </div>
            {loading ? (
              <div className='m-5 fs-3 text-center'><Loading /></div>
            ) : (
              <>
          {bills.map((bill) => (
            <div key={bill._id} className={styles.billsTable}>
              <div className='flex'>
                <div>
                  <p>
                    <Translate>Bill Code :</Translate>   {bill._id.slice(-4)}
                  </p>
                  <p>
                    <Translate>Client Name :</Translate>   {bill.customerName}
                  </p>
                  <p>
                    <Translate> Phone :</Translate> {bill.phone}
                  </p>
                  <p>
                    <Translate> customer Address :</Translate> {bill?.customerAddress}
                  </p>
                </div>
                <div>
                  <p>
                    <Translate> Name Seller:</Translate> {bill?.user.name}
                  </p>
                  <p>
                    <Translate>Bill Date :</Translate> {bill?.createdAt && new Date(bill.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}

                  </p>
                  <p>
                    <Translate>update Date :</Translate> {bill?.updatedAt && new Date(bill.updatedAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </p>
                </div>
                <div>
                  <PrintButton onPrint={() => handlePrint(bills, bill._id)} />
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th> <Translate>product</Translate> </th>
                    <th><Translate>Price</Translate></th>
                    <th><Translate>Quantity</Translate></th>
                    <th><Translate>total price</Translate></th>
                  </tr>
                </thead>
                <tbody>
                  {bill.products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.product?.name}</td>
                      <td>{product.product?.price}</td>
                      <td>{product.productQuantity}</td>
                      <td>{product.totalPrice}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan='2'>
                      <Translate> Total :</Translate>  {bill.totalAmount}
                    </td>
                    <td>
                      <Translate> Paid : </Translate> {bill.paidAmount}
                    </td>
                    <td>
                      <Translate>Remaining : </Translate>  {bill.remainingAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
              {decodedToken.role === "admin" &&
                <div className={styles.Actions}>
                  <Link to={`/updateBills/${bill._id}`} className={styles.updateBtn}>
                    <Translate>Update</Translate>
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteBill(bill._id)}>
                    <Translate>Delete</Translate>
                  </button>
                </div>
              }
              
            </div>
          ))}
          </>
          )}
          <ConfirmationModal show={showConfirmation} onConfirm={confirmDelete} onCancel={cancelDelete} />
          {bills.length === 0 && <p><Translate>No bills available</Translate></p>}
        </div>
      <div className={styles.flex}>
        {pagination.prev && (
          <button onClick={() => handlePageChange(pagination.prev)} className={styles.paginationNext}>
            {pagination.prev}
          </button>
        )}
        <button className={styles.paginationNext}>Page {pagination.currentPge}</button>
        {pagination.next && (
          <button className={styles.paginationNext} onClick={() => handlePageChange(pagination.next)}>
            {pagination.next}
          </button>
        )}
      </div> */}
      <section className=" bg-gray-700 bg-opacity-25 mx-10 rounded-md absolute top-40 w-3/4 z-2">
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
                      className="px-4 py-4 font-medium text-gray-900whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                    >
                      {" "}
                      {product._id.slice(-4)}
                    </th>
                    <td className="px-4 py-4">{product.name}</td>
                    <td className="px-4 py-4">{product.category.name}</td>
                    <td className="px-4 py-4">{product.quantity}</td>
                    <td className="px-4 py-4">{product.productPrice}</td>
                    <td className="px-4 py-4">{product.sellingPrice}</td>
                    <td className="px-4 py-4">{product.sold}</td>
                    <td className="px-4 py-4"><PrintButton /> </td>
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

export default Bills;
