import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// My Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAImNkGqHBscyLnKC3t5R9hqnb-ImbK_dU",
  authDomain: "moviewebsite-1ed1e.firebaseapp.com",
  projectId: "moviewebsite-1ed1e",
  storageBucket: "moviewebsite-1ed1e.appspot.com",
  messagingSenderId: "124903830281",
  appId: "1:124903830281:web:b47201fe7a9c1a0e9299d8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services
export { auth, db };
