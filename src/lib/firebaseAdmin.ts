import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../elementle-firebase-adminsdk.json";

// Initialize Firebase Admin SDK
const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as Record<string, unknown>),
        projectId: serviceAccount.project_id,
      })
    : getApps()[0];

const db = getFirestore(app);

export { db };
