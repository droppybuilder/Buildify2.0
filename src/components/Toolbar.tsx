import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Code, Layers as LayersIcon, Settings, User, CreditCard, LogOut } from 'lucide-react'
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
   const [modalOpen, setModalOpen] = useState(false)
   const [featureRequest, setFeatureRequest] = useState('')
   const [featureName, setFeatureName] = useState('')
   const [submitting, setSubmitting] = useState(false)

   const handleSignOut = async () => {
      await signOut(auth)
      navigate('/auth')
   }

   const handleFeatureSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitting(true)
      // For demo, just close modal and reset
      setTimeout(() => {
         setSubmitting(false)
         setModalOpen(false)
         setFeatureRequest('')
         setFeatureName('')
         // You can add a toast here for success
         // toast('Feature request submitted!')
      }, 1000)
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
            </Button>
            <Button
               variant='outline'
               size='sm'
               className='gap-1 text-xs border-primary text-primary font-semibold'
               style={{ borderWidth: 2 }}
               onClick={() => setModalOpen(true)}
            >
               + Request Next Feature
            </Button>
            <Dialog
               open={modalOpen}
               onOpenChange={setModalOpen}
            >
               <DialogContent className='max-w-md mx-auto'>
                  <DialogHeader>
                     <DialogTitle>Request a Feature</DialogTitle>
                  </DialogHeader>
                  <form
                     onSubmit={handleFeatureSubmit}
                     className='space-y-4'
                  >
                     <div className='space-y-2'>
                        <Label htmlFor='feature-name'>Feature Name</Label>
                        <Input
                           id='feature-name'
                           value={featureName}
                           onChange={(e) => setFeatureName(e.target.value)}
                           placeholder='Short title for your feature...'
                           required
                        />
                     </div>
                     <div className='space-y-2'>
                        <Label htmlFor='feature-request'>Feature Description</Label>
                        <textarea
                           id='feature-request'
                           value={featureRequest}
                           onChange={(e) => setFeatureRequest(e.target.value)}
                           placeholder='Describe your feature idea...'
                           required
                           className='w-full min-h-[80px] max-h-60 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                           style={{ resize: 'vertical' }}
                        />
                     </div>
                     <DialogFooter>
                        <Button
                           type='submit'
                           disabled={submitting || !featureRequest || !featureName}
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
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/pricing')}>Subscription</DropdownMenuItem>
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
