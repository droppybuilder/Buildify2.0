// Test the payment API endpoint
async function testPaymentAPI() {
  const payload = {
    planId: "standard",
    userId: "test123", 
    userEmail: "test@example.com",
    userName: "Test User"
  };

  try {
    console.log('Testing payment API endpoint...');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('http://localhost:3001/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.text();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ Payment API test successful!');
    } else {
      console.log('❌ Payment API test failed');
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testPaymentAPI();
