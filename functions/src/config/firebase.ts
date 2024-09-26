// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { env } from './env.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig: FirebaseOptions = {
    apiKey: env.F_API_KEY,
    authDomain: env.F_AUTH_DOMAIN,
    projectId: env.F_PROJECT_ID,
    storageBucket: env.F_STORAGE_BUCKET,
    messagingSenderId: env.F_MESSAGING_SENDER_ID,
    appId: env.F_APP_ID,
    measurementId: env.F_MEASUREMENT_ID,
    databaseURL: env.F_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const database = getDatabase(app);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storage = getStorage(app);

export { database, firebaseConfig, storage };
