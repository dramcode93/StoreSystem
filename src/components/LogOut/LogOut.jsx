import React from 'react';
import './Logout.css';
import Cookies from 'js-cookie';
import { User } from '@phosphor-icons/react';

const logOut = () => {
  const handle = () => {
    Cookies.remove('token');
    window.location.href = '/';
  };

  return (
    <div>
      <User className='relative bg-transparent rounded-full p-1
                     text-gray-500  dark:hover:text-white focus:outline-none
                    hover:text-slate-500 w-fit'
                     size={32} onClick={handle} />
       
    </div>
  );
};

export default logOut; // Changed the export name to logOut
