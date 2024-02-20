import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react'
import { Translate, useLanguage } from 'translate-easy';
import ConfirmationModal from '../Category/ConfirmationModel';
import styles from "../Category/Category.module.css"
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
const API_users = 'https://store-system-api.gleeze.com/api/users';
const Users = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const decodedToken = jwtDecode(token);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(`${API_users}?search=${searchInput}&page=${pagination.currentPge}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(response.data.data);
        setPagination(response.data.paginationResult);
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


  const confirmDelete = useCallback(() => {
    axios.delete(`${API_users}/${selectedCategoryId}`, { headers: { Authorization: `Bearer ${token}` } })
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



  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage
    });
  }
  return (
    <div>
      <div className={styles.flex}>
        <div>
          <input type="search" name="search" className={styles.margin} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button className='btn btn-primary' onClick={handleSearch}>
            <Translate>A Search</Translate>
          </button>
        </div>
        {decodedToken.role !== "user" &&
          <div>
            <Link to='/profile/formAdd' className='btn btn-primary' >
              <Translate translations={{ ar: 'ضيف', en: 'Add' }}>{selectedLanguage === 'ar' ? 'ضيف' : 'Add'}</Translate>
            </Link>
          </div>
        }
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
                    <th><Translate>Email</Translate></th>
                    <th><Translate>Role</Translate></th>
                    <th><Translate>Active</Translate></th>
                    {decodedToken.role !== "user" &&
                      <th><Translate>Actions</Translate></th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {users.map(category => (
                    <tr key={category._id}>
                      <td>{category._id.slice(-4)}</td>
                      <td>
                        <Link to={`/category/${category._id}/products`} className={styles.categoryLink}>
                          {category.name}
                        </Link>
                      </td>
                      <td>{category?.email}</td>
                      <td>{category?.role}</td>
                      <td><button>{category.active === true ? <Translate>active</Translate> : <Translate>deactive</Translate>}</button></td>
                      {decodedToken.role !== "user" &&
                        <td>
                          <Link to={`/update/${category._id}`} className={styles.updateBtn}>
                            <Translate translations={{ ar: 'تعديل', en: 'update' }}>{selectedLanguage === 'ar' ? 'تعديل' : 'update'}</Translate>
                          </Link>
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
              <ConfirmationModal
                show={showConfirmation}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
              />
              {users.length === 0 && <p>No categories available</p>}
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
  )
}

export default Users
