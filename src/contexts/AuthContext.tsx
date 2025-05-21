import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
// import { Session, User } from '@supabase/supabase-js'
// import { supabase } from '@/integrations/supabase/client'
// import { useSubscription, Subscription } from '@/hooks/useSubscription'
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider } from '../integrations/firebase/firebase.config'
import { db } from '../integrations/firebase/firebase.config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// interface AuthContextProps {
//    session: Session | null
//    user: User | null
//    subscription: Subscription | null
//    loading: boolean
//    signOut: () => Promise<void>
//    hasPaidPlan: boolean
// }

interface AuthContextProps {
   user: User | null
   loading: boolean
   loginWithGoogle: () => Promise<void>
   logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   // Initialize user from localStorage if available
   const [user, setUser] = useState<User | null>(() => {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
   })
   const [loading, setLoading] = useState<boolean>(true)
   // const { subscription, loading: subscriptionLoading } = useSubscription();

   // useEffect(() => {
   //   const setup = async () => {
   //     setLoading(true);

   //     // Set up auth state listener first
   //     const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
   //       (event, currentSession) => {
   //         setSession(currentSession);
   //         setUser(currentSession?.user ?? null);
   //       }
   //     );

   //     // Then get current session
   //     const { data: { session: currentSession } } = await supabase.auth.getSession();
   //     setSession(currentSession);
   //     setUser(currentSession?.user ?? null);

   //     setLoading(false);

   //     return () => {
   //       authSubscription.unsubscribe();
   //     };
   //   };

   //   setup();
   // }, []);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser)
         setLoading(false)
      })
      return () => unsubscribe()
   }, [])

   // Persist user to localStorage whenever it changes
   useEffect(() => {
      if (user) {
         // Firebase User object is not fully serializable, so store only needed fields
         localStorage.setItem(
            'user',
            JSON.stringify({
               uid: user.uid,
               email: user.email,
               displayName: user.displayName,
               photoURL: user.photoURL,
            })
         )
      } else {
         localStorage.removeItem('user')
      }
   }, [user])

   //  const signOut = async () => {
   //     await supabase.auth.signOut()
   //  }

   //  const hasPaidPlan = subscription?.tier === 'standard' || subscription?.tier === 'pro'

   const loginWithGoogle = async (): Promise<void> => {
      try {
         const result = await signInWithPopup(auth, googleProvider)
         const user = result.user
         // Check if user profile exists in Firestore
         const userDocRef = doc(db, 'users', user.uid)
         const userDocSnap = await getDoc(userDocRef)
         if (!userDocSnap.exists()) {
            // Create user profile with name, email, subscription type, and image url
            await setDoc(userDocRef, {
               id: user.uid,
               email: user.email,
               display_name: user.displayName || '',
               avatar_url: user.photoURL || '',
               subscription_type: 'Free',
            })
         }
         // Persist user to localStorage after login
         localStorage.setItem(
            'user',
            JSON.stringify({
               uid: user.uid,
               email: user.email,
               displayName: user.displayName,
               photoURL: user.photoURL,
            })
         )
         setUser(user)
      } catch (error) {
         console.error('Google login failed:', (error as Error).message)
      }
   }

   const logout = async (): Promise<void> => {
      await firebaseSignOut(auth)
      setUser(null)
      localStorage.removeItem('user')
   }

   //    return (
   //       <AuthContext.Provider
   //          value={{
   //             session,
   //             user,
   //             subscription,
   //             loading: loading || subscriptionLoading,
   //             signOut,
   //             hasPaidPlan,
   //          }}
   //       >
   //          {children}
   //       </AuthContext.Provider>
   //    )
   // }

   return <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextProps => {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}
