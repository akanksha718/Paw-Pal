// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "daa-pbl-388fb.firebaseapp.com",
  databaseURL: "https://daa-pbl-388fb-default-rtdb.firebaseio.com",
  projectId: "daa-pbl-388fb",
  storageBucket: "daa-pbl-388fb.firebasestorage.app",
  messagingSenderId: "288869132235",
  appId: "1:288869132235:web:3a1a0c785758f1557bf84e",
  measurementId: "G-MQS8V8ZKH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);