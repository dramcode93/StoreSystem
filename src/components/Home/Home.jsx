import React, { useState } from 'react';
import './Home.css';
import { useI18nContext } from '../context/i18n-context';
import image from '../../Images/images (1).jpg';
import CreateShop from './forms/CreateShop';

const Home = (role,modal) => {
  const {language } = useI18nContext();
  const [showCreateShop, setShowCreateShop] = useState(false);

  const toggleCreateShop = () => {
    setShowCreateShop(!showCreateShop);
  };
  const [openCreate, setOpenCreate] = useState(false);
  const toggleOpenCreateModal = () => {
    setOpenCreate(!openCreate);
  };

  return (
    <div>
      <div className={`absolute top-32 -z-3 flex flex-col justify-content-center ${language === "ar" ? "left-10 " : "right-10 "}`}>
        <img src={image} alt='' className='image-container my-5' />
        <div className="col-span-2 flex justify-center">
          <button
            onClick={toggleCreateShop}
            type="submit"
            className="bg-yellow-900   rounded-md hover:bg-yellow-800 fw-bold text-xl"
          >
            create your shop
          </button>
        </div>
      </div>
      {showCreateShop && <CreateShop
        closeModal={toggleOpenCreateModal}
        modal={modal}
        role={role} />}
    </div>
  );
};

export default Home;
