import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from './../LogOut/LogOut';
import { useParams } from 'react-router-dom';
import Loading from '../Loading/Loading';

const API_URL = 'http://localhost:3030/api/products/list';

const UpdateBills = () => {
  const token = localStorage.getItem('token');
  const { id } = useParams();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const productsResponse = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setProducts(productsResponse.data.data);
        const billResponse = await axios.get(`http://localhost:3030/api/bills/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomerName(billResponse.data?.data?.customerName);
        setPhoneNumber(billResponse.data?.data?.phone);
        setBillProducts(billResponse.data?.data?.products);
        setPaidAmount(billResponse.data?.data?.paidAmount || 0);
        setSellerName(billResponse.data?.data?.sellerName || '');
        setCustomerAddress(billResponse.data?.data?.customerAddress || '');
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSelectedProducts(
      billProducts.map(({ product, productQuantity }) => ({
        productId: product._id,
        quantity: productQuantity,
        price: product.price // Set initial price based on existing bill products
      }))
    );
  }, [billProducts]);

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

  const deleteProductFromBill = (index) => {
    const newBillProducts = [...billProducts];
    newBillProducts.splice(index, 1);
    setBillProducts(newBillProducts);
  };

  const updateBill = async () => {
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
        customerAddress,
      };

      const response = await axios.put(`http://localhost:3030/api/bills/${id}`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Bill updated:', response.data);
      setCustomerName('');
      setPhoneNumber('');
      setPaidAmount(0);
      setSellerName('');
      setCustomerAddress('');
      setSelectedProducts([{ productId: '', quantity: '', price: 0 }]);
      window.location.href = '/bills';
    } catch (error) {
      console.error('Error updating bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBill = () => {
    window.location.href = '/bills';
  };

  return (
    <div className={styles.createBill}>
      <LogOut />
      <MainComponent />
      <form>
        {loading && <div className='m-5 fs-3 text-center'><Loading /></div>}
        <div>
          <label htmlFor="customerName">
            <Translate>Client Name : </Translate>
          </label>
          <input
            id="customerName"
            type="text"
            placeholder="Client Name"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">
            <Translate>Phone Number : </Translate>
          </label>
          <input
            id="phoneNumber"
            placeholder="Phone Number"
            type="text"
            name="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="sellerName">
            <Translate>Seller Name : </Translate>
          </label>
          <input
            id="sellerName"
            placeholder="Seller Name"
            type="text"
            name="sellerName"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="customerAddress">
            <Translate>Customer Address : </Translate>
          </label>
          <input
            id="customerAddress"
            placeholder="Customer Address"
            type="text"
            name="customerAddress"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
        </div>
        {selectedProducts.map((selectedProduct, index) => (
          <div key={index}>
            <select
              name="product"
              className={styles.inputField}
              onChange={(e) => handleProductChange(index, e.target.value)}
              value={selectedProduct.productId}
            >
              <option disabled value="">
                <Translate>Select Product : </Translate>
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <div>
              <label htmlFor={`productQuantity${index}`}>
                <Translate>Product Quantity : </Translate>
              </label>
              <input
                id={`productQuantity${index}`}
                type="number"
                name={`productQuantity${index}`}
                value={selectedProduct.quantity}
                placeholder="Product Quantity"
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            </div>
            {selectedProduct.productId ? (
              <div className="fw-bold pt-3">
                <span className="p-5">
                  <Translate>Price : </Translate> {selectedProduct.price}
                </span>
                <span>
                  <Translate>Quantity : </Translate> {selectedProduct.quantity}
                </span>
              </div>
            ) : null}
            <button type="button" onClick={addProductFields} className={styles.addBtn}>
              <Translate>Add Product</Translate>
            </button>
            <button type="button" className={styles.deleteButton} onClick={() => deleteProductFromBill(index)}>
              <Translate>X</Translate>
            </button>
          </div>
        ))}

        <div>
          <label htmlFor="paidAmount">
            <Translate>Paid Amount : </Translate>
          </label>
          <input
            placeholder="Paid Amount"
            id="paidAmount"
            type="number"
            name="paidAmount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />
        </div>
        <div className='flex my-2'>
          <button type="button" onClick={updateBill} className={styles.addBtn}>
            <Translate>Update Bill</Translate>
          </button>
          <button type="button" onClick={cancelBill} className='bg-danger w-25 rounded-2'>
            <Translate>Cancel</Translate>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBills;