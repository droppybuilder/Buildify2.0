// API to fetch webhook logs from Firebase
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
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 50, days = 7 } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    console.log('Fetching webhook logs from Firebase...');
    
    // Fetch webhook logs from Firebase
    const logsRef = db.collection('webhook_logs');
    const snapshot = await logsRef
      .where('timestamp', '>=', startDate.toISOString())
      .where('timestamp', '<=', endDate.toISOString())
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();

    const logs = [];
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Calculate stats
    const stats = {
      total: logs.length,
      succeeded: logs.filter(log => log.event_type?.includes('succeeded') || log.event_type?.includes('completed')).length,
      failed: logs.filter(log => log.event_type?.includes('failed') || log.event_type?.includes('declined')).length,
      cancelled: logs.filter(log => log.event_type?.includes('cancelled') || log.event_type?.includes('canceled')).length,
      other: logs.filter(log => !log.event_type || (!log.event_type.includes('succeeded') && !log.event_type.includes('completed') && !log.event_type.includes('failed') && !log.event_type.includes('declined') && !log.event_type.includes('cancelled') && !log.event_type.includes('canceled'))).length,
      events_by_type: {}
    };

    // Count events by type
    logs.forEach(log => {
      const eventType = log.event_type || 'unknown';
      stats.events_by_type[eventType] = (stats.events_by_type[eventType] || 0) + 1;
    });

    console.log(`Found ${logs.length} webhook logs`);

    return res.status(200).json({
      success: true,
      logs: logs,
      stats: stats,
      query: {
        limit: parseInt(limit),
        days: parseInt(days),
        date_range: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Failed to fetch webhook logs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch webhook logs',
      details: error.message
    });
  }
}
