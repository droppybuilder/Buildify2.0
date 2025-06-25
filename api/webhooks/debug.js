// Webhook debugging and testing endpoint

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, webhook-id, webhook-signature, webhook-timestamp');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('🔍 WEBHOOK DEBUG - Request received:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  if (req.method === 'GET') {
    // Return webhook debugging information
    return res.status(200).json({
      success: true,
      message: 'Webhook endpoint is accessible',
      debug_info: {
        timestamp: new Date().toISOString(),
        method: req.method,
        headers_received: Object.keys(req.headers),
        webhook_key_configured: !!process.env.DODO_WEBHOOK_KEY,
        webhook_key_preview: process.env.DODO_WEBHOOK_KEY ? 
          `${process.env.DODO_WEBHOOK_KEY.substring(0, 10)}...` : 'NOT SET',
        environment: {
          node_env: process.env.NODE_ENV,
          vercel_url: process.env.VERCEL_URL,
          base_url: process.env.BASE_URL,
        },
        expected_webhook_headers: [
          'webhook-id',
          'webhook-signature', 
          'webhook-timestamp'
        ]
      }
    });
  }

  if (req.method === 'POST') {
    // Log the webhook attempt for debugging
    console.log('🎯 WEBHOOK DEBUG - POST request:', {
      headers: {
        'webhook-id': req.headers['webhook-id'],
        'webhook-timestamp': req.headers['webhook-timestamp'],
        'webhook-signature': req.headers['webhook-signature'] ? 'PRESENT' : 'MISSING',
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
      },
      body_type: typeof req.body,
      body_size: JSON.stringify(req.body).length,
      body_preview: JSON.stringify(req.body).substring(0, 500),
      raw_body: req.body
    });

    // Verify webhook key is configured
    if (!process.env.DODO_WEBHOOK_KEY) {
      console.error('❌ WEBHOOK DEBUG - No webhook key configured');
      return res.status(500).json({
        success: false,
        error: 'Webhook key not configured',
        debug: 'DODO_WEBHOOK_KEY environment variable is missing'
      });
    }

    // Check required headers
    const requiredHeaders = ['webhook-id', 'webhook-signature', 'webhook-timestamp'];
    const missingHeaders = requiredHeaders.filter(header => !req.headers[header]);
    
    if (missingHeaders.length > 0) {
      console.error('❌ WEBHOOK DEBUG - Missing headers:', missingHeaders);
      return res.status(400).json({
        success: false,
        error: 'Missing required webhook headers',
        missing_headers: missingHeaders,
        debug: 'DODO Payments requires webhook-id, webhook-signature, and webhook-timestamp headers'
      });
    }

    // Try to verify the webhook (but don't fail if verification fails in debug mode)
    try {
      const { Webhook } = require("standardwebhooks");
      const webhook = new Webhook(process.env.DODO_WEBHOOK_KEY);
      
      const rawBody = JSON.stringify(req.body);
      const webhookHeaders = {
        "webhook-id": req.headers["webhook-id"] || "",
        "webhook-signature": req.headers["webhook-signature"] || "",
        "webhook-timestamp": req.headers["webhook-timestamp"] || "",
      };

      await webhook.verify(rawBody, webhookHeaders);
      console.log('✅ WEBHOOK DEBUG - Signature verification successful');
      
      return res.status(200).json({
        success: true,
        message: 'Webhook received and verified successfully',
        debug_info: {
          verification: 'PASSED',
          payload_type: req.body?.type,
          payment_id: req.body?.data?.payment_id || req.body?.payment_id,
          timestamp: new Date().toISOString(),
          headers_present: Object.keys(req.headers).filter(h => h.startsWith('webhook-'))
        },
        payload: req.body
      });
      
    } catch (verificationError) {
      console.error('❌ WEBHOOK DEBUG - Signature verification failed:', verificationError.message);
      
      return res.status(400).json({
        success: false,
        error: 'Webhook signature verification failed',
        details: verificationError.message,
        debug_info: {
          verification: 'FAILED',
          webhook_key_length: process.env.DODO_WEBHOOK_KEY?.length,
          headers_received: webhookHeaders,
          body_length: JSON.stringify(req.body).length,
          suggestion: 'Check if DODO_WEBHOOK_KEY matches the one in your DODO dashboard'
        }
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
