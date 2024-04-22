import module from "./Dashboard.module.css";
import React, { useState } from 'react';
import { BiCategory } from "react-icons/bi";
import { LiaMoneyBillSolid } from "react-icons/lia";
import { MdProductionQuantityLimits } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink } from 'react-router-dom';
import { useI18nContext } from "../context/i18n-context";
import { House, SketchLogo } from "@phosphor-icons/react";

const Dashboard = ({ children }) => {
    const menuDashboard = [
        {
            path: '/Home',
            name: "Home",
            icon: <House />,
         },
        {
            path: '/category',
            name: "Category",
            icon: <BiCategory />
        },
        {
            path: "/products",
            name: "Product",
            icon: <MdProductionQuantityLimits />
        },
        {
            path: "/bills",
            name: "Bill",
            icon: <LiaMoneyBillSolid />
        },
        {
            path: "/profile",
            name: "Profile",
            icon: <CgProfile />
        },
    ];
    const { language } = useI18nContext();
    const sidebarStyle = {
        width: "24vw",
         height:"98vh",
         paddingRight:"20px",
         boxShadow: language === "ar" ? "-5px 0px 3px  rgba(0, 0, 0, 0.1)" : "none",
    };
    const [activeLink, setActiveLink] = useState(null);
    const handleLinkClick = (index) => {
        setActiveLink(index);
    };
    return (
        <div className="text-gray-900 dark:text-gray-100 " dir={language === "ar" ? "rtl" : "ltr"}>
            <div style={sidebarStyle} className={`${language === "ar" ? module.sidebarArabic : module.sidebar}`}>
            <h3 className="text-gray-900 pt-5 dark:text-gray-100 font flex justify-content-center gap-2 " > <SketchLogo /> Sales Management</h3>
                <div className={module.top_section}>
                </div>
                {
                    menuDashboard.map((item, index) => (
                        <NavLink to={item.path} key={index} className={module.link} activeClassName={module.active}
                            onClick={() => handleLinkClick(index)} style={activeLink === index ? { backgroundColor: "#713f12",borderRadius:"10px" } : {}}
>
                            <div className={module.icon}>{item.icon}</div>
                            <div className={module.link_text}>{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>
    );
}

export default Dashboard;
