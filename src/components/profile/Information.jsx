
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Translate } from 'translate-easy';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import ProfileField from './ProfileField';
import Loading from '../Loading/Loading';
import AddressField from './AddressField';
const API_info = 'https://store-system-api.gleeze.com/api/users/getMe';
const API_update = 'https://store-system-api.gleeze.com/api/users/updateMe';

const Information = () => {
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('token');
  const [info, setInfo] = useState({ name: '', email: '', username: '', phone: 0, address: { governorate_name_ar: '', city: '', street: '', _id: '' } });
  const [inputValues, setInputValues] = useState({ name: '', email: '', phone: 0, address: { governorate_name_ar: '', city: '', street: '', _id: '' } });
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };
  const handleInputChangePhone = (e) => {
    const { index, value } = e.target;
    setInputValues((prevInputValues) => {
      const newInputValues = { ...prevInputValues };
      newInputValues.phone[index] = value;
      return newInputValues;
    });
  };



  const handleEditToggle = (field) => {
    if (field === 'name') {
      setIsNameEditing(!isNameEditing);
    }
    if (field === 'email') {
      setIsEmailEditing(!isEmailEditing);
    }
    if (field === 'phone') {
      setIsPhoneEditing(!isPhoneEditing);
    }
    if (field === 'address') {
      setIsAddressEditing(!isAddressEditing);
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
            phone: isPhoneEditing ? inputValues.phone : info.phone,
            address: isAddressEditing ? inputValues.address : info.address,
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
          phone: isPhoneEditing ? inputValues.phone : prevInfo.phone,
          address: isAddressEditing ? inputValues.address : prevInfo.address,
        }));

        setIsNameEditing(false);
        setIsEmailEditing(false);
        setIsPhoneEditing(false);
        setIsAddressEditing(false);
      } else {
        console.error('No token found.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div className="bg-gray-700 bg-opacity-25 mx-10 rounded-md py-4 px-4  text-gray-200 absolute top-40 w-3/4" >
      <h3 className='font-bold text-white'><Translate>Information Page</Translate></h3>
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

          <ProfileField
            label="Phone"
            value={info.phone}
            isEditing={isPhoneEditing}
            inputValue={inputValues.phone}
            handleInputChange={handleInputChangePhone}
            handleEditToggle={handleEditToggle}
          />

          <AddressField
            label="Address"
            value={info.address}
            isEditing={isAddressEditing}
            inputValue={inputValues.address[0]}
            handleInputChange={handleInputChange}
            handleEditToggle={handleEditToggle}
          />



          {decodedToken.role !== 'user' &&
            <div className='mx-10'>
              {(isNameEditing || isEmailEditing || isPhoneEditing || isAddressEditing) && (
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
