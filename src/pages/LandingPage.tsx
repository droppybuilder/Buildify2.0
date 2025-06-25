import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { db } from '@/integrations/firebase/firebase.config'
import { collection, addDoc } from 'firebase/firestore'
import { useIsMobile } from '@/hooks/use-mobile'
import logo from '/logo6.png'

const features = [
   {
      title: 'Visual Tkinter Builder',
      desc: 'Drag, drop, and visually design Python Tkinter GUIs with instant code preview.',
      icon: '🖱️',
      gradient: 'from-purple-500 to-pink-500',
   },
   {
      title: 'Export Instantly',
      desc: 'Export clean, production-ready Python code for your desktop apps in one click.',
      icon: '🚀',
      gradient: 'from-blue-500 to-cyan-500',
   },
   {
      title: 'Modern UI Components',
      desc: 'Access a library of beautiful, customizable widgets and layouts.',
      icon: '🎨',
      gradient: 'from-green-500 to-emerald-500',
   },
   {
      title: 'No Coding Required',
      desc: 'Build complex interfaces without writing a single line of code.',
      icon: '🤖',
      gradient: 'from-orange-500 to-red-500',
   },
   {
      title: 'Cloud Profiles',
      desc: 'Save your projects and access them from anywhere, anytime.',
      icon: '☁️',
      gradient: 'from-indigo-500 to-purple-500',
   },
   {
      title: 'Flexible Pricing',
      desc: 'Start for free, upgrade for more power and features.',
      icon: '💸',
      gradient: 'from-yellow-500 to-orange-500',
   },
]

const reviews = [
   {
      name: 'Ritika Sharma',
      role: 'Educator',
      rating: 5,
      text: "It's intuitive and easy to use, making it perfect for my tutorials. I'd love to see more customization options in the future, but overall, it's a great tool for beginners. Looking forward to what's next!",
      avatar: '👩‍🏫',
   },
   {
      name: 'Daniel Kim',
      role: 'YouTuber',
      rating: 5,
      text: "I've been using the free version for my YouTube tutorials, and it's perfect for beginners! The interface is simple, and it's easy to create basic UIs. It's a great tool to learn with, and I'm excited to try the Pro version soon!",
      avatar: '📹',
   },
   {
      name: 'Meera Joshi',
      role: 'Pro User',
      rating: 5,
      text: "I recently tried the Pro version after using the free one, and I'm honestly impressed. The additional features like customizable themes, more widget options, and the ability to save and export projects have made my development process so much smoother. Definitely worth the investment for anyone serious about building Python applications with great UIs!",
      avatar: '👩‍💻',
   },
   {
      name: 'Liam Garcia',
      role: 'Developer',
      rating: 5,
      text: "I've been looking for a tool that simplifies GUI creation, and this product is exactly what I needed! The drag-and-drop interface is so intuitive, and the ability to quickly customize widgets and layouts saved me hours of work. Highly recommend for anyone working on Python projects!",
      avatar: '👨‍💻',
   },
   {
      name: 'Tanmay Bansal',
      role: 'Python Developer',
      rating: 5,
      text: 'Great product loved using it. It is not a virus — sometimes the Python code is flagged as a virus file. I have connected with the creator, and they sent me the Python file which is great and contains no virus.',
      avatar: '🛡️',
   },
   {
      name: 'Sofia Ahmed',
      role: 'Tutorial Creator',
      rating: 5,
      text: "I've been using the free version for a few of my Python tutorials, and I'm really impressed with how easy it is to use. The interface is clean, and it's super beginner-friendly. I love how quickly I can create simple UIs. Still, it's an excellent starting point!",
      avatar: '👩‍🎓',
   },
   {
      name: 'Arjun Nair',
      role: 'App Developer',
      rating: 5,
      text: 'I started with the free version and loved the simplicity, but once I tried the Pro version, it blew me away! The extra features, especially the ability to fully customize the widgets and export options, have taken my projects to the next level.',
      avatar: '🚀',
   },
]

const team = [
   {
      name: 'Pratyush Mishra',
      role: 'Founder & CEO',
      img: '/prof1.jpg',
      peerlist: 'https://peerlist.io/pratyush2002',
   },
   {
      name: 'Nakul Srivastava',
      role: 'Developer',
      img: '/prof2.png',
      peerlist: 'https://devnakul.me',
   },
]

