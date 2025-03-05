// src/components/dashboard/recent-actions.tsx
"use client";

import { FC } from 'react';
import { Droplets, Scissors, Sprout, Zap } from 'lucide-react';
import { useRecentActions } from '@/hooks/useActions';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const RecentActions: FC = () => {
  const { actions, isLoading, isError } = useRecentActions(5);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Watering':
        return <Droplets className="h-4 w-4" />;
      case 'Pruning':
        return <Scissors className="h-4 w-4" />;
      case 'Feeding':
        return <Sprout className="h-4 w-4" />;
      case 'Training':
        return <Zap className="h-4 w-4" />;
      default:
        return <Droplets className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Unable to load recent actions. Please try again later.
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No recent actions found. Start by logging some actions for your plants.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div key={action._id?.toString()} className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            {getActionIcon(action.actionType)}
          </div>
          <div>
            <div className="font-medium">{action.actionType}</div>
            <p className="text-sm text-muted-foreground">
              {/* Placeholder for plant name - you'd need to fetch this */}
              Plant #{action.plantId.toString().substring(0, 6)} • {format(new Date(action.date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActions;