import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import ConfirmationModal from '../Category/ConfirmationModel';
import MainComponent from './../Aside/MainComponent';
import PrintButton from './PrintButton';
import Loading from '../Loading/Loading';
import axios from 'axios';
import LogOut from './../LogOut/LogOut';
import { Translate } from 'translate-easy';
import { jwtDecode } from "jwt-decode";
const API_Bills = 'http://localhost:3030/api/bills';

const Bills = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const response = await axios.get(`${API_Bills}?search=${searchTerm}&page=${pagination.currentPge}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
        setBills(response.data.data);
        setPagination(response.data.paginationResult);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [fetchData, searchTerm, pagination.currentPge]);

  const handleDeleteBill = useCallback((billId) => {
    setSelectedBillId(billId);
    setShowConfirmation(true);
  }, []);

  const confirmDelete = useCallback(() => {
    axios
      .delete(`${API_Bills}/${selectedBillId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchData())
      .catch((error) => console.error('Error deleting bill:', error))
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
    setPagination(prevState => ({
      ...prevState,
      currentPge: newPage
    }));
  }, []);

  const handleSearch = () => {
    setPagination(prevState => ({
      ...prevState,
      currentPge: 1
    }));
    setSearchTerm(searchTerm);
  };

  const handlePrint = (billId) => {
    const billToPrint = bills.find((bill) => bill._id === billId);

    if (billToPrint) {
      const left = window.screen.width / 2;
      const top = window.screen.height / 2;
      const printWindow = window.open(' ', '', `left=${left}, top=${top}`);
      printWindow.document.write(`
        <html>
          <head>
            <h1> فاتورة</h1>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  direction: rtl;
                }
                h1{
                  text-align:center;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 3vh;
                }

                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: center;
                }

                th {
                  background-color: #f2f2f2;
                }

                tr:nth-child(even) {
                  background-color: #f2f2f2;
                }

                tr:hover {
                  background-color: #ddd;
                }

                h2 {
                  font-size: 18px;
                  margin-bottom: 10px;
                }
                h3{
                  margin-top:-2vh ;
                }
                p {
                  font-size: 20px;
                  margin: 3vh 0;
                }

                div {
                  padding: 4vw 0;
                }

                span {
                  font-size: 18px;
                  border: 1px solid gray;
                  padding: 1vh 3vw;
                  margin: 5px 0vw 50px 9vw;
                }
                section{
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                }
                footer{
                  border-bottom:1px dashed black;
                  margin:5vh auto;
                  padding:4vh 0;
                  width:25vw;
                  text-align: center;
                }
              }
            </style>
          </head>
          <body>
          <section>
          <div>
            <p>  اسم العميل : ${billToPrint.customerName} </p>
            <p>  رقم التليفون : ${billToPrint.phone} </p>
            </div>
          <div>
            <p> اسم البائع : ${billToPrint.user.name} </p>
            <p>النوع :  نقدى</p>
            <p> تاريخ الفاتورة : ${billToPrint.createdAt && new Date(billToPrint.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} </p>
            <p> آخر تعديل للفاتورة : ${billToPrint.updatedAt && new Date(billToPrint.updatedAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} </p>
            </div>
            </section>
            <h3> عنوان العميل : ${billToPrint.customerAddress}</h3>
            <table>
              <thead>
                <tr className='text-center'>
                  <th>المنتج</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th> السعر الكلي</th>
                </tr>
              </thead>
              <tbody>
                ${billToPrint.products.map((product) => `
                  <tr>
                    <td>${product?.product?.name}</td>
                    <td>${product?.product?.price}</td>
                    <td>${product?.productQuantity}</td>
                    <td>${product?.totalPrice}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div>
              <span> الإجمالي : ${billToPrint.totalAmount}</span>
              <span>المدفوع : ${billToPrint.paidAmount} </span>
              <span> الباقي : ${billToPrint.remainingAmount}</span>
            </div>
            <p> إمضاء العميل / ...................................................</p>
            <footer>الملاحظات</footer>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div>
      <LogOut />
      <MainComponent />
      {loading ? (
        <div className='m-5 fs-3 text-center'><Loading /></div>
      ) : (
        <div className={styles.billsContainer}>
          <div className='flex gap-5'>
            <Link className='btn btn-primary px-5 my-3 fs-5' to='/CreateBillForm'>
              <span><Translate>Create bill</Translate></span>
            </Link>
            <div>
              <input type="search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className='btn btn-primary' onClick={handleSearch}>
                <Translate>A Search</Translate>
              </button>
            </div>
          </div>
          {bills.map((bill) => (
            <div key={bill._id} className={styles.billsTable}>
              <div className='flex'>
                <div>
                  <p>
                    <Translate>Client Name :</Translate>   {bill.customerName}
                  </p>
                  <p>
                    <Translate> Phone :</Translate> {bill.phone}
                  </p>
                  <p>
                    <Translate> Name Seller:</Translate> {bill?.user.name}
                  </p>
                  <p>
                    <Translate> customer Address :</Translate> {bill?.customerAddress}
                  </p>
                  <p>
                    <Translate>Bill Date :</Translate> {bill?.createdAt && new Date(bill.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}

                  </p>
                  <p>
                    <Translate>update Date :</Translate> {bill?.updatedAt && new Date(bill.updatedAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}

                  </p>
                </div>
                <div>
                  <PrintButton onPrint={() => handlePrint(bill._id)} />
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
          <ConfirmationModal show={showConfirmation} onConfirm={confirmDelete} onCancel={cancelDelete} />
          {bills.length === 0 && <p><Translate>No bills available</Translate></p>}
        </div>
      )}
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
      </div>
    </div>
  );
};

export default Bills;
