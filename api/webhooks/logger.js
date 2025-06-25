// Enhanced webhook event logger for debugging
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}
const db = getFirestore();

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  
  // Log all webhook attempts regardless of method or validity
  console.log('🚨 WEBHOOK EVENT LOGGER - Raw request:', {
    timestamp,
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  // Store webhook attempt in Firebase for analysis
  try {
    await db.collection('webhook_logs').add({
      timestamp,
      method: req.method,
      headers: {
        'webhook-id': req.headers['webhook-id'] || null,
        'webhook-signature': req.headers['webhook-signature'] ? 'PRESENT' : 'MISSING',
        'webhook-timestamp': req.headers['webhook-timestamp'] || null,
        'content-type': req.headers['content-type'] || null,
        'user-agent': req.headers['user-agent'] || null,
        'x-forwarded-for': req.headers['x-forwarded-for'] || null,
      },
      body: req.body || null,
      event_type: req.body?.type || 'unknown',
      payment_id: req.body?.data?.payment_id || req.body?.payment_id || null,
      raw_request: {
        url: req.url,
        method: req.method,
        query: req.query
      }
    });
  } catch (error) {
    console.error('Failed to log webhook event:', error);
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, webhook-id, webhook-signature, webhook-timestamp');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return success for any request (so DODO doesn't retry)
  return res.status(200).json({ 
    received: true, 
    logged: true,
    timestamp,
    message: 'Event logged successfully'
  });
}
