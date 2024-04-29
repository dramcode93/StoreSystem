import React from "react";
import styles from "./Products.module.css";
import { Translate } from "translate-easy";

const ConfirmationDelete = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.confirmationModal}>
      <div className={styles.confirmationModalCon}>
        <p>Are you sure you want to delete this product ?</p>
        <div className={styles.flex}>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDelete;
