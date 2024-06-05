import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import Modal from './Modal';
import FlokMemberProfileModal from './FlokMemberProfileModal';

const logo = '/images/JPZlogolarge.svg';
const addButtonIcon = '/images/addbutton.svg';
const backgroundImage = '/images/DyrBg/bg4.svg'; // Static background
const critters = '/images/critters.svg'; // Ensure this is defined
const settingsIcon = '/images/settingsicon.svg'; // Add the path to your settings icon

// List of available user icons
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

const FlokManagement = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const addButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'users', auth.currentUser.uid, 'flok'),
          orderBy('createdAt', 'asc')
        );
        const unsub = onSnapshot(q, (snapshot) => {
          setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsub();
      } else {
        console.log('User is not authenticated.');
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (addButtonRef.current) {
      addButtonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [members]);

  const handleAddMember = async () => {
    if (name === '') {
      setError('Please provide a valid name.');
      return;
    }

    // Select a random icon for the new member
    const assignedIcons = members.map(member => member.icon);
    const availableIcons = userIcons.filter(icon => !assignedIcons.includes(icon));
    const randomIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)];

    if (auth.currentUser) {
      try {
        const newMemberRef = await addDoc(collection(db, 'users', auth.currentUser.uid, 'flok'), {
          name,
          credits: 0, // Default credits to 0 or omit if not necessary
          createdAt: new Date(), // Adding a timestamp field
          icon: randomIcon // Assigning the random icon
        });
        setMembers([...members, { id: newMemberRef.id, name, credits: 0, createdAt: new Date(), icon: randomIcon }]);
        setName('');
        setSuccess('Member added successfully!');
        setError(null);
        setShowModal(false); // Close the modal
      } catch (error) {
        setError('Error adding member. Please try again.');
        setSuccess(null);
        console.error('Error adding document: ', error);
      }
    } else {
      setError('User is not authenticated.');
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'flok', memberId));
      setMembers(members.filter(member => member.id !== memberId));
      setSelectedMember(null);
    } catch (error) {
      setError('Error deleting member. Please try again.');
      console.error('Error deleting document: ', error);
    }
  };

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
      <div className="text-center mb-4 mt-2 md:mt-4">
        <img src={logo} alt="Jyllands Park Zoo Logo" className="mx-auto" style={{ width: '250px', marginRight: '40px' }} />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mochiy-pop-one-regular text-center mb-4" style={{ textShadow: '1px 1px 2px black' }}>
        Min flok
      </h1>

      <div className="flex flex-col flex-1 w-full items-center relative z-10">
        <div className="flex-1 w-full overflow-y-auto pb-52">
          {members.map((member, index) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className="flex items-center mb-4 cursor-pointer bg-white bg-opacity-91 shadow-lg p-1 rounded-full w-11/12 max-w-md mx-auto"
              style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <img src={member.icon} alt="User Icon" className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-1 ml-12">
                <p className="dynamic-font-size mochiy-pop-one-regular mb-4 mt-1" style={{ WebkitTextStroke: '0.5px black', textTransform: 'capitalize' }}>
                  {member.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-44 w-full flex justify-center z-20" ref={addButtonRef}>
          <button onClick={() => setShowModal(true)} className="bg-white text-black py-4 px-4 rounded-full shadow-md hover:bg-gray-200">
            <img src={addButtonIcon} alt="Add Button" className="w-10 h-10" />
          </button>
        </div>
      </div>
      {showModal && (
        <Modal>
          <div className="relative bg-white bg-opacity-95 rounded-3xl shadow-lg p-6 md:p-8 m-4 max-w-2xl w-full text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-2 left-2 text-2xl font-bold text-red-500 hover:text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 mochiy-pop-one-regular" style={{ textShadow: '2px 2px 2px black' }}>tilføj til flok!</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Navn"
              className="border p-2 rounded-full w-full mb-4"
              maxLength={20}
            />
            <button
              onClick={handleAddMember}
              className="text-green-500 border-2 border-green-500 py-2 px-6 rounded-md shadow-md hover:bg-green-100 mt-4 text-lg"
            >
              Tilføj
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-500 mt-2">{success}</div>}
          </div>
        </Modal>
      )}
      {selectedMember && (
        <FlokMemberProfileModal memberId={selectedMember} onClose={() => setSelectedMember(null)} handleDeleteMember={handleDeleteMember} />
      )}
      <BottomNav />
      {showSidebar && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-4">
          <button className="self-end mb-4" onClick={() => setShowSidebar(false)}>&times;</button>
          <ul>
            <li className="py-2 border-b" onClick={() => { /* Handle Hjælp */ }}>Hjælp</li>
            <li className="py-2 border-b" onClick={() => { /* Handle FAQ */ }}>FAQ</li>
            <li
              className="py-2 text-red-500"
              onClick={handleSignOut}
            >
              Log Ud
            </li>
          </ul>
        </div>
      )}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full h-1/5 z-0" style={{ backgroundImage: `url(${critters})`, backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom', backgroundSize: 'contain' }}></div>
    </div>
  );
};

export default FlokManagement;
