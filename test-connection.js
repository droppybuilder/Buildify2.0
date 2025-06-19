// Simple Node.js test for DodoPayments API
import 'dotenv/config';

const endpoints = [
  'https://test.dodopayments.com',
  'https://test.dodopayments.com/api',
  'https://test.dodopayments.com/api/v1',
  'https://live.dodopayments.com',
  'https://live.dodopayments.com/api', 
  'https://live.dodopayments.com/api/v1'
];

console.log('=== Environment Variables ===');
console.log('DODO_PAYMENTS_API_KEY:', process.env.DODO_PAYMENTS_API_KEY ? `${process.env.DODO_PAYMENTS_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('DODO_API_BASE_URL:', process.env.DODO_API_BASE_URL || 'NOT SET');
console.log('DODO_STANDARD_PRODUCT_ID:', process.env.DODO_STANDARD_PRODUCT_ID || 'NOT SET');
console.log('DODO_PRO_PRODUCT_ID:', process.env.DODO_PRO_PRODUCT_ID || 'NOT SET');
console.log('DODO_LIFETIME_PRODUCT_ID:', process.env.DODO_LIFETIME_PRODUCT_ID || 'NOT SET');
console.log('===============================\n');

console.log('Testing DodoPayments endpoints...\n');

for (const endpoint of endpoints) {
  try {
    console.log(`Testing ${endpoint}...`);
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'Buildfy-Test/1.0'
      }
    });
    
    console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`❌ ${endpoint}: ${error.message}`);
  }
}

console.log('\n=== Testing Subscription Endpoint ===');

const apiKey = process.env.DODO_PAYMENTS_API_KEY || '2RdhbTr4OeZimZOh.x38SM3G0x4_8o35V7lOfm_Wb04pjgr-jUpP1i_ccJRv2-Hcq';
const baseUrl = process.env.DODO_API_BASE_URL || 'https://test.dodopayments.com';
const productId = process.env.DODO_STANDARD_PRODUCT_ID || 'pdt_Z9c6DhWMTzp7sHAYoRdQu';

const payload = {
  payment_link: true,
  product_id: productId,
  quantity: 1,
  customer: {
    email: "test@example.com",
    name: "Test User",
    create_new_customer: true
  },
  billing: {
    city: "New York",
    country: "US", 
    state: "NY",
    street: "123 Main St",
    zipcode: "10001"
  },
  return_url: "http://localhost:3000/payment-success",
  metadata: {
    userId: "test_user_123",
    planType: "standard",
    timestamp: new Date().toISOString(),
    source: 'buildfy-web'
  }
};

try {
  console.log(`Making POST request to ${baseUrl}/subscriptions...`);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  const response = await fetch(`${baseUrl}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  console.log(`Response status: ${response.status}`);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  const responseText = await response.text();
  console.log('Response body:', responseText);

  if (response.ok) {
    console.log('✅ Subscription creation successful!');
  } else {
    console.log('❌ Subscription creation failed');
  }

} catch (error) {
  console.error('❌ Request failed:', error.message);
}
