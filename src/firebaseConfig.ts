// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUiopxSFWv7GePQ0QyduGKwZgMDobQND4",
    authDomain: "bhis-d1e2b.firebaseapp.com",
    // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bhis-d1e2b.web.app",
    projectId: "bhis-d1e2b",
    storageBucket: "bhis-d1e2b.firebasestorage.app",
    messagingSenderId: "815175833497",
    appId: "1:815175833497:web:6475604c8c7f1f4832a508",
    measurementId: "G-7ZX4ZTY2FX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, Timestamp, serverTimestamp };