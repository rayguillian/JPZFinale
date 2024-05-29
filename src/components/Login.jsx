import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-yellow-200">
      <div className="text-center bg-white rounded-lg shadow-lg p-8 m-4 max-w-xs">
        <img src="/path/to/logo.png" alt="Jyllands Park Zoo Logo" className="mb-4 mx-auto" style={{width: '200px'}} />
        <h1 className="text-2xl font-bold mb-2">Velkommen til</h1>
        <h2 className="text-xl mb-4">Vi er glade for at se dig!</h2>
        <button 
          onClick={signInWithGoogle} 
          className="bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600 mb-4 w-full"
        >
          Login
        </button>
        <button 
          className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600 w-full"
        >
          Opret
        </button>
      </div>
    </div>
  );
};

export default Login;
