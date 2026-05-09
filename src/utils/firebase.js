import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyBXHuBAegTdYbd5QExRpVNI4B2FJKsx57g",
  authDomain:        "task-5c456.firebaseapp.com",
  projectId:         "task-5c456",
  storageBucket:     "task-5c456.firebasestorage.app",
  messagingSenderId: "354217797565",
  appId:             "1:354217797565:web:8130e59356b2ad73af54d4"
}

const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)
export default app