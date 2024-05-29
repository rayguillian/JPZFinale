import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCfTz4-voBoAymm9whPJeUWynX4oAljI4U",
  authDomain: "zoozoo-56dbd.firebaseapp.com",
  projectId: "zoozoo-56dbd",
  storageBucket: "zoozoo-56dbd.appspot.com",
  messagingSenderId: "306768274300",
  appId: "1:306768274300:web:466837da2af49ff793baf9",
  measurementId: "G-0R6M8EGHNH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, provider, db, functions, signInWithEmailAndPassword };
