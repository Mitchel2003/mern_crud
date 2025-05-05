export const baseFrontendUrl = import.meta.env.VITE_NODE_ENV === 'production' ? 'https://mern-crud-three-lemon.vercel.app' : 'http://localhost:5173'
export const baseUrl = import.meta.env.VITE_NODE_ENV === 'production' ? 'https://rest-api-qvo9.onrender.com/api' : 'http://localhost:4000/api'

export default {
  nodeEnv: import.meta.env.VITE_NODE_ENV,
  vapidKey: import.meta.env.VITE_VAPID_KEY,
  frontendUrl: import.meta.env.VITE_FRONTEND_URL,

  //firebase config
  firebaseConfig: {
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  }
}