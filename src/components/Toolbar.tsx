import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Code, Layers as LayersIcon, Settings, User, CreditCard, LogOut, MessageSquare, Menu, Eye, EyeOff, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { signOut } from 'firebase/auth'
import { auth } from '@/integrations/firebase/firebase.config'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { feedbackService } from '@/services/feedbackService'
import { toast } from 'sonner'

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
}: ToolbarProps) => {   const navigate = useNavigate()
   const { user } = useAuth()
   const [modalOpen, setModalOpen] = useState(false)
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [submissionType, setSubmissionType] = useState<'feedback' | 'feature-request'>('feedback')
   const [submitting, setSubmitting] = useState(false)

   const handleSignOut = async () => {
      await signOut(auth)
      navigate('/auth')
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
         await feedbackService.submitFeedback(
            title.trim(),
            description.trim(),
            submissionType,
            user
         )
         
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

   return (
      <div className='flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/50 shadow-sm'>
         {/* Left Section - Logo & Project Actions */}
         <div className='flex items-center gap-4'>            <div className='flex items-center gap-3'>
               <div className='w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <span className='text-white font-bold text-sm'>B</span>
               </div>
               <div className='hidden sm:block'>
                  <span className='font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Buildfy</span>
                  <div className='text-xs text-slate-500 -mt-1'>Visual Builder</div>
               </div>
            </div>
            
            <Separator orientation='vertical' className='h-8 bg-slate-200' />
            
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
                     <TooltipContent side="bottom" className="bg-slate-900 text-white text-xs">
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
                     <TooltipContent side="bottom" className="bg-slate-900 text-white text-xs">
                        <p>Redo (Ctrl+Shift+Z)</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
         </div>         {/* Center Section - View Controls */}
         <div className='flex items-center gap-3'>
            <div className='flex items-center bg-slate-100 rounded-2xl p-1 shadow-inner'>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant="ghost"
                           size='sm'
                           onClick={() => {
                              if (showCodePreview) onToggleCodePreview()
                              if (showLayers && onToggleLayers) onToggleLayers()
                              if (showWindowProperties && onToggleWindowProperties) onToggleWindowProperties()
                           }}                           className={`gap-2 text-sm px-3 py-1.5 h-8 rounded-xl transition-all duration-200 ${
                              !showCodePreview && !showLayers && !showWindowProperties 
                                 ? 'bg-white text-purple-600 shadow-sm font-medium' 
                                 : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                           }`}
                        >
                           <Eye size={14} />
                           Design
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent side="bottom" className="bg-slate-900 text-white text-xs">
                        <p>Design Mode</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant="ghost"
                           size='sm'
                           onClick={onToggleCodePreview}                           className={`gap-2 text-sm px-3 py-1.5 h-8 rounded-xl transition-all duration-200 ${
                              showCodePreview 
                                 ? 'bg-white text-purple-600 shadow-sm font-medium' 
                                 : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                           }`}
                        >
                           <Code size={14} />
                           Code
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent side="bottom" className="bg-slate-900 text-white text-xs">
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
                              onClick={onToggleLayers}                              className={`px-3 h-9 rounded-lg transition-all ${
                                 showLayers 
                                    ? 'bg-purple-50 text-purple-600 border border-purple-200/50' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                           >
                              {showLayers ? <PanelLeftClose size={16} /> : <LayersIcon size={16} />}
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 text-white text-xs">
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
                              onClick={onToggleWindowProperties}                              className={`px-3 h-9 rounded-lg transition-all ${
                                 showWindowProperties 
                                    ? 'bg-purple-50 text-purple-600 border border-purple-200/50' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                           >
                              <Settings size={16} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 text-white text-xs">
                           <p>{showWindowProperties ? 'Hide Window Properties' : 'Window Properties'}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </div>         {/* Right Section - User Actions */}
         <div className='flex items-center gap-3'>
            {/* Component Count */}
            <div className='flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg'>
               <div className='w-2 h-2 bg-green-500 rounded-full'></div>
               <span className='text-sm font-medium text-slate-700'>{components.length}</span>
               <span className='text-xs text-slate-500'>components</span>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='gap-2 text-sm px-4 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all'>
                     <Menu size={14} />
                     <span className='hidden sm:inline'>More</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end' className='w-56 bg-white border-slate-200 shadow-xl rounded-xl p-2'>
                  <DropdownMenuItem onClick={() => setModalOpen(true)} className="rounded-lg">
                     <MessageSquare className='mr-3 h-4 w-4 text-purple-500' />
                     <div>
                        <div className="font-medium">Feedback & Ideas</div>
                        <div className="text-xs text-slate-500">Share your thoughts</div>
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/pricing')} className="rounded-lg">
                     <CreditCard className='mr-3 h-4 w-4 text-pink-500' />
                     <div>
                        <div className="font-medium">Upgrade Plan</div>
                        <div className="text-xs text-slate-500">Unlock premium features</div>
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-red-600 hover:bg-red-50">
                     <LogOut className='mr-3 h-4 w-4' />
                     <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-500">End your session</div>
                     </div>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>            {/* Profile Button */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <button className='w-9 h-9 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer'>
                     {user?.photoURL ? (
                        <img 
                           src={user.photoURL} 
                           alt="Profile" 
                           className="w-full h-full object-cover"
                           onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                              if (sibling) sibling.style.display = 'flex';
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
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end' className='w-56 bg-white border-slate-200 shadow-xl rounded-xl p-2'>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-lg">
                     <User className='mr-3 h-4 w-4 text-slate-500' />
                     <div>
                        <div className="font-medium">My Profile</div>
                        <div className="text-xs text-slate-500">Account settings</div>
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-red-600 hover:bg-red-50">
                     <LogOut className='mr-3 h-4 w-4' />
                     <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-500">End your session</div>
                     </div>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         {/* Feedback Dialog */}
         <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className='max-w-md mx-auto'>
               <DialogHeader>
                  <DialogTitle>Share Your Feedback & Ideas</DialogTitle>
               </DialogHeader>
               <form onSubmit={handleSubmit}>
                  <div className='space-y-4'>
                     <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                           id='title'
                           type='text'
                           placeholder='Brief title for your feedback or idea'
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           disabled={submitting}
                           required
                        />
                     </div>
                     <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <textarea
                           id='description'
                           className='w-full min-h-[100px] p-3 border border-input bg-background rounded-md text-sm focus:border-primary focus:outline-none'
                           placeholder='Please describe your feedback or feature request in detail...'
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           disabled={submitting}
                           required
                        />
                     </div>
                     <div className='space-y-2'>
                        <Label>Type</Label>
                        <div className='flex gap-4'>
                           <label className='flex items-center space-x-2'>
                              <input
                                 type='radio'
                                 value='feedback'
                                 checked={submissionType === 'feedback'}
                                 onChange={(e) => setSubmissionType(e.target.value as 'feedback' | 'feature-request')}
                                 disabled={submitting}
                              />
                              <span className='text-sm'>General Feedback</span>
                           </label>
                           <label className='flex items-center space-x-2'>
                              <input
                                 type='radio'
                                 value='feature-request'
                                 checked={submissionType === 'feature-request'}
                                 onChange={(e) => setSubmissionType(e.target.value as 'feedback' | 'feature-request')}
                                 disabled={submitting}
                              />
                              <span className='text-sm'>Feature Request</span>
                           </label>
                        </div>
                     </div>
                  </div>
                  <DialogFooter>
                     <Button type='submit' disabled={submitting || !description || !title}>
                        {submitting ? 'Submitting...' : 'Submit'}
                     </Button>                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   )
}
