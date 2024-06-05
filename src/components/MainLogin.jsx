import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import VerificationModal from './VerificationModal';

const logo = '/images/JPZlogolarge.svg';
const critters = '/images/critters.svg';
const backgroundImage = '/images/DyrBg/bg5.svg'; // Static background for this component

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

const MainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const capitalizeFirstName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getRandomUserIcon = () => {
    const randomIcon = userIcons[Math.floor(Math.random() * userIcons.length)];
    return randomIcon;
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const firstName = capitalizeFirstName(user.displayName.split(' ')[0]);
        const userIcon = getRandomUserIcon();
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { name: firstName, email: user.email, icon: userIcon }, { merge: true });
        }
        navigate('/dashboard');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleRegister = () => {
    const firstName = capitalizeFirstName(name);
    const userIcon = getRandomUserIcon();
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await sendEmailVerification(user);
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { name: firstName, email, icon: userIcon }, { merge: true });
        setShowModal(true);
        setName('');
        setEmail('');
        setPassword('');
        setIsRegistering(false);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="relative flex flex-col items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Adjusted margin to move content up */}
      <div className="text-center relative mb-2 mt-10">
        <h1 className="text-4xl font-bold mochiy-pop-one-regular text-white" style={{ textShadow: '1px 1px 2px black' }}>
          Velkommen til
        </h1>
        {/* Adjusted margin to move logo */}
        <img src={logo} alt="Jyllands Park Zoo Logo" className="mt-2 mx-auto" style={{ width: '250px' , marginLeft: '15px'}} />
      </div>
      <h2 className="text-2xl mb-2 mochiy-pop-one-regular text-white" style={{ textShadow: '1px 1px 2px black' }}>
        Vi er glade for at se dig!
      </h2>
      <div className="text-center bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 m-2 max-w-xs z-10">
        {isRegistering ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Navn"
              className="border p-2 rounded w-full mb-4"
              maxLength={20} // Set maximum length to 20 characters
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kodeord"
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleRegister}
              className="bg-transparent border-2 border-green-500 text-green-500 py-2 px-4 rounded-full shadow-md hover:bg-green-500 hover:text-white mb-2 w-full"
            >
              Opret
            </button>
            <button
              onClick={() => setIsRegistering(false)}
              className="bg-transparent border-2 border-red-500 text-red-500 py-2 px-4 rounded-full shadow-md hover:bg-red-500 hover:text-white w-full"
            >
              Tilbage
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kodeord"
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleLogin}
              className="bg-transparent border-2 border-green-500 text-green-500 py-2 px-4 rounded-full shadow-md hover:bg-green-500 hover:text-white mb-2 w-full"
            >
              Login
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              className="bg-transparent border-2 border-yellow-500 text-yellow-500 py-2 px-4 rounded-full shadow-md hover:bg-yellow-500 hover:text-white mb-2 w-full"
            >
              Opret
            </button>
            <button
              onClick={signInWithGoogle}
              className="bg-transparent border-2 border-blue-500 text-blue-500 py-2 px-4 rounded-full shadow-md hover:bg-blue-500 hover:text-white w-full"
            >
              Login med Google
            </button>
          </>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/5 z-0" style={{ backgroundImage: `url(${critters})`, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom', backgroundSize: 'contain' }}></div>
      {showModal && <VerificationModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MainLogin;
