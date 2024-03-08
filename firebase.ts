import firebase from 'firebase/app';
//require('firebase/auth'); //FIxes the issue for some reason
import 'firebase/firestore';
import 'firebase/storage';

//import 'firebase/firestore';
//import 'firebase/storage';
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
const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
//export const auth = firebase.auth();
export const storage = app.storage();
export default firebase;