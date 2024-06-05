import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import CreditPurchaseModal from './CreditPurchaseModal';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../stripe'; 

const logo = '/images/JPZlogolarge.svg';
const tokenIcon = '/images/token_icon.svg';
const backgroundImage = '/images/DyrBg/bg1.svg';
const settingsIcon = '/images/settingsicon.svg';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [flok, setFlok] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const creditsDivRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();
      setUser({
        ...userData,
        name: userData.name || auth.currentUser.displayName,
      });
      setCredits(userData.credits || 0);

      const q = query(collection(db, 'users', auth.currentUser.uid, 'flok'));
      const unsub = onSnapshot(q, (snapshot) => {
        setFlok(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsub();
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    if (creditsDivRef.current) {
      creditsDivRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [creditsDivRef]);

  const handleSignOut = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-cover bg-center p-4" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute top-6 right-6">
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
          <img
            src={settingsIcon}
            alt="Settings Icon"
            className="cursor-pointer"
            style={{ width: '100%', height: '100%' }}
            onClick={() => setShowSidebar(!showSidebar)}
          />
        </div>
      </div>
      <div className="text-center relative mb-4 mt-2 md:mt-4">
        <img src={logo} alt="Jyllands Park Zoo Logo" className="mx-auto" style={{ width: '250px', marginRight: '40px' }} />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mochiy-pop-one-regular text-center mb-4" style={{ textShadow: '1px 1px 2px black' }}>
        Hej {user?.name?.split(' ')[0] || ''}!
      </h1>
      <div ref={creditsDivRef} className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-6 md:p-8 m-4 max-w-2xl w-full text-center mb-20">
        <div className="relative flex flex-col items-center mb-6">
          <div className="absolute -top-12">
            <img src={user?.icon} alt="User Icon" className="w-24 h-24 rounded-full bg-custom-bg" />
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold mt-14 mochiy-pop-one-regular mb-4">Credits:</h2>
          <div className="flex items-center justify-center text-7xl md:text-9xl font-bold mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '100' }}>
            {credits}
            <img src={tokenIcon} alt="Token Icon" className="w-14 h-14 md:w-20 md:h-20 ml-4 animate-float" />
          </div>
          <button onClick={() => setShowModal(true)} className="bg-transparent border-2 border-green-500 text-green-500 py-2 px-4 md:py-3 md:px-6 rounded-md shadow-md hover:bg-green-500 hover:text-white mt-4 text-lg">
            Tank Op
          </button>
        </div>
      </div>
      <BottomNav />
      {showModal && (
        <Elements stripe={stripePromise}>
          <CreditPurchaseModal onClose={() => setShowModal(false)} />
        </Elements>
      )}
      {showSidebar && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-4">
          <button className="self-end mb-4" onClick={() => setShowSidebar(false)}>&times;</button>
          <ul>
            <li className="py-2 border-b" onClick={() => { /* Handle Hjælp */ }}>Hjælp</li>
            <li className="py-2 border-b" onClick={() => { /* Handle FAQ */ }}>FAQ</li>
            <li className="py-2 text-red-500" onClick={handleSignOut}>Log Ud</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
