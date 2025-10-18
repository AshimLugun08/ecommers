// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import emailjs from 'emailjs-com';

const firebaseConfig = {
  apiKey: "AIzaSyB8SVWdrCBLysXDIvpX1TAETNGe32SvO-0",
  authDomain: "iraxa-7f1b7.firebaseapp.com",
  projectId: "iraxa-7f1b7",
  storageBucket: "iraxa-7f1b7.firebasestorage.app",
  messagingSenderId: "490921326173",
  appId: "1:490921326173:web:bf42e329c03a94aeefffb4",
  measurementId: "G-6LZ9521CQM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_lh3dkt8',
  TEMPLATE_ID: 'template_9f9udc8', 
  USER_ID: 't4JkOzvFRHXRR4Isb'
};

export { auth, db, EMAILJS_CONFIG, emailjs };
export default app;