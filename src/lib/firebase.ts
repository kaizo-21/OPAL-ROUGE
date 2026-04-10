import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCsyAPGWVzuqH-ZSq-zWAT9gdqbmCgdmcg",
  authDomain: "opal-rouge.firebaseapp.com",
  projectId: "opal-rouge",
  storageBucket: "opal-rouge.firebasestorage.app",
  messagingSenderId: "580738002347",
  appId: "1:580738002347:web:6f1b371766c7a1504e36ee",
  measurementId: "G-VPYVRD8522",
};

// Initialize Firebase (prevent re-initialization in dev mode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (client-side only)
export const analytics = typeof window !== "undefined" ? isSupported().then((yes) => (yes ? getAnalytics(app) : null)) : null;

export default app;
