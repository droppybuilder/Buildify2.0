
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  features: PlanFeature[];
  tier: 'free' | 'standard' | 'pro';
  productId?: string;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features for hobbyists',
    price: '$0',
    billingPeriod: 'forever',
    tier: 'free',
    features: [
      { name: 'Basic widgets', included: true },
      { name: 'Limited canvas size', included: true },
      { name: 'Watermarked exports', included: true },
      { name: 'Community support', included: true },
      { name: 'Export code', included: false },
      { name: 'Advanced widgets', included: false },
      { name: 'No watermarks', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'For serious developers',
    price: '$8',
    billingPeriod: 'monthly',
    tier: 'standard',
    productId: '7CX2FTDAsPXnb5Z-9bRKRA==',
    features: [
      { name: 'Basic widgets', included: true },
      { name: 'Unlimited canvas size', included: true },
      { name: 'Export code without watermark', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced widgets', included: true },
      { name: 'Email support', included: true },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professional developers',
    price: '$95',
    billingPeriod: 'yearly',
    tier: 'pro',
    productId: '7CX2FTDAsPXnb5Z-9bRKRA==',
    features: [
      { name: 'Basic widgets', included: true },
      { name: 'Unlimited canvas size', included: true },
      { name: 'Export code without watermark', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced widgets', included: true },
      { name: 'Email support', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom integrations', included: true },
    ],
  },
];

export default function PricingPlans() {
  const [processing, setProcessing] = useState<string | null>(null);
  const { subscription, loading, refetch } = useSubscription();
  const navigate = useNavigate();
  
  const handleUpgrade = async (plan: PricingPlan) => {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please login to upgrade your plan');
      navigate('/auth');
      return;
    }
    
    setProcessing(plan.id);
    
    // This is a simplified version just for demo
    // In a real app, you would redirect to Gumroad checkout
    try {
      if (plan.tier === 'free') {
        // For downgrading to free plan
        await supabase.functions.invoke('verify-gumroad-purchase', {
          body: {
            productId: null,
            purchaseId: null,
            userId: session.user.id,
            tier: 'free'
          }
        });
        
        toast.success('Downgraded to Free plan successfully');
        refetch();
      } else {
        // Mock a purchase ID for demo purposes
        const mockPurchaseId = `purchase_${Math.random().toString(36).substring(2, 10)}`;
        
        await supabase.functions.invoke('verify-gumroad-purchase', {
          body: {
            productId: plan.productId,
            purchaseId: mockPurchaseId,
            userId: session.user.id,
            tier: plan.tier
          }
        });
        
        toast.success(`Upgraded to ${plan.name} plan successfully`);
        refetch();
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription) return 'free';
    return subscription.tier;
  };

  const isCurrentPlan = (planTier: string) => {
    return getCurrentPlan() === planTier;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${isCurrentPlan(plan.tier) ? 'border-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{plan.name}</CardTitle>
                {isCurrentPlan(plan.tier) && (
                  <Badge variant="secondary">Current Plan</Badge>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.billingPeriod}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={isCurrentPlan(plan.tier) ? "secondary" : "default"}
                onClick={() => handleUpgrade(plan)}
                disabled={processing !== null || (isCurrentPlan(plan.tier) && plan.tier !== 'free')}
              >
                {processing === plan.id
                  ? 'Processing...'
                  : isCurrentPlan(plan.tier)
                  ? 'Current Plan'
                  : `Upgrade to ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
