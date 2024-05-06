
import React from 'react';
import './Loading.css';
import { useI18nContext } from '../context/i18n-context';

const Loading = () => {
  const {t} = useI18nContext();
  return (
    <div className='text-center'>
      <div className="loading">
      </div>
      {t("Loading.LOADING")}
    </div>
  );
};

export default Loading;
