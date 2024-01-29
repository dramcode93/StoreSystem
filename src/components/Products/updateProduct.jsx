import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Products.module.css';
function UpdateProduct() {
  const { id } = useParams();
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));
  const API_category = 'https://tame-pink-salmon-boot.cyclic.app/api/categories';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await axios.get(`https://tame-pink-salmon-boot.cyclic.app/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const { data: categoriesData } = await axios.get(API_category, { headers: { Authorization: `Bearer ${token}` } });
    
        setNewProductName(productData.name);
        setNewProductPrice(productData.price);
        setNewProductQuantity(productData.quantity);
        setSelectedCategoryId(productData.categoryId);
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
    axios.put(`https://tame-pink-salmon-boot.cyclic.app/api/products/${id}`, { name: newProductName }, {
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.updateCategoryContainer}>
        <h2>Update product</h2>
        <form>
          <select
            name="category"
            className={styles.inputField}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            value={selectedCategoryId}
          >
            <option disabled value={null}>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor='name'>
            New product Name:</label>
          <input
            type="text"
            id='name'
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <label htmlFor='price'>
            New product price:</label>
          <input
            type="number"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <label htmlFor='quantity'>
            New product quantity:</label>
          <input
            type="number"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(e.target.value)}
          />
          <button type="button" onClick={handleUpdateProduct} className='mb-2'>Update</button>
          <Link to='/products' className='btn bg-danger w-100' >Cancel</Link>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;

