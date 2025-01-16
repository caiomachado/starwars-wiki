import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_CONFIG_API_KEY,
    authDomain: "starwars-wiki-71d1e.firebaseapp.com",
    projectId: "starwars-wiki-71d1e",
    storageBucket: "starwars-wiki-71d1e.firebasestorage.app",
    messagingSenderId: "108426456872",
    appId: "1:108426456872:web:b9f105111811736a7a2a1d"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };