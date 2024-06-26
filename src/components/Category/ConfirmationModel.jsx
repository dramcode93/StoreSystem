import React from "react";
import styles from "../Products/Products.module.css";

const ConfirmationModal = ({ show, onConfirm, onCancel, item }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`${styles.confirmationModal} z-50`}>
      <div className={styles.confirmationModalCon}>
        <p>
          Are you sure you want to delete this {item}?
        </p>
        <div className={styles.flex}>
          <button onClick={onConfirm}>
            Yes
          </button>
          <button onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
