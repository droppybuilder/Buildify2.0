import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Subscription } from '@/hooks/useSubscription';

interface WatermarkedCanvasProps {
  children: ReactNode;
}

function isWatermarkRequired(subscription: Subscription | null): boolean {
  if (!subscription) return true;
  // Only show watermark for free users
  return subscription.tier === 'free';
}

export default function WatermarkedCanvas({ children }: WatermarkedCanvasProps) {
  const { subscription } = useSubscription();
  const showWatermark = isWatermarkRequired(subscription);

  return (
    <div className="relative">
      {children}
      {showWatermark && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="transform rotate-45 text-gray-600 font-bold text-4xl">
              DEMO VERSION
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            Upgrade to remove watermark
          </div>
        </div>
      )}
    </div>
  );
}
