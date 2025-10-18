// Import the functions you need from the SDKs you need
import React from 'react'; // Don't forget to import React
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import App from './App'; // Import your main App component
import client from './apollo-client'; // Your Apollo Client setup
import { ApolloProvider } from '@apollo/client/react';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("Firebase app initialized!", app);

const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:${process.env.VITE_FIREBASE_AUTH_EMULATOR_PORT}");
console.log("Firebase Auth connected to emulator!");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element with ID "root". Please ensure public/index.html has <div id="root"></div>');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
