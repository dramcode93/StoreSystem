import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoryProducts = ({ Products }) => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [categoryProducts, setCategoryProducts] = useState([]);


    useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.43.191:3030/api/categories/${id}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const Products = response.data.data || ''; 
      setCategoryProducts(Products);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };
    
        fetchData();
      }, [id, token]);
    return(
 <div>
    <h2 className='text-primary'>Products</h2>
    <ul>
      {categoryProducts.map(product => (
        <li key={product._id}>{product.name}</li>
      ))}
    </ul>
  </div>
    )
      };

export default CategoryProducts;
