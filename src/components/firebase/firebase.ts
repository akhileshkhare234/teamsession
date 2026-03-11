import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging} from "firebase/messaging";

console.log("Firebase configuration loaded");

// Your Firebase config (from the Firebase Console)

const firebaseConfig = { 
  apiKey: "AIzaSyCDcCcdfpbI4OJkJeiEfcw-3YFGJPVmvEg", 
  authDomain: "dev-team-session.firebaseapp.com", 
  projectId: "dev-team-session", 
  storageBucket: "dev-team-session.firebasestorage.app", 
  messagingSenderId: "308805737724", 
  appId: "1:308805737724:web:adf0f95528c25357874b79", 
  measurementId: "G-94SZELD24G" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { auth, app, messaging };
