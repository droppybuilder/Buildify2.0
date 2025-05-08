
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription, Subscription } from '@/hooks/useSubscription';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  signOut: () => Promise<void>;
  hasPaidPlan: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { subscription, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      
      // Set up auth state listener first
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      );
      
      // Then get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      setLoading(false);
      
      return () => {
        authSubscription.unsubscribe();
      };
    };
    
    setup();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasPaidPlan = subscription?.tier === 'standard' || subscription?.tier === 'pro';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        subscription,
        loading: loading || subscriptionLoading,
        signOut,
        hasPaidPlan
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
