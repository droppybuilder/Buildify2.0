// API endpoint to check payment status with DODO Payments

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
    const { payment_id } = req.query;
    
    if (!payment_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing payment_id parameter' 
      });
    }

    console.log('Checking payment status for:', payment_id);

    // Get payment status from DodoPayments
    const paymentStatus = await checkDodoPaymentStatus(payment_id);
    
    console.log('Payment status result:', paymentStatus);

    return res.status(200).json({
      success: true,
      payment_id: payment_id,
      status: paymentStatus.status,
      error_message: paymentStatus.error_message,
      metadata: paymentStatus.metadata,
      amount: paymentStatus.amount,
      currency: paymentStatus.currency,
      created_at: paymentStatus.created_at,
      updated_at: paymentStatus.updated_at
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to check payment status',
      details: error.message 
    });
  }
}

// Check payment status with DodoPayments API
async function checkDodoPaymentStatus(paymentId) {
  const baseUrl = process.env.DODO_API_BASE_URL || 'https://test.dodopayments.com';
  const apiKey = process.env.DODO_PAYMENTS_API_KEY || '2RdhbTr4OeZimZOh.x38SM3G0x4_8o35V7lOfm_Wb04pjgr-jUpP1i_ccJRv2-Hcq';
  
  if (!apiKey) {
    throw new Error('DodoPayments API key not configured');
  }

  try {
    console.log('Making request to DodoPayments for payment status...');
    console.log('URL:', `${baseUrl}/payments/${paymentId}`);
    
    const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log('DodoPayments status response:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let errorData = null;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      console.error('DodoPayments status API error response:', errorData);
      
      // If payment not found, it might be expired or invalid
      if (response.status === 404) {
        return {
          status: 'expired',
          error_message: 'Payment session not found or expired',
          payment_id: paymentId
        };
      }
      
      throw new Error(`DodoPayments API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('DodoPayments status result:', result);

    // Map DodoPayments status to our internal status
    const status = mapDodoStatus(result.status);
    
    return {
      status: status,
      error_message: result.failure_reason || result.error_message || null,
      metadata: result.metadata || {},
      amount: result.total_amount,
      currency: result.currency,
      created_at: result.created_at,
      updated_at: result.updated_at,
      payment_id: result.payment_id
    };
    
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

// Map DodoPayments status to our internal status
function mapDodoStatus(dodoStatus) {
  const statusMap = {
    'pending': 'pending',
    'processing': 'processing', 
    'succeeded': 'succeeded',
    'completed': 'succeeded',
    'paid': 'succeeded',
    'failed': 'failed',
    'declined': 'failed',
    'cancelled': 'cancelled',
    'canceled': 'cancelled',
    'expired': 'expired',
    'timeout': 'expired'
  };

  const mapped = statusMap[dodoStatus?.toLowerCase()];
  
  if (!mapped) {
    console.warn('Unknown DODO status:', dodoStatus);
    return 'pending'; // Default to pending for unknown statuses
  }
  
  return mapped;
}
