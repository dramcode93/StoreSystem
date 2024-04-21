import module from "./Dashboard.module.css"
import React, { useState } from 'react'
import { BiCategory } from "react-icons/bi";
import { LiaMoneyBillSolid } from "react-icons/lia";
import { MdProductionQuantityLimits } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TiThMenu } from "react-icons/ti";
import { NavLink } from 'react-bootstrap';
const Dashboard = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuDashboard = [
        {
            path: "/category",
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
    ]
    return (

<div className={module.container}>
<div style={{width: isOpen ? "400px" : "50px"}} className={module.sidebar}>
    <div className={module.top_section}>
        <h1 style={{display: isOpen ? "block" : "none"}} className={module.logo}>Logo</h1>
        <div style={{marginLeft: isOpen ? "50px" : "0px"}} className={module.bars}>
            <TiThMenu onClick={toggle}/>
        </div>
    </div>
    {
        menuDashboard.map((item, index)=>(
            <NavLink to={item.path} key={index} className={module.link} activeclassName="active">
                <div className={module.icon}>{item.icon}</div>
                <div style={{display: isOpen ? "block" : "none"}} className={module.link_text}>{item.name}</div>
            </NavLink>
        ))
    }
</div>
<main>{children}</main>
</div>
);
}

export default Dashboard