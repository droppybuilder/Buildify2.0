// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
// import { toast } from 'sonner';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

// export default function AuthPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is already logged in
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         navigate('/');
//       }
//     });

//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         if (session) {
//           navigate('/');
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, [navigate]);

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: `${window.location.origin}/auth`
//       }
//     });

//     setLoading(false);

//     if (error) {
//       console.error('Signup error:', error);
//       toast.error(`Signup error: ${error.message}`);
//     } else {
//       toast.success('Sign up successful! Please check your email for verification.');
//     }
//   };

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) {
//       console.error('Login error:', error);
//       toast.error(`Login error: ${error.message}`);
//     } else {
//       toast.success('Login successful!');
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-primary mb-2">Buildfy</h1>
//           <p className="text-muted-foreground">Build your next project with ease</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//           <Tabs defaultValue="login" className="w-full">
//             <div className="px-6 pt-6">
//               <TabsList className="grid w-full grid-cols-2 mb-4">
//                 <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
//                 <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
//               </TabsList>
//             </div>

//             <TabsContent value="login" className="p-6 pt-2">
//               <form onSubmit={handleSignIn} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email-login">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email-login"
//                       type="email"
//                       placeholder="your.email@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <Label htmlFor="password-login">Password</Label>
//                   </div>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password-login"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="pl-10 pr-10"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? 'Logging in...' : 'Login'}
//                 </Button>
//               </form>
//             </TabsContent>

//             <TabsContent value="signup" className="p-6 pt-2">
//               <form onSubmit={handleSignUp} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email-signup">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email-signup"
//                       type="email"
//                       placeholder="your.email@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-10"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password-signup">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password-signup"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Create a strong password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="pl-10 pr-10"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? 'Creating account...' : 'Create account'}
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </div>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-muted-foreground">
//             By continuing, you agree to our Terms of Service and Privacy Policy.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AuthPage: React.FC = () => {
   const { loginWithGoogle, user } = useAuth()
   const navigate = useNavigate()

   // Redirect if the user is already logged in
   useEffect(() => {
      if (user) {
         navigate('/') // Redirect to the home page or any other page
      }
   }, [user, navigate])

   const handleGoogleLogin = async (): Promise<void> => {
      try {
         await loginWithGoogle()
         toast.success('Login successful!')
         navigate('/') // Redirect to the home page after successful login
      } catch (error) {
         console.error('Login failed:', (error as Error).message)
         toast.error(`Login error: ${error.message}`)
      }
   }

   return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4'>
         <div className='w-full max-w-md'>
            <div className='mb-8 text-center'>
               <h1 className='text-4xl font-bold text-primary mb-2'>Buildfy</h1>
               <p className='text-muted-foreground'>Build your next project with ease</p>
            </div>

            <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
               <div className='p-6'>
                  <button
                     onClick={handleGoogleLogin}
                     className='w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-4'
                  >
                     <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 48 48'
                     >
                        <path
                           fill='#FFC107'
                           d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
                        />
                        <path
                           fill='#FF3D00'
                           d='m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z'
                        />
                        <path
                           fill='#4CAF50'
                           d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
                        />
                        <path
                           fill='#1976D2'
                           d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z'
                        />
                     </svg>
                     Login with Google
                  </button>
               </div>
            </div>

            <div className='mt-6 text-center'>
               <p className='text-sm text-muted-foreground'>
                  By continuing, you agree to our Terms of Service and Privacy Policy.
               </p>
            </div>
         </div>
      </div>
   )
}

export default AuthPage
