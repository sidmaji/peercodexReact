// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // optional, only for production
};

// const firebaseConfig = {
//     apiKey: 'AIzaSyCK_SC25tobvEgy1AaSf-yixl9KHrxYRzA',
//     authDomain: 'peer-codex.firebaseapp.com',
//     projectId: 'peer-codex',
//     storageBucket: 'peer-codex.firebasestorage.app',
//     messagingSenderId: '906455785777',
//     appId: '1:906455785777:web:c10dbcc9075b89ee3a5010',
//     measurementId: 'G-LG4F2CXYXC',
// }

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { auth, db }
