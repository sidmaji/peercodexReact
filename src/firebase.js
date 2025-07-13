// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUxtYV0JeWH8Pr_k6ZnQWD4MEjkTbJkkw",
  authDomain: "peercodexnext.firebaseapp.com",
  projectId: "peercodexnext",
  storageBucket: "peercodexnext.firebasestorage.app",
  messagingSenderId: "504849740566",
  appId: "1:504849740566:web:b921f71c01f2b5d6e29637"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
