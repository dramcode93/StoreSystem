import React, { useCallback, useEffect, useState } from 'react';
import LogOut from '../LogOut/LogOut';
import axios from 'axios';
import { Translate, useLanguage } from 'translate-easy';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import ConfirmationModal from '../Category/ConfirmationModel';
import MainComponent from './../Aside/MainComponent';
import PrintButton from './PrintButton';
import Loading from '../Loading/Loading'; 

const API_Bills = 'https://ill-pear-abalone-tie.cyclic.app/api/bills';

const Bills = () => {
  const token = localStorage.getItem('token');
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const response = await axios.get(`${API_Bills}?search=${searchTerm}&page=${pagination.currentPge}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
        setBills(response.data.data);
        setPagination(response.data.paginationResult);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching bills:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchInput, fetchData, pagination.currentPge]);

  const { selectedLanguage } = useLanguage();

  const handleDeleteBill = (billId) => {
    setSelectedBillId(billId);
    setShowConfirmation(true);
  };

  const confirmDelete = useCallback(() => {
    axios
      .delete(`${API_Bills}/${selectedBillId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchData())
      .catch((error) => console.error('Error deleting bill:', error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedBillId(null);
      });
  }, [selectedBillId, token, searchInput, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedBillId(null);
  }, []);

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage
    });
  };

  const handleSearch = () => {
    setSearchInput(searchTerm);
  };

  const handlePrint = (billId) => {
    const billToPrint = bills.find((bill) => bill._id === billId);

    if (billToPrint) {
      const left = window.screen.width / 2;
      const top = window.screen.height / 2;
      const printWindow = window.open('', '_blank', `left=${left}, top=${top}`);
      printWindow.document.write(`
        <html>
          <head>
            <h1>فاتورة</h1>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  direction: rtl;
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
              }
            </style>
          </head>
          <body>
            <p>  اسم العميل : ${billToPrint.customerName} </p>
            <p>  رقم التليفون : ${billToPrint.phone} </p>
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
            <span>  <Translate>Create bill</Translate></span>
            </Link>
            <div>
              <input type="search" name="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className='btn btn-primary' onClick={handleSearch}>
                <Translate>Search</Translate>
              </button>
            </div>
          </div>
          {bills.map((bill) => (
            <div key={bill._id} className={styles.billsTable}>
              <div className='flex'>
                <div>
                  <p>
                    <Translate>Client Name :</Translate> {bill.customerName}
                  </p>
                  <p>
                    <Translate>Phone :</Translate> {bill.phone}
                  </p>
                </div>
                <div>
                  <PrintButton onPrint={() => handlePrint(bill._id)} />
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>
                      <Translate>product</Translate>
                    </th>
                    <th>
                      <Translate>Price</Translate>
                    </th>
                    <th>
                      <Translate>Quantity</Translate>
                    </th>
                    <th>
                      <Translate>total price</Translate>
                    </th>
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
                      <Translate>Total : </Translate>
                      {bill.totalAmount}
                    </td>
                    <td>
                      <Translate>Paid : </Translate>
                      {bill.paidAmount}
                    </td>
                    <td>
                      <Translate>Remaining : </Translate>
                      {bill.remainingAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.Actions}>
                <Link to={`/updateBills/${bill._id}`} className={styles.updateBtn}>
                  <Translate translations={{ ar: 'تعديل', en: 'update' }}>
                    {selectedLanguage === 'ar' ? 'تعديل' : 'update'}
                  </Translate>
                </Link>
                <button className={styles.deleteBtn} onClick={() => handleDeleteBill(bill._id)}>
                  <Translate translations={{ ar: 'حذف', en: 'Delete' }}>
                    {selectedLanguage === 'ar' ? 'حذف' : 'Delete'}
                  </Translate>
                </button>
              </div>
            </div>
          ))}
          <ConfirmationModal show={showConfirmation} onConfirm={confirmDelete} onCancel={cancelDelete} />
          {bills.length === 0 && <p>No categories available</p>}
        </div>
      )}
      <div className={styles.flex}>
        {pagination.prev && (
          <button onClick={() => handlePageChange(pagination.prev)} className={styles.paginationNext}>
            {pagination.prev}
          </button>
        )}
        <button className={styles.paginationNext}><Translate>Page</Translate> {pagination.currentPge}</button>
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
