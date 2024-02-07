import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from '../LogOut/LogOut';

function UpdateBills() {
  const { id } = useParams();
  // const [newBillsName, setNewBillsName] = useState('');
  const [newCustomerName, setNewBCustomerName] = useState('');
  // const [newBillsPrice, setNewBillsPrice] = useState(0);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newBillsTotalPrice, setNewBillsTotalPrice] = useState(0);
  const [newBillsQuantity, setNewBillsQuantity] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));

  const API_URL = 'https://lucky-fox-scarf.cyclic.app/api/products/list';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setIsLoading(false);
          return; // If id is undefined, don't make the request
        }
        const { data: billData } = await axios.get(`https://lucky-fox-scarf.cyclic.app/api/bills/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const { data: productsData } = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        console.log(billData.data)
        console.log(billData.data.products)
        // setNewBillsName(billData.name);
        setNewBCustomerName(billData.data.customerName)
        setNewPhoneNumber(billData.data.phone)
        // setNewBillsPrice(billData.data.price);
        setNewBillsTotalPrice(billData.data.paidAmount);
        setNewBillsQuantity(billData.data?.products?.productQuantity);
        setSelectedProductId(billData.data.products?.product);
        setProducts(productsData.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, token]);

  const handleUpdateBills = () => {
    axios.put(`https://lucky-fox-scarf.cyclic.app/api/bills/${id}`, {
      customerName: newCustomerName,
      phone: newPhoneNumber,
      quantity: newBillsQuantity,
      paidAmount: newBillsTotalPrice
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data.message);
        window.location.href = '/bills';
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  if (isLoading) {
    return <div><Translate>Loading...</Translate> </div>;
  }

  return (
    <div>
      <LogOut/>
      <MainComponent/>
      <div className={styles.updateCategoryContainer}>
        <h2><Translate>Update bills</Translate></h2>
        <form>
        <label htmlFor='customer name'>
        <Translate> customer Name :</Translate>   
      </label>
      <input
        type="text"
        id='customer name'
        value={newCustomerName}
        onChange={(e) => setNewBCustomerName(e.target.value)}
      />
        <label htmlFor='phone'>
        <Translate> phone Number :</Translate>   
      </label>
      <input
        type="text"
        id='phone'
        value={newPhoneNumber}
        onChange={(e) => setNewPhoneNumber(e.target.value)}
      />
          <select
            name="product"
            onChange={(e) => setSelectedProductId(e.target.value)}
            value={selectedProductId || ''}
          >
            <option disabled value=''>
              <Translate>Select Product</Translate>   
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <label htmlFor='quantity'>
            <Translate> product quantity :</Translate>   
          </label>
          <input
          id='quantity'
            type="number"
            value={newBillsQuantity}
            onChange={(e) => setNewBillsQuantity(e.target.value)}
          />
          <label htmlFor='paidAmount'>
            <Translate> paid Amount :</Translate>   
          </label>
          <input
          id='paidAmount'
            type="number"
            value={newBillsTotalPrice}
            onChange={(e) => setNewBillsTotalPrice(e.target.value)}
          />
          <button type="button" onClick={handleUpdateBills} className='mb-2'><Translate>Update</Translate></button>
          <Link to='/bills' className='btn bg-danger w-100' ><Translate translations={{ar:"الغي"}}>Canceling</Translate></Link>
        </form>
      </div>
    </div>
  );
}

export default UpdateBills;
