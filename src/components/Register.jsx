// src/components/Register.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import VerificationModal from './VerificationModal';

const userIcons = [
  '/images/BrugerProfilIkoner/1.svg',
  '/images/BrugerProfilIkoner/2.svg',
  '/images/BrugerProfilIkoner/3.svg',
  '/images/BrugerProfilIkoner/4.svg',
  '/images/BrugerProfilIkoner/5.svg',
  '/images/BrugerProfilIkoner/6.svg',
  '/images/BrugerProfilIkoner/8.svg',
  // Add more icons as needed
];
const backgroundImage = '/images/DyrBg/bg3.svg'; // Static background

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const capitalizeFirstName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getRandomUserIcon = () => {
    const randomIcon = userIcons[Math.floor(Math.random() * userIcons.length)];
    return randomIcon;
  };

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    const firstName = capitalizeFirstName(name);
    const userIcon = getRandomUserIcon();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Save additional user information in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: firstName,
        email,
        icon: userIcon,
        createdAt: new Date()
      });

      setSuccess('Registration successful! Please check your email for verification.');
      setName('');
      setPassword('');
      setEmail('');
      setShowModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="text-center bg-white rounded-lg shadow-lg p-8 m-4 max-w-xs z-10">
        <img src="/images/JPZlogolarge.svg" alt="Jyllands Park Zoo Logo" className="mb-4 mx-auto" style={{ width: '200px' }} />
        <h1 className="text-2xl font-bold mb-4 mochiy-pop-one-regular">Opret bruger</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Navn"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Adgangskode"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleRegister}
          className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600 mb-4 w-full"
        >
          Opret
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
        <button
          onClick={() => navigate('/')}
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600 w-full"
        >
          Tilbage
        </button>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/5 z-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom', backgroundSize: 'contain' }}></div>
      {showModal && <VerificationModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Register;
