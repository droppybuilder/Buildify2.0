import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import Canvas from '@/components/Canvas'
import { PropertyPanel } from '@/components/PropertyPanel'
import { CodePreview } from '@/components/CodePreview'
import { Toolbar } from '@/components/Toolbar'
import { Layers } from '@/components/Layers'
import { WindowProperties } from '@/components/WindowProperties'
import { ProjectToolbar } from '@/components/ProjectToolbar'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/contexts/AuthContext'
import { useProjectManager } from '@/hooks/useProjectManager'
import WatermarkedCanvas from '@/components/WatermarkedCanvas'
import {
   FEATURES,
   hasFeature,
   canExportCode,
   incrementExportCount,
   hasUnlimitedExports,
} from '@/utils/subscriptionUtils'
import { X } from 'lucide-react'
import { SEO, seoConfig } from '@/components/SEO'

// Define what constitutes a major state change for undo/redo
const ACTION_TYPES = {
   ADD_COMPONENT: 'add_component',
   DELETE_COMPONENT: 'delete_component',
   UPDATE_COMPONENT: 'update_component',
   REORDER_COMPONENTS: 'reorder_components',
   WINDOW_SETTINGS: 'window_settings',
   MULTI_DELETE: 'multi_delete',
}

const Index = () => {
   const navigate = useNavigate()
   const { user } = useAuth()
   const { subscription, loading: subscriptionLoading } = useSubscription()

   const [selectedComponent, setSelectedComponent] = useState(null)
   const [components, setComponents] = useState([])
   const [history, setHistory] = useState<any[][]>([[]])
   const [historyIndex, setHistoryIndex] = useState(0)
   const [actionHistory, setActionHistory] = useState<string[]>(['initial'])
   const [inputFocused, setInputFocused] = useState(false)
   const [selectedComponents, setSelectedComponents] = useState<string[]>([])
   const [showCodePreview, setShowCodePreview] = useState(false)
   const [showLayers, setShowLayers] = useState(false)
   const [showWindowProperties, setShowWindowProperties] = useState(false)
   const [isUndoRedoAction, setIsUndoRedoAction] = useState(false)
   const [lastActionTimestamp, setLastActionTimestamp] = useState(0)

   const [windowTitle, setWindowTitle] = useState('My CustomTkinter Application')
   const [windowSize, setWindowSize] = useState({ width: 800, height: 600 })
   const [windowBgColor, setWindowBgColor] = useState('#e8e8e8') // Set dark background as default
   const [windowAppearanceMode, setWindowAppearanceMode] = useState('system')
   const [showUpdateBanner, setShowUpdateBanner] = useState(() => {
      // Only show if not dismissed before
      return localStorage.getItem('updateBannerDismissed') !== 'true'
   })

   // Safe setter for selected component that includes validation
   const safeSetSelectedComponent = useCallback(
      (component: any) => {
         // If component is null, just clear the selection
         if (!component) {
            setSelectedComponent(null)
            return
         }

         // Validate the component has an id
         if (!component.id) {
            console.warn('Attempted to select an invalid component without id:', component)
            return
         }

         // Verify the component exists in our components array
         const componentExists = components.some((c) => c.id === component.id)
         if (!componentExists) {
            console.warn('Attempted to select a non-existent component:', component.id)
            return
         }

         // Find the component in the array to ensure we have the current version
         const currentComponent = components.find((c) => c.id === component.id)
         setSelectedComponent(currentComponent)
      },
      [components]
   )

   useEffect(() => {
      try {
         const savedComponents = localStorage.getItem('guiBuilderComponents')
         
         if (savedComponents) {
            const parsedComponents = JSON.parse(savedComponents)
            setComponents(parsedComponents)
            // Initialize history with loaded components instead of calling addToHistory
            setHistory([parsedComponents])
            setHistoryIndex(0)
            setActionHistory(['initial'])
         }

         const savedWindowTitle = localStorage.getItem('guiBuilderWindowTitle')
         const savedWindowSize = localStorage.getItem('guiBuilderWindowSize')
         const savedWindowBgColor = localStorage.getItem('guiBuilderWindowBgColor')

         if (savedWindowTitle) setWindowTitle(savedWindowTitle)
         if (savedWindowSize) setWindowSize(JSON.parse(savedWindowSize))
         if (savedWindowBgColor) setWindowBgColor(savedWindowBgColor)
      } catch (error) {
         console.error('Failed to load saved components:', error)
      }
   }, [])

   useEffect(() => {
      try {
         localStorage.setItem('guiBuilderComponents', JSON.stringify(components))
      } catch (error) {
         console.error('Failed to save components:', error)
      }
   }, [components])

   // Optimized addToHistory that only adds significant changes
   const addToHistory = useCallback(
      (newComponents: any[], actionType: string) => {
         const now = Date.now()

         // Don't record history for continuous small movements within 500ms
         if (actionType === ACTION_TYPES.UPDATE_COMPONENT && now - lastActionTimestamp < 500 && !isUndoRedoAction) {
            return
         }

         // Only add to history if it's a significant action or enough time has passed
         if (isUndoRedoAction || actionType !== ACTION_TYPES.UPDATE_COMPONENT || now - lastActionTimestamp > 500) {
            setLastActionTimestamp(now)

            // Make sure we're only storing different states
            if (JSON.stringify(newComponents) !== JSON.stringify(history[historyIndex])) {
               const newHistory = history.slice(0, historyIndex + 1)
               newHistory.push([...newComponents])

               const newActionHistory = actionHistory.slice(0, historyIndex + 1)
               newActionHistory.push(actionType)

               setHistory(newHistory)
               setActionHistory(newActionHistory)
               setHistoryIndex(newHistory.length - 1)
            }
         }
      },
      [history, historyIndex, actionHistory, lastActionTimestamp, isUndoRedoAction]
   )

   const handleComponentsChange = useCallback(
      (newComponents: any[], actionType = ACTION_TYPES.UPDATE_COMPONENT) => {
         setComponents([...newComponents])
         addToHistory([...newComponents], actionType)
      },
      [addToHistory]
   )

   const handleUndo = useCallback(() => {
      if (historyIndex > 0) {
         const newIndex = historyIndex - 1
         setIsUndoRedoAction(true)
         setHistoryIndex(newIndex)
         setComponents([...history[newIndex]])

         // Reset selected component to prevent issues
         setSelectedComponent(null)
         setSelectedComponents([])

         toast.info(`Undo: ${actionHistory[newIndex + 1].replace('_', ' ')}`)

         // Reset the flag after a short delay
         setTimeout(() => {
            setIsUndoRedoAction(false)
         }, 100)
      }
   }, [history, historyIndex, actionHistory])

   const handleRedo = useCallback(() => {
      if (historyIndex < history.length - 1) {
         const newIndex = historyIndex + 1
         setIsUndoRedoAction(true)
         setHistoryIndex(newIndex)
         setComponents([...history[newIndex]])

         // Reset selected component to prevent issues
         setSelectedComponent(null)
         setSelectedComponents([])

         toast.info(`Redo: ${actionHistory[newIndex].replace('_', ' ')}`)

         // Reset the flag after a short delay
         setTimeout(() => {
            setIsUndoRedoAction(false)
         }, 100)
      }
   }, [history, historyIndex, actionHistory])

   // Add a component to the canvas
   const handleAddComponent = useCallback(
      (component: any) => {
         const newComponents = [...components, component]
         handleComponentsChange(newComponents, ACTION_TYPES.ADD_COMPONENT)
         return component
      },
      [components, handleComponentsChange]
   )

   const handleComponentUpdate = useCallback(
      (updatedComponent: any) => {
         try {
            // Enhanced validation before update
            if (!updatedComponent) {
               console.warn('Attempted to update an undefined component')
               return
            }

            if (!updatedComponent.id) {
               console.warn('Attempted to update a component without ID', updatedComponent)
               return
            }

            // Check if component exists in our array
            const componentExists = components.some((c) => c.id === updatedComponent.id)
            if (!componentExists) {
               console.warn('Attempted to update a non-existent component:', updatedComponent.id)
               return
            }

            // Create new components array with the updated component
            const newComponents = components.map((c) => (c.id === updatedComponent.id ? { ...updatedComponent } : c))

            handleComponentsChange(newComponents, ACTION_TYPES.UPDATE_COMPONENT)
         } catch (error) {
            console.error('Error updating component:', error)
            toast.error('Failed to update component')
         }
      },
      [components, handleComponentsChange]
   )

   const handleComponentSelect = useCallback(
      (component: any) => {
         try {
            // Use our safe setter function
            safeSetSelectedComponent(component)
         } catch (error) {
            console.error('Error selecting component:', error)
            setSelectedComponent(null)
         }
      },
      [safeSetSelectedComponent]
   )

   const handleDeleteComponent = useCallback(
      (component: any) => {
         try {
            if (selectedComponents.length > 1) {
               // Validate all components exist before deletion
               const validComponentIds = selectedComponents.filter((id) => components.some((c) => c.id === id))

               if (validComponentIds.length !== selectedComponents.length) {
                  console.warn(
                     "Some selected components don't exist",
                     selectedComponents.filter((id) => !validComponentIds.includes(id))
                  )
               }

               const newComponents = components.filter((c) => !validComponentIds.includes(c.id))
               handleComponentsChange(newComponents, ACTION_TYPES.MULTI_DELETE)
               setSelectedComponents([])
               setSelectedComponent(null)
               toast.info('Multiple components deleted')
            } else if (component) {
               // Validate component exists
               if (!components.some((c) => c.id === component.id)) {
                  console.warn('Attempted to delete a non-existent component:', component.id)
                  setSelectedComponent(null)
                  return
               }

               const newComponents = components.filter((c) => c.id !== component.id)
               handleComponentsChange(newComponents, ACTION_TYPES.DELETE_COMPONENT)
               setSelectedComponent(null)
               toast.info('Component deleted')
            }
         } catch (error) {
            console.error('Error deleting component:', error)
            toast.error('Failed to delete component')
            // Reset selections to be safe
            setSelectedComponent(null)
            setSelectedComponents([])
         }
      },
      [components, handleComponentsChange, selectedComponents]
   )

   const toggleCodePreview = useCallback(async () => {
      // Check if user has permission to view code
      if (!hasFeature(subscription, FEATURES.EXPORT_CODE) && !showCodePreview) {
         toast.error('Upgrade to Standard or Pro plan to export code', {
            action: {
               label: 'Upgrade',
               onClick: () => navigate('/pricing'),
            },
         })
         return
      }

      // For free users, check export limits
      if (!showCodePreview && user && subscription?.tier === 'free') {
         try {
            const exportStatus = await canExportCode(subscription, user.uid)
            if (!exportStatus.canExport) {
               toast.error(
                  `You've reached your monthly export limit (${exportStatus.limit} exports). Upgrade for unlimited exports.`,
                  {
                     action: {
                        label: 'Upgrade',
                        onClick: () => navigate('/pricing'),
                     },
                  }
               )
               return
            }

            // Show remaining exports info for free users
            if (exportStatus.remaining <= 1) {
               toast.info(
                  `${exportStatus.remaining} export${exportStatus.remaining === 1 ? '' : 's'} remaining this month`
               )
            }
         } catch (error) {
            console.error('Error checking export limits:', error)
            toast.error('Unable to check export limits. Please try again.')
            return
         }
      }

      setShowCodePreview((prev) => !prev)
      setShowLayers(false)
      setShowWindowProperties(false)
   }, [subscription, showCodePreview, navigate, user])

   const toggleLayers = useCallback(() => {
      setShowLayers((prev) => !prev)
      setShowCodePreview(false)
      setShowWindowProperties(false)
   }, [])

   const toggleWindowProperties = useCallback(() => {
      setShowWindowProperties((prev) => !prev)
      setShowLayers(false)
      setShowCodePreview(false)
   }, [])

   const handleComponentLayerOrderChange = useCallback(
      (fromIndex: number, toIndex: number) => {
         const result = Array.from(components)
         const [removed] = result.splice(fromIndex, 1)
         result.splice(toIndex, 0, removed)

         handleComponentsChange(result, ACTION_TYPES.REORDER_COMPONENTS)
      },
      [components, handleComponentsChange]
   )

   const handleWindowPropertiesChange = useCallback(
      (title: string, size: any, bgColor: string) => {
         setWindowTitle(title)
         setWindowSize(size)
         setWindowBgColor(bgColor)

         // Add this to history as a window settings change
         addToHistory([...components], ACTION_TYPES.WINDOW_SETTINGS)
      },
      [components, addToHistory, windowSize]
   )

   // Create stable setter functions that don't rely on closures
   const handleTitleChange = useCallback(
      (title: string) => {
         setWindowTitle(title)
         addToHistory([...components], ACTION_TYPES.WINDOW_SETTINGS)
      },
      [components, addToHistory]
   )

   const handleSizeChange = useCallback(
      (size: { width: number; height: number }) => {
         setWindowSize(size)
         addToHistory([...components], ACTION_TYPES.WINDOW_SETTINGS)
      },
      [components, addToHistory]
   )

   const handleBgColorChange = useCallback(
      (color: string) => {
         setWindowBgColor(color)
         addToHistory([...components], ACTION_TYPES.WINDOW_SETTINGS)
      },
      [components, addToHistory]
   )

   // Add debug log for subscription
   useEffect(() => {
      // console.log('Index.tsx subscription:', subscription)
   }, [subscription])

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (inputFocused || ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
            return
         }

         if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault()

            if (selectedComponents.length > 1) {
               // Validate all components exist
               const validComponentIds = selectedComponents.filter((id) => components.some((c) => c.id === id))

               const newComponents = components.filter((c) => !validComponentIds.includes(c.id))
               handleComponentsChange(newComponents, ACTION_TYPES.MULTI_DELETE)
               setSelectedComponents([])
               setSelectedComponent(null)
               toast.info('Multiple components deleted')
            } else if (selectedComponent) {
               // Validate component exists
               if (!components.some((c) => c.id === selectedComponent.id)) {
                  console.warn('Attempted to delete a non-existent component', selectedComponent)
                  setSelectedComponent(null)
                  return
               }

               handleDeleteComponent(selectedComponent)
               setSelectedComponent(null)
            }
         }

         if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            if (!e.shiftKey) {
               e.preventDefault()
               handleUndo()
            } else {
               e.preventDefault()
               handleRedo()
            }
         }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
   }, [selectedComponent, selectedComponents, handleDeleteComponent, handleUndo, handleRedo, inputFocused, components])

   // Project Management Hook
   const projectManager = useProjectManager({
      components,
      setComponents,
      windowTitle,
      setWindowTitle,
      windowSize,
      setWindowSize,
      windowBgColor,
      setWindowBgColor,
      addToHistory,
      ACTION_TYPES,
   })

   const handleDismissBanner = () => {
      setShowUpdateBanner(false)
      localStorage.setItem('updateBannerDismissed', 'true')
   }

   return (
      <div className='h-screen flex overflow-hidden bg-slate-50'>
         <SEO {...seoConfig.home} />
         <Sidebar />
         <main className='flex-1 flex flex-col overflow-hidden'>
            {/* --- Easily removable update banner start --- */}
            {showUpdateBanner && (
               <div className='bg-gray-700 border-b border-purple-300 text-purple-300 px-4 py-2 flex items-center justify-between shadow-sm z-20 rounded-xl w-full max-w-4xl mx-auto text-sm absolute top-14 right-0 left-0'>
                  <div className='flex items-center gap-2'>
                     <span className='font-semibold'>New Update:</span>
                     <span>
                        Notification Panel added for latest Announcements, make sure to check it out, There's an
                        Important Update for you... | Its in Toolbar section, Beside Profile image 👉
                     </span>
                  </div>
                  <button
                     className='ml-4 p-1 rounded hover:bg-purple-200 transition-colors'
                     onClick={handleDismissBanner}
                     aria-label='Dismiss update banner'
                  >
                     <X className='h-5 w-5 text-purple-300 hover:text-purple-800' />
                  </button>
               </div>
            )}
            {/* --- Easily removable update banner end --- */}
            <ProjectToolbar
               currentProject={projectManager.currentProject}
               setCurrentProject={projectManager.setCurrentProject}
               hasUnsavedChanges={projectManager.hasUnsavedChanges}
               setHasUnsavedChanges={projectManager.setHasUnsavedChanges}
               hasUnsavedCloudChanges={projectManager.hasUnsavedCloudChanges}
               setHasUnsavedCloudChanges={projectManager.setHasUnsavedCloudChanges}
               autoSaveEnabled={projectManager.autoSaveEnabled}
               setAutoSaveEnabled={projectManager.setAutoSaveEnabled}
               onNewProject={projectManager.handleNewProject}
               onSaveProject={projectManager.handleSaveProject}
               onLoadProject={projectManager.handleLoadProject}
               components={components}
               windowSettings={{
                  title: windowTitle,
                  size: windowSize,
                  bgColor: windowBgColor,
               }}
            />
            <Toolbar
               components={components}
               onUndo={handleUndo}
               onRedo={handleRedo}
               canUndo={historyIndex > 0}
               canRedo={historyIndex < history.length - 1}
               onToggleCodePreview={toggleCodePreview}
               onToggleLayers={toggleLayers}
               onToggleWindowProperties={toggleWindowProperties}
               showCodePreview={showCodePreview}
               showLayers={showLayers}
               showWindowProperties={showWindowProperties}
            />{' '}
            <div className='flex-1 flex overflow-hidden bg-slate-50'>
               {showCodePreview ? (
                  <>
                     <div className='flex-1 min-w-0'>
                        <CodePreview
                           components={components}
                           visible={showCodePreview}
                           windowSettings={{
                              title: windowTitle,
                              size: windowSize,
                              bgColor: windowBgColor,
                              appearanceMode: windowAppearanceMode,
                           }}
                           subscription={subscription}
                           userId={user?.uid}
                        />
                     </div>
                     <div className='w-72 bg-white border-l border-slate-200/50 flex flex-col overflow-hidden shadow-lg'>
                        <PropertyPanel
                           selectedComponent={selectedComponent}
                           onUpdate={handleComponentUpdate}
                           setInputFocused={setInputFocused}
                           inputFocused={inputFocused}
                        />
                     </div>
                  </>
               ) : showLayers ? (
                  <>
                     <div className='flex-1 min-w-0'>
                        <Layers
                           components={components}
                           onComponentsChange={handleComponentsChange}
                           selectedComponent={selectedComponent}
                           setSelectedComponent={handleComponentSelect}
                           onOrderChange={handleComponentLayerOrderChange}
                           visible={showLayers}
                        />
                     </div>
                     <div className='w-72 bg-white border-l border-slate-200/50 flex flex-col overflow-hidden shadow-lg'>
                        <PropertyPanel
                           selectedComponent={selectedComponent}
                           onUpdate={handleComponentUpdate}
                           setInputFocused={setInputFocused}
                           inputFocused={inputFocused}
                        />
                     </div>
                  </>
               ) : showWindowProperties ? (
                  <>
                     <div className='flex-1 min-w-0'>
                        {' '}
                        <WindowProperties
                           visible={showWindowProperties}
                           title={windowTitle}
                           setTitle={handleTitleChange}
                           size={windowSize}
                           setSize={handleSizeChange}
                           bgColor={windowBgColor}
                           setBgColor={handleBgColorChange}
                           appearanceMode={windowAppearanceMode}
                           setAppearanceMode={setWindowAppearanceMode}
                        />
                     </div>
                     <div className='w-72 bg-white border-l border-slate-200/50 flex flex-col overflow-hidden shadow-lg'>
                        <PropertyPanel
                           selectedComponent={selectedComponent}
                           onUpdate={handleComponentUpdate}
                           setInputFocused={setInputFocused}
                           inputFocused={inputFocused}
                        />
                     </div>
                  </>
               ) : (
                  <>
                     <div className='flex-1 overflow-hidden bg-slate-50 p-2'>
                        <div className='h-full w-full'>
                           <div className='bg-white rounded-xl shadow-xl border border-slate-200/50 overflow-hidden w-full h-full'>
                              <WatermarkedCanvas>
                                 <Canvas
                                    components={components}
                                    setComponents={(newComponents) =>
                                       handleComponentsChange(newComponents, ACTION_TYPES.UPDATE_COMPONENT)
                                    }
                                    selectedComponent={selectedComponent}
                                    setSelectedComponent={handleComponentSelect}
                                    onDeleteComponent={handleDeleteComponent}
                                    selectedComponents={selectedComponents}
                                    setSelectedComponents={setSelectedComponents}
                                    windowTitle={windowTitle}
                                    windowSize={windowSize}
                                    windowBgColor={windowBgColor}
                                    setWindowTitle={(title) =>
                                       handleWindowPropertiesChange(title, windowSize, windowBgColor)
                                    }
                                    onAddComponent={handleAddComponent}
                                 />
                              </WatermarkedCanvas>
                           </div>
                        </div>
                     </div>
                     <div className='w-72 bg-white border-l border-slate-200/50 flex flex-col overflow-hidden shadow-lg'>
                        <PropertyPanel
                           selectedComponent={selectedComponent}
                           onUpdate={handleComponentUpdate}
                           setInputFocused={setInputFocused}
                           inputFocused={inputFocused}
                        />
                     </div>
                  </>
               )}
            </div>
         </main>
      </div>
   )
}

export default Index
