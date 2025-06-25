// Environment and configuration checker for DODO Payments

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
    // Check all environment variables
    const envCheck = {
      api_configuration: {
        dodo_api_key: {
          configured: !!process.env.DODO_PAYMENTS_API_KEY,
          preview: process.env.DODO_PAYMENTS_API_KEY ? 
            `${process.env.DODO_PAYMENTS_API_KEY.substring(0, 20)}...` : 'NOT SET',
          length: process.env.DODO_PAYMENTS_API_KEY?.length || 0,
          is_test_key: process.env.DODO_PAYMENTS_API_KEY?.includes('test') || false
        },
        dodo_base_url: {
          configured: !!process.env.DODO_API_BASE_URL,
          value: process.env.DODO_API_BASE_URL || 'https://test.dodopayments.com (default)',
          is_production: process.env.DODO_API_BASE_URL?.includes('api.dodopayments.com') || false
        },
        webhook_key: {
          configured: !!process.env.DODO_WEBHOOK_KEY,
          preview: process.env.DODO_WEBHOOK_KEY ? 
            `${process.env.DODO_WEBHOOK_KEY.substring(0, 10)}...` : 'NOT SET',
          length: process.env.DODO_WEBHOOK_KEY?.length || 0
        }
      },
      
      product_ids: {
        standard: {
          configured: !!process.env.DODO_STANDARD_PRODUCT_ID,
          value: process.env.DODO_STANDARD_PRODUCT_ID || 'Using fallback'
        },
        pro: {
          configured: !!process.env.DODO_PRO_PRODUCT_ID,
          value: process.env.DODO_PRO_PRODUCT_ID || 'Using fallback'
        },
        lifetime: {
          configured: !!process.env.DODO_LIFETIME_PRODUCT_ID,
          value: process.env.DODO_LIFETIME_PRODUCT_ID || 'Using fallback'
        }
      },

      url_configuration: {
        base_url: process.env.BASE_URL || 'NOT SET',
        vercel_url: process.env.VERCEL_URL || 'NOT SET',
        next_public_base_url: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
        current_host: req.headers.host,
        webhook_url: `https://${req.headers.host || 'your-domain.com'}/api/webhooks/dodo`,
        webhook_debug_url: `https://${req.headers.host || 'your-domain.com'}/api/webhooks/debug`
      },

      firebase_configuration: {
        service_account_configured: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        service_account_preview: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 
          'Configured (JSON)' : 'NOT SET'
      },

      runtime_info: {
        node_env: process.env.NODE_ENV || 'development',
        platform: process.platform,
        node_version: process.version,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    // Test API connectivity
    let apiConnectivityTest = null;
    try {
      if (process.env.DODO_PAYMENTS_API_KEY) {
        const testResponse = await fetch(`${process.env.DODO_API_BASE_URL || 'https://test.dodopayments.com'}/payments?limit=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        apiConnectivityTest = {
          status: testResponse.status,
          success: testResponse.ok,
          message: testResponse.ok ? 'API connection successful' : 'API connection failed'
        };
      }
    } catch (error) {
      apiConnectivityTest = {
        status: 'error',
        success: false,
        message: error.message
      };
    }

    // Configuration warnings and recommendations
    const warnings = [];
    const recommendations = [];

    if (!process.env.DODO_PAYMENTS_API_KEY) {
      warnings.push('DODO_PAYMENTS_API_KEY is not configured');
    }
    
    if (!process.env.DODO_WEBHOOK_KEY) {
      warnings.push('DODO_WEBHOOK_KEY is not configured - webhooks will not work');
    }

    if (process.env.DODO_PAYMENTS_API_KEY?.includes('test') && process.env.NODE_ENV === 'production') {
      warnings.push('Using test API key in production environment');
    }

    if (!process.env.DODO_API_BASE_URL?.includes('api.dodopayments.com') && process.env.NODE_ENV === 'production') {
      recommendations.push('Consider using production DODO API URL: https://api.dodopayments.com');
    }

    if (!process.env.BASE_URL && !process.env.VERCEL_URL) {
      warnings.push('No base URL configured - return URLs may not work correctly');
    }

    return res.status(200).json({
      success: true,
      environment_check: envCheck,
      api_connectivity: apiConnectivityTest,
      warnings: warnings,
      recommendations: recommendations,
      next_steps: [
        'Verify all environment variables are correctly set',
        'Test webhook endpoint at /api/webhooks/debug',
        'Check DODO dashboard for webhook configuration',
        'Test payment creation with /api/payment/create',
        'Monitor webhook logs for incoming events'
      ]
    });

  } catch (error) {
    console.error('Environment check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment',
      details: error.message
    });
  }
}
