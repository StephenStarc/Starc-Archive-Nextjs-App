// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD_XqAQe1I22fCDPo1X25lGO0kjH-agvvQ",
    authDomain: "starc-archive.firebaseapp.com",
    projectId: "starc-archive",
    storageBucket: "starc-archive.appspot.com",
    messagingSenderId: "34098903204",
    appId: "1:34098903204:web:394786d0339301af018e31",
    measurementId: "G-9S9ME4E8VW"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };