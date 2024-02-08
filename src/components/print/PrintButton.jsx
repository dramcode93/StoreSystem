import React from 'react';

const PrintButton = ({ onPrint }) => {
  return (
    <button onClick={onPrint}>
      Print
    </button>
  );
};

export default PrintButton;