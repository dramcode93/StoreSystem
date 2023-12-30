import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Category.module.css';
import { Translate } from 'translate-easy';
import LogOut from '../LogOut/LogOut';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await axios.get('https://storesystemapi.onrender.com/api/categories', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategories(response.data.data);
          // if (Array.isArray(response.data.data)) {
          
          // } else {
          //   console.error('Invalid data format received:', response.data);
          // }
        } else {
          console.error('No token found.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <LogOut/>
    <div className={styles.container}>
      <div className={styles.categoryTable}>
       <table>
        <thead>
          <tr>
            <th><Translate>ID</Translate></th>
            <th><Translate>Name</Translate></th>
             <th><Translate>Actions</Translate></th>
           </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category._id.slice(-4)}</td>
              <td>{category.name}</td>
              <td>
                <button className={styles.updateBtn}>
                  <Translate>Update</Translate>
                </button>
                <button className={styles.deleteBtn}>
                  <Translate>Delete</Translate>
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length === 0 && <p>No categories available</p>}
    </div>
    </div>
    </div>
  );
};

export default CategoryTable;
