import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';

const API_URL = 'https://unusual-blue-button.cyclic.app/api/products/list';

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

      const response = await axios.post('https://unusual-blue-button.cyclic.app/api/bills', requestBody, {
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
    <div className="p-5 m-5">
      <form>
        <label htmlFor="customerName">Customer Name</label>
        <input id="customerName" type="text" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input id="phoneNumber" type="text" name="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        {selectedProducts.map((selectedProduct, index) => (
          <div key={index}>
            <select
              name="product"
              className={styles.inputField}
              onChange={(e) => handleProductChange(index, e.target.value)}
              value={selectedProduct.productId}
            >
            <option disabled selected value=''>
            <Translate>Select Product</Translate>   
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <label htmlFor={`productQuantity${index}`}>Product Quantity</label>
            <input
              id={`productQuantity${index}`}
              type="number"
              name={`productQuantity${index}`}
              value={selectedProduct.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addProductFields}>
          Add Product
        </button>

        <label htmlFor="paidAmount">Paid Amount</label>
        <input id="paidAmount" type="text" name="paidAmount" value={Number(paidAmount)} onChange={(e) => setPaidAmount(e.target.value)} />
        <button type="button" onClick={createBill}>
          Create Bill
        </button>
      </form>
    </div>
  );
};

export default BillForm;
