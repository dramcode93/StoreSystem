import React, { useCallback, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';

const API_info = 'https://real-pear-barracuda-kilt.cyclic.app/api/users/getMe';
const API_update = 'https://real-pear-barracuda-kilt.cyclic.app/api/users/updateMe';

const Information = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [info, setInfo] = useState({ name: '', email: '' });
  const [inputValues, setInputValues] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(`${API_info}`, { headers: { Authorization: `Bearer ${token}` } });
        const userData = response.data.data;
        setInfo(userData);
        setInputValues(userData);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error fetching user information:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      if (token) {
        const response = await axios.put(
          `${API_update}`,
          { name: inputValues.name, email: inputValues.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Save Changes Response:', response.data.data);
        setIsEditing(false);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error updating user information:', error.message);
    }
  };

  return (
    <div className={styles.profileInfo}>
      <h2>Information Page</h2>
      <ul>
        <li>
          <div>
            <p>Name: {isEditing ? <input name="name" value={inputValues.name} onChange={handleInputChange} /> : info.name}</p>
            <p>Email: {isEditing ? <input name="email" value={inputValues.email} onChange={handleInputChange} /> : info.email}</p>
          </div>
        </li>
        <li>
          {isEditing ? (
            <button onClick={handleSaveChanges}>Save Changes</button>
          ) : (
            <button onClick={handleEditToggle}>Edit</button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Information;
