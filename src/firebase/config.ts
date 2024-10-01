// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2wE5a3nDQ292GSeHcwc1qaNftPZk92VI",
  authDomain: "astro-authentication-65590.firebaseapp.com",
  projectId: "astro-authentication-65590",
  storageBucket: "astro-authentication-65590.appspot.com",
  messagingSenderId: "519702988893",
  appId: "1:519702988893:web:5d4affce78f458a6fda5b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = 'es';

export const firebase = {
    app,
    auth
}