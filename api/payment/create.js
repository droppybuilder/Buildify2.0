// DodoPayments API integration for Vercel serverless functions

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map();

function rateLimit(identifier, maxRequests = 3, windowMs = 300000) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  
  return true; // Request allowed
}

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

  // Rate limiting by IP address
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (!rateLimit(clientIP, 3, 300000)) { // 3 requests per 5 minutes
    return res.status(429).json({ 
      success: false, 
      error: 'Too many payment requests. Please try again later.' 
    });
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

    // Enhanced input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    if (userId.length < 3 || userId.length > 50) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID must be between 3 and 50 characters' 
      });
    }

    if (userName.length < 1 || userName.length > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'User name must be between 1 and 100 characters' 
      });
    }

    // Validate plan ID
    const validPlans = ['standard', 'pro', 'lifetime'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid plan ID: ${planId}. Valid plans: ${validPlans.join(', ')}` 
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
  
  // Remove trailing slash if present to avoid double slashes
  returnUrl = returnUrl.replace(/\/$/, '');
  
  // Ensure the URL has the proper protocol (prefer HTTPS for production)
  if (returnUrl && !returnUrl.startsWith('http://') && !returnUrl.startsWith('https://')) {
    // For production, use HTTPS; for localhost, use HTTP
    if (returnUrl.includes('localhost') || returnUrl.includes('127.0.0.1')) {
      returnUrl = `http://${returnUrl}`;
    } else {
      returnUrl = `https://${returnUrl}`;
    }
  }
    console.log('🔍 Environment variables check:');
  console.log('- BASE_URL:', process.env.BASE_URL);
  console.log('- VERCEL_URL:', process.env.VERCEL_URL);
  console.log('- Final returnUrl:', returnUrl);
  console.log('- Final payment return_url:', `${returnUrl}/payment-success`);
  console.log('API Key check:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('Base URL:', baseUrl);
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
    cancel_url: `${returnUrl}/pricing?status=cancelled`,
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
