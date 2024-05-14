import React, { useEffect, useState, useCallback } from 'react';
import { BiCategory } from "react-icons/bi";
import { LiaMoneyBillSolid } from "react-icons/lia";
import { MdProductionQuantityLimits, MdBorderColor } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink } from 'react-router-dom';
import { useI18nContext } from "../context/i18n-context";
import module from "./Dashboard.module.css";
import { House } from "@phosphor-icons/react";
import { FiChevronDown, FiChevronUp, FiShoppingCart } from "react-icons/fi";
import Cookies from 'js-cookie';
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaBagShopping } from "react-icons/fa6";
import axios from 'axios';

const roleRoutes = {
    admin: [
        { path: '/Home', name: "Home.Home", icon: <House /> },
        { path: "/shop", name: "Home.shop", icon: <FiShoppingCart /> },
        { path: '/category', name: "Home.Category", icon: <BiCategory /> },
        { path: "/products", name: "Home.products", icon: <MdProductionQuantityLimits /> },
        {
            path: "/customers", name: "Home.Customer", icon: <BsFillPersonVcardFill />, dropdownItems: [
                { text: 'Create', path: '/create' },
                { text: 'Show bills', path: '/show-bills' },
            ]
        },
        { path: "/bills", name: "Home.Bill", icon: <LiaMoneyBillSolid /> },
        {
            name: "Home.Profile", icon: <CgProfile />, dropdownItems: [
                { text: 'Information', path: '/information' },
                { text: 'Change Password', path: '/change-password' },
                { text: 'Users', path: '/users' }
            ]
        }
    ],
    manager: [
        { path: '/Home', name: "Home.Home", icon: <House /> },
        { path: "/products", name: "Home.products", icon: <MdProductionQuantityLimits /> },
        { path: "/bills", name: "Home.Bill", icon: <LiaMoneyBillSolid /> },
        {
            name: "Home.Profile", icon: <CgProfile />, dropdownItems: [
                { text: 'Information', path: '/information' },
                { text: 'Change Password', path: '/change-password' },
                { text: 'Users', path: '/users' }
            ]
        }
    ],
    user: [
        { path: '/Home', name: "Home.Home", icon: <House /> },
        { path: '/category', name: "Home.Category", icon: <BiCategory /> },
        { path: "/products", name: "Home.products", icon: <MdProductionQuantityLimits /> },
        {
            name: "Home.Bill", icon: <LiaMoneyBillSolid />, dropdownItems: [
                { text: 'Create bills', path: '/create-bills' },
            ]
        },
        {
            name: "Home.Order", icon: <MdBorderColor />, dropdownItems: [
                { text: 'Agree', path: '/agree' },
                { text: 'Accept', path: '/accept' },
            ]
        },
        {
            path: "/customers", name: "Home.Customer", icon: <BsFillPersonVcardFill />, dropdownItems: [
                { text: 'Create', path: '/create' },
                { text: 'Show bills', path: '/show-bills' },
            ]
        },
        {
            name: "Home.Profile", icon: <CgProfile />, dropdownItems: [
                { text: 'Information', path: '/information' },
            ]
        }
    ],
    customer: [
        { path: '/Home', name: "Home.Home", icon: <House /> },
        { path: '/shops', name: "Home.shops", icon: <FaBagShopping /> },
        { path: "/cart", name: "Home.Cart", icon: <MdProductionQuantityLimits /> },
        { name: "Home.Order", icon: <MdBorderColor /> },
        {
            name: "Home.Profile", icon: <CgProfile />, dropdownItems: [
                { text: 'Information', path: '/information' },
                { text: 'Change Password', path: '/change-password' },
            ]
        }
    ]
};

const Dashboard = ({ children }) => {
    const token = Cookies.get('token');
    const { t, language } = useI18nContext();
    const [role, setRole] = useState("");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    "https://store-system-api.gleeze.com/api/Users/getMe",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRole(response.data.data.role)
            } catch (error) {
                console.error("Error fetching :", error);
            }
        };
        fetchUserData();
    }, []);

    const [activeLink, setActiveLink] = useState(null);
    const [isProfileActive, setIsProfileActive] = useState(false);

    const handleLinkClick = useCallback((index) => {
        setActiveLink(index);
        setIsProfileActive(index === roleRoutes[role].length - 1 ? !isProfileActive : false);

        // Store active link index in localStorage
        localStorage.setItem('activeLinkIndex', index);
    }, [role, isProfileActive]);

    useEffect(() => {
        // Retrieve active link index from localStorage
        const storedActiveLinkIndex = localStorage.getItem('activeLinkIndex');
        // If there's a stored index, set it as the active link
        if (storedActiveLinkIndex !== null) {
            setActiveLink(parseInt(storedActiveLinkIndex));
        }
    }, []);

    return (
        <div className="fixed top-5 text-gray-900 dark:text-gray-100" dir={language === "ar" ? "rtl" : "ltr"}>
            {roleRoutes[role] && (
                <div style={{ marginTop: "15vh", boxShadow: language === "ar" ? "-4px 0px 2px rgba(0, 0, 0, 0.1)" : "5px 0px 3px rgba(0, 0, 0, 0.1)" }} className={language === "ar" ? module.sidebarArabic : module.sidebar}>
                    {roleRoutes[role].map((item, index) => (
                        <div key={index}>
                            <NavLink to={item.path} className={module.link} onClick={() => handleLinkClick(index)} style={activeLink === index ? { backgroundColor: "#713f12", borderRadius: "10px" } : {}}>
                                <div className={module.icon}>{item.icon}</div>
                                {item.name === "Home.Profile" ? (
                                    <div className={`${module.link_text} flex`}>{t(item.name)} {activeLink === index ? <FiChevronUp /> : <FiChevronDown />}</div>
                                ) : (
                                    <div className={module.link_text}>{t(item.name)}</div>
                                )}
                            </NavLink>
                            {activeLink === index && isProfileActive && item.dropdownItems && (
                                <div className='transition ease-in-out duration-75' dir={language === "ar" ? "rtl" : "ltr"}>
                                    <div className='flex flex-col w-full mx-auto justify-start font-bold' >
                                        {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                            <NavLink key={dropdownIndex} to={dropdownItem.path} className={module.link} >
                                                <p >{dropdownItem.text}</p>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <main>{children}</main>
        </div>
    );
};

export default Dashboard;
