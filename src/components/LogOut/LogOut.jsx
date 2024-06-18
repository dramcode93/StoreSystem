import React from 'react';
import './Logout.css';
import Cookies from 'js-cookie';
import { User } from '@phosphor-icons/react';
import { useI18nContext } from '../context/i18n-context';

const LogOut = () => {
  const { t } = useI18nContext();

  const handleLogOut = () => {
    Cookies.remove('token');
    window.location.href = '/';
  };

  return (
    <div
      title={t("Home.LogOut")}
    >
      <User
        className='relative bg-transparent rounded-full p-1
                   text-gray-500 dark:hover:text-white focus:outline-none
                   hover:text-slate-500 w-fit z-50 cursor-pointer'
        size={32}
        onClick={handleLogOut}
      />
    </div>
  );
};

export default LogOut;
