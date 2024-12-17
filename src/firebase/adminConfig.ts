import admin from 'firebase-admin';
import path from 'path';
import { FIREBASE_STORAGE_BUCKET } from '../services/utils/constants';

const serviceAccountPath = path.resolve(__dirname, '../../path-to-locaation-of-service-account');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

export const adminAuth = admin.auth();
export const adminStorage = admin.storage().bucket();