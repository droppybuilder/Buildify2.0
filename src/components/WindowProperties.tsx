import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { ColorInput } from '@/components/ColorInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'

interface WindowPropertiesProps {
   visible: boolean
   title: string
   setTitle: (title: string) => void
   size: { width: number; height: number }
   setSize: (size: { width: number; height: number }) => void
   bgColor: string
   setBgColor: (color: string) => void
   appearanceMode?: string
   setAppearanceMode?: (mode: string) => void
}

export const WindowProperties: React.FC<WindowPropertiesProps> = ({
   visible,
   title,
   setTitle,
   size,
   setSize,
   bgColor,
   setBgColor,
   appearanceMode = 'system',
   setAppearanceMode,
}) => {
   const [localTitle, setLocalTitle] = useState(title)
   const [localWidth, setLocalWidth] = useState(size.width.toString())
   const [localHeight, setLocalHeight] = useState(size.height.toString())
   const [localBgColor, setLocalBgColor] = useState(bgColor)
   const [localAppearanceMode, setLocalAppearanceMode] = useState(appearanceMode)

   const { subscription, loading: subscriptionLoading } = useSubscription()

   // Normalize tier for feature checks
   const normalizedTier = subscription?.tier === 'lifetime' ? 'pro' : subscription?.tier
   const isUnlimitedCanvas = normalizedTier === 'standard' || normalizedTier === 'pro'
   const maxCanvasSize = isUnlimitedCanvas ? { width: 3000, height: 2000 } : { width: 800, height: 600 }

   useEffect(() => {
      setLocalTitle(title)
      setLocalWidth(size.width.toString())
      setLocalHeight(size.height.toString())
      setLocalBgColor(bgColor)
      setLocalAppearanceMode(appearanceMode)
   }, [title, size, bgColor, appearanceMode])
   const handlePresetSelect = (width: string, height: string) => {
      const widthNum = parseInt(width)
      const heightNum = parseInt(height)

      // Check subscription limits before allowing preset selection
      if (!subscriptionLoading && subscription !== null) {
         if (widthNum > maxCanvasSize.width || heightNum > maxCanvasSize.height) {
            if (!isUnlimitedCanvas) {
               toast.warning('Upgrade to Standard or Pro for unlimited canvas size!')
               return
            }
         }
      }

      setLocalWidth(width)
      setLocalHeight(height)
      toast.success(`Preset selected: ${width}×${height}. Click "Apply Changes" to save.`)
   }
   const handleApply = () => {
      const width = parseInt(localWidth)
      const height = parseInt(localHeight)

      if (isNaN(width) || isNaN(height) || width < 100 || height < 100) {
         toast.error('Invalid dimensions. Width and height must be at least 100px.')
         return
      }

      // Check subscription limits before applying size changes
      if (!subscriptionLoading && subscription !== null) {
         if (width > maxCanvasSize.width || height > maxCanvasSize.height) {
            if (!isUnlimitedCanvas) {
               toast.warning('Upgrade to Standard or Pro for unlimited canvas size!')
               // Reset to maximum allowed size for free users
               setLocalWidth(Math.min(width, maxCanvasSize.width).toString())
               setLocalHeight(Math.min(height, maxCanvasSize.height).toString())
               return
            }
         }
      }

      setTitle(localTitle)
      // Also update document title
      document.title = localTitle
      setSize({ width, height })
      setBgColor(localBgColor)
      if (setAppearanceMode) {
         setAppearanceMode(localAppearanceMode)
      }
      toast.success('Window properties updated')
   }

   if (!visible) return null

   return (
      <div className='h-full overflow-auto bg-background p-4'>
         <div className='mb-6 space-y-1'>
            <h2 className='text-lg font-semibold mb-4'>Window Properties</h2>
            <p className='text-sm text-muted-foreground mb-4'>Customize the appearance of your application window</p>
         </div>

         <div className='space-y-6'>
            <div className='space-y-2'>
               <Label htmlFor='window-title'>Window Title</Label>
               <Input
                  id='window-title'
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder='Application Title'
               />
            </div>

            <div className='grid grid-cols-2 gap-4'>
               <div className='space-y-2'>
                  <Label htmlFor='window-width'>Width (px)</Label>
                  <Input
                     id='window-width'
                     value={localWidth}
                     onChange={(e) => setLocalWidth(e.target.value)}
                     type='number'
                     min='100'
                     max={isUnlimitedCanvas ? '3000' : '800'}
                     step='10'
                  />
                  {!isUnlimitedCanvas && !subscriptionLoading && (
                     <p className='text-xs text-muted-foreground'>Max: 800px (free plan)</p>
                  )}
               </div>
               <div className='space-y-2'>
                  <Label htmlFor='window-height'>Height (px)</Label>
                  <Input
                     id='window-height'
                     value={localHeight}
                     onChange={(e) => setLocalHeight(e.target.value)}
                     type='number'
                     min='100'
                     max={isUnlimitedCanvas ? '2000' : '600'}
                     step='10'
                  />
                  {!isUnlimitedCanvas && !subscriptionLoading && (
                     <p className='text-xs text-muted-foreground'>Max: 600px (free plan)</p>
                  )}
               </div>
            </div>

            <div className='space-y-2'>
               <Label>Window Size Presets</Label>
               {!isUnlimitedCanvas && !subscriptionLoading && (
                  <p className='text-xs text-muted-foreground'>
                     Free plan: Maximum 800×600. Upgrade for larger sizes.
                  </p>
               )}
               <div className='flex gap-2 flex-wrap'>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={() => handlePresetSelect('640', '480')}
                  >
                     640×480
                  </Button>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={() => handlePresetSelect('800', '600')}
                  >
                     800×600
                  </Button>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={() => handlePresetSelect('1024', '768')}
                     disabled={!isUnlimitedCanvas && !subscriptionLoading}
                     className={!isUnlimitedCanvas && !subscriptionLoading ? 'opacity-50' : ''}
                  >
                     1024×768 {!isUnlimitedCanvas && !subscriptionLoading && '🔒'}
                  </Button>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={() => handlePresetSelect('1280', '720')}
                     disabled={!isUnlimitedCanvas && !subscriptionLoading}
                     className={!isUnlimitedCanvas && !subscriptionLoading ? 'opacity-50' : ''}
                  >
                     1280×720 {!isUnlimitedCanvas && !subscriptionLoading && '🔒'}
                  </Button>
               </div>
            </div>            <div className='grid grid-cols-2 gap-4'>
               <div className='space-y-2'>
                  <Label htmlFor='window-bg'>Background Color</Label>
                  <ColorInput
                     value={localBgColor}
                     onChange={setLocalBgColor}
                     label='Background Color'
                  />
               </div>
               <div className='space-y-2'>
                  <Label htmlFor='appearance-mode'>Appearance Mode</Label>
                  <Select value={localAppearanceMode} onValueChange={setLocalAppearanceMode}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <Button
               className='w-full mt-4'
               onClick={handleApply}
            >
               Apply Changes
            </Button>
         </div>
      </div>
   )
}
