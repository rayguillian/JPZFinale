import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import Modal from './Modal';
import tokenIcon from '/images/token_icon.svg';

const FlokMemberProfileModal = ({ memberId, onClose }) => {
  const [member, setMember] = useState(null);
  const [mainUser, setMainUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      const memberDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'flok', memberId));
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      setMember(memberDoc.data());
      setMainUser(userDoc.data());
    };

    if (auth.currentUser) {
      fetchMemberData();
    }
  }, [memberId]);

  const handleAddCredits = async () => {
    if (mainUser.credits === 0) {
      setError('Your main account has a zero balance. No credits can be transferred.');
      return;
    }

    if (amount <= 0 || amount > mainUser.credits) {
      setError('Please provide a valid amount within your available balance.');
      return;
    }

    try {
      const memberRef = doc(db, 'users', auth.currentUser.uid, 'flok', memberId);
      const userRef = doc(db, 'users', auth.currentUser.uid);

      await updateDoc(memberRef, {
        credits: member.credits + amount,
      });
      await updateDoc(userRef, {
        credits: mainUser.credits - amount,
      });

      setMember(prev => ({ ...prev, credits: prev.credits + amount }));
      setMainUser(prev => ({ ...prev, credits: prev.credits - amount }));
      setAmount(0);
      setSuccess('Credits added successfully!');
      setError(null);
    } catch (error) {
      setError('Error adding credits. Please try again.');
      setSuccess(null);
      console.error('Error updating document: ', error);
    }
  };

  const handleDeleteMember = async () => {
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'flok', memberId));
      onClose();
    } catch (error) {
      setError('Error deleting member. Please try again.');
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <Modal>
      {member && mainUser && (
        <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 md:p-8 m-4 max-w-2xl w-full mx-4 md:mx-auto text-center" style={{ marginTop: '5vh', marginBottom: '5vh' }}>
          <button onClick={onClose} className="absolute top-4 left-4 text-2xl font-bold text-red-500 hover:text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            &times;
          </button>
          <div className="flex flex-col items-center mb-6">
            <div className="w-40 h-40 rounded-full bg-custom-bg flex items-center justify-center mb-4 overflow-hidden">
              <img src={member.icon} alt="User Icon" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mochiy-pop-one-regular mb-4 uppercase break-words" style={{ maxWidth: '90%' }}>
              {member.name}
            </h1>
            <div className="flex items-center justify-center text-7xl md:text-9xl font-bold mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '100' }}>
              {member.credits}
              <img src={tokenIcon} alt="Token Icon" className="w-14 h-14 md:w-20 md:h-20 ml-4 animate-float" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} // Prevent scrolling to negative values
              placeholder="Add Credits"
              className="border p-2 rounded-full w-full mb-4"
              min="0" // Prevent input of negative values
            />
            <button onClick={handleAddCredits} className="w-full bg-green-500 text-white py-4 rounded-md shadow-md hover:bg-green-600 mt-4 text-lg">
              Tank Op
            </button>
            <button onClick={handleDeleteMember} className="text-black underline mt-4 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              Slet gruppemedlem
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-500 mt-2">{success}</div>}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FlokMemberProfileModal;
