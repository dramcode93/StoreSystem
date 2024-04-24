import React from 'react';
import './Home.css';
import { useI18nContext } from '../context/i18n-context';

const Home = () => {
  const { language } = useI18nContext();

  return (
    <div>
      <h1 dir={language === "ar" ? "rtl" : "ltr"}>xzzzzzzxxx</h1>
    </div>
  );
};

export default Home;
