import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PaymentStatus from '@/components/PaymentStatus'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const PaymentPending: React.FC = () => {
   const [searchParams] = useSearchParams()
   const navigate = useNavigate()
   const [paymentId, setPaymentId] = useState<string | null>(null)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

   // Mouse tracking for animated cursor
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
   }, [])

   useEffect(() => {
      // Get payment ID from URL params or localStorage
      const urlPaymentId = searchParams.get('payment_id') || searchParams.get('paymentId')
      const storedPayment = localStorage.getItem('pendingPayment')
      
      let finalPaymentId = urlPaymentId

      if (!finalPaymentId && storedPayment) {
         try {
            const parsed = JSON.parse(storedPayment)
            finalPaymentId = parsed.paymentId
         } catch (error) {
            console.error('Failed to parse stored payment:', error)
         }
      }

      if (finalPaymentId) {
         setPaymentId(finalPaymentId)
         console.log('Tracking payment:', finalPaymentId)
      } else {
         console.warn('No payment ID found, redirecting to pricing')
         navigate('/pricing')
      }
   }, [searchParams, navigate])

   const handleStatusChange = (status: string) => {
      console.log('Payment status changed to:', status)
      
      // Clear stored payment on completion
      if (['succeeded', 'failed', 'cancelled', 'expired'].includes(status)) {
         localStorage.removeItem('pendingPayment')
      }
   }

   if (!paymentId) {
      return (
         <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center'>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md mx-auto text-center">
               <CardContent className="p-0 space-y-4">
                  <h2 className="text-xl font-semibold text-white">Payment Not Found</h2>
                  <p className="text-gray-300">No payment information found. Redirecting to pricing...</p>
                  <Button 
                     onClick={() => navigate('/pricing')}
                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                     View Pricing
                  </Button>
               </CardContent>
            </Card>
         </div>
      )
   }

   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
         {/* Animated Cursor Effect */}
         <div
            className='fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 opacity-50 transition-all duration-300 ease-out'
            style={{
               left: mousePosition.x - 12,
               top: mousePosition.y - 12,
               background: `radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)`,
            }}
         />

         {/* Dynamic Background */}
         <div className='pointer-events-none fixed inset-0 -z-10'>
            <div className='absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-float-1' />
            <div className='absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-float-2' />
            <div className='absolute top-1/2 left-1/2 w-[40vw] h-[40vw] bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-float-3' />
         </div>

         <div className='container mx-auto py-20 px-4 relative z-10 flex flex-col items-center justify-center min-h-screen'>
            <div className='text-center mb-8'>
               <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4'>
                  Payment Processing
               </h1>
               <p className='text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto'>
                  We're checking the status of your payment. Please don't close this window.
               </p>
            </div>

            <PaymentStatus 
               paymentId={paymentId} 
               onStatusChange={handleStatusChange}
            />

            <div className='mt-8 text-center text-sm text-gray-400 max-w-md mx-auto space-y-2'>
               <p>
                  <strong>Payment ID:</strong> {paymentId}
               </p>
               <p>
                  If you're experiencing issues, please contact our support team with this payment ID.
               </p>
               <div className='pt-4'>
                  <Button
                     variant="outline"
                     onClick={() => navigate('/contact')}
                     className="border-white/20 text-gray-300 hover:bg-white/10"
                  >
                     Contact Support
                  </Button>
               </div>
            </div>
         </div>

         {/* Custom Styles */}
         <style>{`
            @keyframes float-1 {
               0%, 100% { transform: translate(0, 0) rotate(0deg); }
               33% { transform: translate(30px, -30px) rotate(120deg); }
               66% { transform: translate(-20px, 20px) rotate(240deg); }
            }
            @keyframes float-2 {
               0%, 100% { transform: translate(0, 0) rotate(0deg); }
               33% { transform: translate(-30px, -30px) rotate(-120deg); }
               66% { transform: translate(20px, 20px) rotate(-240deg); }
            }
            @keyframes float-3 {
               0%, 100% { transform: translate(0, 0) scale(1); }
               50% { transform: translate(20px, -20px) scale(1.1); }
            }
            .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
            .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
            .animate-float-3 { animation: float-3 15s ease-in-out infinite; }
         `}</style>
      </div>
   )
}

export default PaymentPending
