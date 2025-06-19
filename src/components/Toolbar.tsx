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
      <div className='flex items-center justify-between px-4 py-3 bg-background border-b border-border'>
         {/* Left Section - Logo & Project Actions */}
         <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
               <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>B</span>
               </div>
               <span className='font-semibold text-lg hidden sm:block'>Buildfy</span>
            </div>
            
            <Separator orientation='vertical' className='h-6' />
            
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
                           className='px-2'
                        >
                           <Undo2 size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
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
                           className='px-2'
                        >
                           <Redo2 size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>Redo (Ctrl+Shift+Z)</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
         </div>

         {/* Center Section - View Controls */}
         <div className='flex items-center gap-2'>
            <div className='flex items-center bg-muted rounded-lg p-1'>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant={!showCodePreview && !showLayers && !showWindowProperties ? 'secondary' : 'ghost'}
                           size='sm'
                           onClick={() => {
                              if (showCodePreview) onToggleCodePreview()
                              if (showLayers && onToggleLayers) onToggleLayers()
                              if (showWindowProperties && onToggleWindowProperties) onToggleWindowProperties()
                           }}
                           className='gap-2 text-xs px-3'
                        >
                           <Eye size={14} />
                           Design
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>Design Mode</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant={showCodePreview ? 'secondary' : 'ghost'}
                           size='sm'
                           onClick={onToggleCodePreview}
                           className='gap-2 text-xs px-3'
                        >
                           <Code size={14} />
                           Code
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
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
                              variant={showLayers ? 'secondary' : 'ghost'}
                              size='sm'
                              onClick={onToggleLayers}
                              className='px-2'
                           >
                              {showLayers ? <PanelLeftClose size={16} /> : <LayersIcon size={16} />}
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
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
                              variant={showWindowProperties ? 'secondary' : 'ghost'}
                              size='sm'
                              onClick={onToggleWindowProperties}
                              className='px-2'
                           >
                              <Settings size={16} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{showWindowProperties ? 'Hide Window Properties' : 'Window Properties'}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </div>

         {/* Right Section - User Actions */}
         <div className='flex items-center gap-2'>
            {/* Component Count */}
            <Badge variant='secondary' className='text-xs px-2 py-1'>
               {components.length} components
            </Badge>

            {/* Actions Menu */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='gap-2 text-xs px-3'>
                     <Menu size={14} />
                     <span className='hidden sm:inline'>More</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem onClick={() => setModalOpen(true)}>
                     <MessageSquare className='mr-2 h-4 w-4' />
                     Feedback & Ideas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/pricing')}>
                     <CreditCard className='mr-2 h-4 w-4' />
                     Upgrade Plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                     <User className='mr-2 h-4 w-4' />
                     Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                     <LogOut className='mr-2 h-4 w-4' />
                     Sign Out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar */}
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center'>
               <span className='text-white font-medium text-sm'>
                  {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
               </span>
            </div>
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