const plans = [
   {
      id: 'free',
      name: 'Free',
      description: 'Basic features for hobbyists',
      price: '$0',
      billingPeriod: 'forever',
      tier: 'free',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Limited canvas size', included: true },
         { name: 'Watermarked exports', included: true },
         { name: 'Community support', included: true },
         { name: 'Cloud projects (limit: 3)', included: true },
         { name: 'Export code', included: false },
         { name: 'Advanced widgets', included: false },
         { name: 'No watermarks', included: false },
         { name: 'Priority support', included: false },
      ],
   },
   {
      id: 'standard',
      name: 'Standard',
      description: 'For serious developers',
      price: '$8',
      billingPeriod: 'monthly',
      tier: 'standard',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Unlimited canvas size', included: true },
         { name: 'Export code without watermark', included: true },
         { name: 'Community support', included: true },
         { name: 'Advanced widgets', included: true },
         { name: 'Email support', included: true },
         { name: 'Cloud projects (limit: 10)', included: true },
         { name: 'Priority support', included: false },
         { name: 'Custom integrations', included: false },
      ],
   },
   {
      id: 'pro',
      name: 'Pro',
      description: 'For professional developers',
      price: '$95',
      billingPeriod: 'yearly',
      tier: 'pro',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Unlimited canvas size', included: true },
         { name: 'Export code without watermark', included: true },
         { name: 'Community support', included: true },
         { name: 'Advanced widgets', included: true },
         { name: 'Email support', included: true },
         { name: 'Priority support', included: true },
         { name: 'Custom integrations', included: true },
         { name: 'Cloud projects (limit: 20)', included: true },
      ],
   },
]

