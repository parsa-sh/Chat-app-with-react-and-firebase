import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA67bViTgB7Vf-UTpS-KY95SVQH-rnOq2w",
  authDomain: "chat-app-8094d.firebaseapp.com",
  projectId: "chat-app-8094d",
  storageBucket: "chat-app-8094d.appspot.com",
  messagingSenderId: "870764060530",
  appId: "1:870764060530:web:dfc272559fcba8d85907eb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
