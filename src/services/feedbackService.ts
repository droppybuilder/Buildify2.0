import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/integrations/firebase/firebase.config'
import { User } from 'firebase/auth'

export interface FeedbackSubmission {
  id?: string
  title: string
  description: string
  type: 'feedback' | 'feature-request'
  userId: string
  userEmail: string
  submittedAt: any // Firestore timestamp
  status?: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed'
}

export const feedbackService = {
  // Submit feedback or feature request
  async submitFeedback(
    title: string,
    description: string,
    type: 'feedback' | 'feature-request',
    user: User
  ): Promise<string> {
    try {
      const submission: Omit<FeedbackSubmission, 'id'> = {
        title,
        description,
        type,
        userId: user.uid,
        userEmail: user.email || '',
        submittedAt: serverTimestamp(),
        status: 'pending'
      }

      const docRef = await addDoc(collection(db, 'userFeedback'), submission)
      return docRef.id
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw new Error('Failed to submit feedback')
    }
  }
}
