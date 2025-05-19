// import { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: ReactNode;
//   requiredSubscription?: 'free' | 'standard' | 'pro';
// }

// export default function ProtectedRoute({
//   children,
//   requiredSubscription
// }: ProtectedRouteProps) {
//   const { user, loading, subscription } = useAuth();

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/auth" />;
//   }

//   // If no subscription tier is required, or the user is on free plan and no specific tier is needed
//   if (!requiredSubscription) {
//     return <>{children}</>;
//   }

//   // If we get here, we're checking for specific subscription tier
//   const userTier = subscription?.tier || 'free';

//   // Handle standard tier requirement
//   if (requiredSubscription === 'standard' &&
//       (userTier === 'standard' || userTier === 'pro')) {
//     return <>{children}</>;
//   }

//   // Handle pro tier requirement
//   if (requiredSubscription === 'pro' && userTier === 'pro') {
//     return <>{children}</>;
//   }

//   // If tier check fails, redirect to pricing
//   if (requiredSubscription &&
//       (requiredSubscription === 'standard' || requiredSubscription === 'pro')) {
//     return <Navigate to="/pricing" />;
//   }

//   return <>{children}</>;
// }

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
   children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
   const { user } = useAuth()

   if (!user) {
      return <Navigate to='/auth' />
   }

   return <>{children}</>
}

export default ProtectedRoute
