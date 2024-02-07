import React, { useCallback, useEffect, useState } from 'react'
import LogOut from '../LogOut/LogOut'
import axios from 'axios';
import { Translate, useLanguage } from 'translate-easy';
import { Link } from 'react-router-dom';
 import styles from './styles.module.css'

 const API_Bills = 'https://unusual-blue-button.cyclic.app/api/bills';
const Bills = () => {
  const token = localStorage.getItem('token');
  const [bills, setBills] = useState([]);
   const [searchInput, setSearchInput] = useState('');
   const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
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
  return (
    <div>
    <LogOut/>

    <div className={styles.billsContainer}>
      <Link className='btn btn-primary px-5' to='/CreateBillForm'>create</Link>
      {bills.map(bill => (
       <div  key={bill._id} className={styles.billsTable}>
       <p>{bill.customerName}</p>
       <p>{bill.phone}</p>
      <table>

      <thead>
        <tr>
          <th><Translate>Name</Translate></th>
          <th><Translate>Price</Translate></th>
          <th><Translate>Quantity</Translate></th>
          <th><Translate>total price</Translate></th>
          <th><Translate>Actions</Translate></th>
        </tr>
    
      </thead>
      <tbody>
      {bill.products.map(product=>(
        <tr key={product._id}>
        <td>{product.product?.name}</td>
        <td>{product.product?.price}</td>
        <td>{product.productQuantity}</td>
        <td>{product.totalPrice}</td>
        <td>
        <Link className={styles.updateBtn}>
          <Translate translations={{ ar: 'تعديل', en: 'update' }}>
            {selectedLanguage === 'ar' ? 'تعديل' : 'update'}
          </Translate>
        </Link>
    <button className={styles.deleteBtn}>
          <Translate translations={{ ar: 'حذف', en: 'Delete' }}>
            {selectedLanguage === 'ar' ? 'حذف' : 'Delete'}
          </Translate>
        </button>
      </td>
     </tr>
      ))}
      <tr>
      <td><Translate>total : </Translate>{bill.totalAmount}</td>
      <td><Translate>paied : </Translate>{bill.paidAmount}</td>
      <td><Translate>Remaining : </Translate>{bill.remainingAmount}</td>
      </tr>
      </tbody>
    </table>
    </div>
    ))}
    </div>
    </div>
  )
}

export default Bills;
