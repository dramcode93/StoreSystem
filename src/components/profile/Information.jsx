import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Translate } from 'translate-easy';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import ProfileField from './ProfileField';
import Loading from '../Loading/Loading';

const API_info = 'https://store-system-api.gleeze.com/api/users/getMe';
const API_update = 'https://store-system-api.gleeze.com/api/users/updateMe';
const Information = () => {
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('token');
  const [info, setInfo] = useState({ name: '', email: '', username: '', phone: 0 });
  const [inputValues, setInputValues] = useState({ name: '', email: '' });
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

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
          { name: isNameEditing ? inputValues.name : info.name, email: isEmailEditing ? inputValues.email : info.email },
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
    <div className="bg-gray-700 bg-opacity-25 mx-10 rounded-md py-4 px-4  text-gray-200" >
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
            label="phone"
            value={info.phone} />

          {/* <ProfileField
            label="address"
            value={info.address}
          /> */}

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






// import React, { useCallback, useEffect, useState } from 'react';
// import styles from './Profile.module.css';
// import axios from 'axios';
// import { Translate } from 'translate-easy';
// import { jwtDecode } from "jwt-decode";
// import Cookies from 'js-cookie';

// const API_info = 'https://store-system-api.gleeze.com/api/users/getMe';
// const API_update = 'https://store-system-api.gleeze.com/api/users/updateMe';

// const Information = () => {
//   const [loading, setLoading] = useState(true);
//   const token = Cookies.get('token');
//   const [info, setInfo] = useState({ name: '', email: '' });
//   const [inputValues, setInputValues] = useState({ email: '' });
//   const [isNameEditing, setIsNameEditing] = useState(false);
//   const [isEmailEditing, setIsEmailEditing] = useState(false);
//   const decodedToken = jwtDecode(token);

//   const fetchData = useCallback(async () => {
//     let retries = 3;
//     while (retries > 0) {
//       try {
//         if (token) {
//           const response = await axios.get(`${API_info}`, { headers: { Authorization: `Bearer ${token}` } });
//           const userData = response.data.data;
//           setInfo(userData);
//           setInputValues(userData);
//           return;
//         } else {
//           console.error('No token found.');
//         }
//       } catch (error) {
//         console.error('Error fetching user information:', error);
//         retries--;
//         if (retries === 0) {
//           console.error('Maximum retries reached.');
//           break;
//         }
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     }
//     setLoading(false);
//   }, [token]);


//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setInputValues((prevInputValues) => ({
//       ...prevInputValues,
//       [name]: value,
//     }));
//   };

//   const handleEditToggle = (nameField, emailFields) => {
//     if (nameField === 'name') {
//       setIsNameEditing(!isNameEditing);
//     }
//     if (emailFields === 'email') {
//       setIsEmailEditing(!isEmailEditing);
//     }
//   };

//   const handleSaveChanges = async () => {
//     try {
//       if (token) {
//         const response = await axios.put(
//           `${API_update}`,
//           { name: isNameEditing ? inputValues.name : info.name, email: isEmailEditing ? inputValues.email : info.email },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const newToken = response.data.token;
//         const tokenTime = 2
//         Cookies.set('token', newToken, { expires: tokenTime, secure: true, sameSite: 'strict' })

//         setInfo(prevInfo => ({
//           ...prevInfo,
//           name: isNameEditing ? inputValues.name : prevInfo.name,
//           email: isEmailEditing ? inputValues.email : prevInfo.email,
//         }));

//         setIsNameEditing(false);
//         setIsEmailEditing(false);
//       } else {
//         console.error('No token found.');
//       }
//     } catch (error) {
//       console.error('Error updating user information:', error);
//     }
//   };


//   return (
//     <div className={` bg-gray-700 bg-opacity-25  mx-10 rounded-md py-4 px-4 `} >
//       <h3 className='font-bold text-white'><Translate>Information Page</Translate></h3>
//       <ul>
//         <>
//           <div>
//             <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'> <p className='text-gray-200 font-bold text-xl'>Name : {isNameEditing ? <input name="name" value={inputValues.name} onChange={handleInputChange} /> : info.name}</p></li>
//             <li className='bg-gray-500 mx-10 rounded-md py-4 px-4 bg-opacity-25 mb-3'>  <p className='text-gray-200 font-bold text-xl'>Email : {isEmailEditing ? <input name="email" value={inputValues.email} onChange={handleInputChange} /> : info.email}</p></li>
//           </div>
//         </>
//         {decodedToken.role !== 'user' &&
//           <div>
//             {isNameEditing || isEmailEditing ? (
//               <button onClick={handleSaveChanges}><Translate>Save Changes</Translate></button>
//             ) : (
//               <button onClick={() => handleEditToggle('name', 'email')}>An Editing</button>
//             )}
//           </div>
//         }
//       </ul>
//     </div>
//   );
// };

// export default Information;
