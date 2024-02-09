import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from './../LogOut/LogOut';

const API_URL = 'https://ill-pear-abalone-tie.cyclic.app/api/products/list';

const BillForm = () => {
  const token = localStorage.getItem('token');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([{ productId: '', quantity: '' }]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const productsResponse = await axios.get(`${API_URL}`, { headers: { Authorization: `Bearer ${token}` } });
        setProducts(productsResponse.data.data);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProductChange = (index, productId) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].productId = productId;
    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (index, quantity) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = quantity;
    setSelectedProducts(newSelectedProducts);
  };

  const addProductFields = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: '' }]);
  };

  const deleteProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  const createBill = async () => {
    try {
      setLoading(true);

      const productQuantityMap = {};
      const productsArray = selectedProducts.map(({ productId, quantity }) => {
        productQuantityMap[productId] = quantity;
        return { product: productId, quantity };
      });

      const requestBody = {
        customerName,
        phone: phoneNumber,
        products: productsArray,
        productQuantityMap,
        paidAmount: Number(paidAmount),
      };

      const response = await axios.post('https://ill-pear-abalone-tie.cyclic.app/api/bills', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Bill created:', response.data);
      setCustomerName('');
      setPhoneNumber('');
      setPaidAmount('');
      setSelectedProducts([{ productId: '', quantity: '' }]);
      window.location.href='/bills';
    } catch (error) {
      console.error('Error creating bill:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createBill}>
      <LogOut/>
      <MainComponent/>
      <form>
        <div>
          <label htmlFor="customerName"><Translate>client Name : </Translate></label>
          <input id="customerName" type="text" placeholder='client Name' name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="phoneNumber"><Translate>Phone Number : </Translate></label>
          <input id="phoneNumber" placeholder='phone Number' type="text" name="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        {selectedProducts.map((selectedProduct, index) => (
          <div key={index}>
            <select
              name="product"
              className={styles.inputField}
              onChange={(e) => handleProductChange(index, e.target.value)}
              value={selectedProduct.productId}
            >
              <option disabled value=''>
                <Translate>Select Product : </Translate>   
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <div>
              <label htmlFor={`productQuantity${index}`}><Translate>Product Quantity : </Translate></label>
              <input
                id={`productQuantity${index}`}
                type="number"
                name={`productQuantity${index}`}
                value={selectedProduct.quantity}
                placeholder='product Quantity'
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            </div>
            <button type="button" onClick={addProductFields} className={styles.addBtn}>
            <Translate>Add Product</Translate>
            </button>
            <button type="button" title='delete product' className={styles.deleteButton} onClick={() => deleteProduct(index)}><Translate>X</Translate></button>
            </div>
            ))}
        <div>
          <label htmlFor="paid Amount"><Translate>Paid Amount : </Translate></label>
          <input placeholder='paid' id="paidAmount" type="text" name="paidAmount" value={Number(paidAmount)} onChange={(e) => setPaidAmount(e.target.value)} />
        </div>
        <button type="button" onClick={createBill} className={styles.addBtn}> 
          <Translate>Create bill</Translate>  
        </button>
      </form>
    </div>
  );
};

export default BillForm;
