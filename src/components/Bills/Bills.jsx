import React, { useCallback, useEffect, useState } from 'react'
import LogOut from '../LogOut/LogOut'
import axios from 'axios';
import { Translate, useLanguage } from 'translate-easy';
import { Link } from 'react-router-dom';
 import styles from './styles.module.css'
const API_Bills = 'https://real-pear-barracuda-kilt.cyclic.app/api/bills';
const Bills = () => {
  const token = localStorage.getItem('token');
  const [bills, setBills] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching data with search input:', searchInput);
      if (token) {
        const response = await axios.get(`${API_Bills}?search=${searchInput}&page=${pagination.currentPge}`, { headers: { Authorization: `Bearer ${token}` } });
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
  }, [token, searchInput, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchInput, fetchData]);
  return (
    <div>
      <LogOut/>
      {bills.map(bill => (
       
      <table key={bill._id}>
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
      
     </tr>
      ))}
      <td><Translate>total</Translate></td>
      <td><Translate>paied</Translate></td>
      <td><Translate>الباقى</Translate></td>

      </tbody>
    </table>
    ))}

    </div>
  )
}

export default Bills;
