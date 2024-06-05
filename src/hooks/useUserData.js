// src/hooks/useUserData.js
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const useUserData = () => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0); // Initialize credits to 0
  const [flok, setFlok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...userData,
              name: userData.name || authUser.displayName,
            });
            setCredits(userData.credits ?? 0); // Ensure credits are set, default to 0 if undefined
          } else {
            setError('User data not found.');
          }

          const q = query(collection(db, 'users', authUser.uid, 'flok'));
          const unsub = onSnapshot(q, (snapshot) => {
            setFlok(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          });

          return () => unsub();
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('User is not authenticated.');
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, credits, flok, loading, error };
};

export default useUserData;
