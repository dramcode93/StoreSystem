import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Category.module.css';
import { Translate, useLanguage } from 'translate-easy';
import LogOut from '../LogOut/LogOut';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import ConfirmationModal from './ConfirmationModel';
 
const API_URL = 'https://wild-red-jackrabbit-hem.cyclic.app/api/categories';

const CategoryTable = () => {
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage(); // Get the selected language from the context

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(`${API_URL}`, { headers: { Authorization: `Bearer ${token}` } });
        setCategories(response.data.data);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowConfirmation(true);
  };

  const confirmDelete = useCallback(() => {
    axios.delete(`${API_URL}/${selectedCategoryId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchData())
      .catch((error) => console.error('Error deleting category:', error))
      .finally(() => {
        setShowConfirmation(false);
        setSelectedCategoryId(null);
      });
  }, [selectedCategoryId, token, fetchData]);

  const cancelDelete = useCallback(() => {
    setShowConfirmation(false);
    setSelectedCategoryId(null);
  }, []);

  const confirmAddCategory = useCallback(() => {
    axios.post(`${API_URL}`, { name: newCategoryName }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchData())
      .catch((error) => console.error('Error adding category:', error))
      .finally(() => setNewCategoryName(''));
  }, [newCategoryName, token, fetchData]);

  return (
    <div>
      <LogOut />
      <div className={styles.AddSection}>
        <input type="text" name="name" className={styles.margin} value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
        <button onClick={confirmAddCategory}>  <Translate translations={{ ar: 'ضيف', en: 'Add' }}>{selectedLanguage === 'ar' ? 'ضيف' : 'Add'}</Translate></button>
      </div>
      <div className={styles.container}>
        {loading && <div className='m-5 fs-3'><Loading /></div>}
        {!loading && (
          <>
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
                        <Link to={`/update/${category._id}`} className={styles.updateBtn}>
                        <Translate translations={{ ar: 'تعديل', en: 'update' }}>{selectedLanguage === 'ar' ? 'تعديل' : 'update'}</Translate>
                        </Link>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteCategory(category._id)}>
                        <Translate translations={{ ar: 'حذف', en: 'delete' }}>{selectedLanguage === 'ar' ? 'حذف' : 'delete'}</Translate>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ConfirmationModal
                show={showConfirmation}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
              />
              {categories.length === 0 && <p>No categories available</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
