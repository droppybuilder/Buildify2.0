import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface PaymentStatusProps {
   paymentId?: string
   onStatusChange?: (status: string) => void
}

type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'expired'

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentId, onStatusChange }) => {
   const [status, setStatus] = useState<PaymentStatus>('pending')
   const [attempts, setAttempts] = useState(0)
   const [lastChecked, setLastChecked] = useState<Date | null>(null)
   const [errorMessage, setErrorMessage] = useState('')
   const [debugInfo, setDebugInfo] = useState<any>(null)
   const [isDebugMode, setIsDebugMode] = useState(false)
   const navigate = useNavigate()

   const maxAttempts = 30 // 5 minutes of checking (every 10 seconds)

   useEffect(() => {
      if (!paymentId) return

      const checkPaymentStatus = async () => {
         try {
            const response = await fetch(`/api/payment/status?payment_id=${paymentId}`)
            const data = await response.json()

            console.log('Payment status check:', data)
            setLastChecked(new Date())
            setDebugInfo(data) // Store debug info
            
            if (data.success) {
               const newStatus = data.status as PaymentStatus
               setStatus(newStatus)
               onStatusChange?.(newStatus)

               // Handle different statuses
               switch (newStatus) {
                  case 'succeeded':
                     toast.success('🎉 Payment successful!')
                     setTimeout(() => navigate('/payment-success'), 1000)
                     return // Stop polling

                  case 'failed':
                     setErrorMessage(data.error_message || 'Payment failed')
                     toast.error(`❌ Payment failed: ${data.error_message || 'Unknown error'}`)
                     return // Stop polling

                  case 'cancelled':
                     toast.warning('Payment was cancelled')
                     setTimeout(() => navigate('/pricing?status=cancelled'), 1000)
                     return // Stop polling

                  case 'expired':
                     toast.error('Payment session expired')
                     setTimeout(() => navigate('/pricing?status=expired'), 1000)
                     return // Stop polling
               }
            } else {
               console.error('Failed to check payment status:', data.error)
               setErrorMessage(data.error || 'Unable to check payment status')
            }
         } catch (error) {
            console.error('Error checking payment status:', error)
            setErrorMessage('Network error while checking payment status')
         }

         setAttempts(prev => prev + 1)
      }

      // Initial check
      checkPaymentStatus()

      // Set up polling for pending/processing payments
      const interval = setInterval(() => {
         if (attempts >= maxAttempts) {
            clearInterval(interval)
            setStatus('expired')
            toast.error('Payment check timed out. Please contact support if you made a payment.')
            setTimeout(() => navigate('/pricing?status=timeout'), 2000)
            return
         }

         if (['pending', 'processing'].includes(status)) {
            checkPaymentStatus()
         } else {
            clearInterval(interval)
         }
      }, 10000) // Check every 10 seconds

      return () => clearInterval(interval)
   }, [paymentId, attempts, status, maxAttempts, navigate, onStatusChange])

   const getStatusConfig = (status: PaymentStatus) => {
      switch (status) {
         case 'pending':
         case 'processing':
            return {
               icon: <Loader2 className="w-8 h-8 animate-spin text-blue-400" />,
               color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
               title: 'Processing Payment',
               message: 'Please wait while we process your payment...'
            }
         case 'succeeded':
            return {
               icon: <CheckCircle className="w-8 h-8 text-green-400" />,
               color: 'bg-green-500/20 text-green-400 border-green-500/30',
               title: 'Payment Successful',
               message: 'Your payment has been processed successfully!'
            }
         case 'failed':
            return {
               icon: <XCircle className="w-8 h-8 text-red-400" />,
               color: 'bg-red-500/20 text-red-400 border-red-500/30',
               title: 'Payment Failed',
               message: errorMessage || 'Your payment could not be processed'
            }
         case 'cancelled':
            return {
               icon: <AlertCircle className="w-8 h-8 text-yellow-400" />,
               color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
               title: 'Payment Cancelled',
               message: 'Payment was cancelled by user'
            }
         case 'expired':
            return {
               icon: <XCircle className="w-8 h-8 text-red-400" />,
               color: 'bg-red-500/20 text-red-400 border-red-500/30',
               title: 'Payment Session Expired',
               message: 'The payment session has expired. Please try again.'
            }
         default:
            return {
               icon: <AlertCircle className="w-8 h-8 text-gray-400" />,
               color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
               title: 'Unknown Status',
               message: 'Unable to determine payment status'
            }
      }
   }

   const config = getStatusConfig(status)

   return (
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
         <CardContent className="p-0 text-center space-y-4">
            <div className="flex justify-center">
               {config.icon}
            </div>

            <div>
               <h3 className="text-xl font-semibold text-white mb-2">{config.title}</h3>
               <p className="text-gray-300 text-sm mb-4">{config.message}</p>
            </div>

            <Badge className={`px-3 py-1 text-sm ${config.color}`}>
               {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>

            {lastChecked && (
               <p className="text-xs text-gray-500">
                  Last checked: {lastChecked.toLocaleTimeString()}
               </p>
            )}

            {['pending', 'processing'].includes(status) && (
               <div className="text-xs text-gray-400 space-y-1">
                  <p>Checking payment status... ({attempts}/{maxAttempts})</p>
                  <p>Please do not close this window</p>
               </div>
            )}

            {['failed', 'cancelled', 'expired'].includes(status) && (
               <div className="space-y-2 pt-4">
                  <Button
                     onClick={() => navigate('/pricing')}
                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                     Try Again
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => navigate('/contact')}
                     className="w-full border-white/20 text-gray-300 hover:bg-white/10"
                  >
                     Contact Support
                  </Button>
                  
                  {/* Debug Mode Toggle */}
                  <Button
                     variant="ghost"
                     onClick={() => setIsDebugMode(!isDebugMode)}
                     className="w-full text-xs text-gray-500 hover:text-gray-300"
                  >
                     {isDebugMode ? 'Hide' : 'Show'} Debug Info
                  </Button>
               </div>
            )}

            {/* Debug Information */}
            {isDebugMode && debugInfo && (
               <div className="mt-4 p-4 bg-black/20 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Debug Information</h4>
                  <pre className="text-xs text-gray-400 overflow-auto max-h-40">
                     {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                  <div className="mt-2 text-xs text-gray-500">
                     <p>Payment ID: {paymentId}</p>
                     <p>Attempts: {attempts}/{maxAttempts}</p>
                     <p>Current URL: {window.location.href}</p>
                  </div>
               </div>
            )}
         </CardContent>
      </Card>
   )
}

export default PaymentStatus
