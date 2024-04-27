import React from 'react';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
const PrintButton = ({ onPrint }) => {
  return (
    <button className='w-55 rounded-md bg-orange-600 hover:bg-orange-400 ' onClick={onPrint}>
      <Translate>A Print</Translate>
    </button>
  );
};

export default PrintButton;