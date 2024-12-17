require('dotenv').config();

export const PORT = process.env.PORT || 5000

export const GIGAPIXEL_API_KEY = process.env.GIGAPIXEL_API_KEY
export const GIGAPIXEL_API_URL = 'https://api.topazlabs.com/v1/gigapixel/upscale'

export const DEEPART_API_URL = 'https://api.deepart.io/v1/artwork/'
export const DEEPART_API_KEY = process.env.DEEPART_API_KEY

export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET
export const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID 
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID
export const FIREBASE_MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID