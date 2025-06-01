import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import logo from '/logo1.png'

const features = [
   {
      title: 'Visual Tkinter Builder',
      desc: 'Drag, drop, and visually design Python Tkinter GUIs with instant code preview.',
      icon: '🖱️',
   },
   {
      title: 'Export Instantly',
      desc: 'Export clean, production-ready Python code for your desktop apps in one click.',
      icon: '🚀',
   },
   {
      title: 'Modern UI Components',
      desc: 'Access a library of beautiful, customizable widgets and layouts.',
      icon: '🎨',
   },
   {
      title: 'No Coding Required',
      desc: 'Build complex interfaces without writing a single line of code.',
      icon: '🤖',
   },
   {
      title: 'Cloud Profiles',
      desc: 'Save your projects and access them from anywhere, anytime.',
      icon: '☁️',
   },
   {
      title: 'Flexible Pricing',
      desc: 'Start for free, upgrade for more power and features.',
      icon: '💸',
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

const glass = 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl'

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
   // Combine plans and lifetimePlan for display
   const displayPlans = [...plans, lifetimePlan]
   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-[#181c2b] via-[#23243a] to-[#1a1d2b] text-white'>
         {/* Animated background blobs */}
         <div className='pointer-events-none fixed inset-0 -z-10'>
            <div className='absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600 opacity-30 rounded-full blur-3xl animate-blob1' />
            <div className='absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600 opacity-30 rounded-full blur-3xl animate-blob2' />
            <div className='absolute top-1/2 left-1/2 w-[30vw] h-[30vw] bg-pink-500 opacity-20 rounded-full blur-3xl animate-blob3' />
         </div>

         {/* Banner */}
         <div className='w-full flex justify-center z-50 relative animate-fadein'>
            <div className='relative flex items-center justify-center px-6 py-3 mt-4 rounded-2xl shadow-lg bg-gradient-to-r from-[#7f5af0] via-[#6246ea] to-[#ff6ac1] border border-[#a78bfa]/40 backdrop-blur-md'>
               <svg
                  className='w-6 h-6 text-white animate-bounce mr-2 drop-shadow-lg'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
               >
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     d='M5 13l4 4L19 7'
                  />
               </svg>
               <span className='drop-shadow font-semibold text-lg bg-gradient-to-r from-white via-[#e0c3fc] to-[#ffb6b9] bg-clip-text text-transparent'>
                  AI Integration <span className='font-bold text-pink-200'>coming soon!</span>
               </span>
            </div>
         </div>

         {/* Hero Section */}
         <header className='w-full py-24 flex flex-col items-center justify-center relative z-10'>
            <div className='flex items-center justify-center gap-4 mb-6'>
               <div className='p-2 rounded-3xl bg-gradient-to-br from-[#23243a] via-[#181c2b] to-[#1a1d2b] shadow-2xl border border-[#7f5af0]/30'>
                  <img
                     src={logo}
                     alt='Buildfy2.0 Logo'
                     className='size-28 drop-shadow-xl animate-float'
                     draggable={false}
                  />
               </div>
               <h1 className='text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center tracking-tight drop-shadow-lg animate-glow'>
                  Buildfy Web
               </h1>
            </div>
            <p className='text-2xl md:text-3xl text-gray-200 mb-10 text-center max-w-2xl font-medium animate-fadein-slow'>
               Effortlessly design, preview, and export beautiful Python Tkinter GUIs.
               <br />
               Drag, drop, and build your next desktop app visually—no code required!
            </p>
            <div className='flex gap-6 mb-4 flex-wrap justify-center'>
               <Button
                  size='lg'
                  className='px-10 py-4 text-lg font-semibold shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-pink-500 transition-all duration-300 animate-pop rounded-2xl'
                  onClick={() => navigate(userExists ? '/' : '/auth')}
               >
                  {userExists ? 'DesignLab' : 'Login'}
               </Button>
            </div>
         </header>

         {/* Features Section */}
         <section className='py-20 px-4 max-w-6xl mx-auto w-full'>
            <h2 className='text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow'>
               Features
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
               {features.map((f, i) => (
                  <div
                     key={i}
                     className={`${glass} p-8 flex flex-col items-center hover:scale-[1.04] hover:shadow-2xl transition-all duration-300 group animate-fadein-up`}
                     style={{ animationDelay: `${i * 80}ms` }}
                  >
                     <div className='text-4xl mb-3 animate-pop'>{f.icon}</div>
                     <h3 className='text-2xl font-semibold mb-2 text-indigo-200 group-hover:text-pink-300 transition-colors'>
                        {f.title}
                     </h3>
                     <p className='text-gray-200 text-center'>{f.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Team Section */}
         <section className='py-20 px-4 max-w-5xl mx-auto w-full'>
            <h2 className='text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow'>
               Meet the Team
            </h2>
            <div className='flex flex-wrap justify-center gap-10'>
               {team.map((member, i) => (
                  <div
                     key={i}
                     className={`${glass} p-8 flex flex-col items-center w-72 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fadein-up`}
                     style={{ animationDelay: `${i * 120}ms` }}
                  >
                     <img
                        src={member.img}
                        alt={member.name}
                        className='w-24 h-24 rounded-full mb-4 object-cover border-4 border-indigo-400 shadow-lg animate-pop'
                     />
                     <h3 className='text-xl font-semibold mb-1 text-indigo-100'>{member.name}</h3>
                     <p className='text-gray-300 mb-2'>{member.role}</p>
                     <a
                        href={member.peerlist}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-indigo-300 hover:text-pink-300 hover:underline transition-colors'
                     >
                        Visit
                     </a>
                  </div>
               ))}
            </div>
         </section>

         {/* Pricing Section */}
         <section className='py-20 px-4 max-w-7xl mx-auto w-full'>
            <h2 className='text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow'>
               Pricing
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
               {displayPlans.map((plan, idx) => (
                  <div
                     key={plan.id}
                     className={`${glass} flex flex-col items-center px-6 py-10 relative hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fadein-up`}
                     style={{ minHeight: 520, animationDelay: `${idx * 100}ms` }}
                  >
                     {/* Subtitle/Banner */}
                     <div className='absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-700/80 to-purple-700/80 text-indigo-100 px-5 py-1 rounded-full font-semibold shadow text-sm border border-indigo-300 w-44 text-center animate-pop'>
                        {plan.id === 'free' && 'Forever Free'}
                        {plan.id === 'standard' && 'Pay As You Go'}
                        {plan.id === 'pro' && 'Pay As You Go'}
                        {plan.id === 'lifetime' && 'One-Time Payment'}
                     </div>
                     <h3 className='text-2xl font-bold mt-0 mb-1 text-indigo-100'>{plan.name}</h3>
                     <div className='mb-4'>
                        <span className='text-3xl font-bold text-pink-300'>{plan.price}</span>
                        <span className='text-gray-400 ml-1 text-base'>/{plan.billingPeriod}</span>
                     </div>
                     <ul className='mb-0 text-gray-200 text-left w-full max-w-xs mx-auto space-y-2'>
                        {plan.features.map((feature, i) => (
                           <li
                              key={i}
                              className='flex items-center gap-2'
                           >
                              {feature.included ? (
                                 <span
                                    className='text-green-400 font-bold text-lg'
                                    aria-label='Included'
                                 >
                                    ✔
                                 </span>
                              ) : (
                                 <span
                                    className='text-red-400 font-bold text-lg'
                                    aria-label='Not included'
                                 >
                                    ✖
                                 </span>
                              )}
                              <span>{feature.name}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </section>

         <footer className='mt-10 mb-4 text-gray-400 text-sm text-center'>
            &copy; {new Date().getFullYear()} Buildfy. All rights reserved.
         </footer>

         {/* Animations */}
         <style>{`
            @keyframes float {
               0%, 100% { transform: translateY(0); }
               50% { transform: translateY(-16px); }
            }
            .animate-float { animation: float 3.5s ease-in-out infinite; }
            @keyframes glow {
               0%, 100% { filter: drop-shadow(0 0 12px #a78bfa); }
               50% { filter: drop-shadow(0 0 32px #f472b6); }
            }
            .animate-glow { animation: glow 2.5s ease-in-out infinite; }
            @keyframes fadein {
               from { opacity: 0; transform: translateY(16px); }
               to { opacity: 1; transform: none; }
            }
            .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
            .animate-fadein-slow { animation: fadein 2s cubic-bezier(.4,0,.2,1) both; }
            .animate-fadein-up { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
            @keyframes pop {
               0% { transform: scale(0.9); }
               60% { transform: scale(1.05); }
               100% { transform: scale(1); }
            }
            .animate-pop { animation: pop 0.7s cubic-bezier(.4,0,.2,1) both; }
            @keyframes blob1 {
               0%, 100% { transform: scale(1) translate(0,0); }
               50% { transform: scale(1.15) translate(40px, 40px); }
            }
            .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
            @keyframes blob2 {
               0%, 100% { transform: scale(1) translate(0,0); }
               50% { transform: scale(1.1) translate(-40px, -40px); }
            }
            .animate-blob2 { animation: blob2 14s ease-in-out infinite; }
            @keyframes blob3 {
               0%, 100% { transform: scale(1) translate(0,0); }
               50% { transform: scale(1.08) translate(-30px, 30px); }
            }
            .animate-blob3 { animation: blob3 16s ease-in-out infinite; }
         `}</style>
      </div>
   )
}

export default LandingPage