const lifetimePlan = {
   id: 'lifetime',
   name: 'Lifetime',
   description: 'Pay once - Use Forever',
   price: '$200',
   billingPeriod: 'forever',
   tier: 'lifetime',
   features: [
      { name: 'Basic widgets', included: true },
      { name: 'Unlimited canvas size', included: true },
      { name: 'Export code without watermark', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced widgets', included: true },
      { name: 'Email support', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Lifetime updates', included: true },
      { name: 'Cloud projects (unlimited)', included: true },
   ],
}

const LandingPage: React.FC = () => {
   const navigate = useNavigate()
   const isMobile = useIsMobile()
   const userExists = Boolean(localStorage.getItem('user'))
   const displayPlans = [...plans, lifetimePlan]
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [showMobileDialog, setShowMobileDialog] = useState(false)

   // Check for URL parameters (payment status, etc.)
   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const status = urlParams.get('status')
      
      if (status === 'cancelled') {
         toast.info('💭 Payment was cancelled. You can try again anytime!')
         // Clean up URL
         window.history.replaceState({}, '', '/landing')
      } else if (status === 'expired') {
         toast.warning('⏰ Payment session expired. Please start a new payment.')
         // Clean up URL  
         window.history.replaceState({}, '', '/landing')
      } else if (status === 'timeout') {
         toast.error('⏱️ Payment check timed out. If you made a payment, please contact support.')
         // Clean up URL
         window.history.replaceState({}, '', '/landing')
      }
   }, [])

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
   }, [])

   const handleContactSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
         // Save to Firebase Firestore
         await addDoc(collection(db, 'contactform'), {
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message,
            timestamp: new Date(),
            status: 'new',
         })

         // Show success toast
         toast.success("Message sent successfully! 🎉 We'll get back to you soon.")

         // Reset form
         setContactForm({ name: '', email: '', message: '' })
      } catch (error) {
         console.error('Error submitting contact form:', error)
         toast.error('Failed to send message. Please try again.')
      } finally {
         setIsSubmitting(false)
      }
   }

   const handleNavigation = (path: string) => {
      if (isMobile) {
         setShowMobileDialog(true)
      } else {
         navigate(path)
      }
   }

   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
         {' '}
         {/* ===== TEMPORARY LAUNCH BADGES - REMOVE AFTER LAUNCH ===== */}
         <div className='launch-badges fixed top-16 sm:top-18 left-0 right-0 z-30 bg-gradient-to-r from-black/30  via-purple-700/70 to-black/30 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto px-4 py-3'>
               <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6'>
                  <div className='flex items-center gap-2'>
                     <span className='text-white text-sm sm:text-base font-semibold animate-pulse'>
                        🚀 We're Live on
                     </span>
                  </div>
                  <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
                     {/* Product Hunt Badge */}
                     <a
                        href='https://www.producthunt.com/products/buildfy-web?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-buildfy&#0045;web'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='transition-transform hover:scale-105'
                     >
                        <img
                           src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=982539&theme=light&t=1750756805683'
                           alt='Buildfy Web - Turn Ideas into Python Apps — Without Writing Code | Product Hunt'
                           style={{ width: '220px', height: '48px' }}
                           width='220'
                           height='48'
                           className='rounded-md shadow-lg'
                        />
                     </a>
                     {/* Peerlist Badge */}
                     <a
                        href='https://peerlist.io/pratyush2002'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='transition-transform hover:scale-105'
                     >
                        <img
                           src='/Launch_SVG_Light.svg'
                           alt='Peerlist Launch Badge'
                           style={{ width: '220px', height: '48px' }}
                           width='220'
                           height='48'
                           className='rounded-md shadow-lg bg-white/10 p-1'
                        />
                     </a>
                  </div>
                  <button
                     className='hidden sm:block text-white/70 hover:text-white text-xs transition-colors'
                     onClick={() => document.querySelector('.launch-badges')?.remove()}
                     title='Hide badges'
                  >
                     ✕
                  </button>
               </div>
            </div>
         </div>
         
         {/* ===== PAYMENT SUPPORT NOTICE ===== */}
         <div className='payment-notice fixed top-32 sm:top-36 left-0 right-0 z-25 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 backdrop-blur-md border-y border-blue-500/30'>
            <div className='max-w-7xl mx-auto px-4 py-2'>
               <div className='flex flex-col sm:flex-row items-center justify-center gap-2 text-center'>
                  <span className='text-blue-300 text-xs sm:text-sm'>
                     💳 Having payment issues? 
                  </span>
                  <a 
                     href='/payment-debug' 
                     className='text-blue-200 hover:text-white text-xs sm:text-sm underline transition-colors'
                  >
                     Check payment status
                  </a>
                  <span className='text-blue-300 text-xs sm:text-sm'>
                     or 
                  </span>
                  <a 
                     href='#contact' 
                     className='text-blue-200 hover:text-white text-xs sm:text-sm underline transition-colors'
                     onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                     }}
                  >
                     contact support
                  </a>
                  <button
                     className='hidden sm:block text-blue-300/70 hover:text-white text-xs transition-colors ml-4'
                     onClick={() => document.querySelector('.payment-notice')?.remove()}
                     title='Hide notice'
                  >
                     ✕
                  </button>
               </div>
            </div>
         </div>
         {/* ===== END PAYMENT SUPPORT NOTICE ===== */}
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
         </div>{' '}
         {/* Navbar */}
         <nav className='fixed top-0 w-full bg-black/10 backdrop-blur-xl border-b border-white/10 z-40'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <div className='flex items-center justify-between h-16 sm:h-18'>
                  <div className='flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0'>
                     <img
                        src={logo}
                        alt='Buildfy Web'
                        className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg flex-shrink-0'
                     />
                     <span className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-none'>
                        Buildfy Web
                     </span>
                  </div>
                  <div className='hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8'>
                     <a
                        href='#features'
                        className='hover:text-purple-400 transition-colors text-sm lg:text-base whitespace-nowrap'
                     >
                        Features
                     </a>
                     <a
                        href='#pricing'
                        className='hover:text-purple-400 transition-colors text-sm lg:text-base whitespace-nowrap'
                     >
                        Pricing
                     </a>
                     <a
                        href='#contact'
                        className='hover:text-purple-400 transition-colors text-sm lg:text-base whitespace-nowrap'
                     >
                        Contact
                     </a>
                  </div>{' '}
                  <div className='flex items-center space-x-2 sm:space-x-3 flex-shrink-0'>
                     {userExists ? (
                        <Button
                           onClick={() => handleNavigation('/')}
                           className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-2 sm:px-4 lg:px-6 py-2 rounded-xl text-xs sm:text-sm lg:text-base whitespace-nowrap'
                        >
                           <span className='hidden sm:inline'>Enter Canvas</span>
                           <span className='sm:hidden'>Canvas</span>
                        </Button>
                     ) : (
                        <>
                           <Button
                              variant='ghost'
                              onClick={() => handleNavigation('/auth')}
                              className='hover:bg-white/10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm lg:text-base whitespace-nowrap'
                           >
                              <span className='hidden sm:inline'>Sign In</span>
                              <span className='sm:hidden'>Login</span>
                           </Button>
                           <Button
                              onClick={() => handleNavigation('/auth')}
                              className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-2 sm:px-4 lg:px-6 py-2 rounded-xl text-xs sm:text-sm lg:text-base whitespace-nowrap'
                           >
                              <span className='hidden sm:inline'>Get Started</span>
                              <span className='sm:hidden'>Start</span>
                           </Button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>{' '}
         {/* Hero Section */}
         <section className='relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto text-center pt-40 sm:pt-44 pb-8 sm:pb-12'>
               <div className='flex flex-col items-center justify-center space-y-6 sm:space-y-8'>
                  <Badge className='bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-500/30 px-3 sm:px-4 py-2 text-xs sm:text-sm lg:text-base'>
                     🚀 Web version of the popular Buildfy Tool
                  </Badge>
                  <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight'>
                     Build Python GUIs
                     <br />
                     <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                        Visually & Effortlessly
                     </span>
                  </h1>
                  <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4'>
                     Create stunning Tkinter desktop applications with our intuitive drag-and-drop interface. No coding
                     required - just design, customize, and export production-ready Python code.
                  </p>{' '}
                  <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none'>
                     <Button
                        size='lg'
                        onClick={() => handleNavigation(userExists ? '/app' : '/auth')}
                        className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[200px]'
                     >
                        🚀 Start Building Now
                     </Button>{' '}
                     <Button
                        size='lg'
                        variant='outline'
                        onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                        className='border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg rounded-xl w-full sm:w-auto min-w-[200px]'
                     >
                        ▶️ Watch Trailer
                     </Button>
                  </div>
                  {/* Stats */}
                  <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl mx-auto pt-8 sm:pt-12'>
                     {[
                        { number: '10,000+', label: 'GUIs Created' },
                        { number: '5,000+', label: 'Happy Developers' },
                        { number: '50+', label: 'UI Components' },
                        { number: '99%', label: 'Code Quality' },
                     ].map((stat, index) => (
                        <div
                           key={index}
                           className='text-center'
                        >
                           <div className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                              {stat.number}
                           </div>
                           <div className='text-gray-400 text-xs sm:text-sm lg:text-base'>{stat.label}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>{' '}
         {/* Reviews Marquee */}
         <section className='py-12 sm:py-16 lg:py-20 overflow-hidden'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  What Buildfy Users Say
               </h2>
               <div className='relative'>
                  <div className='flex animate-marquee space-x-6 sm:space-x-8'>
                     {[...reviews, ...reviews].map((review, index) => (
                        <Card
                           key={index}
                           className='flex-shrink-0 w-72 sm:w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6'
                        >
                           <CardContent className='p-0'>
                              <div className='flex items-center mb-3 sm:mb-4'>
                                 <span className='text-2xl sm:text-3xl mr-2 sm:mr-3'>{review.avatar}</span>
                                 <div className='min-w-0 flex-1'>
                                    <h4 className='font-semibold text-white text-sm sm:text-base truncate'>
                                       {review.name}
                                    </h4>
                                    <p className='text-gray-400 text-xs sm:text-sm truncate'>{review.role}</p>
                                 </div>
                                 <div className='ml-2 flex text-yellow-400 text-sm'>
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                       <span key={i}>⭐</span>
                                    ))}
                                 </div>
                              </div>
                              <p className='text-gray-300 text-sm sm:text-base italic leading-relaxed'>
                                 "{review.text}"
                              </p>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               </div>
            </div>
         </section>{' '}
         {/* Features Section */}
         <section
            id='features'
            className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8'
         >
            <div className='max-w-7xl mx-auto'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Powerful Features
                  </h2>
                  <p className='text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                     Everything you need to build professional Python GUIs without writing a single line of code
                  </p>
               </div>

               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
                  {features.map((feature, index) => (
                     <Card
                        key={index}
                        className='group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105'
                     >
                        <CardContent className='p-0'>
                           <div
                              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                           >
                              {feature.icon}
                           </div>
                           <h3 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white'>{feature.title}</h3>
                           <p className='text-gray-300 text-sm sm:text-base leading-relaxed'>{feature.desc}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>{' '}
         {/* Demo Section */}
         <section
            id='demo'
            className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20'
         >
            <div className='max-w-6xl mx-auto text-center'>
               <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  See Buildfy in Action
               </h2>
               <p className='text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed'>
                  Watch how easy it is to create professional Python GUIs with our visual builder
               </p>{' '}
               <div className='relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 sm:p-6 lg:p-8 backdrop-blur-md border border-white/10'>
                  <video
                     className='w-full aspect-video rounded-xl sm:rounded-2xl object-cover'
                     controls
                     poster='/thumbnail.png'
                  >
                     <source
                        src='https://res.cloudinary.com/dp2bzu9e2/video/upload/v1750582299/IMG_9655_eiwlv3.mp4'
                        type='video/mp4'
                     />
                     Your browser does not support the video tag.
                  </video>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl sm:rounded-3xl pointer-events-none' />
               </div>
            </div>
         </section>{' '}
         {/* Pricing Section */}
         <section
            id='pricing'
            className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8'
         >
            <div className='max-w-7xl mx-auto'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Choose Your Plan
                  </h2>
                  <p className='text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                     Start free and scale as you grow. All plans include our core features.
                  </p>
               </div>

               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
                  {displayPlans.map((plan) => (
                     <Card
                        key={plan.id}
                        className={`relative bg-white/5 backdrop-blur-md border rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 ${
                           plan.tier === 'pro' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-white/10'
                        }`}
                     >
                        {plan.tier === 'pro' && (
                           <Badge className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm'>
                              Most Popular
                           </Badge>
                        )}
                        <CardContent className='p-0'>
                           <div className='text-center mb-6 sm:mb-8'>
                              <h3 className='text-xl sm:text-2xl font-bold mb-2 text-white'>{plan.name}</h3>
                              <p className='text-gray-400 text-sm sm:text-base mb-3 sm:mb-4'>{plan.description}</p>
                              <div className='flex items-baseline justify-center'>
                                 <span className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                    {plan.price}
                                 </span>
                                 <span className='text-gray-400 ml-2 text-sm sm:text-base'>/{plan.billingPeriod}</span>
                              </div>
                           </div>
                           <ul className='space-y-2 sm:space-y-3 mb-6 sm:mb-8'>
                              {plan.features.map((feature, index) => (
                                 <li
                                    key={index}
                                    className={`flex items-center text-sm sm:text-base ${
                                       feature.included ? 'text-green-400' : 'text-gray-500'
                                    }`}
                                 >
                                    <span className='mr-2 sm:mr-3 text-xs sm:text-sm'>
                                       {feature.included ? '✅' : '❌'}
                                    </span>
                                    <span className='leading-tight'>{feature.name}</span>
                                 </li>
                              ))}
                           </ul>{' '}
                           <Button
                              className={`w-full py-2 sm:py-3 rounded-xl text-sm sm:text-base ${
                                 plan.tier === 'pro'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                              }`}
                              onClick={() => handleNavigation('/auth')}
                           >
                              Get Started
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>{' '}
         {/* Team Section */}
         <section className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20'>
            <div className='max-w-5xl mx-auto'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Meet Our Team
                  </h2>
                  <p className='text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                     The passionate developers behind Buildfy, making GUI development accessible to everyone
                  </p>
               </div>

               <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center'>
                  {team.map((member, index) => (
                     <Card
                        key={index}
                        className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 w-full max-w-sm'
                     >
                        <CardContent className='p-0 text-center'>
                           <img
                              src={member.img}
                              alt={member.name}
                              className='w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 sm:mb-6 ring-4 ring-purple-500/20'
                           />
                           <h3 className='text-lg sm:text-xl font-semibold mb-2 text-white'>{member.name}</h3>
                           <p className='text-purple-400 mb-3 sm:mb-4 text-sm sm:text-base'>{member.role}</p>
                           <Button
                              variant='outline'
                              size='sm'
                              onClick={() => window.open(member.peerlist, '_blank')}
                              className='border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-xs sm:text-sm'
                           >
                              View Profile
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>{' '}
         {/* Contact Section */}
         <section
            id='contact'
            className='py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8'
         >
            <div className='max-w-5xl mx-auto'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Get in Touch
                  </h2>
                  <p className='text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                     Have questions? Need support? Want to collaborate? We'd love to hear from you!
                  </p>
               </div>

               <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-stretch'>
                  {/* Contact Form */}
                  <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 h-full'>
                     <CardContent className='p-0 h-full flex flex-col'>
                        <h3 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white'>Send us a message</h3>
                        <form
                           onSubmit={handleContactSubmit}
                           className='space-y-4 sm:space-y-6 flex-1'
                        >
                           <div>
                              <label className='block text-sm font-medium text-gray-300 mb-2'>Name</label>
                              <Input
                                 value={contactForm.name}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                                 className='bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-sm sm:text-base'
                                 placeholder='Your name'
                                 required
                              />
                           </div>
                           <div>
                              <label className='block text-sm font-medium text-gray-300 mb-2'>Email</label>
                              <Input
                                 type='email'
                                 value={contactForm.email}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                                 className='bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-sm sm:text-base'
                                 placeholder='your@email.com'
                                 required
                              />
                           </div>
                           <div className='flex-1'>
                              <label className='block text-sm font-medium text-gray-300 mb-2'>Message</label>
                              <Textarea
                                 value={contactForm.message}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                                 className='bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none'
                                 placeholder='Tell us how we can help...'
                                 required
                              />
                           </div>

                           <Button
                              type='submit'
                              disabled={isSubmitting}
                              className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-2 sm:py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
                           >
                              {isSubmitting ? 'Sending... ⏳' : 'Send Message 📧'}
                           </Button>
                        </form>
                     </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <div className='space-y-4 sm:space-y-6 lg:space-y-8 h-full flex flex-col justify-center'>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 👨‍💼
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-white text-sm sm:text-base'>Pratyush Mishra</h4>
                                 <p className='text-gray-400 text-xs sm:text-sm break-all'>proxlight02@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 📧
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-white text-sm sm:text-base'>Email Support</h4>
                                 <p className='text-gray-400 text-xs sm:text-sm break-all'>droppybuilder@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 🐛
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-white text-sm sm:text-base'>Bug Reports</h4>
                                 <p className='text-gray-400 text-xs sm:text-sm break-all'>droppybuilder@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 👨‍💻
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-white text-sm sm:text-base'>Nakul Srivastava</h4>
                                 <p className='text-gray-400 text-xs sm:text-sm break-all'>imnakul44@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </section>{' '}
         {/* Footer */}
         <footer className='bg-black/20 backdrop-blur-md border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
               <div className='text-center'>
                  <div className='flex items-center justify-center space-x-2 mb-3 sm:mb-4'>
                     <img
                        src={logo}
                        alt='Buildfy Web'
                        className='h-8 w-8 sm:h-10 sm:w-10 rounded-lg'
                     />
                     <span className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                        Buildfy Web
                     </span>
                  </div>
                  <p className='text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed'>
                     Making Python GUI development accessible to everyone through visual design.
                  </p>
                  <div className='border-t border-white/10 pt-6 sm:pt-8'>
                     <p className='text-gray-400 text-xs sm:text-sm'>© 2025 Buildfy Web. All rights reserved.</p>
                  </div>
               </div>
            </div>{' '}
         </footer>{' '}
         {/* Mobile Device Dialog */}
         <Dialog
            open={showMobileDialog}
            onOpenChange={setShowMobileDialog}
         >
            <DialogContent className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/50 text-white max-w-sm mx-auto rounded-xl'>
               <DialogHeader>
                  <DialogTitle className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center'>
                     📱 Mobile Device Detected
                  </DialogTitle>
                  <DialogDescription className='text-gray-300 text-center text-base leading-relaxed mt-4'>
                     Buildfy Web works best on larger screens for the optimal visual building experience.
                  </DialogDescription>
               </DialogHeader>

               <div className='space-y-4 mt-6'>
                  <div className='text-center'>
                     <h4 className='font-semibold text-white mb-3'>Continue on a bigger screen:</h4>
                     <div className='flex justify-center space-x-4 text-4xl mb-4'>
                        <span title='Tablet'>📱</span>
                        <span title='Laptop'>💻</span>
                        <span title='Desktop'>🖥️</span>
                     </div>
                  </div>

                  <div className='bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20'>
                     <p className='text-sm text-gray-300 text-center leading-relaxed'>
                        For the best drag-and-drop experience and full access to all features, please visit Buildfy Web
                        on a tablet, laptop, or desktop computer.
                     </p>
                  </div>

                  <Button
                     onClick={() => setShowMobileDialog(false)}
                     className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl text-base'
                  >
                     Got it! 👍
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
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
            @keyframes marquee {
               0% { transform: translateX(0); }
               100% { transform: translateX(-50%); }
            }
            .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
            .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
            .animate-float-3 { animation: float-3 15s ease-in-out infinite; }
            .animate-marquee { animation: marquee 30s linear infinite; }
         `}</style>
      </div>
   )
}

export default LandingPage
