// Test connection to DodoPayments API
export default async function handler(req, res) {  const endpoints = [
    'https://test.dodopayments.com',
    'https://test.dodopayments.com/api',
    'https://test.dodopayments.com/api/v1',
    'https://live.dodopayments.com',
    'https://live.dodopayments.com/api', 
    'https://live.dodopayments.com/api/v1'
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'User-Agent': 'Buildfy-Test/1.0'
        }
      });
      
      results.push({
        endpoint,
        status: response.status,
        statusText: response.statusText,
        reachable: true
      });
      
      console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      results.push({
        endpoint,
        error: error.message,
        reachable: false
      });
      
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }

  return res.json({
    message: 'DodoPayments endpoint connectivity test',
    results
  });
}
