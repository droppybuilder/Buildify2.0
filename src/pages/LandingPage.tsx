import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const features = [
   {
      title: 'Visual Tkinter Builder',
      desc: 'Drag, drop, and visually design Python Tkinter GUIs with instant code preview.',
   },
   {
      title: 'Export Instantly',
      desc: 'Export clean, production-ready Python code for your desktop apps in one click.',
   },
   {
      title: 'Modern UI Components',
      desc: 'Access a library of beautiful, customizable widgets and layouts.',
   },
   {
      title: 'No Coding Required',
      desc: 'Build complex interfaces without writing a single line of code.',
   },
   {
      title: 'Cloud Profiles',
      desc: 'Save your projects and access them from anywhere, anytime.',
   },
   {
      title: 'Flexible Pricing',
      desc: 'Start for free, upgrade for more power and features.',
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
      role: 'Frontend Developer',
      img: '/prof2.png',
      peerlist: 'https://peerlist.io/imnakul',
   },
]

// PRICING PLANS DATA (copied from PricingPlans.tsx)
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
      ],
   },
]

const LandingPage: React.FC = () => {
   const navigate = useNavigate()
   // Check if user exists in localStorage
   const userExists = Boolean(localStorage.getItem('user'))
   return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col overflow-auto'>
         {/* Banner */}
         <div className='w-full bg-gradient-to-r from-primary to-indigo-500 text-white text-center py-3 font-semibold tracking-wide shadow-md z-50 text-lg flex items-center justify-center gap-2'>
            <svg className='w-6 h-6 text-white animate-bounce' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
               <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
            <span className='drop-shadow-sm'>AI Integration <span className='font-bold'>coming soon</span>!</span>
         </div>
         {/* Hero Section */}
         <header className='w-full py-16 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 border-b border-indigo-200'>
            <h1 className='text-6xl font-extrabold text-primary mb-4 text-center tracking-tight drop-shadow-lg'>
               Buildfy
            </h1>
            <p className='text-2xl text-muted-foreground mb-8 text-center max-w-2xl font-medium'>
               Effortlessly design, preview, and export beautiful Python Tkinter GUIs.
               <br />
               Drag, drop, and build your next desktop app visually—no code required!
            </p>
            <div className='flex gap-6 mb-4 flex-wrap justify-center'>
               <Button
                  size='lg'
                  className='px-10 py-4 text-lg font-semibold shadow-lg'
                  onClick={() => navigate(userExists ? '/' : '/auth')}
               >
                  {userExists ? 'DesignLab' : 'Login'}
               </Button>
            </div>
         </header>

         {/* Features Section */}
         <section className='py-20 px-4 max-w-6xl mx-auto w-full'>
            <h2 className='text-4xl font-bold text-center mb-12 text-primary'>Features</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
               {features.map((f, i) => (
                  <div
                     key={i}
                     className='bg-white rounded-xl shadow-md border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-shadow'
                  >
                     <h3 className='text-2xl font-semibold mb-2 text-indigo-700'>{f.title}</h3>
                     <p className='text-gray-600 text-center'>{f.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Team Section */}
         <section className='py-20 px-4 max-w-5xl mx-auto w-full'>
            <h2 className='text-4xl font-bold text-center mb-12 text-primary'>Meet the Team</h2>
            <div className='flex flex-wrap justify-center gap-10'>
               {team.map((member, i) => (
                  <div
                     key={i}
                     className='bg-white rounded-xl shadow-md border border-gray-100 p-8 flex flex-col items-center w-72 hover:shadow-xl transition-shadow'
                  >
                     <img
                        src={member.img}
                        alt={member.name}
                        className='w-24 h-24 rounded-full mb-4 object-cover border-4 border-indigo-200'
                     />
                     <h3 className='text-xl font-semibold mb-1'>{member.name}</h3>
                     <p className='text-gray-500 mb-2'>{member.role}</p>
                     <a
                        href={member.peerlist}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-indigo-600 hover:underline'
                     >
                        Peerlist
                     </a>
                  </div>
               ))}
            </div>
         </section>

         {/* Pricing Section */}
         <section className='py-20 px-4 max-w-6xl mx-auto w-full'>
            <h2 className='text-4xl font-bold text-center mb-12 text-primary'>Pricing</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
               {plans.map((plan) => (
                  <div
                     key={plan.id}
                     className='bg-white rounded-xl shadow-md border border-gray-100 p-10 flex flex-col items-center hover:shadow-xl transition-shadow'
                  >
                     <h3 className='text-2xl font-semibold mb-2 text-indigo-700'>{plan.name}</h3>
                     <p className='text-gray-500 mb-4'>{plan.description}</p>
                     <div className='mb-6'>
                        <span className='text-3xl font-bold'>{plan.price}</span>
                        <span className='text-muted-foreground'>/{plan.billingPeriod}</span>
                     </div>
                     <ul className='mb-6 text-gray-600 text-left w-full max-w-xs mx-auto'>
                        {plan.features.map((feature, i) => (
                           <li
                              key={i}
                              className='flex items-center gap-2'
                           >
                              {feature.included ? (
                                 <span className='text-green-500'>✔</span>
                              ) : (
                                 <span className='text-red-400'>✖</span>
                              )}
                              <span>{feature.name}</span>
                           </li>
                        ))}
                     </ul>
                     <Button
                        className='w-full mt-auto'
                        variant={plan.tier === 'free' ? 'default' : 'outline'}
                        onClick={() => navigate('/auth')}
                     >
                        {plan.tier === 'free' ? 'Start Free' : `Go ${plan.name}`}
                     </Button>
                  </div>
               ))}
            </div>
         </section>

         <footer className='mt-10 mb-4 text-muted-foreground text-sm text-center'>
            &copy; {new Date().getFullYear()} Buildfy. All rights reserved.
         </footer>
      </div>
   )
}

export default LandingPage
