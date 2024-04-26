import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useI18nContext } from "../context/i18n-context";

const Dropdown = () => {
    const { t, language } = useI18nContext();
    const dropdownItems = [
        { text: 'Information', path: '/information' },
        { text: 'Change Password', path: '/change-password' },
        { text: 'Users', path: '/users' }
    ];

    return (
        <div className='transition ease-in-out duration-75' dir={language === "ar" ? "rtl" : "ltr"}>
            <div className='flex flex-col w-50 mx-auto justify-start font-bold text-white'>
                {dropdownItems.map((item, index) => (
                    <NavLink key={index} to={item.path} className='w-full' activeClassName='text-blue-500'>
                        <p className='text-white'>{item.text}</p>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;
