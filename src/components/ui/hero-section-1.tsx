import React from 'react'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import logo from '/logo6.png'

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
   return (
      <>
         <HeroHeader
            handleNavigation={handleNavigation}
            userExists={userExists}
         />
         <main className='overflow-hidden bg-neutral-950 relative'>
            {/* Purple Theme Background Effects */}
            <div className='pointer-events-none fixed inset-0 -z-10'>
               <div className='absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-3xl animate-float-1' />
               <div className='absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-purple-800/15 rounded-full blur-3xl animate-float-2' />
               <div className='absolute top-1/2 left-1/2 w-[40vw] h-[40vw] bg-purple-700/10 rounded-full blur-3xl animate-float-3' />
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
                     <div className='text-center sm:mx-auto lg:mr-auto lg:mt-0'>
                        <AnimatedGroup variants={transitionVariants}>
                           <a
                              href='#features'
                              className='hover:bg-purple-900/30 bg-purple-900/20 group mx-auto flex w-fit items-center gap-4 rounded-full border border-purple-800 p-1 pl-4 shadow-md shadow-purple-950/20 transition-all duration-300'
                           >
                              <span className='text-purple-200 text-sm'>🚀 We're Live on Product Hunt!</span>
                              <span className='block h-4 w-0.5 border-l border-purple-700 bg-purple-700'></span>

                              <div className='bg-purple-800 group-hover:bg-purple-700 size-6 overflow-hidden rounded-full duration-500'>
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

                           <h1 className='mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-12 xl:text-[5.25rem] font-bold text-purple-100'>
                              Turn Ideas into{' '}
                              <span className='bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                 Python Apps
                              </span>{' '}
                              — Without Writing Code
                           </h1>
                           <p className='mx-auto mt-8 max-w-2xl text-balance text-lg text-purple-200 leading-relaxed'>
                              Build professional Python GUIs with our visual drag-and-drop builder. Export clean,
                              production-ready code instantly. No coding experience required.
                           </p>
                        </AnimatedGroup>

                        <AnimatedGroup
                           variants={transitionVariants}
                           className='mt-8 sm:mt-12 flex flex-col items-center justify-center gap-4 sm:gap-2 md:flex-row'
                        >
                           <div
                              key={1}
                              className='bg-purple-600/20 rounded-[14px] border border-purple-600 p-0.5'
                           >
                              <Button
                                 asChild
                                 size='lg'
                                 className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-8 text-base font-medium'
                              >
                                 <a href='#features'>
                                    <span className='text-nowrap'>Start Building Free</span>
                                 </a>
                              </Button>
                           </div>
                           <Button
                              key={2}
                              asChild
                              size='lg'
                              variant='ghost'
                              className='h-11 rounded-xl px-8 hover:bg-purple-900/30 text-purple-200 border border-purple-800'
                           >
                              <a href='#demo'>
                                 <span className='text-nowrap'>Watch Demo</span>
                              </a>
                           </Button>
                        </AnimatedGroup>
                     </div>
                  </div>

                  <AnimatedGroup variants={transitionVariants}>
                     <div className='relative mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-16'>
                        <div
                           aria-hidden
                           className='bg-gradient-to-b to-neutral-950 absolute inset-0 z-10 from-transparent from-35%'
                        />
                        <div className='relative mx-auto max-w-sm sm:max-w-6xl overflow-hidden rounded-2xl border border-purple-800 p-4 shadow-lg shadow-purple-950/30 bg-purple-900/20 backdrop-blur-md'>
                           <img
                              className='aspect-video relative rounded-2xl w-full object-contain'
                              src='/BD2.png'
                              alt='Buildfy Web Dashboard - Visual Python GUI Builder'
                              width='2700'
                              height='1440'
                           />
                        </div>
                     </div>
                  </AnimatedGroup>
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
                     'bg-neutral-950/90 max-w-4xl rounded-2xl border border-purple-900 backdrop-blur-lg lg:px-5'
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
                        <span className='text-lg font-bold text-purple-300'>Buildfy Web</span>
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

                  <div className='bg-neutral-950/90 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-purple-800 p-6 shadow-2xl shadow-purple-950/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none'>
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
                              <Button
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
                              </Button>
                              <Button
                                 onClick={() => handleNavigation('/auth')}
                                 size='sm'
                                 className={cn(
                                    isScrolled ? 'lg:inline-flex' : 'hidden',
                                    'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                 )}
                              >
                                 <span>Get Started</span>
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
