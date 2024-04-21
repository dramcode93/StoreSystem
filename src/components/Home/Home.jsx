import React from 'react'
import './Home.css'
import { FaCannabis, FaChevronCircleRight, FaCloudMeatball, FaUbuntu, FaUser } from 'react-icons/fa';
import { Translate } from 'translate-easy';
 import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
 import MainComponent from '../Aside/MainComponent';
import Cookies from 'js-cookie';
 import { useI18nContext } from '../context/i18n-context';
const Home = () => {
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const { t } = useI18nContext();

  return (
    <div>

      <MainComponent />
      <div className='marginHome'>
        <div className='cards grid'>
          {decodedToken.role !== "manager" &&
            <>
              <Link to='/category' className='card1 back1'>
                <div className='flex text1'>
                  <div>
                    <h2>135</h2>
                  <span>   {t("Home.Category")}</span>
                  </div>
                  <FaCannabis className='productLogo' />

                </div>
                <div className='details1 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
              </Link>

              <Link to='/products' className='card1 back2'>
                <div className='flex text1'>
                  <div>
                    <h2>65</h2>
                    <span><Translate>products</Translate></span>
                  </div>
                  <FaUbuntu className='productLogo' />

                </div>
                <div className='details2 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
              </Link>

              <Link to='/bills' className='card1 back3'>
                <div className='flex text1'>
                  <div>
                    <h2><Translate>44</Translate></h2>
                    <span><Translate>bills</Translate></span>
                  </div>
                  <FaCloudMeatball className='productLogo' />

                </div>
                <div className='details3 border2'>  <Translate>Details</Translate> <FaChevronCircleRight /></div>
              </Link>
            </>
          }
          <Link to='/profile' className='card1 back4'>
            <div className='flex text1'>
              <div>
                <h2>87</h2>
                <span><Translate>the Profile</Translate></span>
              </div>
              <FaUser className='productLogo' />

            </div>
            <div className='details4 border2'> <Translate>Details</Translate> <FaChevronCircleRight /></div>
          </Link>

        </div>
      </div>
    </div>

  )
}

export default Home