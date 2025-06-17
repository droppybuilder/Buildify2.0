import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Code, Layers as LayersIcon, Settings, User, CreditCard, LogOut, MessageSquare } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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

   const handleFeatureSubmit = async (e: React.FormEvent) => {
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
      <div className='h-12 border-b flex items-center px-4 gap-2'>
         <TooltipProvider>
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={onUndo}
                     disabled={!canUndo}
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
                     size='icon'
                     onClick={onRedo}
                     disabled={!canRedo}
                  >
                     <Redo2 size={16} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Redo (Ctrl+Shift+Z)</p>
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>

         <Separator
            orientation='vertical'
            className='h-6 mx-2'
         />

         <TooltipProvider>
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                     variant={showCodePreview ? 'default' : 'ghost'}
                     size='sm'
                     onClick={onToggleCodePreview}
                     className='gap-2 text-xs'
                  >
                     <Code size={16} />
                     {!showCodePreview ? 'Code' : 'Hide Code'}
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Toggle code preview</p>
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>

         {onToggleLayers && (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        variant={showLayers ? 'default' : 'ghost'}
                        size='sm'
                        onClick={onToggleLayers}
                        className='gap-2 text-xs'
                     >
                        <LayersIcon size={16} />
                        {!showLayers ? 'Layers' : 'Hide Layers'}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>Toggle layers panel (Figma style)</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         )}

         {onToggleWindowProperties && (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        variant={showWindowProperties ? 'default' : 'ghost'}
                        size='sm'
                        onClick={onToggleWindowProperties}
                        className='gap-2 text-xs'
                     >
                        <Settings size={16} />
                        {!showWindowProperties ? 'Window' : 'Hide Window'}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>Toggle window properties</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         )}

         <div className='ml-auto flex items-center gap-2'>
            {/* {subscription && <Badge className='capitalize'>{subscription.tier} Plan</Badge>} */}

            <Button
               variant='ghost'
               size='sm'
               className='gap-1 text-xs'
               onClick={() => navigate('/pricing')}
            >
               <CreditCard size={16} />
               Plans
            </Button>            <Button
               variant='outline'
               size='sm'
               className='gap-1 text-xs border-primary text-primary font-semibold'
               style={{ borderWidth: 2 }}
               onClick={() => setModalOpen(true)}
            >
               <MessageSquare size={14} />
               Feedback & Ideas
            </Button>
            <Dialog
               open={modalOpen}
               onOpenChange={setModalOpen}
            >               <DialogContent className='max-w-md mx-auto'>
                  <DialogHeader>
                     <DialogTitle>Share Your Feedback & Ideas</DialogTitle>
                  </DialogHeader>
                  <form
                     onSubmit={handleFeatureSubmit}
                     className='space-y-4'
                  >
                     <div className='space-y-2'>
                        <Label>Type</Label>
                        <div className='flex gap-4'>
                           <label className='flex items-center space-x-2 cursor-pointer'>
                              <input
                                 type='radio'
                                 name='submissionType'
                                 value='feedback'
                                 checked={submissionType === 'feedback'}
                                 onChange={(e) => setSubmissionType(e.target.value as 'feedback')}
                                 className='text-primary'
                              />
                              <span className='text-sm'>General Feedback</span>
                           </label>
                           <label className='flex items-center space-x-2 cursor-pointer'>
                              <input
                                 type='radio'
                                 name='submissionType'
                                 value='feature-request'
                                 checked={submissionType === 'feature-request'}
                                 onChange={(e) => setSubmissionType(e.target.value as 'feature-request')}
                                 className='text-primary'
                              />
                              <span className='text-sm'>Feature Request</span>
                           </label>
                        </div>
                     </div>
                     <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                           id='title'
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           placeholder={submissionType === 'feedback' ? 'Brief summary of your feedback...' : 'Short title for your feature idea...'}
                           required
                        />
                     </div>
                     <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <textarea
                           id='description'
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           placeholder={submissionType === 'feedback' ? 'Tell us about your experience, what you liked, what could be improved...' : 'Describe your feature idea in detail...'}
                           required
                           className='w-full min-h-[80px] max-h-60 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                           style={{ resize: 'vertical' }}
                        />
                     </div>
                     <DialogFooter>
                        <Button
                           type='submit'
                           disabled={submitting || !description || !title}
                        >
                           {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                     </DialogFooter>
                  </form>
               </DialogContent>
            </Dialog>

            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant='ghost'
                     size='icon'
                  >
                     <User size={16} />
                  </Button>
               </DropdownMenuTrigger>               <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/pricing')}>Subscription</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setModalOpen(true)}>
                     <MessageSquare className='mr-2 h-4 w-4' />
                     Send Feedback
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                     <LogOut className='mr-2 h-4 w-4' />
                     Sign Out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>

            <div className='text-xs text-muted-foreground'>{components.length} components</div>
         </div>
      </div>
   )
}
