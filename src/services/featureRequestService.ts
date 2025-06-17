import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/integrations/firebase/firebase.config'
import { User } from 'firebase/auth'

export interface FeatureRequest {
  id?: string
  featureName: string
  featureDescription: string
  userId: string
  userEmail: string
  submittedAt: any // Firestore timestamp
  status?: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed'
}

export const featureRequestService = {
  // Submit a new feature request
  async submitFeatureRequest(
    featureName: string,
    featureDescription: string,
    user: User
  ): Promise<string> {
    try {
      const featureRequest: Omit<FeatureRequest, 'id'> = {
        featureName,
        featureDescription,
        userId: user.uid,
        userEmail: user.email || '',
        submittedAt: serverTimestamp(),
        status: 'pending'
      }

      const docRef = await addDoc(collection(db, 'featureRequests'), featureRequest)
      return docRef.id
    } catch (error) {
      console.error('Error submitting feature request:', error)
      throw new Error('Failed to submit feature request')
    }
  }
}
