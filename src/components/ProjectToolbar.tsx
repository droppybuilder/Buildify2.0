import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { projectService, ProjectData, SaveProjectData } from '@/services/projectService'
import { useAuth } from '@/contexts/AuthContext'
import {
   Save,
   FolderOpen,
   FilePlus,
   Clock,
   Trash2,
   Copy,
   AlertTriangle,
   Cloud,
   HardDrive,
   Settings,
} from 'lucide-react'

interface ProjectToolbarProps {
   currentProject: ProjectData | null
   setCurrentProject: (project: ProjectData | null) => void
   hasUnsavedChanges: boolean
   setHasUnsavedChanges: (value: boolean) => void
   hasUnsavedCloudChanges: boolean
   setHasUnsavedCloudChanges: (value: boolean) => void
   autoSaveEnabled: boolean
   setAutoSaveEnabled: (value: boolean) => void
   onNewProject: () => void
   onSaveProject: (projectName: string, projectId?: string) => Promise<void>
   onLoadProject: (project: ProjectData) => void
   components: any[]
   windowSettings: {
      title: string
      size: { width: number; height: number }
      bgColor: string
   }
}

export const ProjectToolbar: React.FC<ProjectToolbarProps> = ({
   currentProject,
   setCurrentProject,
   hasUnsavedChanges,
   setHasUnsavedChanges,
   hasUnsavedCloudChanges,
   setHasUnsavedCloudChanges,
   autoSaveEnabled,
   setAutoSaveEnabled,
   onNewProject,
   onSaveProject,
   onLoadProject,
   components,
   windowSettings,
}) => {
   const { user } = useAuth()
   const [showSaveDialog, setShowSaveDialog] = useState(false)
   const [showLoadDialog, setShowLoadDialog] = useState(false)
   const [showConfirmDialog, setShowConfirmDialog] = useState(false)
   const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
   const [projectName, setProjectName] = useState('')
   const [userProjects, setUserProjects] = useState<ProjectData[]>([])
   const [loading, setLoading] = useState(false)
   const handleNewProject = () => {
      if (hasUnsavedCloudChanges) {
         setConfirmAction(() => () => {
            onNewProject()
            setShowConfirmDialog(false)
         })
         setShowConfirmDialog(true)
      } else {
         onNewProject()
      }
   }
   const handleSaveProject = async () => {
      if (currentProject) {
         // Save existing project to cloud
         try {
            await onSaveProject(currentProject.name, currentProject.id)
            toast.success('Project saved to cloud!')
         } catch (error) {
            toast.error('Failed to save to cloud')
         }
      } else {
         // Save as new project to cloud
         setProjectName('')
         setShowSaveDialog(true)
      }
   }

   const handleSaveAsNew = async () => {
      if (!projectName.trim()) {
         toast.error('Please enter a project name')
         return
      }

      try {
         setLoading(true)
         await onSaveProject(projectName.trim())
         setShowSaveDialog(false)
         setProjectName('')
         toast.success('Project saved to cloud!')
      } catch (error) {
         toast.error('Failed to save to cloud')
      } finally {
         setLoading(false)
      }
   }
   const handleLoadProjects = async () => {
      if (!user) {
         toast.error('Please log in to load projects')
         return
      }

      if (hasUnsavedCloudChanges) {
         setConfirmAction(() => async () => {
            await loadUserProjects()
            setShowLoadDialog(true)
            setShowConfirmDialog(false)
         })
         setShowConfirmDialog(true)
      } else {
         await loadUserProjects()
         setShowLoadDialog(true)
      }
   }

   const loadUserProjects = async () => {
      try {
         setLoading(true)
         const projects = await projectService.getUserProjects(user!.uid)
         setUserProjects(projects)
      } catch (error) {
         toast.error('Failed to load projects')
      } finally {
         setLoading(false)
      }
   }
   const handleLoadProject = (project: ProjectData) => {
      onLoadProject(project)
      setCurrentProject(project)
      setHasUnsavedChanges(false)
      setHasUnsavedCloudChanges(false)
      setShowLoadDialog(false)
      toast.success(`Loaded project: ${project.name}`)
   }

   const handleDeleteProject = async (projectId: string, projectName: string) => {
      if (confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
         try {
            await projectService.deleteProject(projectId)
            setUserProjects((prev) => prev.filter((p) => p.id !== projectId))

            if (currentProject?.id === projectId) {
               setCurrentProject(null)
            }

            toast.success('Project deleted successfully')
         } catch (error) {
            toast.error('Failed to delete project')
         }
      }
   }
   const handleDuplicateProject = async (project: ProjectData) => {
      try {
         const newName = `${project.name} (Copy)`
         await projectService.duplicateProject(project.id, newName, user!.uid)
         await loadUserProjects()
         toast.success('Project duplicated successfully')
      } catch (error) {
         toast.error('Failed to duplicate project')
      }
   }

   const formatDate = (timestamp: any) => {
      if (!timestamp) return 'Unknown'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
   }
   return (
      <>
         <div className='flex items-center justify-between gap-6 p-4 bg-white border-b border-slate-200/50 shadow-sm'>
            {/* Left Side - Local Storage & New Project */}
            <div className='flex items-center gap-3'>
               {/* New Project */}
               <Button
                  size='sm'
                  onClick={handleNewProject}
                  className='flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 px-4 py-2.5 rounded-xl shadow-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105'
                  title='Create a new project (clears current work)'
               >
                  <FilePlus className='w-4 h-4' />
                  New Project
               </Button>

               {/* Divider */}
               <div className='w-px h-8 bg-gray-300' />

               {/* Local Storage Section */}
               <div className='flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm'>
                  <div className='flex items-center gap-2'>
                     <HardDrive className='w-4 h-4 text-gray-600' />
                     <span className='text-sm font-medium text-gray-700'>Local:</span>
                  </div>
                  <div className='flex items-center gap-2'>
                     <Switch
                        id='auto-save'
                        checked={autoSaveEnabled}
                        onCheckedChange={setAutoSaveEnabled}
                     />
                     <Label
                        htmlFor='auto-save'
                        className='text-sm text-gray-600 cursor-pointer'
                        title='Automatically saves your work to browser storage every 5 seconds'
                     >
                        Auto-save
                     </Label>
                  </div>

                  {/* Local Storage Status */}
                  <div className='flex items-center'>
                     {hasUnsavedChanges ? (
                        <Badge
                           variant='outline'
                           className='text-amber-700 border-amber-300 bg-amber-50 text-xs flex items-center gap-1 rounded-lg'
                        >
                           <Clock className='w-3 h-3' />
                           Unsaved
                        </Badge>
                     ) : (
                        <Badge
                           variant='outline'
                           className='text-green-700 border-green-300 bg-green-50 text-xs flex items-center gap-1 rounded-lg'
                        >
                           <div className='w-2 h-2 bg-green-500 rounded-full' />
                           Saved
                        </Badge>
                     )}
                  </div>
               </div>
            </div>

            {/* Right Side - Cloud Storage */}
            <div className='flex items-center gap-3'>
               {/* Cloud Status */}
               <div className='flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm'>
                  <div className='flex items-center gap-2'>
                     <Cloud className='w-4 h-4 text-blue-600' />
                     <span className='text-sm font-medium text-gray-700'>Cloud:</span>
                  </div>
                  <div className='flex items-center gap-3'>
                     {currentProject ? (
                        <div className='flex items-center gap-2'>
                           <span className='text-sm font-medium text-gray-900'>{currentProject.name}</span>
                           {hasUnsavedCloudChanges && (
                              <Badge
                                 variant='outline'
                                 className='text-blue-700 border-blue-300 bg-blue-50 text-xs'
                              >
                                 Changes pending
                              </Badge>
                           )}
                        </div>
                     ) : (
                        <span className='text-sm text-gray-500 italic'>No project loaded</span>
                     )}
                  </div>
               </div>
               {/* Divider */}
               <div className='w-px h-8 bg-gray-300' /> {/* Cloud Actions */}
               <div className='flex items-center gap-2'>                  <Button
                     size='sm'
                     variant='outline'
                     onClick={handleSaveProject}
                     className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:text-white border-0 px-4 py-2.5 rounded-xl shadow-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105'
                     disabled={!user}
                     title={!user ? 'Please log in to save to cloud' : 'Save your project to cloud storage'}
                  >
                     <Save className='w-4 h-4' />
                     Save to Cloud
                  </Button>                  <Button
                     size='sm'
                     variant='outline'
                     onClick={handleLoadProjects}
                     className='flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 px-4 py-2.5 rounded-xl shadow-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105'
                     disabled={!user}
                     title={!user ? 'Please log in to load from cloud' : 'Load projects from cloud storage'}
                  >
                     <FolderOpen className='w-4 h-4' />
                     Load from Cloud
                  </Button>
               </div>
            </div>
         </div>{' '}
         {/* Save Dialog */}
         <Dialog
            open={showSaveDialog}
            onOpenChange={setShowSaveDialog}
         >
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-lg'>
                     <Cloud className='w-5 h-5 text-blue-600' />
                     Save Project to Cloud
                  </DialogTitle>
               </DialogHeader>
               <div className='space-y-4'>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                     <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                           <Cloud className='w-4 h-4 text-blue-600' />
                        </div>
                        <div className='text-sm text-blue-800'>
                           <p className='font-medium mb-1'>Cloud Storage Benefits</p>
                           <p>
                              Your project will be saved securely to the cloud, making it accessible from any device.
                              Your local work is already auto-saved in your browser.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className='space-y-2'>
                     <Label
                        htmlFor='project-name'
                        className='text-sm font-medium'
                     >
                        Project Name
                     </Label>
                     <Input
                        id='project-name'
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder='Enter a descriptive name for your project...'
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveAsNew()}
                        className='w-full'
                     />
                  </div>
               </div>
               <DialogFooter className='gap-2'>
                  <Button
                     variant='outline'
                     onClick={() => setShowSaveDialog(false)}
                     className='px-4'
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleSaveAsNew}
                     disabled={loading || !projectName.trim()}
                     className='bg-blue-600 hover:bg-blue-700 px-4'
                  >
                     {loading ? (
                        <>
                           <Clock className='w-4 h-4 mr-2 animate-spin' />
                           Saving...
                        </>
                     ) : (
                        <>
                           <Save className='w-4 h-4 mr-2' />
                           Save to Cloud
                        </>
                     )}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>{' '}
         {/* Load Projects Dialog */}
         <Dialog
            open={showLoadDialog}
            onOpenChange={setShowLoadDialog}
         >
            <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
               <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-lg'>
                     <FolderOpen className='w-5 h-5 text-blue-600' />
                     Load Project from Cloud
                  </DialogTitle>
               </DialogHeader>
               <div className='space-y-4'>
                  {loading ? (
                     <div className='text-center py-12'>
                        <div className='flex flex-col items-center gap-3'>
                           <Cloud className='w-8 h-8 text-blue-600 animate-pulse' />
                           <p className='text-gray-600'>Loading your cloud projects...</p>
                        </div>
                     </div>
                  ) : userProjects.length === 0 ? (
                     <div className='text-center py-12'>
                        <div className='flex flex-col items-center gap-4'>
                           <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                              <Cloud className='w-8 h-8 text-gray-400' />
                           </div>
                           <div className='space-y-2'>
                              <h3 className='font-medium text-gray-900'>No cloud projects found</h3>
                              <p className='text-sm text-gray-500'>Save your first project to cloud to see it here!</p>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className='space-y-1'>
                        <p className='text-sm text-gray-600 mb-4'>
                           Found {userProjects.length} project{userProjects.length !== 1 ? 's' : ''} in your cloud
                           storage
                        </p>
                        <div className='space-y-3'>
                           {userProjects.map((project) => (
                              <div
                                 key={project.id}
                                 className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200'
                              >
                                 <div className='flex items-center justify-between'>
                                    <div className='flex-1 min-w-0'>
                                       <h3 className='font-semibold text-gray-900 truncate'>{project.name}</h3>
                                       <div className='text-sm text-gray-500 space-y-1 mt-2'>
                                          <div className='flex items-center gap-4'>
                                             <div className='flex items-center gap-1'>
                                                <Settings className='w-3 h-3' />
                                                <span>{project.components?.length || 0} components</span>
                                             </div>
                                             <div className='flex items-center gap-1'>
                                                <span>📐</span>
                                                <span>
                                                   {project.windowSettings?.size?.width || 800}×
                                                   {project.windowSettings?.size?.height || 600}
                                                </span>
                                             </div>
                                          </div>
                                          <div className='flex items-center gap-1 text-xs'>
                                             <Clock className='w-3 h-3' />
                                             <span>Last updated: {formatDate(project.updatedAt)}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className='flex items-center gap-2 ml-4'>
                                       <Button
                                          size='sm'
                                          variant='ghost'
                                          onClick={() => handleDuplicateProject(project)}
                                          className='h-8 w-8 p-0'
                                          title='Duplicate project'
                                       >
                                          <Copy className='w-4 h-4' />
                                       </Button>
                                       <Button
                                          size='sm'
                                          variant='ghost'
                                          onClick={() => handleDeleteProject(project.id, project.name)}
                                          className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                                          title='Delete project'
                                       >
                                          <Trash2 className='w-4 h-4' />
                                       </Button>
                                       <Button
                                          size='sm'
                                          onClick={() => handleLoadProject(project)}
                                          className='bg-blue-600 hover:bg-blue-700 text-white px-4'
                                       >
                                          Load Project
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
               <DialogFooter>
                  <Button
                     variant='outline'
                     onClick={() => setShowLoadDialog(false)}
                     className='px-4'
                  >
                     Close
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>{' '}
         {/* Confirmation Dialog */}
         <Dialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
         >
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-lg'>
                     <AlertTriangle className='w-5 h-5 text-amber-600' />
                     Unsaved Changes
                  </DialogTitle>
               </DialogHeader>
               <div className='space-y-4'>
                  <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                     <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center'>
                           <AlertTriangle className='w-4 h-4 text-amber-600' />
                        </div>
                        <div className='text-sm text-amber-800'>
                           <p className='font-medium mb-2'>You have unsaved changes</p>
                           <div className='space-y-1'>
                              <p>• Your work is auto-saved locally in your browser</p>
                              <p>• Changes have not been saved to cloud storage</p>
                              <p>• Continuing will keep your local work but you'll lose the current state</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                     <p className='text-sm text-blue-800'>
                        💡 <strong>Tip:</strong> Save to cloud first to access your work from anywhere
                     </p>
                  </div>
               </div>
               <DialogFooter className='gap-2'>
                  <Button
                     variant='outline'
                     onClick={() => setShowConfirmDialog(false)}
                     className='px-4'
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={confirmAction}
                     variant='destructive'
                     className='px-4'
                  >
                     Continue Anyway
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   )
}
