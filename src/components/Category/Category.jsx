import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Category.module.css';
import { Translate, useLanguage } from 'translate-easy';
import LogOut from '../LogOut/LogOut';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import ConfirmationModal from './ConfirmationModel';

const API_category = 'https://real-pear-barracuda-kilt.cyclic.app/api/categories';

const CategoryTable = () => {
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching data with search input:', searchInput);
      if (token) {
        const response = await axios.get(`${API_category}?search=${searchInput}&page=${pagination.currentPge}`, { headers: { Authorization: `Bearer ${token}` } });
         setCategories(response.data.data);
        setPagination(response.data.paginationResult);
       } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token, searchInput, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchInput, fetchData]);

  const handleSearch = () => {
    setSearchInput(searchTerm);
  };

  const handleDeleteCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowConfirmation(true);
  };

  const confirmDelete = useCallback(() => {
    axios.delete(`${API_category}/${selectedCategoryId}`, { headers: { Authorization: `Bearer ${token}` } })
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
    axios.post(`${API_category}`, { name: newCategoryName }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchData())
      .catch((error) => console.error('Error adding category:', error))
      .finally(() => setNewCategoryName(''));
  }, [newCategoryName, token, fetchData]);

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage
    });
  }

  return (
    <div>
      <LogOut />
      <div className={styles.flex}>
        <div>
          <input type="search" name="search" className={styles.margin} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button className='btn btn-primary' onClick={handleSearch}>
            <Translate>A Search</Translate>
          </button>
        </div>
        <div>
          <input type="text" name="name" className={styles.margin} value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
          <button className='btn btn-primary' onClick={confirmAddCategory}>
            <Translate translations={{ ar: 'ضيف', en: 'Add' }}>{selectedLanguage === 'ar' ? 'ضيف' : 'Add'}</Translate>
          </button>
        </div>
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
                      <td>
                        <Link to={`/category/${category._id}/products`} className={styles.categoryLink}>
                          {category.name}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/update/${category._id}`} className={styles.updateBtn}>
                          <Translate translations={{ ar: 'تعديل', en: 'update' }}>{selectedLanguage === 'ar' ? 'تعديل' : 'update'}</Translate>
                        </Link>

                        <button className={styles.deleteBtn} onClick={() => handleDeleteCategory(category._id)}>
                          <Translate translations={{ ar: 'حذف', en: "Delete" }}>{selectedLanguage === 'ar' ? "حذف" : "Delete"}</Translate>
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
      <div>
        <div className={styles.flex}>
          {pagination.prev && (
            <button onClick={() => handlePageChange(pagination.prev)} className={styles.paginationNext}>
              {pagination.prev}
            </button>
          )}
          <button className={styles.paginationNext}><Translate>Page</Translate> {pagination.currentPge}</button>
          {pagination.next && (
            <button className={styles.paginationNext} onClick={() => handlePageChange(pagination.next)}>
              {pagination.next}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
