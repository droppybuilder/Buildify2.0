// Test the webhook locally with the correct port
import fetch from 'node-fetch';

async function testLocalWebhookSimple() {
  console.log('🧪 Testing local webhook endpoint on port 8080...\n');

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
    // First, check if the endpoint exists
    console.log('📡 Testing webhook endpoint...');
    const response = await fetch('http://localhost:8080/api/webhooks/dodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Minimal headers to avoid verification issues for now
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    console.log('📄 Response body:', responseText);

    if (response.status === 400 && responseText.includes('verification failed')) {
      console.log('✅ Webhook endpoint exists but signature verification failed (expected)');
    } else if (response.ok) {
      console.log('✅ Webhook endpoint is working!');
    } else {
      console.log('❌ Unexpected response from webhook endpoint');
    }

  } catch (error) {
    console.error('❌ Failed to call webhook endpoint:', error.message);
  }
}

testLocalWebhookSimple().catch(console.error);
