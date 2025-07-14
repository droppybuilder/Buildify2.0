import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { projectService, ProjectData, SaveProjectData } from '@/services/projectService'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'

export interface UseProjectManagerProps {
   components: any[]
   setComponents: (components: any[]) => void
   windowTitle: string
   setWindowTitle: (title: string) => void
   windowSize: { width: number; height: number }
   setWindowSize: (size: { width: number; height: number }) => void
   windowBgColor: string
   setWindowBgColor: (color: string) => void
   addToHistory: (components: any[], actionType: string) => void
   ACTION_TYPES: Record<string, string>
}

export const useProjectManager = ({
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
}: UseProjectManagerProps) => {
   const { user } = useAuth()
   const { subscription } = useSubscription()

   const [currentProject, setCurrentProject] = useState<ProjectData | null>(null)
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
   const [hasUnsavedCloudChanges, setHasUnsavedCloudChanges] = useState(false)
   const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
   const [lastSaveData, setLastSaveData] = useState<string>('')
   const [lastCloudSaveData, setLastCloudSaveData] = useState<string>('')
   const [isInitialLoad, setIsInitialLoad] = useState(true)
   const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)

   // Generate current state hash for comparison
   const getCurrentStateHash = useCallback(() => {
      const state = {
         components,
         windowSettings: {
            title: windowTitle,
            size: windowSize,
            bgColor: windowBgColor,
         },
      }
      return JSON.stringify(state)
   }, [components, windowTitle, windowSize, windowBgColor])
   // Check for unsaved changes (local and cloud)
   useEffect(() => {
      const currentHash = getCurrentStateHash()

      // Skip change detection during initial load
      if (isInitialLoad) {
         setIsInitialLoad(false)
         setLastSaveData(currentHash)
         setLastCloudSaveData(currentHash)
         return
      }

      // Check for local unsaved changes
      if (lastSaveData && currentHash !== lastSaveData) {
         setHasUnsavedChanges(true)
      }

      // Check for cloud unsaved changes
      if (lastCloudSaveData && currentHash !== lastCloudSaveData) {
         setHasUnsavedCloudChanges(true)
      }
   }, [getCurrentStateHash, lastSaveData, lastCloudSaveData, isInitialLoad])
   // Auto-save functionality (localStorage only)
   useEffect(() => {
      // Clear any existing auto-save timeout
      if (autoSaveIntervalRef.current) {
         clearTimeout(autoSaveIntervalRef.current)
         autoSaveIntervalRef.current = null
      }

      // Only auto-save if enabled, has changes, not during initial load, and has actual content
      if (autoSaveEnabled && hasUnsavedChanges && !isInitialLoad) {
         autoSaveIntervalRef.current = setTimeout(() => {
            try {
               // Save to localStorage only
               localStorage.setItem('guiBuilderComponents', JSON.stringify(components))
               localStorage.setItem('guiBuilderWindowTitle', windowTitle)
               localStorage.setItem('guiBuilderWindowSize', JSON.stringify(windowSize))
               localStorage.setItem('guiBuilderWindowBgColor', windowBgColor)

               // Only clear local unsaved changes flag, not cloud changes
               setHasUnsavedChanges(false)
               setLastSaveData(getCurrentStateHash())
               toast.success('Auto-saved locally', { duration: 2000 })
            } catch (error) {
               console.error('Auto-save to localStorage failed:', error)
               toast.error('Auto-save failed')
            }
         }, 2000) // Auto-save after 2 seconds of inactivity
      }

      return () => {
         if (autoSaveIntervalRef.current) {
            clearTimeout(autoSaveIntervalRef.current)
         }
      }
   }, [
      autoSaveEnabled,
      hasUnsavedChanges,
      components,
      windowTitle,
      windowSize,
      windowBgColor,
      getCurrentStateHash,
      isInitialLoad,
   ])

   const handleNewProject = useCallback(() => {
      setComponents([])
      setWindowTitle('My CustomTkinter Application')
      setWindowSize({ width: 800, height: 600 })
      setWindowBgColor('#e8e8e8')
      setCurrentProject(null)
      setHasUnsavedChanges(false)
      setHasUnsavedCloudChanges(false)
      setLastSaveData('')
      setLastCloudSaveData('')
      addToHistory([], ACTION_TYPES.ADD_COMPONENT)

      // Clear localStorage
      localStorage.removeItem('guiBuilderComponents')
      localStorage.removeItem('guiBuilderWindowTitle')
      localStorage.removeItem('guiBuilderWindowSize')
      localStorage.removeItem('guiBuilderWindowBgColor')

      toast.success('New project created')
   }, [setComponents, setWindowTitle, setWindowSize, setWindowBgColor, addToHistory, ACTION_TYPES])

   const handleSaveProject = useCallback(
      async (projectName: string, projectId?: string) => {
         if (!user) {
            throw new Error('User not authenticated')
         }

         // Cloud project limits by plan
         const planLimits: Record<string, number | null> = {
            free: 3,
            standard: 10,
            pro: 20,
            lifetime: null, // unlimited
         }
         const userTier = subscription?.tier || 'free'
         const limit = planLimits[userTier] ?? 3

         // Only check limit for new projects (not updates)
         if (!projectId && limit !== null) {
            const userProjects = await projectService.getUserProjects(user.uid)
            if (userProjects.length >= limit) {
               toast.error(
                  `Cloud project limit reached for your plan (${limit}). Delete a project or upgrade your plan to save more.`
               )
               throw new Error('Cloud project limit reached')
            }
         }

         const projectData: SaveProjectData = {
            name: projectName,
            components,
            windowSettings: { title: windowTitle, size: windowSize, bgColor: windowBgColor },
         }

         try {
            const savedProjectId = await projectService.saveProject(
               user.uid,
               projectData,
               projectId,
               user.email || undefined
            )

            // Update current project if it's a new save
            if (!projectId) {
               const savedProject: ProjectData = {
                  id: savedProjectId,
                  name: projectName,
                  components,
                  windowSettings: projectData.windowSettings,
                  userId: user.uid,
                  userEmail: user.email || undefined,
                  createdAt: new Date(),
                  updatedAt: new Date(),
               }
               setCurrentProject(savedProject)
            } else {
               // Update existing project
               setCurrentProject((prev) =>
                  prev
                     ? {
                          ...prev,
                          name: projectName,
                          components,
                          windowSettings: projectData.windowSettings,
                          updatedAt: new Date(),
                       }
                     : null
               )
            }

            // Clear both local and cloud unsaved changes since we just saved to cloud
            setHasUnsavedChanges(false)
            setHasUnsavedCloudChanges(false)
            setLastSaveData(getCurrentStateHash())
            setLastCloudSaveData(getCurrentStateHash())
         } catch (error) {
            console.error('Save project error:', error)
            throw error
         }
      },
      [user, components, windowTitle, windowSize, windowBgColor, getCurrentStateHash, subscription]
   )

   const handleLoadProject = useCallback(
      (project: ProjectData) => {
         setComponents(project.components || [])
         setWindowTitle(project.windowSettings?.title || 'My CustomTkinter Application')
         setWindowSize(project.windowSettings?.size || { width: 800, height: 600 })
         setWindowBgColor(project.windowSettings?.bgColor || '#e8e8e8')
         addToHistory(project.components || [], ACTION_TYPES.ADD_COMPONENT)
         setCurrentProject(project)
         setHasUnsavedChanges(false)
         setHasUnsavedCloudChanges(false)
         setLastSaveData(getCurrentStateHash())
         setLastCloudSaveData(getCurrentStateHash())

         // Update localStorage
         localStorage.setItem('guiBuilderComponents', JSON.stringify(project.components || []))
         localStorage.setItem('guiBuilderWindowTitle', project.windowSettings?.title || 'My CustomTkinter Application')
         localStorage.setItem(
            'guiBuilderWindowSize',
            JSON.stringify(project.windowSettings?.size || { width: 800, height: 600 })
         )
         localStorage.setItem('guiBuilderWindowBgColor', project.windowSettings?.bgColor || '#e8e8e8')
      },
      [setComponents, setWindowTitle, setWindowSize, setWindowBgColor, addToHistory, ACTION_TYPES, getCurrentStateHash]
   )
   // Initialize last save data on mount
   useEffect(() => {
      if (!lastSaveData) {
         setLastSaveData(getCurrentStateHash())
      }
      // Initialize cloud save data to current state if no project is loaded
      if (!lastCloudSaveData && !currentProject) {
         setLastCloudSaveData(getCurrentStateHash())
      }
   }, [getCurrentStateHash, lastSaveData, lastCloudSaveData, currentProject])
   return {
      currentProject,
      setCurrentProject,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      hasUnsavedCloudChanges,
      setHasUnsavedCloudChanges,
      autoSaveEnabled,
      setAutoSaveEnabled,
      handleNewProject,
      handleSaveProject,
      handleLoadProject,
   }
}
