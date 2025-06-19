// Test webhook endpoint directly
import fetch from 'node-fetch';
import crypto from 'crypto';

const BASE_URL = 'https://buildfyweb.vercel.app'; // Your deployed URL
const WEBHOOK_SECRET = 'whsec_dyCawXmjue9gR33qZjmFf7Ak'; // Your webhook secret

async function testWebhookEndpoint() {
  console.log('🧪 Testing webhook endpoint...\n');

  // Create test payload
  const payload = {
    type: 'payment.succeeded',
    payment_id: 'pay_test_webhook_123',
    amount: '999',
    currency: 'USD',
    customer: {
      email: 'webhook-test@example.com',
      name: 'Webhook Test User'
    },
    metadata: {
      userId: 'webhook-test-user-456',
      planType: 'pro'
    }
  };

  const payloadString = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Create webhook signature (simplified - real DodoPayments will do this)
  const webhookId = 'msg_' + Math.random().toString(36).substring(7);
  const toSign = `${webhookId}.${timestamp}.${payloadString}`;
  const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(toSign).digest('base64');

  const headers = {
    'Content-Type': 'application/json',
    'webhook-id': webhookId,
    'webhook-timestamp': timestamp.toString(),
    'webhook-signature': `v1,${signature}`
  };

  console.log('📦 Sending payload:', JSON.stringify(payload, null, 2));
  console.log('🔗 Headers:', JSON.stringify(headers, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/dodo`, {
      method: 'POST',
      headers,
      body: payloadString
    });

    console.log(`\n📡 Response status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Response body:', responseText);

    if (response.ok) {
      console.log('✅ Webhook endpoint is working!');
    } else {
      console.log('❌ Webhook endpoint failed');
    }

  } catch (error) {
    console.error('❌ Failed to call webhook endpoint:', error.message);
  }
}

// Test local development webhook
async function testLocalWebhook() {
  console.log('\n🧪 Testing local webhook endpoint...\n');

  const payload = {
    type: 'payment.succeeded',
    payment_id: 'pay_local_test_123',
    amount: '999',
    currency: 'USD',
    customer: {
      email: 'local-test@example.com',
      name: 'Local Test User'
    },
    metadata: {
      userId: 'local-test-user-789',
      planType: 'standard'
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhooks/dodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'webhook-id': 'msg_local_test',
        'webhook-timestamp': Math.floor(Date.now() / 1000).toString(),
        'webhook-signature': 'v1,test_signature' // This will fail verification, but we can see if the endpoint responds
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 Local response status: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    console.log('📄 Local response body:', responseText);

  } catch (error) {
    console.log('ℹ️ Local server not running or webhook verification failed (expected):', error.message);
  }
}

async function runTests() {
  await testWebhookEndpoint();
  await testLocalWebhook();
  console.log('\n🏁 Webhook tests completed');
}

runTests().catch(console.error);
