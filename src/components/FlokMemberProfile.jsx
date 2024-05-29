import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase';

const FlokMemberProfile = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
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

    fetchMemberData();
  }, [memberId]);

  const handleAddCredits = async () => {
    if (amount <= 0 || amount > mainUser.credits) {
      setError('Please provide a valid amount within your available balance.');
      return;
    }

    if ((mainUser.credits - amount) < 0 || (member.credits + amount) < 0) {
      setError('Transaction would result in negative credits.');
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

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate('/flok')}
        className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 mb-4"
      >
        Back to Flok Management
      </button>
      {member && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{member.name}'s Profile</h1>
          <p className="text-lg mb-4">Credits: <span className="font-bold">{member.credits}</span></p>
          <div className="mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Add Credits"
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleAddCredits}
              className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
            >
              Add Credits
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-500 mt-2">{success}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlokMemberProfile;
