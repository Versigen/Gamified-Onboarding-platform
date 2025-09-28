import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration - using demo values for development
// In production, these would come from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyD-miFh4GwX9pd1v5-MGvlBBMSFuxxw7T4",
  authDomain: "agelessbicyclists-app.firebaseapp.com",
  projectId: "agelessbicyclists-app",
  storageBucket: "agelessbicyclists-app.firebasestorage.app",
  messagingSenderId: "731562564675",
  appId: "1:731562564675:web:5dd406f614ea3a2f2048f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app