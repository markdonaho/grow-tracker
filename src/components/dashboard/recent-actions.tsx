// src/components/dashboard/recent-actions.tsx
import { FC } from 'react';
import { Droplets, Scissors, Sprout, Zap } from 'lucide-react';

interface ActionItem {
  id: string;
  type: string;
  plantName: string;
  date: string;
}

const mockActions: ActionItem[] = [
  { id: '1', type: 'Watering', plantName: 'Northern Lights', date: '2 hours ago' },
  { id: '2', type: 'Pruning', plantName: 'White Widow', date: 'Yesterday' },
  { id: '3', type: 'Feeding', plantName: 'Northern Lights', date: '2 days ago' },
  { id: '4', type: 'Training', plantName: 'AK-47', date: '3 days ago' },
  { id: '5', type: 'Watering', plantName: 'White Widow', date: '4 days ago' },
];

const RecentActions: FC = () => {
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

  return (
    <div className="space-y-4">
      {mockActions.map((action) => (
        <div key={action.id} className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            {getActionIcon(action.type)}
          </div>
          <div>
            <div className="font-medium">{action.type}</div>
            <p className="text-sm text-muted-foreground">
              {action.plantName} • {action.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActions;