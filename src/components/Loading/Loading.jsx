
import React from 'react';
import './Loading.css';
import { useI18nContext } from '../context/i18n-context';

const Loading = () => {
  const {t} = useI18nContext();
  return (
    <div>
      <div className="loading">
      </div>
      {t("Global.LOADING")}
    </div>
  );
};

export default Loading;
