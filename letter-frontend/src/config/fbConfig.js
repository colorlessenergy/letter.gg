/**
 * config file for firebase setup
 */
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAjBEIByVN-1qKH0iS4QL0QeL2hy8SlpZM",
  authDomain: "letter-gg.firebaseapp.com",
  databaseURL: "https://letter-gg.firebaseio.com",
  projectId: "letter-gg",
  storageBucket: "letter-gg.appspot.com",
  messagingSenderId: "757762735671",
  appId: "1:757762735671:web:25454aabfea2322f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initialize firestore 
firebase.firestore();

export default firebase;