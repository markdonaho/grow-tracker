// src/components/dashboard/stats-card.tsx
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sprout, 
  Package, 
  Calendar, 
  Activity,
  Droplets,
  Sun,
  ThermometerSun
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, description, icon }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'plant':
        return <Sprout className="h-5 w-5" />;
      case 'package':
        return <Package className="h-5 w-5" />;
      case 'calendar':
        return <Calendar className="h-5 w-5" />;
      case 'activity':
        return <Activity className="h-5 w-5" />;
      case 'droplets':
        return <Droplets className="h-5 w-5" />;
      case 'sun':
        return <Sun className="h-5 w-5" />;
      case 'thermometer':
        return <ThermometerSun className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            {renderIcon()}
          </div>
          <div className="text-sm font-medium">{title}</div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;