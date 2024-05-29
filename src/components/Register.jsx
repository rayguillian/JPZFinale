import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Save additional user information in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: new Date()
      });

      setSuccess('Registration successful! Please check your email for verification.');
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/liongirafbg.svg)' }}>
      <div className="text-center bg-white rounded-lg shadow-lg p-8 m-4 max-w-xs">
        <img src="/images/JPZlogolarge.svg" alt="Jyllands Park Zoo Logo" className="mb-4 mx-auto" style={{ width: '200px' }} />
        <h1 className="text-2xl font-bold mb-4 mochiy-pop-one-regular">Opret bruger</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Brugernavn"
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
    </div>
  );
};

export default Register;
