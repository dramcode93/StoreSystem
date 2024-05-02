import React, { useState } from 'react';
import './Home.css';
import { useI18nContext } from '../context/i18n-context';
import image from '../../Images/images (1).jpg';
import CreateShop from './forms/CreateShop';

const Home = (role,modal) => {
  const {   language } = useI18nContext();
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
      <div dir={language === "ar" ? "rtl" : "ltr"} className=' relative top-8 flex flex-col justify-content-center'>
        <img src={image} alt='' className='image-container w-75 my-5' />
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
