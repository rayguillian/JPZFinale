import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [flok, setFlok] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      setUser(userDoc.data());
      setCredits(userDoc.data().credits);

      const q = query(collection(db, 'users', auth.currentUser.uid, 'flok'));
      const unsub = onSnapshot(q, (snapshot) => {
        setFlok(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsub();
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, [auth.currentUser]);

  const handleSignOut = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={handleSignOut} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600">Sign Out</button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.name}</h2>
        <p className="text-lg">Credits: <span className="font-bold">{credits}</span></p>
        <button onClick={() => navigate('/purchase')} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 mt-4">Purchase Credits</button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Flok Members</h3>
        <button onClick={() => navigate('/flok')} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600">Manage Flok</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flok.length > 0 ? flok.map(member => (
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
        )) : <p className="text-gray-500">No members found. Click "Manage Flok" to add members.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
