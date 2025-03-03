// src/components/plants/plant-actions.tsx
'use client';

import { FC } from 'react';
import { Calendar, Droplets, Scissors, Zap, Sprout } from 'lucide-react';

interface PlantActionsProps {
  plantId: string;
}

interface ActionItem {
  id: string;
  type: string;
  date: string;
  details: string;
}

const PlantActions: FC<PlantActionsProps> = ({ plantId }) => {
  // Mock data - in a real app, this would come from your API
  const mockActions: ActionItem[] = [
    { 
      id: '1', 
      type: 'Watering', 
      date: 'Feb 3, 2025', 
      details: 'Standard watering, soil was quite dry.' 
    },
    { 
      id: '2', 
      type: 'Feeding', 
      date: 'Jan 28, 2025', 
      details: 'Tiger Bloom - 10ml, Big Bloom - 6ml' 
    },
    { 
      id: '3', 
      type: 'Pruning', 
      date: 'Jan 13, 2025', 
      details: 'Trimmed fan leaves and everything above trellis' 
    },
    { 
      id: '4', 
      type: 'Watering', 
      date: 'Jan 10, 2025', 
      details: 'Standard watering' 
    },
    { 
      id: '5', 
      type: 'Training', 
      date: 'Jan 6, 2025', 
      details: 'Trimmed fan leaves. Took 2 clippings for clones.' 
    },
  ];

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

  return (
    <div className="space-y-4">
      {mockActions.map((action) => (
        <div key={action.id} className="flex border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-start mt-1 mr-4">
            <div className="p-2 rounded-full bg-primary/10">
              {getActionIcon(action.type)}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{action.type}</h4>
              <div className="text-sm text-muted-foreground">{action.date}</div>
            </div>
            <p className="mt-1">{action.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantActions;