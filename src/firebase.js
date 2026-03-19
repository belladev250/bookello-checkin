// src/firebase/firebaseInit.js
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDzlNHDHHFtXMG8GrGGqiyIxsN860q5eck",
  authDomain: "bookello-checkin.firebaseapp.com",
  projectId: "bookello-checkin",
  storageBucket: "bookello-checkin.appspot.com", 
  messagingSenderId: "249907568610",
  appId: "1:249907568610:web:3ef5ad7fc9136bab0163bb",
  measurementId: "G-D8PC6SV0QS"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
