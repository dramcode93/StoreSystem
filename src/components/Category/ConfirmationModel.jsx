import React from 'react';
import styles from './Category.module.css';
import { Translate } from 'translate-easy';

const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.confirmationModal}>
      <div className={styles.confirmationModalCon}>
        <p><Translate>Are you sure you want to delete this category?</Translate></p>
        <div className={styles.flex}>
          <button onClick={onConfirm}><Translate>Yes</Translate></button>
          <button onClick={onCancel}><Translate>No</Translate></button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
