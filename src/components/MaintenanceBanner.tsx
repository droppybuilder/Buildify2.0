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
                        <span className='font-bold' style={{ color: '#fbbf24' }}>This project is no longer actively maintained.</span>
                        {' '}The person whose idea Buildify was has left the team — I'm the one who built this product,
                        and I'm now left with no roadmap ahead. Without any user feedback either, I've decided to leave it here for you all.
                     </p>
                     <p>
                        <span style={{ color: '#fef3c7' }}>Feel free to use it — it will keep working just as it is.</span>
                        {' '}If you ever want access to a <span className='font-medium' style={{ color: '#fbbf24' }}>Premium or paid plan</span>, just reach out — I can give you free access.
                     </p>
                     <p>
                        Still have questions or doubts? I'm around to help — but <span className='italic'>the contact form won't reach me</span>, so please contact me directly at{' '}
                        <a
                           href='https://contact.nakulsrivastava.com'
                           target='_blank'
                           rel='noopener noreferrer'
                           className='underline underline-offset-2 font-semibold transition-colors'
                           style={{ color: '#fbbf24' }}
                        >
                           contact.nakulsrivastava.com
                        </a>
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
                  You can find this information anytime in the{' '}
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
