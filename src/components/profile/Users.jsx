import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { Translate, useLanguage } from 'translate-easy';
import styles from '../Category/Category.module.css';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Cookies from 'js-cookie';
import LogOut from '../LogOut/LogOut';
import MyComponent from '../MyComponent';
import MainComponent from '../Aside/MainComponent';

const API_users = 'https://store-system-api.gleeze.com/api/users';

const Users = () => {
  const token = Cookies.get('token');
  const [users, setUsers] = useState([]);
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
      console.error('Error fetching users:', error);
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

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage,
    });
  };

  const handleUpdateActive = (id, newActiveStatus) => {
    axios
      .put(`https://store-system-api.gleeze.com/api/users/${id}`, { active: newActiveStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Refresh the user list after updating the active status
        fetchData();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  return (
    <div>
      <LogOut />
      <MyComponent />
      <MainComponent/>
      <div className={styles.index}>
        <div className={styles.flex}>
          <div>
            <input type="search" name="search" className={styles.margin} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button className='btn btn-primary' onClick={handleSearch}>
              <Translate>A Search</Translate>
            </button>
          </div>
          <div>
            <Link to='/users/addUser' className='btn btn-primary AddUser p-2' >
              <Translate>ِAdd user</Translate>
            </Link>
          </div>
        </div>
        <div className={styles.container4}>
          {loading && <div className='m-5 fs-3'><Loading /></div>}
          {!loading && (
            <>
              <div className={styles.categoryTable}>
                <table>
                  <thead>
                    <tr>
                      <th><Translate>ID</Translate></th>
                      <th><Translate>Name</Translate></th>
                      <th><Translate>Role</Translate></th>
                      <th><Translate>Active</Translate></th>
                      <th><Translate>Actions</Translate></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user._id.slice(-4)}</td>
                        {decodedToken.role === 'admin' && (
                          <td>
                            <Link to={`/users/${user._id}/userBills`} className={styles.categoryLink}>
                              {user.name}
                            </Link>
                          </td>
                        )}
                        {decodedToken.role === 'manager' && <td>{user.name}</td>}
                        <td>{user?.role}</td>
                        {decodedToken._id !== user._id &&
                          <td>
                            <button className='border'
                              value={!user.active}
                              onClick={() => handleUpdateActive(user._id, !user.active)}
                            >
                              {user.active === true ? (
                                <Translate>active</Translate>
                              ) : (
                                <Translate>deactive</Translate>
                              )}
                            </button>
                          </td>}
                        {decodedToken.role !== 'user' &&
                          user.role !== 'manager' && (
                            <td>
                              <Link to={`/changeUserPassword/${user._id}`} className={styles.deleteBtn}>
                                <Translate translations={{ ar: 'تغيير كلمة المرور', en: 'change password' }}>{selectedLanguage === 'ar' ? 'تغيير كلمة المرور' : 'change password'}</Translate>
                              </Link>
                            </td>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    </div>
  );
};

export default Users;
