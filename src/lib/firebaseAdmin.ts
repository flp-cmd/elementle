import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK with environment variables for Vercel deployment
const serviceAccount = {
  type: "service_account",
  project_id: process.env.SECRET_FIREBASE_PROJECT_ID,
  private_key_id: process.env.SECRET_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.SECRET_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.SECRET_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.SECRET_FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.SECRET_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};

// Debug environment variables
console.log("Firebase Admin Environment Variables Debug:");
console.log(
  "SECRET_FIREBASE_PROJECT_ID:",
  process.env.SECRET_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "SECRET_FIREBASE_PRIVATE_KEY_ID:",
  process.env.SECRET_FIREBASE_PRIVATE_KEY_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "SECRET_FIREBASE_PRIVATE_KEY:",
  process.env.SECRET_FIREBASE_PRIVATE_KEY ? "✅ Set" : "❌ Missing"
);
console.log(
  "SECRET_FIREBASE_CLIENT_EMAIL:",
  process.env.SECRET_FIREBASE_CLIENT_EMAIL ? "✅ Set" : "❌ Missing"
);
console.log(
  "SECRET_FIREBASE_CLIENT_ID:",
  process.env.SECRET_FIREBASE_CLIENT_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "SECRET_FIREBASE_CLIENT_X509_CERT_URL:",
  process.env.SECRET_FIREBASE_CLIENT_X509_CERT_URL ? "✅ Set" : "❌ Missing"
);

// Log service account object (without sensitive data)
console.log("Service Account Config:", {
  type: serviceAccount.type,
  project_id: serviceAccount.project_id,
  private_key_id: serviceAccount.private_key_id ? "✅ Set" : "❌ Missing",
  private_key: serviceAccount.private_key ? "✅ Set" : "❌ Missing",
  client_email: serviceAccount.client_email,
  client_id: serviceAccount.client_id,
  auth_uri: serviceAccount.auth_uri,
  token_uri: serviceAccount.token_uri,
  auth_provider_x509_cert_url: serviceAccount.auth_provider_x509_cert_url,
  client_x509_cert_url: serviceAccount.client_x509_cert_url,
  universe_domain: serviceAccount.universe_domain,
});

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as Record<string, unknown>),
        projectId: process.env.SECRET_FIREBASE_PROJECT_ID,
      })
    : getApps()[0];

const db = getFirestore(app);

export { db };
