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

interface Profile {
   id: string
   email: string
   display_name: string | null
   avatar_url: string | null
}

const ProfilePage: React.FC = () => {
   const { user } = useAuth()
   const [profile, setProfile] = useState<Profile | null>(null)
   const [displayName, setDisplayName] = useState('')
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()

   useEffect(() => {
      let isMounted = true // Prevent state updates if component unmounts

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
               console.log('Fetched profile data:', data) // Debug log
               setProfile(data)
               setDisplayName(data.display_name || '')
            } else if (isMounted) {
               console.warn('No profile found for user:', user.uid)
               setProfile(null) // Ensure profile is set to null if not found
            }
         } catch (error) {
            console.error('Error fetching profile:', error)
            alert('Failed to load profile. Please try again later.')
         } finally {
            if (isMounted) setLoading(false)
         }
      }

      fetchProfile()

      return () => {
         isMounted = false // Cleanup to prevent state updates after unmount
      }
   }, [user, navigate])

   const updateProfile = async () => {
      try {
         if (!profile) return

         const docRef = doc(db, 'users', user!.uid)
         await updateDoc(docRef, { display_name: displayName })

         setProfile({ ...profile, display_name: displayName })
         alert('Profile updated successfully')
      } catch (error) {
         console.error('Error updating profile:', error)
         alert('Failed to update profile')
      }
   }

   const handleLogout = async () => {
      try {
         await signOut(auth) // Logs the user out
         navigate('/auth') // Redirects to the auth page
      } catch (error) {
         console.error('Error logging out:', error)
         alert('Failed to log out. Please try again.')
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

   if (loading) {
      return (
         <div className='container mx-auto p-6'>
            <div className='flex justify-center'>
               <span>Loading profile...</span>
            </div>
         </div>
      )
   }

   return (
      <div className='container mx-auto p-6'>
         <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Profile Information */}
            <Card className='md:col-span-2'>
               <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details and preferences</CardDescription>
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
                           <AvatarFallback>
                              {profile?.display_name
                                 ? getInitials(profile.display_name)
                                 : profile?.email.charAt(0).toUpperCase()}
                           </AvatarFallback>
                        )}
                     </Avatar>
                     <div>
                        <h3 className='text-lg font-medium'>{profile?.display_name || 'No display name set'}</h3>
                        <p className='text-sm text-gray-500'>{profile?.email}</p>
                     </div>
                  </div>

                  <div className='space-y-2'>
                     <Label htmlFor='display-name'>Display Name</Label>
                     <Input
                        id='display-name'
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder='Enter your display name'
                     />
                  </div>

                  <div className='flex justify-between'>
                     <Button onClick={updateProfile}>Save Changes</Button>
                     <Button
                        variant='destructive'
                        onClick={handleLogout}
                     >
                        Sign Out
                     </Button>
                  </div>
               </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card>
               <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Your current plan and subscription information</CardDescription>
               </CardHeader>
               <CardContent className='space-y-4'>
                  <div>
                     <h3 className='font-medium'>Current Plan</h3>
                     <p className='text-2xl font-bold capitalize'>Free</p>
                  </div>

                  <Button
                     className='w-full'
                     onClick={() => navigate('/pricing')}
                  >
                     Upgrade Plan
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}

export default ProfilePage
