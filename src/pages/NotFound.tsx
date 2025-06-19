import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
   const location = useLocation()
   const navigate = useNavigate()
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
      console.error('404 Error: User attempted to access non-existent route:', location.pathname)
   }, [location.pathname])

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

         <div className='text-center z-10 px-6'>
            <div className='mb-8'>
               <h1 className='text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4'>
                  404
               </h1>
               <h2 className='text-3xl font-semibold text-white mb-4'>Oops! Page not found</h2>
               <p className='text-xl text-gray-300 mb-8 max-w-md mx-auto'>
                  The page you're looking for doesn't exist or has been moved to another location.
               </p>
            </div>

            <div className='space-y-6'>
               <Button
                  onClick={() => navigate('/')}
                  className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-8 rounded-xl font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
               >
                  🏠 Return to Home
               </Button>

               <div className='flex justify-center space-x-4'>
                  <Button
                     variant='outline'
                     onClick={() => navigate(-1)}
                     className='border-white/20 text-gray-600 hover:bg-white/10 backdrop-blur-sm rounded-lg'
                  >
                     ← Go Back
                  </Button>
                  <Button
                     variant='outline'
                     onClick={() => navigate('/pricing')}
                     className='border-white/20 text-gray-600 hover:bg-white/10 backdrop-blur-sm   rounded-lg'
                  >
                     View Pricing
                  </Button>
               </div>
            </div>

            {/* Floating Elements */}
            <div className='absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-bounce' />
            <div className='absolute bottom-20 right-10 w-6 h-6 bg-pink-400 rounded-full opacity-40 animate-pulse' />
            <div className='absolute top-1/3 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-ping' />
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

export default NotFound
