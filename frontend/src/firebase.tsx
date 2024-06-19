// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVRTHGW49kugvUufnzMyEL9NiRFRtRYfA",
  authDomain: "auth399.firebaseapp.com",
  projectId: "auth399",
  storageBucket: "auth399.appspot.com",
  messagingSenderId: "27579778870",
  appId: "1:27579778870:web:463b833571f8fac6165597",
  measurementId: "G-FLHY4EJL0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const getCurrentFirebaseEmail = (): string | null => {
  const user = auth.currentUser;
  if (user && user.email) {
    return user.email;
  } else {
    return null;
  }
}
export default app;