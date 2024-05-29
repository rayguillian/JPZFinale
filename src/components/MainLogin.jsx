import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithEmailAndPassword } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

// Image paths
const logo = '/images/JPZlogolarge.svg';

const MainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
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

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/liongirafbg.svg)' }}>
      <img src={logo} alt="Jyllands Park Zoo Logo" className="mb-4" style={{ width: '250px' }} />
      <h1 className="text-4xl font-bold mb-2 mochiy-pop-one-regular">Velkommen til</h1>
      <h2 className="text-2xl mb-6 mochiy-pop-one-regular">Vi er glade for at se dig!</h2>
      <div className="text-center bg-white bg-opacity-75 rounded-lg shadow-lg p-8 m-4 max-w-xs">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Brugernavn"
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
          className="bg-transparent border-2 border-green-500 text-green-500 py-2 px-4 rounded-full shadow-md hover:bg-green-500 hover:text-white mb-4 w-full"
        >
          Login
        </button>
        <button 
          onClick={signInWithGoogle}
          className="bg-transparent border-2 border-blue-500 text-blue-500 py-2 px-4 rounded-full shadow-md hover:bg-blue-500 hover:text-white w-full"
        >
          Login with Google
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default MainLogin;
