
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WatermarkedCanvasProps {
  children: ReactNode;
}

export default function WatermarkedCanvas({ children }: WatermarkedCanvasProps) {
  const { subscription } = useAuth();
  const isFreeUser = !subscription || subscription.tier === 'free';

  return (
    <div className="relative">
      {children}
      
      {isFreeUser && (
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
