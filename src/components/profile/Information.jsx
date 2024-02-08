import React, { useCallback, useEffect, useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';

const API_info = 'https://helpful-worm-attire.cyclic.app/api/users/getMe';
const API_update = 'https://helpful-worm-attire.cyclic.app/api/users/updateMe';

const Information = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [info, setInfo] = useState({ name: '', email: '' });
  const [inputValues, setInputValues] = useState({ email: '' });
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  const fetchData = useCallback(async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        if (token) {
          const response = await axios.get(`${API_info}`, { headers: { Authorization: `Bearer ${token}` } });
          const userData = response.data.data;
          setInfo(userData);
          setInputValues(userData);
          return; 
        } else {
          console.error('No token found.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error.message);
        retries--;
        if (retries === 0) {
          console.error('Maximum retries reached.');
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    setLoading(false);
  }, [token]);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };
  
   const handleEditToggle = (nameField,emailFields) => {
    if (nameField === 'name') {
      setIsNameEditing(!isNameEditing);
    }  
    if (emailFields === 'email') {
      setIsEmailEditing(!isEmailEditing);
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      if (token) {
        const response = await axios.put(
          `${API_update}`,
          { name: isNameEditing ? inputValues.name : info.name, email: isEmailEditing ? inputValues.email : info.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Save Changes Response:', response.data.data);
  
        setIsNameEditing(false);
        setIsEmailEditing(false);
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
          <p>Name: {isNameEditing ? <input name="name" value={inputValues.name} onChange={handleInputChange} /> : info.name}</p>
          <p>Email: {isEmailEditing ? <input name="email" value={inputValues.email} onChange={handleInputChange} /> : info.email}</p>
           </div>
        </li>
        <li>
          {isNameEditing || isEmailEditing ? (
            <button onClick={handleSaveChanges}>Save Changes</button>
          ) : (
            <button onClick={() => handleEditToggle('name','email')}>Edit</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Information;
