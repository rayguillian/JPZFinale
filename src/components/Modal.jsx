// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
