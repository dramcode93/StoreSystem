import React from 'react'
import './Home.css'
import { FaCannabis, FaChevronCircleRight, FaCloudMeatball, FaUbuntu, FaUser } from 'react-icons/fa';
import { Translate } from 'translate-easy';
 import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
 import { useI18nContext } from '../context/i18n-context';
const Home = () => {
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const { t } = useI18nContext();

  return (
    <div>

    </div>

  )
}

export default Home