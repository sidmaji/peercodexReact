// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
// apiKey: "AIzaSyBUxtYV0JeWH8Pr_k6ZnQWD4MEjkTbJkkw",
// authDomain: "peercodexnext.firebaseapp.com",
// projectId: "peercodexnext",
// storageBucket: "peercodexnext.firebasestorage.app",
// messagingSenderId: "504849740566",
// appId: "1:504849740566:web:b921f71c01f2b5d6e29637"
// };

const firebaseConfig = {
    apiKey: 'AIzaSyCK_SC25tobvEgy1AaSf-yixl9KHrxYRzA',
    authDomain: 'peer-codex.firebaseapp.com',
    projectId: 'peer-codex',
    storageBucket: 'peer-codex.firebasestorage.app',
    messagingSenderId: '906455785777',
    appId: '1:906455785777:web:c10dbcc9075b89ee3a5010',
    measurementId: 'G-LG4F2CXYXC',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { auth, db }
