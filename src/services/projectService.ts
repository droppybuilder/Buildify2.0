import { db } from '@/integrations/firebase/firebase.config'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'

export interface ProjectData {
  id: string
  name: string
  components: any[]
  windowSettings: {
    title: string
    size: { width: number; height: number }
    bgColor: string
  }
  createdAt: any
  updatedAt: any
  userId: string
  userEmail?: string
}

export interface SaveProjectData {
  name: string
  components: any[]
  windowSettings: {
    title: string
    size: { width: number; height: number }
    bgColor: string
  }
}

class ProjectService {
  private static instance: ProjectService
  
  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService()
    }
    return ProjectService.instance
  }
  async saveProject(userId: string, projectData: SaveProjectData, projectId?: string, userEmail?: string): Promise<string> {
    try {
      const id = projectId || doc(collection(db, 'projects')).id
      const docRef = doc(db, 'projects', id)
      
      const dataToSave = {
        ...projectData,
        userId,
        ...(userEmail && { userEmail }),
        updatedAt: serverTimestamp(),
        ...(projectId ? {} : { createdAt: serverTimestamp() })
      }
      
      await setDoc(docRef, dataToSave, { merge: true })
      return id
    } catch (error) {
      console.error('Error saving project:', error)
      throw new Error('Failed to save project')
    }
  }
  async loadProject(projectId: string, userId: string): Promise<ProjectData | null> {
    try {
      const docRef = doc(db, 'projects', projectId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const projectData = {
          id: docSnap.id,
          ...docSnap.data()
        } as ProjectData
        
        // Security check: Only allow users to load their own projects
        if (projectData.userId !== userId) {
          throw new Error('Unauthorized: You can only access your own projects')
        }
        
        return projectData
      }
      return null
    } catch (error) {
      console.error('Error loading project:', error)
      throw new Error('Failed to load project')
    }
  }
  async getUserProjects(userId: string): Promise<ProjectData[]> {
    try {
      // First try with orderBy, if it fails, fall back to simple query
      let querySnapshot
      try {
        const q = query(
          collection(db, 'projects'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        )
        querySnapshot = await getDocs(q)
      } catch (indexError) {
        console.warn('Composite index not available, using simple query:', indexError)
        // Fallback to simple query without orderBy
        const q = query(
          collection(db, 'projects'),
          where('userId', '==', userId)
        )
        querySnapshot = await getDocs(q)
      }
      
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectData[]
      
      // Sort manually if we used the fallback query
      return projects.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || new Date(a.updatedAt || 0)
        const bTime = b.updatedAt?.toDate?.() || new Date(b.updatedAt || 0)
        return bTime.getTime() - aTime.getTime()
      })
    } catch (error) {
      console.error('Error fetching user projects:', error)
      throw new Error('Failed to fetch projects')
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      throw new Error('Failed to delete project')
    }
  }  async duplicateProject(projectId: string, newName: string, userId: string, userEmail?: string): Promise<string> {
    try {
      const project = await this.loadProject(projectId, userId)
      if (!project) {
        throw new Error('Project not found')
      }

      const duplicatedData: SaveProjectData = {
        name: newName,
        components: project.components,
        windowSettings: project.windowSettings
      }

      return await this.saveProject(project.userId, duplicatedData, undefined, userEmail)
    } catch (error) {
      console.error('Error duplicating project:', error)
      throw new Error('Failed to duplicate project')
    }
  }
}

export const projectService = ProjectService.getInstance()
