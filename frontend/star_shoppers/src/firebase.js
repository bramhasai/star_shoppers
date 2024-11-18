import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for sellers
const sellerFirebaseConfig = {
  apiKey: "AIzaSyCHVOlqiWm1z-M_2PB2vOc4EJ5nI6Z4vzk",
  authDomain: "star-sellers.firebaseapp.com",
  projectId: "star-sellers",
  storageBucket: "star-sellers.firebasestorage.app",
  messagingSenderId: "588232697167",
  appId: "1:588232697167:web:d5dd4135e9211e55b1513a"
};

// Firebase configuration for shoppers
const shopperFirebaseConfig = {
  apiKey: "AIzaSyCrRc7MZkNDr0V0hVjWhdfnF0Tb_Xh98Ak",
  authDomain: "star-shoppers.firebaseapp.com",
  projectId: "star-shoppers",
  storageBucket: "star-shoppers.firebasestorage.app",
  messagingSenderId: "735469605285",
  appId: "1:735469605285:web:5fdae3c8e4093e29de584c"
};

const appSeller = initializeApp(sellerFirebaseConfig, "seller");
const appShopper = initializeApp(shopperFirebaseConfig, "shopper");

//sellers
export const authSeller = getAuth(appSeller);
export const firestoreSeller = getFirestore(appSeller);

//shoppers
export const authShopper = getAuth(appShopper);
export const firestoreShopper = getFirestore(appShopper);
