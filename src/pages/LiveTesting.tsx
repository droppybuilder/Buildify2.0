import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

const LiveTesting: React.FC = () => {
   const [results, setResults] = useState<any[]>([])
   const [loading, setLoading] = useState(false)
   const { user } = useAuth()

   const runTest = async (testName: string, testFunction: () => Promise<any>) => {
      setLoading(true)
      const startTime = Date.now()
      
      try {
         const result = await testFunction()
         const endTime = Date.now()
         
         setResults(prev => [...prev, {
            test: testName,
            status: 'success',
            result,
            duration: endTime - startTime,
            timestamp: new Date().toISOString()
         }])
         
         toast.success(`✅ ${testName} completed`)
      } catch (error) {
         const endTime = Date.now()
         
         setResults(prev => [...prev, {
            test: testName,
            status: 'error',
            error: error.message,
            duration: endTime - startTime,
            timestamp: new Date().toISOString()
         }])
         
         toast.error(`❌ ${testName} failed: ${error.message}`)
      } finally {
         setLoading(false)
      }
   }

   const testEnvironmentCheck = async () => {
      const response = await fetch('/api/debug/environment')
      return await response.json()
   }

   const testWebhookEndpoint = async () => {
      const response = await fetch('/api/webhooks/debug')
      return await response.json()
   }

   const testPaymentCreation = async () => {
      const response = await fetch('/api/payment/create', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            planId: 'standard',
            userId: `test-${Date.now()}`,
            userEmail: 'test+live@example.com',
            userName: 'Live Test User',
            testMode: true
         })
      })
      return await response.json()
   }

   const testPaymentStatus = async () => {
      // Use a fake payment ID for testing
      const response = await fetch('/api/payment/status?payment_id=pay_test_123')
      return await response.json()
   }

   const testWebhookLogs = async () => {
      const response = await fetch('/api/debug/webhook-logs')
      return await response.json()
   }

   const clearResults = () => {
      setResults([])
      toast.info('Test results cleared')
   }

   return (
      <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8'>
         <div className='max-w-6xl mx-auto space-y-6'>
            <Card className="bg-white/5 backdrop-blur-md border border-red-500/30 rounded-2xl">
               <CardHeader>
                  <CardTitle className="text-2xl font-bold text-red-400 flex items-center gap-2">
                     🚨 Live Environment Testing
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
                     <AlertDescription className="text-yellow-300">
                        ⚠️ This is the LIVE environment. All tests are safe and won't affect real users or payments.
                        Only authorized personnel should use this panel.
                     </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                     <Button
                        onClick={() => runTest('Environment Check', testEnvironmentCheck)}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                     >
                        Test Environment
                     </Button>
                     
                     <Button
                        onClick={() => runTest('Webhook Endpoint', testWebhookEndpoint)}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                     >
                        Test Webhook
                     </Button>
                     
                     <Button
                        onClick={() => runTest('Payment Creation', testPaymentCreation)}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                     >
                        Test Payment
                     </Button>
                     
                     <Button
                        onClick={() => runTest('Payment Status', testPaymentStatus)}
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                     >
                        Test Status API
                     </Button>
                     
                     <Button
                        onClick={() => runTest('Webhook Logs', testWebhookLogs)}
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                     >
                        Test Logs API
                     </Button>
                     
                     <Button
                        onClick={clearResults}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                     >
                        Clear Results
                     </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <Card className="bg-black/20 border border-white/10">
                        <CardContent className="p-4">
                           <h4 className="font-semibold mb-2">Quick Links</h4>
                           <div className="space-y-2 text-sm">
                              <a href="/payment-debug" target="_blank" className="block text-blue-400 hover:text-blue-300">
                                 Payment Debug Tool
                              </a>
                              <a href="/webhook-logs" target="_blank" className="block text-green-400 hover:text-green-300">
                                 Webhook Logs Viewer
                              </a>
                              <a href="https://dashboard.dodopayments.com" target="_blank" className="block text-purple-400 hover:text-purple-300">
                                 DODO Dashboard
                              </a>
                           </div>
                        </CardContent>
                     </Card>
                     
                     <Card className="bg-black/20 border border-white/10">
                        <CardContent className="p-4">
                           <h4 className="font-semibold mb-2">System Info</h4>
                           <div className="space-y-1 text-sm text-gray-400">
                              <div>Environment: Production</div>
                              <div>Domain: {window.location.hostname}</div>
                              <div>User: {user?.email || 'Not logged in'}</div>
                              <div>Time: {new Date().toLocaleString()}</div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </CardContent>
            </Card>

            {/* Test Results */}
            {results.length > 0 && (
               <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                  <CardHeader>
                     <CardTitle className="text-xl font-bold text-white">
                        Test Results ({results.length})
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {results.map((result, index) => (
                           <div key={index} className="border border-white/10 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                 <h4 className="font-semibold text-white">{result.test}</h4>
                                 <div className="flex items-center gap-2">
                                    <Badge className={
                                       result.status === 'success' 
                                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    }>
                                       {result.status}
                                    </Badge>
                                    <span className="text-xs text-gray-400">{result.duration}ms</span>
                                 </div>
                              </div>
                              <pre className="bg-black/20 rounded p-3 text-xs text-gray-300 overflow-auto max-h-40">
                                 {JSON.stringify(result.result || result.error, null, 2)}
                              </pre>
                              <div className="text-xs text-gray-500 mt-2">
                                 {new Date(result.timestamp).toLocaleString()}
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   )
}

export default LiveTesting
