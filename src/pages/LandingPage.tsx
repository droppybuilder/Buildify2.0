import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
      name: 'Alex Chen',
      role: 'Python Developer',
      rating: 5,
      text: 'Buildfy revolutionized my workflow! Building Tkinter GUIs has never been this easy.',
      avatar: '👨‍💻',
   },
   {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      rating: 5,
      text: 'The drag-and-drop interface is intuitive. Saved me hours of coding!',
      avatar: '👩‍💻',
   },
   {
      name: 'Michael Torres',
      role: 'Data Scientist',
      rating: 5,
      text: 'Perfect for creating quick GUI prototypes. The code export is clean and professional.',
      avatar: '🧑‍🔬',
   },
   {
      name: 'Emily Davis',
      role: 'Freelancer',
      rating: 5,
      text: 'Client presentations are now 10x better with beautiful UIs created in minutes.',
      avatar: '👩‍🎨',
   },
   {
      name: 'David Kim',
      role: 'Startup Founder',
      rating: 5,
      text: 'Buildfy helped us launch our MVP faster. No more struggling with Tkinter layouts!',
      avatar: '🚀',
   },
   {
      name: 'Lisa Wang',
      role: 'CS Student',
      rating: 5,
      text: 'Learning GUI development became fun! The visual approach makes everything clear.',
      avatar: '🎓',
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
         { name: 'AI Integration', included: true },
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
      { name: 'AI Integration', included: true },
   ],
}

