import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'
import { toast } from 'sonner'

const PaymentSuccess = () => {
   const navigate = useNavigate()
   const { refetch } = useSubscription()

   useEffect(() => {
      // Refetch subscription after payment
      refetch()
      toast.success('Payment successful! Your subscription has been updated.')
      // Optionally redirect after a delay
      const timer = setTimeout(() => navigate('/profile'), 2500)
      return () => clearTimeout(timer)
   }, [refetch, navigate])

   return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
         <h2 className='text-2xl font-bold mb-4'>Payment Successful!</h2>
         <p className='text-lg text-muted-foreground'>
            Thank you for your purchase. Your subscription will update shortly.
         </p>
      </div>
   )
}

export default PaymentSuccess
