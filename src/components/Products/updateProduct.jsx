import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Products.module.css';
import { Translate } from 'translate-easy';
import MainComponent from './../Aside/MainComponent';
import LogOut from '../LogOut/LogOut';

function UpdateProduct() {
  const { id } = useParams();
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));
  const API_category = 'https://store-system-api.gleeze.com/api/categories/list';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await axios.get(`https://store-system-api.gleeze.com/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const { data: categoriesData } = await axios.get(API_category, { headers: { Authorization: `Bearer ${token}` } });
    
        setNewProductName(productData.data.name);
        setNewProductPrice(productData.data.price);
        setNewProductQuantity(productData.data.quantity);
        setSelectedCategoryId(productData.data.category._id); // Set category ID
        setCategories(categoriesData.data);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, token]);

  const handleUpdateProduct = () => {
    axios.put(`https://store-system-api.gleeze.com/api/products/${id}`, { name: newProductName, price: newProductPrice, quantity: newProductQuantity, category: selectedCategoryId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data.message);
        window.location.href = '/products';
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
        <h2><Translate>Update product</Translate></h2>
        <form>
          <select
            name="category"  
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            value={selectedCategoryId}
          >
            <option disabled value=''>
              <Translate>Select Category</Translate>   
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor='name'><Translate> New product Name :</Translate></label>
          <input
            type="text"
            id='name'
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <label htmlFor='price'>
            <Translate> New product price :</Translate>   
          </label>
          <input
            id='price'
            type="number"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <label htmlFor='quantity'>
            <Translate> New product quantity :</Translate>   
          </label>
          <input
            id='quantity'
            type="number"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(e.target.value)}
          />
          <button type="button" onClick={handleUpdateProduct} className='mb-2'><Translate>Update</Translate></button>
          <Link to='/products' className='btn bg-danger w-100' ><Translate translations={{ar:"الغي"}}>Canceling</Translate></Link>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
