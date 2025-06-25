import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const PaymentDebug: React.FC = () => {
   const [paymentId, setPaymentId] = useState('')
   const [loading, setLoading] = useState(false)
   const [result, setResult] = useState<any>(null)
   const [envCheck, setEnvCheck] = useState<any>(null)
   const [webhookTest, setWebhookTest] = useState<any>(null)

   const checkEnvironment = async () => {
      setLoading(true)
      try {
         const response = await fetch('/api/debug/environment')
         const data = await response.json()
         setEnvCheck(data)
         
         if (data.success) {
            toast.success('Environment check completed')
         } else {
            toast.error(`Environment check failed: ${data.error}`)
         }
      } catch (error) {
         console.error('Failed to check environment:', error)
         toast.error('Failed to check environment')
         setEnvCheck({ error: error.message })
      } finally {
         setLoading(false)
      }
   }

   const testWebhookEndpoint = async () => {
      setLoading(true)
      try {
         const response = await fetch('/api/webhooks/debug')
         const data = await response.json()
         setWebhookTest(data)
         
         if (data.success) {
            toast.success('Webhook endpoint is accessible')
         } else {
            toast.error(`Webhook test failed: ${data.error}`)
         }
      } catch (error) {
         console.error('Failed to test webhook:', error)
         toast.error('Failed to test webhook endpoint')
         setWebhookTest({ error: error.message })
      } finally {
         setLoading(false)
      }
   }

   const checkPaymentStatus = async () => {
      if (!paymentId.trim()) {
         toast.error('Please enter a payment ID')
         return
      }

      setLoading(true)
      try {
         const response = await fetch(`/api/payment/status?payment_id=${paymentId}`)
         const data = await response.json()
         
         setResult(data)
         
         if (data.success) {
            toast.success(`Status: ${data.status}`)
         } else {
            toast.error(`Error: ${data.error}`)
         }
      } catch (error) {
         console.error('Failed to check payment status:', error)
         toast.error('Failed to check payment status')
         setResult({ error: error.message })
      } finally {
         setLoading(false)
      }
   }

   const testCreatePayment = async () => {
      setLoading(true)
      try {
         const response = await fetch('/api/payment/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               planId: 'standard',
               userId: 'test-user-123',
               userEmail: 'test@example.com',
               userName: 'Test User'
            })
         })
         
         const data = await response.json()
         setResult(data)
         
         if (data.success) {
            toast.success('Payment created successfully')
         } else {
            toast.error(`Error: ${data.error}`)
         }
      } catch (error) {
         console.error('Failed to create payment:', error)
         toast.error('Failed to create payment')
         setResult({ error: error.message })
      } finally {
         setLoading(false)
      }
   }

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'succeeded':
         case 'completed':
            return 'bg-green-500/20 text-green-400 border-green-500/30'
         case 'failed':
         case 'declined':
            return 'bg-red-500/20 text-red-400 border-red-500/30'
         case 'pending':
         case 'processing':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
         case 'cancelled':
         case 'canceled':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
         case 'expired':
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
         default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      }
   }

   return (
      <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8'>
         <div className='max-w-4xl mx-auto space-y-6'>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
               <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                     Payment Debug Tool
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  {/* Environment Check */}
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold">Environment Check</h3>
                     <div className="flex gap-4">
                        <Button
                           onClick={checkEnvironment}
                           disabled={loading}
                           className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                           {loading ? 'Checking...' : 'Check Environment'}
                        </Button>
                        <Button
                           onClick={testWebhookEndpoint}
                           disabled={loading}
                           className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                           {loading ? 'Testing...' : 'Test Webhook Endpoint'}
                        </Button>
                     </div>
                  </div>

                  {/* Check Payment Status */}
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold">Check Payment Status</h3>
                     <div className="flex gap-4">
                        <Input
                           placeholder="Enter Payment ID (e.g., pay_xyz123)"
                           value={paymentId}
                           onChange={(e) => setPaymentId(e.target.value)}
                           className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        />
                        <Button
                           onClick={checkPaymentStatus}
                           disabled={loading}
                           className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                           {loading ? 'Checking...' : 'Check Status'}
                        </Button>
                     </div>
                  </div>

                  {/* Test Payment Creation */}
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold">Test Payment Creation</h3>
                     <Button
                        onClick={testCreatePayment}
                        disabled={loading}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                     >
                        {loading ? 'Creating...' : 'Create Test Payment'}
                     </Button>
                  </div>

                  {/* Environment Info */}
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold">Environment Info</h3>
                     <div className="bg-black/20 rounded-lg p-4 text-sm font-mono">
                        <div>Current URL: {window.location.href}</div>
                        <div>User Agent: {navigator.userAgent}</div>
                        <div>Timestamp: {new Date().toISOString()}</div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Results */}
            {(result || envCheck || webhookTest) && (
               <div className="space-y-6">
                  {/* Environment Check Results */}
                  {envCheck && (
                     <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                        <CardHeader>
                           <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                              Environment Check Results
                              {envCheck.success ? (
                                 <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OK</Badge>
                              ) : (
                                 <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {envCheck.warnings && envCheck.warnings.length > 0 && (
                              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                 <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Warnings:</h4>
                                 <ul className="text-yellow-300 text-sm space-y-1">
                                    {envCheck.warnings.map((warning: string, i: number) => (
                                       <li key={i}>• {warning}</li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                           
                           {envCheck.recommendations && envCheck.recommendations.length > 0 && (
                              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                 <h4 className="text-blue-400 font-semibold mb-2">💡 Recommendations:</h4>
                                 <ul className="text-blue-300 text-sm space-y-1">
                                    {envCheck.recommendations.map((rec: string, i: number) => (
                                       <li key={i}>• {rec}</li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                           
                           <pre className="bg-black/20 rounded-lg p-4 text-sm font-mono overflow-auto max-h-96 text-gray-300">
                              {JSON.stringify(envCheck, null, 2)}
                           </pre>
                        </CardContent>
                     </Card>
                  )}

                  {/* Webhook Test Results */}
                  {webhookTest && (
                     <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                        <CardHeader>
                           <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                              Webhook Test Results
                              {webhookTest.success ? (
                                 <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OK</Badge>
                              ) : (
                                 <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <pre className="bg-black/20 rounded-lg p-4 text-sm font-mono overflow-auto max-h-96 text-gray-300">
                              {JSON.stringify(webhookTest, null, 2)}
                           </pre>
                        </CardContent>
                     </Card>
                  )}

                  {/* Payment Status Results */}
                  {result && (
                     <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                        <CardHeader>
                           <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                              Payment Results
                              {result.success && result.status && (
                                 <Badge className={getStatusColor(result.status)}>
                                    {result.status}
                                 </Badge>
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <pre className="bg-black/20 rounded-lg p-4 text-sm font-mono overflow-auto max-h-96 text-gray-300">
                              {JSON.stringify(result, null, 2)}
                           </pre>
                        </CardContent>
                     </Card>
                  )}
               </div>
            )}

            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
               <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="flex flex-wrap gap-4">
                  <Button
                     onClick={() => window.open('/webhook-logs', '_blank')}
                     variant="outline"
                     className="border-white/20 text-white hover:bg-white/10"
                  >
                     View Webhook Logs
                  </Button>
                  <Button
                     onClick={() => window.open('https://dashboard.dodopayments.com', '_blank')}
                     variant="outline"
                     className="border-white/20 text-white hover:bg-white/10"
                  >
                     Open DODO Dashboard
                  </Button>
                  <Button
                     onClick={() => {
                        const stored = localStorage.getItem('pendingPayment')
                        if (stored) {
                           const parsed = JSON.parse(stored)
                           setPaymentId(parsed.paymentId || '')
                           toast.info('Loaded payment ID from localStorage')
                        } else {
                           toast.warning('No pending payment found in localStorage')
                        }
                     }}
                     variant="outline"
                     className="border-white/20 text-white hover:bg-white/10"
                  >
                     Load from localStorage
                  </Button>
                  <Button
                     onClick={() => {
                        localStorage.removeItem('pendingPayment')
                        toast.success('Cleared pending payment from localStorage')
                     }}
                     variant="outline"
                     className="border-white/20 text-white hover:bg-white/10"
                  >
                     Clear localStorage
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}

export default PaymentDebug
