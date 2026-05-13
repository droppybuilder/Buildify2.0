import { useState } from 'react'
import { X, Bell } from 'lucide-react'

const STORAGE_KEY = 'maintenanceBannerDismissed'

export const MaintenanceBanner = () => {
   const [visible, setVisible] = useState(() => localStorage.getItem(STORAGE_KEY) !== 'true')
   const [showHint, setShowHint] = useState(false)

   if (!visible && !showHint) return null

   const dismiss = () => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, 'true')
      setShowHint(true)
   }

   return (
      <>
         {visible && (
            <div className='relative w-full border-b border-amber-700/50 z-50' style={{ background: 'linear-gradient(to right, #1c0f00, #2d1500, #1c0f00)' }}>
               <div className='max-w-7xl mx-auto px-4 py-3 flex items-start gap-4'>
                  <span className='text-lg shrink-0 mt-0.5'>⚠️</span>

                  <div className='flex-1 text-sm leading-relaxed space-y-1' style={{ color: '#fcd9a0' }}>
                     <p>
                        <span className='font-bold' style={{ color: '#fbbf24' }}>Buildfy is no longer maintained.</span>
                        {' '}The person whose idea this was left the team — I'm the builder left alone, now with no roadmap ahead.
                        It's here for you, free to use, as-is.{' '}
                        Bookmark{' '}
                        <a
                           href='https://buildfyweb.vercel.app'
                           target='_blank'
                           rel='noopener noreferrer'
                           className='underline underline-offset-2 font-semibold'
                           style={{ color: '#fbbf24' }}
                        >
                           buildfyweb.vercel.app
                        </a>
                        {' '}to keep using it.
                     </p>
                     <p>
                        Want a <span className='font-medium' style={{ color: '#fbbf24' }}>Premium plan - for Free?</span> or Questions - Please Reach out 
                        {' '}
                        <a
                           href='https://contact.nakulsrivastava.com'
                           target='_blank'
                           rel='noopener noreferrer'
                           className='underline underline-offset-2 font-semibold'
                           style={{ color: '#fbbf24' }}
                        >
                           contact.nakulsrivastava.com
                        </a>
                        {' '}<span className='opacity-70 text-xs'>(contact form on website won't work)</span>
                     </p>
                  </div>

                  <button
                     onClick={dismiss}
                     aria-label='Dismiss banner'
                     className='shrink-0 rounded-md p-1.5 transition-colors hover:bg-amber-800/50'
                  >
                     <X size={16} color='#fef3c7' strokeWidth={2.5} />
                  </button>
               </div>
            </div>
         )}

         {showHint && (
            <div
               className='fixed top-4 right-4 z-[100] rounded-xl shadow-2xl border px-4 py-3 flex items-start gap-3 max-w-xs'
               style={{ background: '#1c1917', borderColor: '#78350f' }}
            >
               <Bell size={16} color='#fbbf24' className='shrink-0 mt-0.5' />
               <p className='text-sm flex-1' style={{ color: '#fcd9a0' }}>
                  You can find this info anytime in the{' '}
                  <span className='font-semibold' style={{ color: '#fbbf24' }}>Notification Panel</span>
                  {' '}in the toolbar.
               </p>
               <button
                  onClick={() => setShowHint(false)}
                  aria-label='Close'
                  className='shrink-0 rounded p-0.5 hover:bg-amber-900/50 transition-colors'
               >
                  <X size={14} color='#fcd9a0' strokeWidth={2.5} />
               </button>
            </div>
         )}
      </>
   )
}
