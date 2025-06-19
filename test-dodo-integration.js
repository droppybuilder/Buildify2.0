// Test file to verify DodoPayments integration
// Run this in your browser console or create a test endpoint

const testDodoPaymentsIntegration = async () => {
  console.log('🚀 Testing DodoPayments Integration...');
  
  // Test 1: Create Payment Link
  try {
    console.log('📝 Creating payment link...');
    const response = await fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId: 'standard',
        userId: 'test_user_123',
        userEmail: 'test@example.com',
        userName: 'Test User'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Payment link created successfully!');
      console.log('Payment URL:', result.paymentUrl);
      console.log('Payment ID:', result.paymentId);
    } else {
      console.error('❌ Payment creation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
  
  // Test 2: Check Environment Variables
  console.log('\n🔧 Environment Check:');
  console.log('- Check Vercel dashboard for environment variables');
  console.log('- Required: DODO_PAYMENTS_API_KEY, DODO_WEBHOOK_KEY');
  console.log('- Required: DODO_STANDARD_PRODUCT_ID, DODO_PRO_PRODUCT_ID, DODO_LIFETIME_PRODUCT_ID');
  
  // Test 3: Webhook URL
  console.log('\n🔗 Webhook Configuration:');
  console.log('Configure this URL in your DodoPayments dashboard:');
  console.log(`${window.location.origin}/api/webhooks/dodo`);
};

// Test Payment Success Flow
const testPaymentSuccess = () => {
  console.log('🎯 Testing Payment Success Flow...');
  
  // Simulate successful payment return
  const testUrl = `${window.location.origin}/payment-success?payment_id=pay_test123&status=succeeded`;
  console.log('Test URL:', testUrl);
  console.log('Open this URL to test payment success flow');
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDodoPaymentsIntegration, testPaymentSuccess };
} else {
  window.testDodoPaymentsIntegration = testDodoPaymentsIntegration;
  window.testPaymentSuccess = testPaymentSuccess;
}
