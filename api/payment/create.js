// DodoPayments API integration for Vercel serverless functions
export default async function handler(req, res) {
  // Add CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userId, userEmail, userName } = req.body;
    
    console.log('Payment creation request:', { planId, userId, userEmail, userName });
    
    // Validate required fields
    if (!planId || !userId || !userEmail || !userName) {
      console.error('Missing required fields:', { planId, userId, userEmail, userName });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: planId, userId, userEmail, userName' 
      });
    }

    // Get DodoPayments product ID for the plan
    const productId = getDodoProductId(planId);
    if (!productId) {
      console.error('Invalid plan ID or missing environment variable for plan:', planId);
      return res.status(400).json({
        success: false,
        error: `Invalid plan ID: ${planId}. Make sure DODO_${planId.toUpperCase()}_PRODUCT_ID environment variable is set.`
      });
    }

    console.log('Using product ID:', productId);

    // Create payment using DodoPayments API
    const payment = await createDodoPayment({
      productId,
      userId,
      userEmail,
      userName,
      planId
    });

    console.log('Payment created successfully:', payment.payment_id);

    return res.status(200).json({
      success: true,
      paymentUrl: payment.payment_link,
      paymentId: payment.payment_id
    });
  } catch (error) {
    console.error('DodoPayments API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Payment creation failed',
      details: error.message 
    });
  }
}

// Map your plan IDs to DodoPayments product IDs
function getDodoProductId(planId) {
  // Fallback hardcoded values for local testing if env vars don't work
  const fallbackMapping = {
    'standard': 'pdt_Z9c6DhWMTzp7sHAYoRdQu',
    'pro': 'pdt_0edTALfEQzfJUWfdRCkwz',
    'lifetime': 'pdt_jbtmC1tnnrW5JTb7NMFqS'
  };

  const productMapping = {
    'standard': process.env.DODO_STANDARD_PRODUCT_ID || fallbackMapping.standard,
    'pro': process.env.DODO_PRO_PRODUCT_ID || fallbackMapping.pro,
    'lifetime': process.env.DODO_LIFETIME_PRODUCT_ID || fallbackMapping.lifetime
  };
  
  console.log('Plan ID received:', planId);
  const productId = productMapping[planId];
  console.log('Mapped product ID:', productId);
  
  return productId;
}

// Create payment with DodoPayments
async function createDodoPayment({ productId, userId, userEmail, userName, planId }) {  const baseUrl = process.env.DODO_API_BASE_URL || 'https://test.dodopayments.com';
  const apiKey = process.env.DODO_PAYMENTS_API_KEY || '2RdhbTr4OeZimZOh.x38SM3G0x4_8o35V7lOfm_Wb04pjgr-jUpP1i_ccJRv2-Hcq';
    // Fix the return URL to ensure it has proper protocol
  let returnUrl = process.env.BASE_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  // Ensure the URL has the proper protocol
  if (returnUrl && !returnUrl.startsWith('http://') && !returnUrl.startsWith('https://')) {
    returnUrl = `http://${returnUrl}`;
  }
  
  console.log('API Key check:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('Base URL:', baseUrl);
  console.log('Return URL will be:', `${returnUrl}/payment-success`);
  console.log('Full API URL:', `${baseUrl}/payments`);
  
  console.log('API Key check:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('Base URL:', baseUrl);
  console.log('Return URL will be:', `${returnUrl}/payment-success`);
  console.log('Full API URL:', `${baseUrl}/payments`);
  
  if (!apiKey) {
    throw new Error('DodoPayments API key not configured');
  }

  const payload = {
    payment_link: true,
    product_cart: [
      {
        product_id: productId,
        quantity: 1
      }
    ],
    customer: {
      email: userEmail,
      name: userName,
      create_new_customer: true
    },
    billing: {
      city: "New York",
      country: "US", 
      state: "NY",
      street: "123 Main St",
      zipcode: "10001"
    },
    return_url: `${returnUrl}/payment-success`,
    metadata: {
      userId: userId,
      planType: planId,
      timestamp: new Date().toISOString(),
      source: 'buildfy-web'
    }
  };

  console.log('Payment payload:', JSON.stringify(payload, null, 2));

  try {
    console.log('Making request to DodoPayments...');
    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let errorData = null;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      console.error('DodoPayments API error response:', errorData);
      throw new Error(`DodoPayments API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('DodoPayments response:', result);
    return result;
    
  } catch (error) {
    console.error('Fetch error details:', {
      message: error.message,
      cause: error.cause,
      code: error.code,
      errno: error.errno
    });
    
    throw error;
  }
}
