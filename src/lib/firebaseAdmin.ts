import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Check if the base64 service account environment variable is set
if (!process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_BASE64) {
  throw new Error(
    "SECRET_SERVICE_ACCOUNT_BASE64 environment variable is not set"
  );
}

const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.SECRET_FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString()
);

// Debug: Check if private_key exists and has proper format
console.log("Service Account Debug:");
console.log("Has private_key:", !!serviceAccount.private_key);
console.log(
  "Private key starts with:",
  serviceAccount.private_key?.substring(0, 30)
);
console.log("Private key ends with:", serviceAccount.private_key?.slice(-30));
console.log("Private key length:", serviceAccount.private_key?.length);

// Fix private_key format if needed
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as Record<string, unknown>),
        projectId: process.env.SECRET_FIREBASE_PROJECT_ID,
      })
    : getApps()[0];

const db = getFirestore(app);

export { db };
