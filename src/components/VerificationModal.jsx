// src/components/VerificationModal.jsx
import React from 'react';
import Modal from './Modal';

const VerificationModal = ({ onClose }) => {
  return (
    <Modal>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 md:mx-8 lg:mx-12 text-center">

        <h2 className="text-3xl font-bold mb-6">🐒🦁📧 Tjek din email! 📧🦁🐒</h2>
        <p className="text-lg mb-6">
          En bekræftelsesemail er sendt. Tjek din indbakke og følg instruktionerne for at bekræfte din konto.
          Hvorfor gik løven til computeren? For at brøle af glæde over sin nye konto! 🦁✨
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white py-3 px-6 rounded-full shadow-md hover:bg-green-600 text-lg"
        >
          Luk
        </button>
      </div>
    </Modal>
  );
};

export default VerificationModal;
