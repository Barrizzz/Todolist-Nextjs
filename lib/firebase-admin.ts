import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const sdkKeyEnv = process.env.FIREBASE_ADMIN_SDK_KEY;
let isInitialized = false;

if (!admin.apps.length) {
  if (sdkKeyEnv) {
    try {
      const serviceAccount = JSON.parse(sdkKeyEnv);

      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      console.log("Firebase Admin successfully initialized using single JSON string.");
      isInitialized = true;
    } catch (error) {
      console.error("Failed to parse FIREBASE_ADMIN_SDK_KEY JSON string:", error);
    }
  } else {
    console.warn("FIREBASE_ADMIN_SDK_KEY is missing. Skipping initialization (expected during build time).");
  }
} else {
  isInitialized = true;
}

export const adminAuth = isInitialized && admin.apps.length ? getAuth() : null;
export const adminDb = isInitialized && admin.apps.length ? admin.firestore() : null;