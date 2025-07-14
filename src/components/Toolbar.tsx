import { Button } from '@/components/ui/button'
import {
   Undo2,
   Redo2,
   Code,
   Layers as LayersIcon,
   Settings,
   User,
   CreditCard,
   LogOut,
   MessageSquare,
   Menu,
   Eye,
   EyeOff,
   PanelLeftClose,
   PanelLeftOpen,
   Bell,
   Crown,
   Zap,
   Download,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/AuthContext'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { signOut } from 'firebase/auth'
import { auth } from '@/integrations/firebase/firebase.config'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { feedbackService } from '@/services/feedbackService'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'
import {
   isPremiumUser,
   canExportCode,
   getCurrentMonthExportCount,
   getExportLimit,
   initializeUserTracking,
} from '@/utils/subscriptionUtils'

interface ToolbarProps {
   components: any[]
   onUndo: () => void
   onRedo: () => void
   canUndo: boolean
   canRedo: boolean
   onToggleCodePreview: () => void
   onToggleLayers?: () => void
   onToggleWindowProperties?: () => void
   showCodePreview: boolean
   showLayers?: boolean
   showWindowProperties?: boolean
}

export const Toolbar = ({
   components,
   onUndo,
   onRedo,
   canUndo,
   canRedo,
   onToggleCodePreview,
   onToggleLayers,
   onToggleWindowProperties,
   showCodePreview,
   showLayers = false,
   showWindowProperties = false,
}: ToolbarProps) => {
   const navigate = useNavigate()
   const { user } = useAuth()
   const { subscription } = useSubscription()
   const [modalOpen, setModalOpen] = useState(false)
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [submissionType, setSubmissionType] = useState<'feedback' | 'feature-request'>('feedback')
   const [submitting, setSubmitting] = useState(false)

   // Export tracking state
   const [currentExports, setCurrentExports] = useState<number>(0)
   const [exportLimit, setExportLimit] = useState<number>(0)

   // Notification state
   const defaultNotifications = [
      {
         id: '4',
         title: 'Free Code Exports Now Available! 🎉',
         content: `Great news! We're now offering 3 free code exports per month for all free plan users. You can now export your Python GUI projects without upgrading!

         This means you can:
         • Export clean Python code 3 times per month
         • Test your applications before upgrading
         • Share your projects with others
         
         Want unlimited exports? Upgrade to Standard or Pro for unlimited code exports without watermarks!
         
         Additional Updates:
         • Cloud Project status indicator at the top
         • Export codes indicator in the toolbar
         • Indicator for Pro and lifetime members`,
         date: '2025-07-09',
      },
      {
         id: '3',
         title: 'New Landing Page + New Domain Name',
         content: `We have launched a new landing page for Buildfy with a fresh design and improved user experience. Leave a feedback on the new design, we would love to hear your thoughts!
         
         Also, we have got a new domain name to buildfy.online for a more professional and memorable web address. Make sure to bookmark it!`,
         date: '2025-07-02',
      },
      {
         id: '1',
         title: 'Payments Got Smoother!',
         content: `Payments now support adaptive currency and payment methods. Pay in your local currency and with methods supported in your country. 
         Like, Indian users can pay via UPI now. 

         Also From now on, New Updates will come here in Notification Panel, so make sure to check it out regularly!
         
         Any Feedback, query or feature request, please let us know through our feedback form, its highly appreciated - Available at More Options in Toolbar Area, beside profile icon!
         Thank you for using Buildfy!`,
         date: '2025-07-01',
      },
      {
         id: '2',
         title: 'Welcome to Buildfy!',
         content: 'Thank you for using Buildfy. Share your feedback or request features anytime!',
         date: '2025-06-20',
      },
   ]

   // Helper to get notification read state from localStorage
   const getReadMap = () => {
      try {
         const stored = localStorage.getItem('buildfyNotificationRead')
         return stored ? JSON.parse(stored) : {}
      } catch {
         return {}
      }
   }

   // Helper to persist notification read state
   const setReadMap = (readMap: Record<string, boolean>) => {
      localStorage.setItem('buildfyNotificationRead', JSON.stringify(readMap))
   }

   // Initialize notifications with correct read state
   const getInitialNotifications = () => {
      const readMap = getReadMap()
      return defaultNotifications.map((n) => ({ ...n, read: !!readMap[n.id] }))
   }

   const [notifications, setNotifications] = useState(getInitialNotifications)
   const [showNotifications, setShowNotifications] = useState(false)
   const [activeNotification, setActiveNotification] = useState<any>(null)

   // Count unread notifications
   const unreadCount = notifications.filter((n) => !n.read).length

   // When notifications list changes (e.g. new notification added), merge with localStorage read state
   useEffect(() => {
      const readMap = getReadMap()
      setNotifications((prev) => defaultNotifications.map((n) => ({ ...n, read: !!readMap[n.id] })))
   }, [])

   // Handler to open notification modal and mark as read
   const handleNotificationClick = (notification: any) => {
      setActiveNotification(notification)
      setNotifications((prev) => {
         const updated = prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
         // Persist to localStorage immediately
         const readMap = getReadMap()
         readMap[notification.id] = true
         setReadMap(readMap)
         return updated
      })
   }

   // Handler to close notification modal
   const closeNotificationModal = () => setActiveNotification(null)

   //~ Fetch export count and limits
   useEffect(() => {
      const fetchExportData = async () => {
         if (!user) return

         try {
            // Initialize user tracking first
            await initializeUserTracking(user.uid)

            const tier = subscription?.tier || 'free'
            const limit = getExportLimit(tier)

            setExportLimit(limit)

            if (limit !== -1) {
               const count = await getCurrentMonthExportCount(user.uid)
               setCurrentExports(count)
               console.log('📊 Export count loaded:', count, 'Limit:', limit)
            }
         } catch (error) {
            console.error('Error fetching export data:', error)
         }
      }

      fetchExportData()
   }, [user, subscription])

   //~ Function to refresh export count (can be called after export)
   const refreshExportCount = async () => {
      if (!user || exportLimit === -1) return

      try {
         const count = await getCurrentMonthExportCount(user.uid)
         setCurrentExports(count)
         console.log('🔄 Export count refreshed:', count)
      } catch (error) {
         console.error('Error refreshing export count:', error)
      }
   }

   //~ Periodically refresh export count for free users
   useEffect(() => {
      if (!user || exportLimit === -1) return

      const interval = setInterval(refreshExportCount, 30000) // Refresh every 30 seconds

      // Listen for export events to refresh immediately
      const handleExportCountChanged = () => {
         refreshExportCount()
      }

      window.addEventListener('exportCountChanged', handleExportCountChanged)

      return () => {
         clearInterval(interval)
         window.removeEventListener('exportCountChanged', handleExportCountChanged)
      }
   }, [user, exportLimit])

   const handleSignOut = async () => {
      await signOut(auth)
      navigate('/')
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!user) {
         toast.error('You must be logged in to submit feedback')
         return
      }

      if (!title.trim() || !description.trim()) {
         toast.error('Please fill in both title and description')
         return
      }

      setSubmitting(true)

      try {
         await feedbackService.submitFeedback(title.trim(), description.trim(), submissionType, user)

         // Success - reset form and close modal
         setModalOpen(false)
         setDescription('')
         setTitle('')
         const typeText = submissionType === 'feedback' ? 'Feedback' : 'Feature request'
         toast.success(`${typeText} submitted successfully! Thank you for your input.`)
      } catch (error) {
         console.error('Error submitting feedback:', error)
         toast.error('Failed to submit. Please try again.')
      } finally {
         setSubmitting(false)
      }
   }

   //~ Fetch export and project limits when subscription changes
   useEffect(() => {
      const fetchUsageData = async () => {
         if (!user || !subscription) return

         try {
            // Get export data
            const tier = subscription.tier
            const limit = getExportLimit(tier)
            const current = limit === -1 ? 0 : await getCurrentMonthExportCount(user.uid)

            setExportLimit(limit)
            setCurrentExports(current)
         } catch (error) {
            console.error('Error fetching usage data:', error)
         }
      }

      fetchUsageData()
   }, [user, subscription])

   return (
      <div className='flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/50 shadow-sm'>
         {/* Left Section - Logo & Project Actions */}
         <div className='flex items-center gap-4'>
            {' '}
            <div className='flex items-center gap-3'>
               <div className='w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <span className='text-white font-bold text-sm'>B</span>
               </div>
               <div className='hidden sm:block'>
                  <span className='font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                     Buildfy
                  </span>
                  <div className='text-xs text-slate-500 -mt-1'>Visual Builder</div>
               </div>
            </div>
            <Separator
               orientation='vertical'
               className='h-8 bg-slate-200'
            />
            {/* Project Actions */}
            <div className='flex items-center gap-1'>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant='ghost'
                           size='sm'
                           onClick={onUndo}
                           disabled={!canUndo}
                           className='px-3 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all'
                        >
                           <Undo2 size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side='bottom'
                        className='bg-slate-900 text-white text-xs'
                     >
                        <p>Undo (Ctrl+Z)</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant='ghost'
                           size='sm'
                           onClick={onRedo}
                           disabled={!canRedo}
                           className='px-3 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all'
                        >
                           <Redo2 size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side='bottom'
                        className='bg-slate-900 text-white text-xs'
                     >
                        <p>Redo (Ctrl+Shift+Z)</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
         </div>{' '}
         {/* Center Section - View Controls */}
         <div className='flex items-center gap-3'>
            <div className='flex items-center bg-slate-100 rounded-2xl p-1 shadow-inner'>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant='ghost'
                           size='sm'
                           onClick={() => {
                              if (showCodePreview) onToggleCodePreview()
                              if (showLayers && onToggleLayers) onToggleLayers()
                              if (showWindowProperties && onToggleWindowProperties) onToggleWindowProperties()
                           }}
                           className={`gap-2 text-sm px-3 py-1.5 h-8 rounded-xl transition-all duration-200 ${
                              !showCodePreview && !showLayers && !showWindowProperties
                                 ? 'bg-white text-purple-600 shadow-sm font-medium'
                                 : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                           }`}
                        >
                           <Eye size={14} />
                           Design
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side='bottom'
                        className='bg-slate-900 text-white text-xs'
                     >
                        <p>Design Mode</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant='ghost'
                           size='sm'
                           onClick={onToggleCodePreview}
                           className={`gap-2 text-sm px-3 py-1.5 h-8 rounded-xl transition-all duration-200 ${
                              showCodePreview
                                 ? 'bg-white text-purple-600 shadow-sm font-medium'
                                 : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                           }`}
                        >
                           <Code size={14} />
                           Code
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side='bottom'
                        className='bg-slate-900 text-white text-xs'
                     >
                        <p>View Generated Code</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>

            {/* Panel Controls */}
            <div className='flex items-center gap-1'>
               {onToggleLayers && (
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              variant='ghost'
                              size='sm'
                              onClick={onToggleLayers}
                              className={`px-3 h-9 rounded-lg transition-all ${
                                 showLayers
                                    ? 'bg-purple-50 text-purple-600 border border-purple-200/50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                           >
                              {showLayers ? <PanelLeftClose size={16} /> : <LayersIcon size={16} />}
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent
                           side='bottom'
                           className='bg-slate-900 text-white text-xs'
                        >
                           <p>{showLayers ? 'Hide Layers' : 'Show Layers'}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}

               {onToggleWindowProperties && (
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              variant='ghost'
                              size='sm'
                              onClick={onToggleWindowProperties}
                              className={`px-3 h-9 rounded-lg transition-all ${
                                 showWindowProperties
                                    ? 'bg-purple-50 text-purple-600 border border-purple-200/50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                           >
                              <Settings size={16} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent
                           side='bottom'
                           className='bg-slate-900 text-white text-xs'
                        >
                           <p>{showWindowProperties ? 'Hide Window Properties' : 'Window Properties'}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </div>{' '}
         {/* Right Section - User Actions */}
         <div className='flex items-center gap-3'>
            {/* Component Count */}
            <div className='flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg'>
               <div className='w-2 h-2 bg-green-500 rounded-full'></div>
               <span className='text-sm font-medium text-slate-700'>{components.length}</span>
               <span className='text-xs text-slate-500'>components</span>
            </div>
            {/* Export Status */}
            {user && (
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div
                           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                              exportLimit === -1
                                 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300'
                                 : exportLimit - currentExports <= 1
                                 ? 'bg-gradient-to-r from-red-100 to-pink-100 border border-red-300'
                                 : 'bg-slate-100'
                           }`}
                        >
                           {exportLimit === -1 ? (
                              <Zap
                                 size={12}
                                 className='text-yellow-600'
                              />
                           ) : (
                              <Download
                                 size={12}
                                 className={exportLimit - currentExports <= 1 ? 'text-red-500' : 'text-blue-500'}
                              />
                           )}
                           <span
                              className={`text-sm font-medium ${
                                 exportLimit === -1
                                    ? 'text-yellow-700'
                                    : exportLimit - currentExports <= 1
                                    ? 'text-red-700'
                                    : 'text-slate-700'
                              }`}
                           >
                              {exportLimit === -1 ? '∞' : `${Math.max(0, exportLimit - currentExports)}/${exportLimit}`}
                           </span>
                           <span
                              className={`text-xs ${
                                 exportLimit === -1
                                    ? 'text-yellow-600'
                                    : exportLimit - currentExports <= 1
                                    ? 'text-red-600'
                                    : 'text-slate-500'
                              }`}
                           >
                              exports
                           </span>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent
                        side='bottom'
                        className='bg-slate-900 text-white text-xs'
                     >
                        <p>
                           {exportLimit === -1
                              ? 'Unlimited exports (Premium)'
                              : exportLimit - currentExports <= 1
                              ? `Only ${Math.max(0, exportLimit - currentExports)} export${
                                   exportLimit - currentExports === 1 ? '' : 's'
                                } remaining!`
                              : `${Math.max(0, exportLimit - currentExports)} exports remaining this month`}
                        </p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            )}
            {/* Actions Menu */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant='ghost'
                     className='gap-2 text-sm px-4 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all'
                  >
                     <Menu size={14} />
                     <span className='hidden sm:inline'>More</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  align='end'
                  className='w-56 bg-white border-slate-200 shadow-xl rounded-xl p-2'
               >
                  <DropdownMenuItem
                     onClick={() => setModalOpen(true)}
                     className='rounded-lg'
                  >
                     <MessageSquare className='mr-3 h-4 w-4 text-purple-500' />
                     <div>
                        <div className='font-medium'>Feedback & Ideas</div>
                        <div className='text-xs text-slate-500'>Share your thoughts</div>
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => navigate('/pricing')}
                     className='rounded-lg'
                  >
                     <CreditCard className='mr-3 h-4 w-4 text-pink-500' />
                     <div>
                        <div className='font-medium'>Upgrade Plan</div>
                        <div className='text-xs text-slate-500'>Unlock premium features</div>
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='bg-slate-200' />
                  {/* <DropdownMenuItem
                     onClick={handleSignOut}
                     className='rounded-lg text-red-600 hover:bg-red-50'
                  >
                     <LogOut className='mr-3 h-4 w-4' />
                     <div>
                        <div className='font-medium'>Sign Out</div>
                        <div className='text-xs text-red-500'>End your session</div>
                     </div>
                  </DropdownMenuItem> */}
               </DropdownMenuContent>
            </DropdownMenu>{' '}
            {/* Profile Button with Crown for Premium Users */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <div className='relative'>
                     <button
                        className={`w-9 h-9 rounded-xl overflow-hidden shadow-lg border-2 ${
                           isPremiumUser(subscription)
                              ? 'border-yellow-400 bg-gradient-to-br from-yellow-500 to-orange-600 shadow-yellow-400/50'
                              : 'border-white bg-gradient-to-br from-violet-500 to-purple-600'
                        } flex items-center justify-center hover:scale-105 transition-transform cursor-pointer`}
                     >
                        {user?.photoURL ? (
                           <img
                              src={user.photoURL}
                              alt='Profile'
                              className='w-full h-full object-cover'
                              onError={(e) => {
                                 e.currentTarget.style.display = 'none'
                                 const sibling = e.currentTarget.nextElementSibling as HTMLElement
                                 if (sibling) sibling.style.display = 'flex'
                              }}
                           />
                        ) : null}
                        <span
                           className='text-white font-semibold text-sm flex items-center justify-center w-full h-full'
                           style={{ display: user?.photoURL ? 'none' : 'flex' }}
                        >
                           {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                     </button>
                     {/* Crown for Premium Users */}
                     {isPremiumUser(subscription) && (
                        <div className='absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border border-white'>
                           <Crown className='w-3 h-3 text-white' />
                        </div>
                     )}
                  </div>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  align='end'
                  className='w-56 bg-white border-slate-200 shadow-xl rounded-xl p-2'
               >
                  <DropdownMenuItem
                     onClick={() => navigate('/profile')}
                     className='rounded-lg'
                  >
                     <User className='mr-3 h-4 w-4 text-slate-500' />
                     <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                           <span className='font-medium'>My Profile</span>
                           {isPremiumUser(subscription) && (
                              <Badge className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5 h-4'>
                                 <Crown className='w-2.5 h-2.5 mr-1' />
                                 {subscription?.tier === 'lifetime' ? 'LIFETIME' : subscription?.tier?.toUpperCase()}
                              </Badge>
                           )}
                        </div>
                        <div className='text-xs text-slate-500'>Account settings</div>
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='bg-slate-200' />
                  <DropdownMenuItem
                     onClick={handleSignOut}
                     className='rounded-lg text-red-600 hover:bg-red-50'
                  >
                     <LogOut className='mr-3 h-4 w-4' />
                     <div>
                        <div className='font-medium'>Sign Out</div>
                        <div className='text-xs text-red-500'>End your session</div>
                     </div>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
            {/* Notification Bell */}
            <div className='relative'>
               <Button
                  variant='ghost'
                  className='p-0 w-10 h-10 rounded-full flex items-center justify-center relative shadow-lg bg-gradient-to-br from-pink-100/60 via-purple-100/60 to-white border-2 border-purple-400'
                  onClick={() => setShowNotifications((prev) => !prev)}
                  aria-label='Notifications'
               >
                  <Bell
                     size={32}
                     className='text-pink-500 drop-shadow-lg'
                  />
                  {unreadCount > 0 ? (
                     <span className='absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-400 rounded-full border-2 border-white animate-pulse shadow-lg'></span>
                  ) : (
                     <span className='absolute top-1 right-1 w-4 h-4 bg-gray-300 rounded-full border-2 border-white opacity-50'></span>
                  )}
               </Button>
               {showNotifications && (
                  <div className='absolute right-0 mt-2 w-[320px] bg-white border border-pink-400/40 shadow-2xl rounded-2xl z-50 p-4 flex flex-col gap-3 max-h-[24rem] overflow-y-auto backdrop-blur-xl'>
                     <div className=' flex items-center gap-2'>
                        <Bell
                           className='text-pink-400'
                           size={20}
                        />
                        <span className='font-bold text-base bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent'>
                           Notifications
                        </span>
                        {unreadCount > 0 && (
                           <span className='ml-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-semibold'>
                              {unreadCount} new
                           </span>
                        )}
                     </div>
                     {notifications.length === 0 && (
                        <div className='text-center text-gray-400 py-8 text-base'>No notifications</div>
                     )}
                     {notifications.map((n) => (
                        <div
                           key={n.id}
                           className={`cursor-pointer rounded-xl p-3 mb-2 shadow-lg border border-transparent transition-all bg-gradient-to-br from-white via-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 hover:border-pink-300/60 hover:scale-[1.03]`}
                           onClick={() => handleNotificationClick(n)}
                        >
                           <div className='flex items-center justify-between mb-1'>
                              <div className='font-bold text-base bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent'>
                                 {n.title}
                              </div>
                              {!n.read && (
                                 <span className='ml-2 w-2.5 h-2.5 bg-pink-400 rounded-full border-2 border-white shadow-lg animate-pulse'></span>
                              )}
                           </div>
                           <div className='text-xs text-gray-400 mb-1'>{n.date}</div>
                           <div className='text-sm text-slate-600 truncate'>
                              {n.content.length > 60 ? n.content.slice(0, 60) + '…' : n.content}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
            {/* Notification Modal */}
            {activeNotification && (
               <Dialog
                  open={true}
                  onOpenChange={closeNotificationModal}
               >
                  <DialogContent className='max-w-md mx-auto bg-white border border-slate-300 text-slate-900 rounded-2xl p-8'>
                     <DialogHeader>
                        <DialogTitle className='text-pink-600'>{activeNotification.title}</DialogTitle>
                     </DialogHeader>
                     <div className='mt-4 text-base whitespace-pre-line'>{activeNotification.content}</div>
                     <div className='mt-2 text-xs text-gray-400'>Received: {activeNotification.date}</div>
                     {/* <DialogFooter className='pt-4'>
                        <Button
                           onClick={closeNotificationModal}
                           className='bg-pink-500 text-white rounded-xl'
                        >
                           Close
                        </Button>
                     </DialogFooter> */}
                  </DialogContent>
               </Dialog>
            )}
         </div>{' '}
         {/* Feedback Dialog */}
         <Dialog
            open={modalOpen}
            onOpenChange={setModalOpen}
         >
            {' '}
            <DialogContent className='max-w-lg mx-auto bg-slate-900 border border-slate-700 text-white rounded-2xl p-8'>
               <DialogHeader>
                  <DialogTitle className='text-white bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent'>
                     Share Your Feedback & Ideas
                  </DialogTitle>
               </DialogHeader>
               <form onSubmit={handleSubmit}>
                  <div className='space-y-5'>
                     {/* Type Selection */}
                     <div className='space-y-3'>
                        <Label className='text-white font-medium'>Type</Label>

                        <div className='flex gap-3'>
                           {' '}
                           <label
                              className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all ${
                                 submissionType === 'feedback'
                                    ? 'bg-pink-500/20 border border-pink-500/30'
                                    : 'hover:bg-slate-800/50 border border-transparent'
                              }`}
                           >
                              <input
                                 type='radio'
                                 value='feedback'
                                 checked={submissionType === 'feedback'}
                                 onChange={(e) => setSubmissionType(e.target.value as 'feedback' | 'feature-request')}
                                 disabled={submitting}
                                 className='w-4 h-4 text-pink-500 bg-slate-800 border-slate-600 focus:ring-0 focus:ring-offset-0'
                              />
                              <span
                                 className={`text-sm transition-colors ${
                                    submissionType === 'feedback' ? 'text-pink-400 font-medium' : 'text-gray-300'
                                 }`}
                              >
                                 💬 General Feedback
                              </span>
                           </label>{' '}
                           <label
                              className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all ${
                                 submissionType === 'feature-request'
                                    ? 'bg-violet-500/20 border border-violet-500/30'
                                    : 'hover:bg-slate-800/50 border border-transparent'
                              }`}
                           >
                              <input
                                 type='radio'
                                 value='feature-request'
                                 checked={submissionType === 'feature-request'}
                                 onChange={(e) => setSubmissionType(e.target.value as 'feedback' | 'feature-request')}
                                 disabled={submitting}
                                 className='w-4 h-4 text-violet-500 bg-slate-800 border-slate-600 focus:ring-0 focus:ring-offset-0'
                              />
                              <span
                                 className={`text-sm transition-colors ${
                                    submissionType === 'feature-request'
                                       ? 'text-violet-400 font-medium'
                                       : 'text-gray-300'
                                 }`}
                              >
                                 ✨ Feature Request
                              </span>
                           </label>
                        </div>

                        {/* Info Box */}
                        <div
                           className={`p-3 rounded-xl border transition-all ${
                              submissionType === 'feedback'
                                 ? 'bg-pink-500/10 border-pink-500/30'
                                 : 'bg-violet-500/10 border-violet-500/30'
                           }`}
                        >
                           <p className='text-xs text-gray-300'>
                              {submissionType === 'feedback'
                                 ? "� Request new features or functionality that doesn't currently exist in the app."
                                 : '� Share your thoughts about the app, report bugs, or suggest improvements to existing features.'}
                           </p>
                        </div>
                     </div>{' '}
                     <div className='space-y-3'>
                        <Label
                           htmlFor='title'
                           className='text-white'
                        >
                           {submissionType === 'feedback' ? 'Feedback Title' : 'Feature Title'}
                        </Label>
                        <Input
                           id='title'
                           type='text'
                           placeholder={
                              submissionType === 'feedback'
                                 ? 'Brief title for your feedback...'
                                 : 'Brief title for your feature request...'
                           }
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           disabled={submitting}
                           required
                           className='bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-pink-500 rounded-xl h-11 px-4'
                        />
                     </div>
                     <div className='space-y-3'>
                        <Label
                           htmlFor='description'
                           className='text-white'
                        >
                           {submissionType === 'feedback' ? 'Your Feedback' : 'Feature Description'}
                        </Label>
                        <textarea
                           id='description'
                           className='w-full min-h-[120px] p-4 border border-slate-600 bg-slate-800 rounded-xl text-sm text-white placeholder:text-gray-400 focus:border-pink-500 focus:outline-none resize-none'
                           placeholder={
                              submissionType === 'feedback'
                                 ? "Please share your thoughts, suggestions, or issues you've encountered..."
                                 : "Describe the feature you'd like to see. What problem would it solve? How would it work?..."
                           }
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           disabled={submitting}
                           required
                        />
                     </div>
                  </div>{' '}
                  <DialogFooter className='pt-4'>
                     <Button
                        type='submit'
                        disabled={submitting || !description || !title}
                        className='w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white border-0 rounded-xl h-11'
                     >
                        {submitting
                           ? 'Submitting...'
                           : `Submit ${submissionType === 'feedback' ? 'Feedback' : 'Feature Request'}`}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   )
}
