import React, { useCallback, useEffect, useState } from 'react';
import LogOut from '../LogOut/LogOut';
import axios from 'axios';
import { Translate, useLanguage } from 'translate-easy';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import ConfirmationModal from '../Category/ConfirmationModel';
import MainComponent from './../Aside/MainComponent';
import PrintButton from './PrintButton';

const API_Bills = 'https://ill-pear-abalone-tie.cyclic.app/api/bills';

const Bills = () => {
  const token = localStorage.getItem('token');
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const fetchData = useCallback(async () => {
    try {
      if (token) {
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
  }, [token, searchInput, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchInput,fetchData,pagination.currentPge]);

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
  }, [selectedBillId, token,searchInput, fetchData]);

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
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill Print</title>
            <style>
            /* Add this CSS to your existing CSS file or create a new one */

@media print {
  /* Define styles for printed document */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }

  .total p{
    border:1px solid gray;
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
    font-size: 14px;
    margin: 5px 0;
  }
}
            </style>
          </head>
          <body>
             <p>Client Name: ${billToPrint.customerName}</p>
            <p>Phone: ${billToPrint.phone}</p>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                ${billToPrint.products.map((product) => `
                  <tr>
                    <td>${product.product?.name}</td>
                    <td>${product.product?.price}</td>
                    <td>${product.productQuantity}</td>
                    <td>${product.totalPrice}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
  <div className={styles.total}>
            <p>Total: ${billToPrint.totalAmount}</p>
            <p>Paid: ${billToPrint.paidAmount}</p>
            <p>Remaining: ${billToPrint.remainingAmount}</p></div>
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
      <MainComponent/>
<div className={styles.billsContainer}>
<div className='flex'>
<Link className='btn btn-primary px-5 my-3 fs-5' to='/CreateBillForm'>
<Translate>Create bill</Translate>
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
          <Translate>total : </Translate>
          {bill.totalAmount}
        </td>
        <td>
          <Translate>paied : </Translate>
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
