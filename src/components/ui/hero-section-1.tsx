import React from 'react'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import logo from '/logo6.png'
import { useState, useEffect } from 'react'

const transitionVariants = {
   container: {
      visible: {
         transition: {
            delayChildren: 1,
         },
      },
   },
   item: {
      hidden: {
         opacity: 0,
         filter: 'blur(12px)',
         y: 12,
      },
      visible: {
         opacity: 1,
         filter: 'blur(0px)',
         y: 0,
         transition: {
            type: 'spring' as const,
            bounce: 0.3,
            duration: 1.5,
         },
      },
   },
}

export function HeroSection({
   handleNavigation,
   userExists,
}: {
   handleNavigation: (path: string) => void
   userExists: boolean
}) {
   const heroContentAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.2, triggerOnce: true })
   const heroImageAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.1, triggerOnce: true })
   const [isBelowLg, setIsBelowLg] = useState(() => window.innerWidth < 1024)

   useEffect(() => {
      const handleResize = () => setIsBelowLg(window.innerWidth < 1024)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   const handleCTA = () => {
      if (userExists) {
         handleNavigation('/')
      } else {
         handleNavigation('/auth')
      }
   }

   return (
      <>
         <HeroHeader
            handleNavigation={handleNavigation}
            userExists={userExists}
         />
         <main className='overflow-hidden bg-slate-950 relative'>
            {/* Enhanced Purple Theme Background Effects */}
            <div className='pointer-events-none fixed inset-0 -z-10'>
               <div className='absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-3xl animate-float-1' />
               <div className='absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-purple-800/15 rounded-full blur-3xl animate-float-2' />
               <div className='absolute top-1/2 left-1/2 w-[40vw] h-[40vw] bg-purple-700/10 rounded-full blur-3xl animate-float-3' />

               {/* Additional floating elements */}
               <div className='absolute top-[20%] right-[10%] w-32 h-32 bg-pink-500/5 rounded-full blur-2xl animate-float-1' />
               <div className='absolute bottom-[30%] left-[15%] w-24 h-24 bg-purple-400/8 rounded-full blur-xl animate-float-2' />
               <div className='absolute top-[60%] right-[20%] w-16 h-16 bg-purple-600/10 rounded-full blur-lg animate-float-3' />
            </div>

            {/* Floating decorative elements */}
            <div className='pointer-events-none absolute inset-0 -z-5'>
               {/* Geometric shapes */}
               <div className='absolute top-[25%] left-[8%] w-2 h-2 bg-purple-400/30 rounded-full animate-float-1' />
               <div className='absolute top-[15%] right-[12%] w-1 h-1 bg-pink-400/40 rounded-full animate-float-2' />
               <div className='absolute bottom-[40%] left-[5%] w-3 h-3 bg-purple-500/20 rounded-full animate-float-3' />
               <div className='absolute top-[70%] right-[8%] w-1.5 h-1.5 bg-purple-300/35 rounded-full animate-float-1' />
               <div className='absolute bottom-[20%] right-[25%] w-2 h-2 bg-pink-500/25 rounded-full animate-float-2' />

               {/* Subtle lines */}
               <div className='absolute top-[30%] left-[20%] w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent rotate-45 animate-float-3' />
               <div className='absolute bottom-[50%] right-[15%] w-12 h-0.5 bg-gradient-to-r from-transparent via-pink-400/15 to-transparent -rotate-45 animate-float-1' />
            </div>

            <div
               aria-hidden
               className='z-[2] absolute inset-0 pointer-events-none isolate opacity-30 contain-strict hidden lg:block'
            >
               <div className='w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(147,51,234,0.08)_0,rgba(147,51,234,0.02)_50%,rgba(147,51,234,0)_80%)]' />
               <div className='h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(147,51,234,0.06)_0,rgba(147,51,234,0.02)_80%,transparent_100%)] [translate:5%_-50%]' />
               <div className='h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(147,51,234,0.04)_0,rgba(147,51,234,0.02)_80%,transparent_100%)]' />
            </div>
            <section>
               <div className='relative pt-24 md:pt-28'>
                  <AnimatedGroup
                     variants={transitionVariants}
                     className='absolute inset-0 -z-20'
                  >
                     <img
                        src='/BuildfyDashboard.png'
                        alt='background'
                        className='absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block'
                        width='3276'
                        height='4095'
                     />
                  </AnimatedGroup>
                  <div
                     aria-hidden
                     className='absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]'
                  />
                  <div className='mx-auto max-w-7xl px-6'>
                     <div
                        ref={heroContentAnimation.elementRef}
                        className={cn(
                           'text-center sm:mx-auto lg:mr-auto lg:mt-0 transition-all duration-1500 ease-out',
                           heroContentAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        )}
                     >
                        <div
                           className={cn(
                              'transition-all duration-1200 delay-300 ease-out',
                              heroContentAnimation.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                           )}
                        >
                           <a
                              href='https://www.producthunt.com/products/buildfy-web?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-buildfy&#0045;web'
                              target='_blank'
                              rel='noopener noreferrer'
                              aria-label='Product Hunt Badge'
                              className='hover:bg-purple-900/30 bg-purple-900/20 group mx-auto flex w-fit items-center gap-4 rounded-full border border-purple-800 p-1 pl-4 shadow-md shadow-purple-950/20 transition-all duration-300 hover:scale-105 relative'
                           >
                              {/* Subtle glow behind badge */}
                              <div className='absolute inset-0 bg-purple-600/10 blur-xl rounded-full opacity-50' />
                              <span className='text-purple-200 text-sm relative z-10'>
                                 🚀 We're Live on Product Hunt!
                              </span>

                              <span className='block h-4 w-0.5 border-l border-purple-700 bg-purple-700 relative z-10'></span>

                              <div className='bg-purple-800 group-hover:bg-purple-700 size-6 overflow-hidden rounded-full duration-500 relative z-10'>
                                 <div className='flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0'>
                                    <span className='flex size-6'>
                                       <ArrowRight className='m-auto size-3 text-purple-200' />
                                    </span>
                                    <span className='flex size-6'>
                                       <ArrowRight className='m-auto size-3 text-purple-200' />
                                    </span>
                                 </div>
                              </div>
                           </a>

                           <div
                              className={cn(
                                 'transition-all duration-1400 delay-600 ease-out',
                                 heroContentAnimation.isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-6'
                              )}
                           >
                              <div className='relative'>
                                 {/* Brightness glow behind text */}
                                 <div className='absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-500/15 to-purple-600/10 blur-3xl scale-110 opacity-60' />
                                 <h1 className='relative mt-8 max-w-4xl mx-auto text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl lg:mt-12 xl:text-[5.25rem] font-bold text-purple-100 font-display leading-tight'>
                                    <span className='block relative'>
                                       Turn Ideas into
                                       {/* Subtle text shadow */}
                                       <div className='absolute inset-0 text-purple-300/20 blur-sm'>
                                          Turn Ideas into
                                       </div>
                                    </span>
                                    <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block relative'>
                                       Python Apps
                                       {/* Enhanced glow for gradient text */}
                                       {/* <div className='absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-xl -z-10' /> */}
                                    </span>
                                    <span className='block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] mt-2 relative'>
                                       Without Writing Code
                                       <div className='absolute inset-0 text-purple-300/20 blur-sm'>
                                          Without Writing Code
                                       </div>
                                    </span>
                                 </h1>
                              </div>
                           </div>

                           <div
                              className={cn(
                                 'transition-all duration-1300 delay-900 ease-out',
                                 heroContentAnimation.isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-4'
                              )}
                           >
                              <div className='relative'>
                                 {/* Subtle glow behind description */}
                                 <div className='absolute inset-0 bg-purple-500/5 blur-2xl scale-105' />
                                 <p className='relative mx-auto mt-8 max-w-2xl text-balance text-lg text-purple-200 leading-relaxed font-sans'>
                                    Build professional Python GUIs with our visual drag-and-drop builder. Export clean,
                                    production-ready code instantly. No coding experience required.
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div
                           className={cn(
                              'mt-8 sm:mt-12 flex flex-col items-center justify-center gap-4 sm:gap-2 md:flex-row transition-all duration-1400 delay-1200 ease-out',
                              heroContentAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                           )}
                        >
                           {isBelowLg && (
                              <div
                                 key={1}
                                 className='bg-purple-600/20 rounded-[14px] border border-purple-600 p-0.5 hover:scale-105 transition-transform duration-200'
                              >
                                 <Button
                                    asChild
                                    size='lg'
                                    className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-6 text-base font-medium'
                                    onClick={handleCTA}
                                 >
                                    <span className='text-nowrap'>
                                       {userExists ? 'Enter Canvas' : 'Start Building Free'}
                                    </span>
                                 </Button>
                              </div>
                           )}

                           <Button
                              key={2}
                              asChild
                              size='lg'
                              variant='ghost'
                              className='h-11 rounded-xl px-8 hover:bg-purple-900/30 text-purple-200 border border-purple-800 hover:scale-105 transition-all duration-200'
                           >
                              <a href='#demo'>
                                 <span className='text-nowrap'>Watch Demo</span>
                              </a>
                           </Button>
                        </div>
                     </div>
                  </div>

                  <div
                     ref={heroImageAnimation.elementRef}
                     className={cn(
                        'relative mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-16 transition-all duration-1600 delay-500 ease-out',
                        heroImageAnimation.isVisible
                           ? 'opacity-100 translate-y-0 scale-100'
                           : 'opacity-0 translate-y-12 scale-95'
                     )}
                  >
                     <div
                        aria-hidden
                        className='bg-gradient-to-b to-slate-950 absolute inset-0 z-10 from-transparent from-35%'
                     />
                     <div
                        className={cn(
                           'relative mx-auto max-w-sm sm:max-w-6xl overflow-hidden rounded-2xl border border-purple-800 p-4 shadow-lg shadow-purple-950/30 bg-purple-900/20 backdrop-blur-md transition-all duration-300 hover:shadow-purple-900/40 hover:border-purple-700',
                           heroImageAnimation.isVisible && 'hover:scale-[1.02]'
                        )}
                     >
                        {/* Enhanced glow around image container */}
                        <div className='absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 blur-xl opacity-75 -z-10' />
                        <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl' />

                        <img
                           className='aspect-video relative rounded-2xl w-full object-contain'
                           src='/BD2.png'
                           alt='Buildfy Web Dashboard - Visual Python GUI Builder'
                           width='2700'
                           height='1440'
                        />

                        {/* Floating elements around the image */}
                        <div className='absolute -top-2 -left-2 w-4 h-4 bg-purple-400/30 rounded-full animate-float-1' />
                        <div className='absolute -top-1 -right-3 w-2 h-2 bg-pink-400/40 rounded-full animate-float-2' />
                        <div className='absolute -bottom-2 -left-1 w-3 h-3 bg-purple-500/25 rounded-full animate-float-3' />
                        <div className='absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-pink-500/35 rounded-full animate-float-1' />
                     </div>
                  </div>
               </div>
            </section>
            {/* <section className='bg-neutral-950 pb-16 pt-16 md:pb-32'>
               <div className='group relative m-auto max-w-5xl px-6'>
                  <div className='absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100'>
                     <a
                        href='#features'
                        className='block text-sm duration-150 hover:opacity-75 text-purple-300'
                     >
                        <span>Trusted by Developers Worldwide</span>
                        <ChevronRight className='ml-1 inline-block size-3' />
                     </a>
                  </div>
                  <div className='group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14'>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Python</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Tkinter</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>GUI</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Builder</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Visual</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Code</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Export</div>
                     </div>
                     <div className='flex items-center justify-center'>
                        <div className='text-purple-400 font-bold text-lg'>Cloud</div>
                     </div>
                  </div>
               </div>
            </section> */}
         </main>
      </>
   )
}

const menuItems = [
   { name: 'Features', href: '#features' },
   { name: 'Demo', href: '#demo' },
   { name: 'Pricing', href: '#pricing' },
   { name: 'Contact', href: '#contact' },
]

const HeroHeader = ({
   handleNavigation,
   userExists,
}: {
   handleNavigation: (path: string) => void
   userExists: boolean
}) => {
   const [menuState, setMenuState] = React.useState(false)
   const [isScrolled, setIsScrolled] = React.useState(false)

   React.useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 50)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
   }, [])

   return (
      <header>
         <nav
            data-state={menuState && 'active'}
            className='fixed z-40 w-full px-2 group bg-black/30'
         >
            <div
               className={cn(
                  'mx-auto max-w-6xl px-6 transition-all duration-300 lg:px-12',
                  isScrolled &&
                     'bg-slate-950/90 max-w-4xl rounded-2xl border border-purple-900 backdrop-blur-lg lg:px-5'
               )}
            >
               <div className='relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4'>
                  <div className='flex w-full justify-between lg:w-auto'>
                     <a
                        href='/'
                        aria-label='home'
                        className='flex items-center space-x-2'
                     >
                        <img
                           src={logo}
                           alt='Buildfy Web'
                           className='h-8 w-8 sm:h-10 sm:w-10 rounded-lg'
                        />
                        <span className='text-xl font-bold text-purple-300 font-display'>Buildfy Web</span>
                     </a>

                     <button
                        onClick={() => setMenuState(!menuState)}
                        aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                        className='relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden'
                     >
                        <Menu className='in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-purple-300' />
                        <X className='group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-purple-300' />
                     </button>
                  </div>

                  <div className='absolute inset-0 m-auto hidden size-fit lg:block'>
                     <ul className='flex gap-8 text-sm'>
                        {menuItems.map((item, index) => (
                           <li key={index}>
                              <a
                                 href={item.href}
                                 className='text-purple-200 hover:text-purple-400 block duration-150'
                              >
                                 <span>{item.name}</span>
                              </a>
                           </li>
                        ))}
                     </ul>
                  </div>

                  <div className='bg-slate-950/90 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-purple-800 p-6 shadow-2xl shadow-purple-950/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none'>
                     <div className='lg:hidden'>
                        <ul className='space-y-6 text-base'>
                           {menuItems.map((item, index) => (
                              <li key={index}>
                                 <a
                                    href={item.href}
                                    className='text-purple-200 hover:text-purple-400 block duration-150'
                                 >
                                    <span>{item.name}</span>
                                 </a>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className='flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit'>
                        {userExists ? (
                           <Button
                              onClick={() => handleNavigation('/')}
                              size='sm'
                              className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl'
                           >
                              <span>Enter Canvas</span>
                           </Button>
                        ) : (
                           <>
                              {/* <Button
                                 onClick={() => handleNavigation('/auth')}
                                 variant='ghost'
                                 size='sm'
                                 className={cn(
                                    isScrolled && 'lg:hidden',
                                    'hover:bg-purple-900/30 text-purple-200 border border-purple-800'
                                 )}
                              >
                                 <span>Login</span>
                              </Button>
                              <Button
                                 onClick={() => handleNavigation('/auth')}
                                 size='sm'
                                 className={cn(
                                    isScrolled && 'lg:hidden',
                                    'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                 )}
                              >
                                 <span>Sign Up</span>
                              </Button> */}
                              {/* <Button
                                 onClick={() => handleNavigation('/auth')}
                                 size='sm'
                                 className={cn(
                                    isScrolled ? 'lg:inline-flex' : 'hidden',
                                    'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                 )}
                              >
                                 <span>Get Started</span>
                              </Button> */}
                              <Button
                                 asChild
                                 size='sm'
                                 className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-5 text-base font-medium'
                                 onClick={() => handleNavigation('/auth')}
                              >
                                 <span className='text-nowrap'>Start Building Free</span>
                              </Button>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </nav>
      </header>
   )
}

// Floating animations are handled by the parent LandingPage component
