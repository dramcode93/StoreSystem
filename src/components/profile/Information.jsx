import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Translate } from 'translate-easy';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import ProfileField from './ProfileField';
import Loading from '../Loading/Loading';
import AddressField from './AddressField';
import PhoneField from './PhoneField';

const API_info = 'https://store-system-api.gleeze.com/api/users/getMe';
const API_update = 'https://store-system-api.gleeze.com/api/users/updateMe';
const DEL_phone = 'https://store-system-api.gleeze.com/api/Users/deletePhone';
const DEL_address = 'https://store-system-api.gleeze.com/api/Users/deleteAddress';
const ADD_phone = 'https://store-system-api.gleeze.com/api/Users/addPhone';

const Information = ({ openAdd }) => {
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('token');
  const [info, setInfo] = useState({ name: '', email: '', username: '', phone: [], address: [{}] });
  const [inputValues, setInputValues] = useState({ name: '', email: '' });
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPhoneAdding, setIsPhoneAdding] = useState(false);
  const [isDeletingPhone, setIsDeletingPhone] = useState(false); // Add state for phone deletion loading
  const [isDeletingAddress, setIsDeletingAddress] = useState(false); // Add state for phone deletion loading
  const [isAddingPhone, setIsAddingPhone] = useState(false); // Add state for phone addition loading

  const decodedToken = jwtDecode(token);

  const fetchData = useCallback(async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        if (token) {
          const response = await axios.get(`${API_info}?fields=username name email phone address`, { headers: { Authorization: `Bearer ${token}` } });
          const userData = response.data.data;
          setInfo(userData);
          setInputValues(userData);
          setLoading(false);
          return;
        } else {
          console.error('No token found.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setInputValues(prevInputValues => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleDelPhone = async (index) => {
    try {
      setIsDeletingPhone(true); // Set isDeletingPhone to true before making the request
      if (token) {
        const response = await axios.delete(
          `${DEL_phone}`,
          { data: { phone: info.phone[index] }, headers: { Authorization: `Bearer ${token}` } }
        );
        setIsDeletingPhone(false);
        fetchData();
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error deleting phone:', error);
      setIsDeletingPhone(false);
    }
  };

  const handleDelAddress = async (index) => {
    try {
      setIsDeletingAddress(true); // Set isDeletingAddress to true before making the request
      if (token) {
        const response = await axios.delete(
          `${DEL_address}`,
          { data: { address: info.address[index] }, headers: { Authorization: `Bearer ${token}` } }
        );
        setIsDeletingAddress(false); // Set isDeletingAddress to false after the request completes
        fetchData();
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setIsDeletingAddress(false);
    }
  };


  const handleAddToggle = (field) => {
    setIsPhoneAdding(!isPhoneAdding);
  };

  const handleAddPhone = async () => {
    try {
      setIsAddingPhone(true);
      if (token) {
        const response = await axios.put(
          ADD_phone,
          { phone: inputValues.phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setIsPhoneAdding(false);
      } else {
        console.error('No token found.');
      }
      setIsAddingPhone(false);
      fetchData();
    } catch (error) {
      console.error('Error adding phone:', error.response);
      setIsAddingPhone(false);
    }
  };

  const handleEditToggle = (field) => {
    if (field === 'name') {
      setIsNameEditing(!isNameEditing);
    }
    if (field === 'email') {
      setIsEmailEditing(!isEmailEditing);
    }

  };

  const handleSaveChanges = async () => {
    try {
      if (token) {
        const response = await axios.put(
          `${API_update}`,
          {
            name: isNameEditing ? inputValues.name : info.name,
            email: isEmailEditing ? inputValues.email : info.email,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newToken = response.data.token;
        const tokenTime = 2
        Cookies.set('token', newToken, { expires: tokenTime, secure: true, sameSite: 'strict' })

        setInfo(prevInfo => ({
          ...prevInfo,
          name: isNameEditing ? inputValues.name : prevInfo.name,
          email: isEmailEditing ? inputValues.email : prevInfo.email,
        }));

        setIsNameEditing(false);
        setIsEmailEditing(false);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div className="bg-gray-700 bg-opacity-25 mx-10 rounded-md py-4 px-4  text-gray-200 absolute top-40 w-3/4 " >
      <h3 className='font-bold text-white'>Information Page</h3>
      {loading ? <div className=" fs-4 text-center mb-5 pb-3"><Loading /> </div> : (
        <ul>
          <ProfileField
            label="Username"
            value={info.username}
          />

          <ProfileField
            label="Name"
            value={info.name}
            isEditing={isNameEditing}
            inputValue={inputValues.name}
            handleInputChange={handleInputChange}
            handleEditToggle={handleEditToggle}
          />

          <ProfileField
            label="Email"
            value={info.email}
            isEditing={isEmailEditing}
            inputValue={inputValues.email}
            handleInputChange={handleInputChange}
            handleEditToggle={handleEditToggle}
          />

          <PhoneField
            label="Phone"
            value={info.phone}
            handleInputChange={handleInputChange}
            isEditing={isPhoneAdding}
            handleDelPhone={handleDelPhone}
            handleAddPhone={handleAddPhone}
            handleAddToggle={handleAddToggle}
            isLoading={isDeletingPhone || isAddingPhone}
          />

          <AddressField
            label="Address"
            values={info.address}
            openAdd={openAdd}
            handleDelAddress={handleDelAddress}
            isLoading={isDeletingAddress}
          />


          {decodedToken.role !== 'user' &&
            <div className='mx-10'>
              {(isNameEditing || isEmailEditing) && (
                <button onClick={handleSaveChanges} className="bg-yellow-900  rounded-full hover:bg-yellow-800 fw-bold">Save Changes</button>
              )}
            </div>
          }
        </ul>
      )}
    </div>
  );
};

export default Information;