const LandingPage: React.FC = () => {
   const navigate = useNavigate()
   const userExists = Boolean(localStorage.getItem('user'))
   const displayPlans = [...plans, lifetimePlan]
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
   }, [])

   const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Handle contact form submission
      console.log('Contact form submitted:', contactForm)
      // Reset form
      setContactForm({ name: '', email: '', message: '' })
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
         {/* Navbar */}
         <nav className='fixed top-0 w-full bg-black/10 backdrop-blur-xl border-b border-white/10 z-40'>
            <div className='max-w-7xl mx-auto px-6 sm:px-8'>
               <div className='flex items-center justify-between h-16'>
                  <div className='flex items-center space-x-4'>
                     {' '}
                     <img
                        src={logo}
                        alt='Buildfy Web'
                        className='h-12 w-12 rounded-lg'
                     />
                     <span className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                        Buildfy Web
                     </span>
                  </div>
                  <div className='hidden md:flex items-center space-x-8'>
                     <a
                        href='#features'
                        className='hover:text-purple-400 transition-colors'
                     >
                        Features
                     </a>
                     <a
                        href='#pricing'
                        className='hover:text-purple-400 transition-colors'
                     >
                        Pricing
                     </a>
                     <a
                        href='#contact'
                        className='hover:text-purple-400 transition-colors'
                     >
                        Contact
                     </a>
                  </div>
                  <div className='flex items-center space-x-4'>
                     {userExists ? (
                        <Button
                           onClick={() => navigate('/app')}
                           className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-xl'
                        >
                           Open App
                        </Button>
                     ) : (
                        <>
                           <Button
                              variant='ghost'
                              onClick={() => navigate('/auth')}
                              className='hover:bg-white/10'
                           >
                              Sign In
                           </Button>
                           <Button
                              onClick={() => navigate('/auth')}
                              className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-xl'
                           >
                              Get Started
                           </Button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>
         {/* Hero Section */}
         <section className='relative pt-32 pb-20 px-6 sm:px-8'>
            <div className='max-w-6xl mx-auto text-center'>
               <Badge className='mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-500/30 px-4 py-2'>
                  🚀 Web version of the popular Buildfy Tool
               </Badge>

               <h1 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight'>
                  Build Python GUIs
                  <br />
                  <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Visually & Effortlessly
                  </span>
               </h1>

               <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed'>
                  Create stunning Tkinter desktop applications with our intuitive drag-and-drop interface. No coding
                  required - just design, customize, and export production-ready Python code.
               </p>

               <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
                  {' '}
                  <Button
                     size='lg'
                     onClick={() => navigate(userExists ? '/app' : '/auth')}
                     className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300'
                  >
                     🚀 Start Building Now
                  </Button>
                  <Button
                     size='lg'
                     variant='outline'
                     onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                     className='border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg rounded-xl'
                  >
                     ▶️ Watch Demo
                  </Button>
               </div>

               {/* Stats */}
               <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-20'>
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
                        <div className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                           {stat.number}
                        </div>
                        <div className='text-gray-400 text-sm md:text-base'>{stat.label}</div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
         {/* Reviews Marquee */}
         <section className='py-16 overflow-hidden'>
            <div className='max-w-7xl mx-auto px-6 sm:px-8'>
               <h2 className='text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  What Developers Say
               </h2>
               <div className='relative'>
                  <div className='flex animate-marquee space-x-8'>
                     {[...reviews, ...reviews].map((review, index) => (
                        <Card
                           key={index}
                           className='flex-shrink-0 w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6'
                        >
                           <CardContent className='p-0'>
                              <div className='flex items-center mb-4'>
                                 <span className='text-3xl mr-3'>{review.avatar}</span>
                                 <div>
                                    <h4 className='font-semibold text-white'>{review.name}</h4>
                                    <p className='text-gray-400 text-sm'>{review.role}</p>
                                 </div>
                                 <div className='ml-auto flex text-yellow-400'>
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                       <span key={i}>⭐</span>
                                    ))}
                                 </div>
                              </div>
                              <p className='text-gray-300 italic'>"{review.text}"</p>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               </div>
            </div>
         </section>
         {/* Features Section */}
         <section
            id='features'
            className='py-20 px-6 sm:px-8'
         >
            <div className='max-w-7xl mx-auto'>
               <div className='text-center mb-16'>
                  <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Powerful Features
                  </h2>
                  <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
                     Everything you need to build professional Python GUIs without writing a single line of code
                  </p>
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {features.map((feature, index) => (
                     <Card
                        key={index}
                        className='group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105'
                     >
                        <CardContent className='p-0'>
                           <div
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                           >
                              {feature.icon}
                           </div>
                           <h3 className='text-xl font-semibold mb-4 text-white'>{feature.title}</h3>
                           <p className='text-gray-300 leading-relaxed'>{feature.desc}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>
         {/* Demo Section */}
         <section
            id='demo'
            className='py-20 px-6 sm:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20'
         >
            <div className='max-w-6xl mx-auto text-center'>
               <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  See Buildfy in Action
               </h2>
               <p className='text-xl text-gray-300 mb-12 max-w-3xl mx-auto'>
                  Watch how easy it is to create professional Python GUIs with our visual builder
               </p>

               <div className='relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-8 backdrop-blur-md border border-white/10'>
                  <div className='aspect-video bg-gray-800 rounded-2xl flex items-center justify-center text-6xl'>
                     ▶️
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl' />
                  <Button
                     size='lg'
                     className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg rounded-xl shadow-2xl'
                  >
                     ▶️ Play Demo
                  </Button>
               </div>
            </div>
         </section>
         {/* Pricing Section */}
         <section
            id='pricing'
            className='py-20 px-6 sm:px-8'
         >
            <div className='max-w-7xl mx-auto'>
               <div className='text-center mb-16'>
                  <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Choose Your Plan
                  </h2>
                  <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
                     Start free and scale as you grow. All plans include our core features.
                  </p>
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                  {displayPlans.map((plan) => (
                     <Card
                        key={plan.id}
                        className={`relative bg-white/5 backdrop-blur-md border rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 ${
                           plan.tier === 'pro' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-white/10'
                        }`}
                     >
                        {plan.tier === 'pro' && (
                           <Badge className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1'>
                              Most Popular
                           </Badge>
                        )}
                        <CardContent className='p-0'>
                           <div className='text-center mb-8'>
                              <h3 className='text-2xl font-bold mb-2 text-white'>{plan.name}</h3>
                              <p className='text-gray-400 mb-4'>{plan.description}</p>
                              <div className='flex items-baseline justify-center'>
                                 <span className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                    {plan.price}
                                 </span>
                                 <span className='text-gray-400 ml-2'>/{plan.billingPeriod}</span>
                              </div>
                           </div>

                           <ul className='space-y-3 mb-8'>
                              {plan.features.map((feature, index) => (
                                 <li
                                    key={index}
                                    className={`flex items-center ${
                                       feature.included ? 'text-green-400' : 'text-gray-500'
                                    }`}
                                 >
                                    <span className='mr-3'>{feature.included ? '✅' : '❌'}</span>
                                    {feature.name}
                                 </li>
                              ))}
                           </ul>

                           <Button
                              className={`w-full py-3 rounded-xl ${
                                 plan.tier === 'pro'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                              }`}
                              onClick={() => navigate('/auth')}
                           >
                              Get Started
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>
         {/* Team Section */}
         <section className='py-20 px-6 sm:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20'>
            <div className='max-w-5xl mx-auto'>
               <div className='text-center mb-16'>
                  <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Meet Our Team
                  </h2>
                  <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
                     The passionate developers behind Buildfy, making GUI development accessible to everyone
                  </p>
               </div>

               <div className='flex flex-col md:flex-row gap-8 justify-center items-center'>
                  {team.map((member, index) => (
                     <Card
                        key={index}
                        className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 max-w-sm'
                     >
                        <CardContent className='p-0 text-center'>
                           <img
                              src={member.img}
                              alt={member.name}
                              className='w-24 h-24 rounded-full mx-auto mb-6 ring-4 ring-purple-500/20'
                           />
                           <h3 className='text-xl font-semibold mb-2 text-white'>{member.name}</h3>
                           <p className='text-purple-400 mb-4'>{member.role}</p>
                           <Button
                              variant='outline'
                              size='sm'
                              onClick={() => window.open(member.peerlist, '_blank')}
                              className='border-purple-500/50 text-purple-300 hover:bg-purple-500/10'
                           >
                              View Profile
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>
         {/* Contact Section */}
         <section
            id='contact'
            className='py-20 px-6 sm:px-8'
         >
            <div className='max-w-5xl mx-auto'>
               <div className='text-center mb-16'>
                  <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                     Get in Touch
                  </h2>
                  <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
                     Have questions? Need support? Want to collaborate? We'd love to hear from you!
                  </p>
               </div>{' '}
               <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch'>
                  {/* Contact Form */}
                  <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 h-full'>
                     <CardContent className='p-0 h-full flex flex-col'>
                        <h3 className='text-2xl font-semibold mb-6 text-white'>Send us a message</h3>
                        <form
                           onSubmit={handleContactSubmit}
                           className='space-y-6'
                        >
                           <div>
                              <label className='block text-sm font-medium text-gray-300 mb-2'>Name</label>
                              <Input
                                 value={contactForm.name}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                                 className='bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl'
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
                                 className='bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl'
                                 placeholder='your@email.com'
                                 required
                              />
                           </div>
                           <div>
                              <label className='block text-sm font-medium text-gray-300 mb-2'>Message</label>
                              <Textarea
                                 value={contactForm.message}
                                 onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                                 className='bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl min-h-[120px]'
                                 placeholder='Tell us how we can help...'
                                 required
                              />
                           </div>
                           <Button
                              type='submit'
                              className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl'
                           >
                              Send Message 📧
                           </Button>
                        </form>
                     </CardContent>
                  </Card>{' '}
                  {/* Contact Info */}
                  <div className='space-y-8 h-full flex flex-col justify-center'>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-4'>
                              <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl'>
                                 👨‍💼
                              </div>
                              <div>
                                 <h4 className='font-semibold text-white'>Pratyush Mishra</h4>
                                 <p className='text-gray-400'>proxlight02@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-4'>
                              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl'>
                                 📧
                              </div>{' '}
                              <div>
                                 <h4 className='font-semibold text-white'>Email Support</h4>
                                 <p className='text-gray-400'>droppybuilder@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>{' '}
                     </Card>{' '}
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-4'>
                              <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl'>
                                 🐛
                              </div>{' '}
                              <div>
                                 <h4 className='font-semibold text-white'>Bug Reports</h4>
                                 <p className='text-gray-400'>droppybuilder@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                     <Card className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6'>
                        <CardContent className='p-0'>
                           <div className='flex items-center space-x-4'>
                              <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl'>
                                 👨‍💻
                              </div>
                              <div>
                                 <h4 className='font-semibold text-white'>Nakul Srivastava</h4>
                                 <p className='text-gray-400'>imnakul44@gmail.com</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </section>{' '}
         {/* Footer */}
         <footer className='bg-black/20 backdrop-blur-md border-t border-white/10 py-12 px-6 sm:px-8'>
            <div className='max-w-7xl mx-auto'>
               <div className='text-center'>
                  <div className='flex items-center justify-center space-x-3 mb-4'>
                     <img
                        src={logo}
                        alt='Buildfy Web'
                        className='h-10 w-10 rounded-lg'
                     />
                     <span className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                        Buildfy Web
                     </span>
                  </div>
                  <p className='text-gray-400 mb-8 max-w-2xl mx-auto'>
                     Making Python GUI development accessible to everyone through visual design.
                  </p>
                  <div className='border-t border-white/10 pt-8'>
                     <p className='text-gray-400 text-sm'>© 2025 Buildfy Web. All rights reserved.</p>
                  </div>
               </div>
            </div>
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
            .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
            .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
            .animate-float-3 { animation: float-3 15s ease-in-out infinite; }
            .animate-marquee { animation: marquee 30s linear infinite; }
         `}</style>
      </div>
   )
}

export default LandingPage
