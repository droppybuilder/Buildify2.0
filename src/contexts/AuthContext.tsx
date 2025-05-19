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
   const [user, setUser] = useState<User | null>(null)
   // const [session, setSession] = useState<Session | null>(null);
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
      })
      return () => unsubscribe()
   }, [])

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
      } catch (error) {
         console.error('Google login failed:', (error as Error).message)
      }
   }

   const logout = async (): Promise<void> => {
      await firebaseSignOut(auth)
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
