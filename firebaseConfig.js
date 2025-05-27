// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-QbAu6PLHMH9Zsn-kkiT77O43YuWYIZU",
    authDomain: "iconique-photos.firebaseapp.com",
    databaseURL: "https://iconique-photos-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iconique-photos",
    storageBucket: "iconique-photos.firebasestorage.app",
    messagingSenderId: "836163762350",
    appId: "1:836163762350:web:f4da1b13225a9d5d7b953f",
    measurementId: "G-H58RQTG805"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { database, firestore };