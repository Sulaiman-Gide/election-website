import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDaHrWrEVVedbrfigYhzNTqZzJFk-_9C6o",
  authDomain: "election-544c8.firebaseapp.com",
  projectId: "election-544c8",
  storageBucket: "election-544c8.appspot.com",
  messagingSenderId: "173518600803",
  appId: "1:173518600803:web:331058308a61686b329656",
  measurementId: "G-P3WQNC5T7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app); 