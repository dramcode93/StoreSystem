import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Category.module.css';
import { Translate } from 'translate-easy';

function UpdateCategory() {
  const { id } = useParams();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryNamePlaceholder, setCategoryNamePlaceholder] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://real-pear-barracuda-kilt.cyclic.app/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categoryName = response.data.data?.name || '';
        setNewCategoryName(categoryName);
        setCategoryNamePlaceholder(categoryName);
      } catch (error) {
        console.error('Error fetching category:', error.message);
      }
    };

    fetchData();
  }, [id, token]);

  const handleUpdateCategory = () => {
    axios.put(`https://real-pear-barracuda-kilt.cyclic.app/api/categories/${id}`, { name: newCategoryName }, {
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
        <h2><Translate>Update Category</Translate></h2>
        <label>
        <Translate> New Category Name:</Translate> 
          <input
            type="text"
            value={newCategoryName || ''}  
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={categoryNamePlaceholder || ''}
          />
        </label>
        <button onClick={handleUpdateCategory} className='my-3 w-100'><Translate>Update</Translate></button>
        <Link to='/category' className='btn bg-danger w-100' ><Translate>Canceling</Translate></Link>

      </div>
    </div>
  );
}

export default UpdateCategory;
