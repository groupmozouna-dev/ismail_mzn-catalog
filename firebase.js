import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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

const ADMIN_UID = "4h8vDZ4RXbOgdxxbVC0W76GcIyD2";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.firebaseDB = db;
window.firebaseAuth = auth;

window.mozounaAdmin = {
  login: async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    if (result.user.uid !== ADMIN_UID) {
      await signOut(auth);
      throw new Error("هذا الحساب ليس لديه صلاحية الإدارة.");
    }

    return result.user;
  },

  logout: () => signOut(auth),

  getUser: () => auth.currentUser,

  loadProducts: async () => {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));
  },

  saveProduct: async (product) => {
    if (auth.currentUser?.uid !== ADMIN_UID) {
      throw new Error("غير مسموح");
    }

    const data = {
      name: product.name,
      category: product.category,
      price: Number(product.price),
      min: Number(product.min),
      image: product.image,
      updatedAt: serverTimestamp()
    };

    if (product.id) {
      await updateDoc(doc(db, "products", product.id), data);
      return product.id;
    }

    const result = await addDoc(collection(db, "products"), {
      ...data,
      createdAt: serverTimestamp()
    });

    return result.id;
  },

  deleteProduct: async (id) => {
    if (auth.currentUser?.uid !== ADMIN_UID) {
      throw new Error("غير مسموح");
    }

    await deleteDoc(doc(db, "products", id));
  }
};

onAuthStateChanged(auth, user => {
  window.dispatchEvent(new CustomEvent("mozouna-auth", {
    detail: {
      isAdmin: !!user && user.uid === ADMIN_UID
    }
  }));
});

console.log("MOZOUNA Firebase ready");
