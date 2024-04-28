import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCcwR5Cnk7rvZwCP1vAz3LVpQII5UqkknQ",
  authDomain: "election-5310e.firebaseapp.com",
  projectId: "election-5310e",
  storageBucket: "election-5310e.appspot.com",
  messagingSenderId: "1097453696141",
  appId: "1:1097453696141:web:a0f9b7bdfc6b7c3e759ec4",
  measurementId: "G-29DMZH731Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app); 