import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/integrations/firebase/firebase.config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../integrations/firebase/firebase.config'
import { signOut } from 'firebase/auth'
import { X } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import { toast } from 'sonner'
import { SEO, seoConfig } from '@/components/SEO'
import { getSubscriptionStatus, getRemainingDays, isExpiringSoon, isSubscriptionExpired } from '@/utils/subscriptionUtils'

interface Profile {
   id: string
   email: string
   display_name: string | null
   avatar_url: string | null
}

const ProfilePage: React.FC = () => {
   const { user } = useAuth()
   const { subscription } = useSubscription()
   const [profile, setProfile] = useState<Profile | null>(null)
   const [displayName, setDisplayName] = useState('')
   const [loading, setLoading] = useState(true)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const navigate = useNavigate()

   // Mouse tracking for animated cursor
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
   }, [])

   useEffect(() => {
      let isMounted = true

      const fetchProfile = async () => {
         try {
            setLoading(true)

            if (!user) {
               navigate('/auth')
               return
            }

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists() && isMounted) {
               const data = docSnap.data() as Profile
               console.log('Fetched profile data:', data)
               setProfile(data)
               setDisplayName(data.display_name || '')
            } else if (isMounted) {
               console.warn('No profile found for user:', user.uid)
               setProfile(null)
            }
         } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('❌ Failed to load profile. Please try again later.')
         } finally {
            if (isMounted) setLoading(false)
         }
      }

      fetchProfile()

      return () => {
         isMounted = false
      }
   }, [user, navigate])

   const updateProfile = async () => {
      try {
         if (!profile) return

         const docRef = doc(db, 'users', user!.uid)
         await updateDoc(docRef, { display_name: displayName })

         setProfile({ ...profile, display_name: displayName })
         toast.success('✅ Profile updated successfully!')
      } catch (error) {
         console.error('Error updating profile:', error)
         toast.error('❌ Failed to update profile. Please try again.')
      }
   }

   const handleLogout = async () => {
      try {
         await signOut(auth)
         toast.success('👋 Successfully logged out!')
         navigate('/')
      } catch (error) {
         console.error('Error logging out:', error)
         toast.error('❌ Failed to log out. Please try again.')
      }
   }

   const formatDate = (dateString: string | null) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      })
   }

   const getInitials = (name: string) => {
      return name
         .split(' ')
         .map((n) => n[0])
         .join('')
         .toUpperCase()
   }

   const getExpiryText = () => {
      if (!subscription || !subscription.subscriptionExpiry) return null
      if (subscription.subscriptionExpiry === 'lifetime') return 'Never (Lifetime)'
      const date = new Date(subscription.subscriptionExpiry)
      if (isNaN(date.getTime())) return null
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
   }

   if (loading) {
      return (
         <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center'>
            <div className='text-center'>
               <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
               <span className='text-lg'>Loading profile...</span>
            </div>
         </div>
      )
   }

   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
         <SEO {...seoConfig.profile} />
         {/* Animated Cursor Effect */}
         <div
            className='fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 opacity-30 blur-sm transition-all duration-75 ease-out'
            style={{
               left: mousePosition.x - 12,
               top: mousePosition.y - 12,
            }}
         />
         
         {/* Close Icon */}
         <button
            className='absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10'
            onClick={() => navigate('/')}
            aria-label='Close'
         >
            <X className='w-6 h-6 text-white hover:text-pink-400' />
         </button>

         <div className='container mx-auto p-6 relative flex flex-col items-center min-h-screen justify-center'>
            <div className='w-full max-w-2xl flex flex-col gap-8 justify-center items-stretch'>
               {/* Profile Information */}
               <Card className='flex-1 flex flex-col justify-between bg-white/10 backdrop-blur-md border-white/20'>
                  <CardHeader>
                     <CardTitle className='text-white'>Profile Information</CardTitle>
                     <CardDescription className='text-gray-300'>Update your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                     <div className='flex items-center space-x-4'>
                        <Avatar className='h-16 w-16 border border-pink-400'>
                           {profile?.avatar_url ? (
                              <AvatarImage
                                 src={profile.avatar_url}
                                 alt={profile.display_name || profile.email}
                              />
                           ) : (
                              <AvatarFallback className='bg-gradient-to-r from-pink-500 to-violet-500 text-white'>
                                 {profile?.display_name
                                    ? getInitials(profile.display_name)
                                    : profile?.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                           )}
                        </Avatar>
                        <div>
                           <h3 className='text-lg font-medium text-white'>{profile?.display_name || 'No display name set'}</h3>
                           <p className='text-sm text-gray-300'>{profile?.email}</p>
                        </div>
                     </div>
                     <div className='space-y-2'>
                        <Label htmlFor='display-name' className='text-white'>Display Name</Label>
                        <Input
                           id='display-name'
                           value={displayName}
                           onChange={(e) => setDisplayName(e.target.value)}
                           placeholder='Enter your display name'
                           className='bg-white/10 border-white/20 text-white placeholder:text-gray-400'
                        />
                     </div>
                     <div className='flex justify-between'>
                        <Button onClick={updateProfile} className='bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600'>
                           Save Changes
                        </Button>
                        <Button
                           variant='destructive'
                           onClick={handleLogout}
                           className='bg-red-600 hover:bg-red-700'
                        >
                           Sign Out
                        </Button>
                     </div>
                  </CardContent>
               </Card>
               
               {/* Subscription Info */}
               <Card className='flex-1 flex flex-col justify-between bg-white/10 backdrop-blur-md border-white/20'>
                  <CardHeader>
                     <CardTitle className='text-white'>Subscription</CardTitle>
                     <CardDescription className='text-gray-300'>Your current plan and subscription information</CardDescription>
                  </CardHeader>                  <CardContent className='space-y-4 flex flex-col flex-1'>
                     <div>
                        <h3 className='font-medium text-white'>Current Plan</h3>
                        <div className='flex items-center gap-2'>
                           <p className='text-2xl font-bold capitalize bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent'>
                              {subscription ? subscription.tier : 'Free'}
                           </p>
                           {subscription && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 isSubscriptionExpired(subscription) 
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : isExpiringSoon(subscription)
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                              }`}>
                                 {getSubscriptionStatus(subscription)}
                              </span>
                           )}
                        </div>
                     </div>
                     {subscription && subscription.tier !== 'free' && (
                        <div className='space-y-2'>
                           <div>
                              <span className='text-sm text-gray-300'>
                                 Subscription expires: <b className='text-white'>{getExpiryText() || 'Unknown'}</b>
                              </span>
                           </div>
                           {!isSubscriptionExpired(subscription) && getRemainingDays(subscription) !== null && (
                              <div>
                                 <span className={`text-sm ${
                                    isExpiringSoon(subscription) ? 'text-yellow-400' : 'text-gray-300'
                                 }`}>
                                    {getRemainingDays(subscription)} days remaining
                                 </span>
                              </div>
                           )}
                           {isSubscriptionExpired(subscription) && (
                              <div className='p-3 rounded-lg bg-red-500/10 border border-red-500/30'>
                                 <p className='text-red-400 text-sm'>
                                    ⚠️ Your subscription has expired. Upgrade to continue enjoying premium features.
                                 </p>
                              </div>
                           )}
                           {isExpiringSoon(subscription) && !isSubscriptionExpired(subscription) && (
                              <div className='p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30'>
                                 <p className='text-yellow-400 text-sm'>
                                    ⏰ Your subscription expires soon. Consider renewing to avoid interruption.
                                 </p>
                              </div>
                           )}
                        </div>
                     )}
                     <div className='flex-1'></div>
                     <Button
                        className='w-full mt-auto bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600'
                        onClick={() => navigate('/pricing')}
                     >
                        {isSubscriptionExpired(subscription) ? 'Renew Subscription' : 'Upgrade Plan'}
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}

export default ProfilePage
