import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const PaymentSuccess = () => {
   const navigate = useNavigate()
   const { refetch } = useSubscription()
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const [countdown, setCountdown] = useState(5)

   // Mouse tracking for animated cursor
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
   }, [])

   useEffect(() => {
      // Refetch subscription after payment
      refetch()
      toast.success('Payment successful! Your subscription has been updated.')

      // Countdown timer
      const timer = setInterval(() => {
         setCountdown((prev) => {
            if (prev <= 1) {
               clearInterval(timer)
               navigate('/profile')
               return 0
            }
            return prev - 1
         })
      }, 1000)

      return () => clearInterval(timer)
   }, [refetch, navigate])

   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center'>
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

         <div className='text-center z-10 px-6 max-w-2xl mx-auto'>
            {/* Success Animation */}
            <div className='mb-8 relative'>
               <div className='w-32 h-32 mx-auto mb-6 relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse' />
                  <div className='absolute inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center'>
                     <svg
                        className='w-16 h-16 text-white animate-bounce'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                     >
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={3}
                           d='M5 13l4 4L19 7'
                        />
                     </svg>
                  </div>
               </div>

               <h1 className='text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4'>
                  Payment Successful! 🎉
               </h1>
               <p className='text-xl text-gray-300 mb-6'>
                  Thank you for your purchase! Your subscription has been activated and you now have access to all
                  premium features.
               </p>
            </div>

            {/* Features Unlocked */}
            <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8'>
               <h3 className='text-xl font-semibold text-white mb-4'>🔓 Features Unlocked</h3>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                  <div className='flex items-center space-x-2 text-green-400'>
                     <span>✓</span>
                     <span>Unlimited canvas size</span>
                  </div>
                  <div className='flex items-center space-x-2 text-green-400'>
                     <span>✓</span>
                     <span>No watermarks</span>
                  </div>
                  <div className='flex items-center space-x-2 text-green-400'>
                     <span>✓</span>
                     <span>Advanced widgets</span>
                  </div>
                  <div className='flex items-center space-x-2 text-green-400'>
                     <span>✓</span>
                     <span>Priority support</span>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-4'>
               <div className='text-gray-400 text-sm mb-4'>Redirecting to your profile in {countdown} seconds...</div>

               <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Button
                     onClick={() => navigate('/profile')}
                     className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-8 rounded-xl font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                  >
                     👤 View Profile
                  </Button>

                  <Button
                     onClick={() => navigate('/')}
                     variant='outline'
                     className='border-white/20 text-white hover:bg-white/10 backdrop-blur-sm py-3 px-8 rounded-xl'
                  >
                     🏠 Go to Dashboard
                  </Button>
               </div>
            </div>

            {/* Floating Success Elements */}
            <div className='absolute top-10 left-10 text-4xl animate-bounce'>🎊</div>
            <div className='absolute top-20 right-10 text-3xl animate-pulse'>✨</div>
            <div className='absolute bottom-20 left-20 text-3xl animate-ping'>🎉</div>
            <div className='absolute bottom-10 right-20 text-4xl animate-bounce delay-300'>🚀</div>
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

export default PaymentSuccess
