import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Category.module.css';

function UpdateCategory() {
  const { id } = useParams();
  const [newCategoryName, setNewCategoryName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://wild-red-jackrabbit-hem.cyclic.app/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNewCategoryName(response.data.name);
      } catch (error) {
        console.error('Error fetching category:', error.message);
      }
    };

    fetchData();
  }, [id, token]); // Add id and token to the dependency array

  const handleUpdateCategory = () => {
    // Call the server to update the category
    axios.put(`https://wild-red-jackrabbit-hem.cyclic.app/api/categories/${id}`, { name: newCategoryName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data.message);
         window.location.href = '/category';
      })
      .catch((error) => {
        console.error('Error updating category:', error);
      });
  };

  return ( 
    <div>

    <div className={styles.updateCategoryContainer}>
      <h2>Update Category</h2>
      <label>
        New Category Name:
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </label>
      <button onClick={handleUpdateCategory}>Update</button>
    </div>
    </div>
  );
}

export default UpdateCategory;
