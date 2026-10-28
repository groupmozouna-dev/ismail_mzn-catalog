import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7jguoawdO6hjLLGyrkWZAnLGpf1N65Ic",
  authDomain: "mozouna-catalog.firebaseapp.com",
  projectId: "mozouna-catalog",
  storageBucket: "mozouna-catalog.firebasestorage.app",
  messagingSenderId: "1002870132256",
  appId: "1:1002870132256:web:bbf974032eeaa1de7cf645",
  measurementId: "G-8175V015KK"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

window.firebaseDB = db;
window.firebaseAuth = auth;

console.log("Firebase connected successfully");
getDocs(collection(db, "products"))
  .then((snapshot) => {
      console.log("Firestore connected. Products:", snapshot.size);
  })
  .catch((error) => {
    console.error("Firestore error:", error.code, error.message);
  });
