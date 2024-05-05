import React from 'react';
import { useI18nContext } from '../context/i18n-context';
const PrintButton = ({ onPrint }) => {
  const t = useI18nContext();
  return (
    <button className='w-55 rounded-md bg-orange-600 hover:bg-orange-400 ' onClick={onPrint}>
      {t('Global.print')}
    </button>
  );
};

export default PrintButton;