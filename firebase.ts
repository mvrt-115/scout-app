// import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeApp} from 'firebase/app';
import {getFirestore, collection} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBVYgLi7CnBXVAo4aN0qFbRGFSozXiltHM",
  authDomain: "mvrt115-scout.firebaseapp.com",
  projectId: "mvrt115-scout",
  storageBucket: "mvrt115-scout.appspot.com",
  messagingSenderId: "161834372741",
  appId: "1:161834372741:web:21f42a585166e7479323ec"
}

// Initialize Firebase  
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const SEASON_YEAR = '2026';
export const dbCurYear = collection(db, `years`);
export const auth = getAuth(app);
export const storage = getStorage(app);