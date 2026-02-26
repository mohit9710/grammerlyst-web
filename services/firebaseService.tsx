import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDB8VTGzTvzXC8hTaKQGCTC4t6hBYwpxso",
  authDomain: "grammrlyst-b3b71.firebaseapp.com",
  projectId: "grammrlyst-b3b71",
  storageBucket: "grammrlyst-b3b71.firebasestorage.app",
  messagingSenderId: "439163188594",
  appId: "1:439163188594:web:7e88540809f82f65b319eb",
  measurementId: "G-NYK8YEMKXE",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let analytics: Analytics | null = null;

// ✅ async init properly
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && !analytics) {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  }
  return analytics;
};

export { app };