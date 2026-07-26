// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWuxOQvOjm7aLQ4CgjlxEaFQfSqGt2tSI",
  authDomain: "scango-mart.firebaseapp.com",
  projectId: "scango-mart",
  storageBucket: "scango-mart.firebasestorage.app",
  messagingSenderId: "136815626749",
  appId: "1:136815626749:web:de2199b9dc8a15c4b0b194",
};

// Prevent re-initializing on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
