import React, { useCallback, useEffect, useState } from 'react';
import LogOut from '../LogOut/LogOut';
import axios from 'axios';
import { Translate, useLanguage } from 'translate-easy';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import ConfirmationModal from '../Category/ConfirmationModel';
import MainComponent from './../Aside/MainComponent';
import PrintButton from '../print/PrintButton';

const API_Bills = 'https://helpful-worm-attire.cyclic.app/api/bills';

const Bills = () => {
  const token = localStorage.getItem('token');
  const [bills, setBills] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null); // changed variable name
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching data with search input:', searchInput);
      if (token) {
        const response = await axios.get(`${API_Bills}?limit=20`, { headers: { Authorization: `Bearer ${token}` } });
        console.log('API Response:', response.data);
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
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [searchInput, fetchData]);

  const { selectedLanguage } = useLanguage();

  const handleDeleteBill = (billId) => {
    setSelectedBillId(billId); // corrected variable name
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
  }, [selectedBillId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedBillId(null);
  }, []);

// print
const handlePrint = (billId) => {
  const billToPrint = bills.find((bill) => bill._id === billId);

  if (billToPrint) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill Print</title>
        </head>
        <body>
          <h2>Bill Details</h2>
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

          <p>Total: ${billToPrint.totalAmount}</p>
          <p>Paid: ${billToPrint.paidAmount}</p>
          <p>Remaining: ${billToPrint.remainingAmount}</p>
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
        <Link className='btn btn-primary px-5 my-3 fs-5' to='/CreateBillForm'>
          <Translate>Create bill</Translate>
        </Link>
        {bills.map((bill) => (
          <div key={bill._id} className={styles.billsTable}>
            <p>
              <Translate>Client Name :</Translate> {bill.customerName}
            </p>
            <p>
              <Translate>Phone :</Translate> {bill.phone}
            </p>
            <PrintButton onPrint={() => handlePrint(bill._id)} />
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
            <button className={styles.deleteBtn} onClick={() => handleDeleteBill(bill._id)}> {/* corrected onClick function */}
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
    </div>
  );
};

export default Bills;
