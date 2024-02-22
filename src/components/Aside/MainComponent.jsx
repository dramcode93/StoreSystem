import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'translate-easy';
import { FaBars } from 'react-icons/fa';
import LogoImage from '../../Images/Modern Creative Technology Logo.svg';
import './styles.css';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
const MainComponent = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const token = Cookies.get('token');
  
  const decodedToken = jwtDecode(token);
  const toggleSidebar = () => {
    setShowSidebar(prevState => !prevState);
  };

  return (
    
    <div className={`main-container ${showSidebar ? 'show-sidebar' : ''}`}>
      <div className={`sidebar ${showSidebar ? 'show-sidebar' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="logo-container">
          <img src={LogoImage} alt="Logo" />
        </div>
        <div className="nav-links">
          <Link to="/home">
            <Translate>Main Page</Translate>
          </Link>
    {decodedToken.role !== "manager" &&
          <>
          <Link to="/category">
            <Translate>Categories</Translate>
          </Link>
          <Link to="/products">
            <Translate>Products</Translate>
          </Link>
          <Link to="/bills">
            <Translate>Bills</Translate>
          </Link>
            </>
          }
          <Link to="/profile">
            <Translate>Profile</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
