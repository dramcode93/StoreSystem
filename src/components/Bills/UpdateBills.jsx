import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from './../LogOut/LogOut';
import { useParams } from 'react-router-dom';

const API_URL = 'https://helpful-worm-attire.cyclic.app/api/products/list';

const UpdateBills = () => {
  const token = localStorage.getItem('token');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState([]);
  const [loading, setLoading] = useState(false);
    const { id } = useParams();

  const [selectedProducts, setSelectedProducts] = useState([{ productId: '', quantity: '' }]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        const productsResponse = await axios.get(`${API_URL}`, { headers: { Authorization: `Bearer ${token}` } });
        setProducts(productsResponse.data.data);
        const billResponse=await axios.get(`https://helpful-worm-attire.cyclic.app/api/bills/${id}`, {
                     headers: {
                       Authorization: `Bearer ${token}`,
                     },
                  });
                  setCustomerName(billResponse.data?.data?.customerName)
                  setPhoneNumber(billResponse.data?.data?.phone)
                  setBillProducts(billResponse.data?.data?.products)
                  console.log(billResponse.data.data.products)
                  setPaidAmount(billResponse.data?.data?.paidAmount)
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

  const updateBill = async () => {
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

      const response = await axios.put(`https://helpful-worm-attire.cyclic.app/api/bills/${id}`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Bill updated:', response.data);
      setCustomerName('');
      setPhoneNumber('');
      setPaidAmount('');
      setSelectedProducts([{ productId: '', quantity: '' }]);
      window.location.href = '/bills'; // Redirect to bills page after updating
    } catch (error) {
      console.error('Error updating bill:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className={styles.createBill}>
  //     <LogOut/>
  //     <MainComponent/>
  //     <form>
  //       <div>
  //         <label htmlFor="customerName"><Translate>client Name : </Translate></label>
  //         <input id="customerName" type="text" placeholder='client Name' name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
  //       </div>
  //       <div>
  //         <label htmlFor="phoneNumber"><Translate>Phone Number : </Translate></label>
  //         <input id="phoneNumber" placeholder='phone Number' type="text" name="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
  //       </div>
  //       {selectedProducts.map((selectedProduct, index) => (
  //         <div key={index}>
  //           <select
  //             name="product"
  //             className={styles.inputField}
  //             onChange={(e) => handleProductChange(index, e.target.value)}
  //             value={selectedProduct.productId}
  //           >
  //             <option disabled value=''>
  //               <Translate>Select Product : </Translate>   
  //             </option>
  //             {products.map((product) => (
  //               <option key={product._id} value={product._id}>
  //                 {product.name}
  //               </option>
  //             ))}
  //           </select>
  //           <div>
  //             <label htmlFor={`productQuantity${index}`}><Translate>Product Quantity : </Translate></label>
  //             <input
  //               id={`productQuantity${index}`}
  //               type="number"
  //               name={`productQuantity${index}`}
  //               value={selectedProduct.quantity}
  //               placeholder='product Quantity'
  //               onChange={(e) => handleQuantityChange(index, e.target.value)}
  //             />
  //           </div>
  //         </div>
  //       ))}

  //       <button type="button" onClick={addProductFields} className={styles.addBtn}>
  //         <Translate>Add Product</Translate>
  //       </button>

  //       <div>
  //         <label htmlFor="paid Amount"><Translate>Paid Amount : </Translate></label>
  //         <input placeholder='paid' id="paidAmount" type="text" name="paidAmount" value={Number(paidAmount)} onChange={(e) => setPaidAmount(e.target.value)} />
  //       </div>

  //       <button type="button" onClick={updateBill} className={styles.addBtn}> 
  //         <Translate>Update bill</Translate>  
  //       </button>
  //     </form>
  //   </div>
  // );
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
        {billProducts.map((billProduct, index) => (
          <div key={index}>
            <span>{billProduct.product.name}: {billProduct.productQuantity}</span>
          </div>
        ))}
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
          </div>
        ))}
  
        <button type="button" onClick={addProductFields} className={styles.addBtn}>
          <Translate>Add Product</Translate>
        </button>
  
        <div>
          <label htmlFor="paid Amount"><Translate>Paid Amount : </Translate></label>
          <input placeholder='paid' id="paidAmount" type="text" name="paidAmount" value={Number(paidAmount)} onChange={(e) => setPaidAmount(e.target.value)} />
        </div>
  
        <button type="button" onClick={updateBill} className={styles.addBtn}> 
          <Translate>Update bill</Translate>  
        </button>
      </form>
    </div>
  );
  
};

export default UpdateBills;
