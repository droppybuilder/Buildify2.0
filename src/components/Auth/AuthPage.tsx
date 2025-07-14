import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import logo from '/logo6.png'
import { SEO, seoConfig } from '@/components/SEO'

const AuthPage: React.FC = () => {
   const { loginWithGoogle, user } = useAuth()
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

   // Redirect if the user is already logged in
   useEffect(() => {
      if (user) {
         navigate('/') // Redirect to the home page or any other page
      }
   }, [user, navigate])

   const handleGoogleLogin = async (): Promise<void> => {
      try {
         await loginWithGoogle()
         toast.success('Login successful!')
         navigate('/') // Redirect to the home page after successful login
      } catch (error) {
         console.error('Login failed:', (error as Error).message)
         toast.error(`Login error: ${(error as Error).message}`)
      }
   }

   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4'>
         <SEO {...seoConfig.auth} />
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

         <div className='w-full max-w-md z-10'>
            {/* Header */}
            <div className='mb-8 text-center'>
               <div
                  className='flex items-center justify-center space-x-2 mb-4 cursor-pointer hover:scale-105 transition-transform duration-300'
                  onClick={() => navigate('/')}
               >
                  <img
                     src={logo}
                     alt='Buildfy Web'
                     className='h-12 w-12 rounded-lg'
                  />
                  <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Buildfy Web
                  </h1>
               </div>
               <p className='text-gray-300 text-lg'>Build your next Python GUI project with ease</p>
            </div>

            {/* Auth Card */}
            <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden'>
               <div className='p-8'>
                  <div className='text-center mb-6'>
                     <h2 className='text-2xl font-semibold text-white mb-2'>Welcome Back</h2>
                     <p className='text-gray-400'>Sign in to continue building amazing GUIs</p>
                  </div>

                  <button
                     onClick={handleGoogleLogin}
                     className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                  >
                     <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 48 48'
                        className='flex-shrink-0'
                     >
                        <path
                           fill='#FFC107'
                           d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
                        />
                        <path
                           fill='#FF3D00'
                           d='m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z'
                        />
                        <path
                           fill='#4CAF50'
                           d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
                        />
                        <path
                           fill='#1976D2'
                           d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z'
                        />
                     </svg>
                     <span className='text-lg'>Continue with Google</span>
                  </button>

                  {/* Features highlight */}
                  <div className='mt-8 pt-6 border-t border-white/10'>
                     <p className='text-center text-gray-400 text-sm mb-4'>What you'll get:</p>
                     <div className='space-y-3'>
                        <div className='flex items-center space-x-3 text-gray-300'>
                           <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>
                           <span className='text-sm'>Visual drag-and-drop GUI builder</span>
                        </div>
                        <div className='flex items-center space-x-3 text-gray-300'>
                           <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>
                           <span className='text-sm'>Export clean Python code</span>
                        </div>
                        <div className='flex items-center space-x-3 text-gray-300'>
                           <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>
                           <span className='text-sm'>Cloud project management</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className='mt-8 text-center'>
               <p className='text-sm text-gray-400'>
                  By continuing, you agree to our{' '}
                  <a
                     href='/terms'
                     className='text-purple-400 hover:text-purple-300 transition-colors'
                  >
                     Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                     href='/privacy'
                     className='text-purple-400 hover:text-purple-300 transition-colors'
                  >
                     Privacy Policy
                  </a>
                  .
               </p>
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

export default AuthPage
