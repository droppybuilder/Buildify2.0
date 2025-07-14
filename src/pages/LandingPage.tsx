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
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import logo from '/logo6.png'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { HeroSection } from '@/components/ui/hero-section-1'

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
         { name: 'Code export (3 per month)', included: true },
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
         { name: 'Unlimited code export', included: true },
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
         { name: 'Unlimited code export', included: true },
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
      { name: 'Unlimited code export', included: true },
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

   // Scroll animations
   const featuresAnimation = useScrollAnimation({ threshold: 0.15 })
   const demoAnimation = useScrollAnimation({ threshold: 0.2 })
   const pricingAnimation = useScrollAnimation({ threshold: 0.15 })
   const teamAnimation = useScrollAnimation({ threshold: 0.2 })
   const contactAnimation = useScrollAnimation({ threshold: 0.15 })

   // Mouse tracking for animated cursor
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
      <div className='min-h-screen w-full relative overflow-x-hidden bg-slate-950 text-purple-100 font-sans'>
         {/* Animated Cursor Effect */}
         <div
            className='fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 opacity-50 transition-all duration-300 ease-out'
            style={{
               left: mousePosition.x - 12,
               top: mousePosition.y - 12,
               background: `radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)`,
            }}
         />
         <HeroSection
            handleNavigation={handleNavigation}
            userExists={userExists}
         />
         {/* Features Section */}
         <section
            ref={featuresAnimation.elementRef}
            id='features'
            className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative transition-all duration-1000 ease-out ${
               featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
         >
            {/* Background effects */}
            <div className='absolute inset-0 overflow-hidden'>
               <div className='absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl animate-pulse-slow' />
               <div className='absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse-slow' style={{ animationDelay: '2s' }} />
            </div>
            
            <div className='max-w-7xl mx-auto relative z-10'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-purple-300 font-display'>
                     Powerful Features
                  </h2>
                  <p className='text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed font-sans'>
                     Everything you need to build professional Python GUIs without writing a single line of code
                  </p>
               </div>

               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
                  {features.map((feature, index) => (
                     <Card
                        key={index}
                        className={`group bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-6 sm:p-8 hover:bg-slate-900/80 hover:border-purple-600/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg shadow-purple-950/20 hover:shadow-purple-900/30 hover:shadow-xl ${
                           featuresAnimation.isVisible 
                             ? 'opacity-100 translate-y-0 translate-x-0' 
                             : `opacity-0 ${index % 2 === 0 ? 'translate-x-[-30px]' : 'translate-x-[30px]'} translate-y-4`
                        }`}
                        style={{ 
                           transitionDelay: featuresAnimation.isVisible ? `${0.1 * index}s` : '0s',
                           transitionDuration: '0.8s'
                        }}
                     >
                        <CardContent className='p-0'>
                           <div
                              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                           >
                              {feature.icon}
                           </div>
                           <h3 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-purple-200 font-display'>
                              {feature.title}
                           </h3>
                           <p className='text-purple-300 text-sm sm:text-base leading-relaxed font-sans'>{feature.desc}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>{' '}
         {/* Reviews Marquee */}
         <section className='py-12 sm:py-16 lg:py-20 overflow-x-auto bg-slate-950 relative'>
            {/* Subtle gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950 pointer-events-none' />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
               <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-display'>
                  What Buildfy Users Say
               </h2>
               <div className='relative'>
                  <div className='flex animate-marquee space-x-6 sm:space-x-8 min-w-[200%]'>
                     {[...reviews, ...reviews].map((review, index) => (
                        <Card
                           key={index}
                           className='flex-shrink-0 w-72 sm:w-80 bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-4 sm:p-6 hover:border-purple-600/70 hover:bg-slate-900/80 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-950/20'
                        >
                           <CardContent className='p-0'>
                              <div className='flex items-center mb-3 sm:mb-4'>
                                 <span className='text-2xl sm:text-3xl mr-2 sm:mr-3'>{review.avatar}</span>
                                 <div className='min-w-0 flex-1'>
                                    <h4 className='font-semibold text-purple-200 text-sm sm:text-base truncate'>
                                       {review.name}
                                    </h4>
                                    <p className='text-purple-300 text-xs sm:text-sm truncate'>{review.role}</p>
                                 </div>
                                 <div className='ml-2 flex text-yellow-400 text-sm'>
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                       <span key={i}>⭐</span>
                                    ))}
                                 </div>
                              </div>
                              <p className='text-purple-200 text-sm sm:text-base italic leading-relaxed'>
                                 "{review.text}"
                              </p>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               </div>
            </div>
         </section>{' '}
         {/* Demo Section */}
         <section
            ref={demoAnimation.elementRef}
            id='demo'
            className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative transition-all duration-1000 ease-out ${
               demoAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
         >
            {/* Animated background elements */}
            <div className='absolute inset-0 overflow-hidden'>
               <div className='absolute top-0 left-1/3 w-72 h-72 bg-purple-800/5 rounded-full blur-3xl animate-float-gentle' />
               <div className='absolute bottom-0 right-1/3 w-72 h-72 bg-pink-800/5 rounded-full blur-3xl animate-float-gentle' style={{ animationDelay: '3s' }} />
            </div>
            
            <div className='max-w-6xl mx-auto text-center relative z-10'>
               <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-purple-300 font-display'>
                  See Buildfy in Action
               </h2>
               <p className='text-lg sm:text-xl text-purple-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-sans'>
                  Watch how easy it is to create professional Python GUIs with our visual builder
               </p>
               <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 sm:p-6 lg:p-8 backdrop-blur-md border border-purple-800/50 hover:border-purple-600/70 transition-all duration-700 shadow-2xl shadow-purple-950/30 hover:shadow-purple-900/40 ${
                  demoAnimation.isVisible ? 'scale-100 rotate-0' : 'scale-95 rotate-1'
               }`} style={{ transitionDelay: demoAnimation.isVisible ? '0.4s' : '0s' }}>
                  <video
                     className={`w-full aspect-video rounded-xl sm:rounded-2xl object-cover transition-transform duration-700 ${
                        demoAnimation.isVisible ? 'scale-100' : 'scale-105'
                     }`}
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
            ref={pricingAnimation.elementRef}
            id='pricing'
            className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative transition-all duration-1000 ease-out ${
               pricingAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
         >
            {/* Background gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950' />
            
            <div className='max-w-7xl mx-auto relative z-10'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-purple-300 font-display'>
                     Choose Your Plan
                  </h2>
                  <p className='text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed font-sans'>
                     Start free and scale as you grow. All plans include our core features.
                  </p>
               </div>

               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
                  {displayPlans.map((plan, index) => (
                     <Card
                        key={plan.id}
                        className={`relative bg-slate-900/60 backdrop-blur-md border rounded-2xl p-6 sm:p-8 hover:bg-slate-900/80 hover:border-purple-600/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 shadow-lg shadow-purple-950/20 hover:shadow-purple-900/40 hover:shadow-2xl ${
                           plan.tier === 'pro' ? 'border-purple-500 ring-2 ring-purple-500/20 hover:ring-purple-400/30' : 'border-purple-800/50'
                        } ${
                           pricingAnimation.isVisible 
                             ? 'opacity-100 translate-y-0' 
                             : 'opacity-0 translate-y-6'
                        }`}
                        style={{ 
                           transitionDelay: pricingAnimation.isVisible ? `${0.15 * index}s` : '0s',
                           transitionDuration: '0.7s'
                        }}
                     >
                        {plan.tier === 'pro' && (
                           <Badge className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm'>
                              Most Popular
                           </Badge>
                        )}
                        <CardContent className='p-0'>
                           <div className='text-center mb-6 sm:mb-8'>
                              <h3 className='text-xl sm:text-2xl font-bold mb-2 text-purple-200'>{plan.name}</h3>
                              <p className='text-purple-300 text-sm sm:text-base mb-3 sm:mb-4'>{plan.description}</p>
                              <div className='flex items-baseline justify-center'>
                                 <span className='text-3xl sm:text-4xl font-bold text-purple-400'>{plan.price}</span>
                                 <span className='text-purple-300 ml-2 text-sm sm:text-base'>
                                    /{plan.billingPeriod}
                                 </span>
                              </div>
                           </div>
                           <ul className='space-y-2 sm:space-y-3 mb-6 sm:mb-8'>
                              {plan.features.map((feature, index) => (
                                 <li
                                    key={index}
                                    className={`flex items-center text-sm sm:text-base ${
                                       feature.included ? 'text-green-400' : 'text-purple-700'
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
                                    ? 'bg-purple-800 hover:bg-purple-700'
                                    : 'bg-purple-900 hover:bg-purple-800 border border-purple-800'
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
         <section 
            ref={teamAnimation.elementRef}
            className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative transition-all duration-1000 ease-out ${
               teamAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
         >
            {/* Subtle animated background */}
            <div className='absolute inset-0 overflow-hidden'>
               <div className='absolute top-1/2 left-0 w-64 h-64 bg-purple-900/5 rounded-full blur-3xl animate-pulse-slow' />
               <div className='absolute top-1/2 right-0 w-64 h-64 bg-pink-900/5 rounded-full blur-3xl animate-pulse-slow' style={{ animationDelay: '4s' }} />
            </div>
            
            <div className='max-w-5xl mx-auto relative z-10'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-purple-300 font-display'>
                     Meet Our Team
                  </h2>
                  <p className='text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed font-sans'>
                     The passionate developers behind Buildfy, making GUI development accessible to everyone
                  </p>
               </div>

               <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center'>
                  {team.map((member, index) => (
                     <Card
                        key={index}
                        className={`bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-6 sm:p-8 hover:bg-slate-900/80 hover:border-purple-600/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-sm shadow-lg shadow-purple-950/20 hover:shadow-purple-900/30 hover:shadow-xl ${
                           teamAnimation.isVisible 
                             ? 'opacity-100 translate-x-0' 
                             : `opacity-0 ${index === 0 ? 'translate-x-[-40px]' : 'translate-x-[40px]'}`
                        }`}
                        style={{ 
                           transitionDelay: teamAnimation.isVisible ? `${0.2 * index}s` : '0s',
                           transitionDuration: '0.8s'
                        }}
                     >
                        <CardContent className='p-0 text-center'>
                           <img
                              src={member.img}
                              alt={member.name}
                              className='w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 sm:mb-6 ring-4 ring-purple-500/20'
                           />
                           <h3 className='text-lg sm:text-xl font-semibold mb-2 text-purple-200'>{member.name}</h3>
                           <p className='text-purple-400 mb-3 sm:mb-4 text-sm sm:text-base'>{member.role}</p>
                           <Button
                              variant='outline'
                              size='sm'
                              onClick={() => window.open(member.peerlist, '_blank')}
                              className='border-purple-700 text-purple-300 hover:bg-purple-800/30 text-xs sm:text-sm'
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
            ref={contactAnimation.elementRef}
            id='contact'
            className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative transition-all duration-1000 ease-out ${
               contactAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
         >
            {/* Animated background gradients */}
            <div className='absolute inset-0 overflow-hidden'>
               <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-900/10 to-pink-900/10 rounded-full blur-3xl animate-float-gentle' />
               <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-full blur-3xl animate-float-gentle' style={{ animationDelay: '5s' }} />
            </div>
            
            <div className='max-w-5xl mx-auto relative z-10'>
               <div className='text-center mb-12 sm:mb-16'>
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-purple-300 font-display'>
                     Get in Touch
                  </h2>
                  <p className='text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed font-sans'>
                     Have questions? Need support? Want to collaborate? We'd love to hear from you!
                  </p>
               </div>

               <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-stretch'>
                  {/* Contact Form */}
                  <Card className={`bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-6 sm:p-8 h-full hover:border-purple-600/70 hover:bg-slate-900/80 transition-all duration-500 shadow-lg shadow-purple-950/20 hover:shadow-purple-900/30 ${
                     contactAnimation.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-40px]'
                  }`} style={{ transitionDelay: contactAnimation.isVisible ? '0.4s' : '0s', transitionDuration: '0.8s' }}>
                     <CardContent className='p-0 h-full flex flex-col'>
                        <h3 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-purple-200 font-display'>
                           Send us a message
                        </h3>
                        <form
                           onSubmit={handleContactSubmit}
                           className='space-y-4 sm:space-y-6 flex-1'
                        >
                           <div>
                              <label className='block text-sm font-medium text-purple-300 mb-2'>Name</label>
                              <Input
                                 value={contactForm.name}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                                 className='bg-purple-950 border-purple-800 text-purple-100 placeholder-purple-400 rounded-xl text-sm sm:text-base'
                                 placeholder='Your name'
                                 required
                              />
                           </div>
                           <div>
                              <label className='block text-sm font-medium text-purple-300 mb-2'>Email</label>
                              <Input
                                 type='email'
                                 value={contactForm.email}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                                 className='bg-purple-950 border-purple-800 text-purple-100 placeholder-purple-400 rounded-xl text-sm sm:text-base'
                                 placeholder='your@email.com'
                                 required
                              />
                           </div>
                           <div className='flex-1'>
                              <label className='block text-sm font-medium text-purple-300 mb-2'>Message</label>
                              <Textarea
                                 value={contactForm.message}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                                 className='bg-purple-950 border-purple-800 text-purple-100 placeholder-purple-400 rounded-xl min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none'
                                 placeholder='Tell us how we can help...'
                                 required
                              />
                           </div>

                           <Button
                              type='submit'
                              disabled={isSubmitting}
                              className='w-full bg-purple-800 hover:bg-purple-700 py-2 sm:py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
                           >
                              {isSubmitting ? 'Sending... ⏳' : 'Send Message 📧'}
                           </Button>
                        </form>
                     </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <div className={`space-y-4 sm:space-y-6 lg:space-y-8 h-full flex flex-col justify-center transition-all duration-800 ease-out ${
                     contactAnimation.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[40px]'
                  }`} style={{ transitionDelay: contactAnimation.isVisible ? '0.6s' : '0s' }}>
                     <Card className='bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-4 sm:p-6 hover:border-purple-600/70 hover:bg-slate-900/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-950/20'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 👨‍💼
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-purple-200 text-sm sm:text-base'>Pratyush Mishra</h4>
                                 <p className='text-purple-300 text-xs sm:text-sm break-all'>proxlight02@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-4 sm:p-6 hover:border-purple-600/70 hover:bg-slate-900/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-950/20'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 📧
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-purple-200 text-sm sm:text-base'>Email Support</h4>
                                 <p className='text-purple-300 text-xs sm:text-sm break-all'>droppybuilder@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-4 sm:p-6 hover:border-purple-600/70 hover:bg-slate-900/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-950/20'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 🐛
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-purple-200 text-sm sm:text-base'>Bug Reports</h4>
                                 <p className='text-purple-300 text-xs sm:text-sm break-all'>droppybuilder@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-slate-900/60 backdrop-blur-md border border-purple-800/50 rounded-2xl p-4 sm:p-6 hover:border-purple-600/70 hover:bg-slate-900/80 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-950/20'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-3 sm:space-x-4'>
                              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0'>
                                 👨‍💻
                              </div>
                              <div className='min-w-0 flex-1'>
                                 <h4 className='font-semibold text-purple-200 text-sm sm:text-base'>
                                    Nakul Srivastava
                                 </h4>
                                 <p className='text-purple-300 text-xs sm:text-sm break-all'>imnakul44@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </section>{' '}
         {/* Footer */}
         <footer className='bg-slate-950 border-t border-purple-900/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative'>
            {/* Footer background effect */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-900/20' />
            
            <div className='max-w-7xl mx-auto relative z-10'>
               <div className='text-center'>
                  <div className='flex items-center justify-center space-x-2 mb-3 sm:mb-4'>
                     <img
                        src={logo}
                        alt='Buildfy Web'
                        className='h-8 w-8 sm:h-10 sm:w-10 rounded-lg hover:scale-110 transition-transform duration-300'
                     />
                     <span className='text-xl sm:text-2xl font-bold text-purple-300 font-display'>Buildfy Web</span>
                  </div>
                  <p className='text-purple-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-sans'>
                     Making Python GUI development accessible to everyone through visual design.
                  </p>
                  <div className='border-t border-purple-900/30 pt-6 sm:pt-8'>
                     <p className='text-purple-700 text-xs sm:text-sm'>© 2025 Buildfy Web. All rights reserved.</p>
                  </div>
               </div>
            </div>{' '}
         </footer>{' '}
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
            @keyframes float-gentle {
               0%, 100% { transform: translateY(0px) rotate(0deg); }
               50% { transform: translateY(-20px) rotate(180deg); }
            }
            @keyframes pulse-slow {
               0%, 100% { opacity: 0.4; transform: scale(1); }
               50% { opacity: 0.8; transform: scale(1.05); }
            }
            @keyframes bounce-gentle {
               0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
               40% { transform: translateY(-10px); }
               60% { transform: translateY(-5px); }
            }
            
            .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
            .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
            .animate-float-3 { animation: float-3 15s ease-in-out infinite; }
            .animate-marquee { animation: marquee 30s linear infinite; }
            .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
            .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
         `}</style>
         {/* Mobile Device Dialog */}
         <Dialog
            open={showMobileDialog}
            onOpenChange={setShowMobileDialog}
         >
            <DialogContent className='bg-slate-950 border-purple-800 text-purple-100 max-w-sm mx-auto rounded-xl backdrop-blur-md'>
               <DialogHeader>
                  <DialogTitle className='text-xl sm:text-2xl font-bold text-purple-300 text-center animate-fade-in-up'>
                     📱 Mobile Device Detected
                  </DialogTitle>
                  <DialogDescription className='text-purple-300 text-center text-base leading-relaxed mt-4 animate-fade-in-up' style={{ animationDelay: '0.2s' }}>
                     Buildfy Web works best on larger screens for the optimal visual building experience.
                  </DialogDescription>
               </DialogHeader>

               <div className='space-y-4 mt-6'>
                  <div className='text-center animate-fade-in-up' style={{ animationDelay: '0.4s' }}>
                     <h4 className='font-semibold text-purple-200 mb-3'>Continue on a bigger screen:</h4>
                     <div className='flex justify-center space-x-4 text-4xl mb-4 animate-bounce-gentle'>
                        <span title='Tablet' className='hover:scale-125 transition-transform duration-300'>📱</span>
                        <span title='Laptop' className='hover:scale-125 transition-transform duration-300'>💻</span>
                        <span title='Desktop' className='hover:scale-125 transition-transform duration-300'>🖥️</span>
                     </div>
                  </div>

                  <div className='bg-slate-900/60 backdrop-blur-md rounded-xl p-4 border border-purple-800/50 hover:border-purple-600/70 transition-colors duration-300 animate-fade-in-up' style={{ animationDelay: '0.6s' }}>
                     <p className='text-sm text-purple-300 text-center leading-relaxed'>
                        For the best drag-and-drop experience and full access to all features, please visit Buildfy Web
                        on a tablet, laptop, or desktop computer.
                     </p>
                  </div>

                  <Button
                     onClick={() => setShowMobileDialog(false)}
                     className='w-full bg-purple-800 hover:bg-purple-700 py-3 rounded-xl text-base hover:scale-105 transition-all duration-300 animate-fade-in-up'
                     style={{ animationDelay: '0.8s' }}
                  >
                     Got it! 👍
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   )
}

export default LandingPage
