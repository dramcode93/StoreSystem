import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from './../LogOut/LogOut';
import Loading from '../Loading/Loading';

const API_URL = 'http://localhost:3030/api/products/list';

const BillForm = () => {
  const token = localStorage.getItem('token');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([{ productId: '', quantity: '', price: 0 }]);
  const [sellerName, setSellerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const productsResponse = await axios.get(`${API_URL}`, { headers: { Authorization: `Bearer ${token}` } });
        setProducts(productsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProductChange = (index, productId) => {
    const newSelectedProducts = [...selectedProducts];
    const selectedProduct = products.find((product) => product._id === productId);

    newSelectedProducts[index] = {
      productId,
      price: selectedProduct.price,
      quantity: selectedProduct.quantity || '',
    };

    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (index, quantity) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = quantity;
    setSelectedProducts(newSelectedProducts);
  };

  const addProductFields = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: '', price: 0 }]);
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
      const productsArray = selectedProducts.map(({ productId, quantity, price }) => {
        productQuantityMap[productId] = quantity;
        return { product: productId, quantity, price };
      });

      const requestBody = {
        customerName,
        phone: phoneNumber,
        products: productsArray,
        productQuantityMap,
        paidAmount: Number(paidAmount),
        sellerName,
        customerAddress
      };

      const response = await axios.post('http://localhost:3030/api/bills', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomerName('');
      setPhoneNumber('');
      setPaidAmount('');
      setSellerName('');
      setCustomerAddress('');
      setSelectedProducts([{ productId: '', quantity: '', price: 0 }]);
      window.location.href = '/bills';
    } catch (error) {
      console.error('Error creating bill:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createBill}>
      <LogOut />
      <MainComponent />
      <form>
        {loading && <div className='m-5 fs-3 text-center'><Loading /></div>}
        <div>
          <label htmlFor="customerName"><Translate>Client Name : </Translate></label>
          <input id="customerName" type="text" placeholder='Client Name' name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="phoneNumber"><Translate>Phone Number : </Translate></label>
          <input id="phoneNumber" placeholder='Phone Number' type="text" name="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div>
          <label htmlFor="sellerName"><Translate>Seller Name : </Translate></label>
          <input id="sellerName" placeholder='Seller Name' type="text" name="sellerName" value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="customerAddress"><Translate>Customer Address : </Translate></label>
          <input id="customerAddress" placeholder='Customer Address' type="text" name="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
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
                placeholder='Product Quantity'
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            </div>
            {selectedProduct.productId ? (
              <div className='fw-bold pt-3'>
                <span className='p-5'><Translate>Price : </Translate> {selectedProduct.price}</span>
                <span><Translate>Quantity : </Translate> {selectedProduct.quantity}</span>
              </div>
            ) : (
              <div>
                <label htmlFor={`productQuantity${index}`}><Translate>Product Quantity : </Translate></label>
                <input
                  id={`productQuantity${index}`}
                  type="number"
                  name={`productQuantity${index}`}
                  value={selectedProduct.quantity}
                  placeholder='Product Quantity'
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </div>
            )}
            <button type="button" onClick={addProductFields} className={styles.addBtn}>
              <Translate>Add Product</Translate>
            </button>
            <button type="button" title='Delete Product' className={styles.deleteButton} onClick={() => deleteProduct(index)}><Translate>X</Translate></button>
          </div>
        ))}

        <div>
          <label htmlFor="paidAmount"><Translate>Paid Amount : </Translate></label>
          <input placeholder='Paid Amount' id="paidAmount" type="text" name="paidAmount" value={Number(paidAmount)} onChange={(e) => setPaidAmount(e.target.value)} />
        </div>
        <button type="button" onClick={createBill} className={styles.addBtn} disabled={loading}>
          {loading ? <Translate>Adding...</Translate> : <Translate>Create bill</Translate>}
        </button>

      </form>
    </div>
  );
};

export default BillForm;
