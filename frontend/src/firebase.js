import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA5ykALQhtTbbFrvt40_BRz7s0mNI5Evng",
    authDomain: "medraga-2efba.firebaseapp.com",
    projectId: "medraga-2efba",
    storageBucket: "medraga-2efba.firebasestorage.app",
    messagingSenderId: "435447224066",
    appId: "1:435447224066:web:863afe91f871992fe5d41b"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);