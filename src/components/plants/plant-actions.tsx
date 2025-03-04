// src/components/plants/plant-actions.tsx
'use client';

import { FC } from 'react';
import { Calendar, Droplets, Scissors, Zap, Sprout } from 'lucide-react';
import { format } from 'date-fns';
import { usePlantActions } from '@/hooks/useActions';
import { Skeleton } from '@/components/ui/skeleton';

interface PlantActionsProps {
  plantId: string;
}

const PlantActions: FC<PlantActionsProps> = ({ plantId }) => {
  const { actions, isLoading, isError } = usePlantActions(plantId);
  
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Watering':
        return <Droplets className="h-5 w-5" />;
      case 'Pruning':
        return <Scissors className="h-5 w-5" />;
      case 'Feeding':
        return <Sprout className="h-5 w-5" />;
      case 'Training':
        return <Zap className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-start mt-1 mr-4">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <div className="w-full">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Error loading actions. Please try again.</p>
      </div>
    );
  }
  
  if (actions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No actions recorded yet. Log your first action to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div key={action._id?.toString()} className="flex border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-start mt-1 mr-4">
            <div className="p-2 rounded-full bg-primary/10">
              {getActionIcon(action.actionType)}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{action.actionType}</h4>
              <div className="text-sm text-muted-foreground">
                {format(new Date(action.date), 'MMM d, yyyy')}
              </div>
            </div>
            <p className="mt-1">{action.notes || 'No details provided'}</p>
            {action.details && action.details.nutrients && (
              <div className="mt-2">
                <p className="text-sm font-medium">Nutrients:</p>
                <ul className="text-sm">
                  {action.details.nutrients.map((nutrient, index) => (
                    <li key={index}>
                      {nutrient.name}: {nutrient.quantity}{nutrient.unit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantActions;