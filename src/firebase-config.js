import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAO1i2KxsfzKH00bCC5K9Gf3xhE8Yb4NSY",
    authDomain: "blogproject-c9a92.firebaseapp.com",
    projectId: "blogproject-c9a92",
    storageBucket: "blogproject-c9a92.appspot.com",
    messagingSenderId: "555563549449",
    appId: "1:555563549449:web:efff9d9f5adf6f196389d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getFirestore(app);

export { auth, provider, database, collection, doc, setDoc, getDoc };