import React from 'react';
import styles from './styles.module.css';
import { Translate } from 'translate-easy';
const PrintButton = ({ onPrint }) => {
  return (
    <button className={styles.printButton} onClick={onPrint}>
     <Translate>A Print</Translate> 
    </button>
  );
};

export default PrintButton;