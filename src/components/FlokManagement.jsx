import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const FlokManagement = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, 'users', auth.currentUser.uid, 'flok'));
        const unsub = onSnapshot(q, (snapshot) => {
          setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsub();
      } else {
        console.log('User is not authenticated.');
      }
    };

    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    if (name === '') {
      setError('Please provide a valid name.');
      return;
    }

    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'flok'), {
          name,
          credits: 0 // Default credits to 0 or omit if not necessary
        });
        setName('');
        setSuccess('Member added successfully!');
        setError(null);
      } catch (error) {
        setError('Error adding member. Please try again.');
        setSuccess(null);
        console.error('Error adding document: ', error);
      }
    } else {
      setError('User is not authenticated.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Flok Members</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {members.map(member => (
          <div
            key={member.id}
            onClick={() => navigate(`/flok/${member.id}`)}
            className="flex items-center mb-4 cursor-pointer bg-gray-100 hover:bg-gray-200 active:bg-gray-300 p-4 rounded"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white mr-4">
              {member.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{member.name}</p>
            </div>
          </div>
        ))}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleAddMember}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
        >
          Add Member
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default FlokManagement;
