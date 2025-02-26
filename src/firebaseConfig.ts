import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_DSJ_p_yoPwKlkvQ4AAQQJDVkv4Va-SI",
  authDomain: "wanted-one-piece.firebaseapp.com",
  projectId: "wanted-one-piece",
  storageBucket: "wanted-one-piece.firebasestorage.app",
  messagingSenderId: "190987943032",
  appId: "1:190987943032:web:60d6804eb6815f35f5818d",
  measurementId: "G-4PK3XESFVZ"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);

// Initialiser Storage
export const storage = getStorage(app);