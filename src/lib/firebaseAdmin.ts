import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Check if the Firebase service account JSON environment variable is set
if (!process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error(
    "SECRET_FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set"
  );
}

const serviceAccount = JSON.parse(
  process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_JSON
);

if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as Record<string, unknown>),
        projectId: serviceAccount.project_id,
      })
    : getApps()[0];

const db = getFirestore(app);

export { db };
