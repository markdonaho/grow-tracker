// src/components/plants/plant-card.tsx
import { FC } from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { Sprout, Ruler, Calendar, Badge, MoreVertical } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plant } from '@/types/plant';

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: FC<PlantCardProps> = ({ plant }) => {
  const ageInDays = calculateAgeInDays(plant.startDate);
  const statusColor = getStatusColor(plant.status);
  const cycleColor = getCycleColor(plant.growCycleType);
  
  // Get the latest height from growth metrics
  const currentHeight = plant.growthMetrics && plant.growthMetrics.length > 0 
    ? plant.growthMetrics[plant.growthMetrics.length - 1].height 
    : 0;

  function calculateAgeInDays(dateValue: Date | string) {
    const startDate = new Date(dateValue);
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'Growing':
        return 'bg-green-500';
      case 'Harvested':
        return 'bg-amber-500';
      case 'Archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  function getCycleColor(cycle: string) {
    switch (cycle) {
      case 'Vegetative':
        return 'bg-emerald-500';
      case 'Flowering':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  }

  // Calculate estimated harvest date (if flowering)
  const daysToHarvest = plant.growCycleType === 'Flowering' ? 
    Math.max(0, 63 - (plant.harvestDate ? 0 : ageInDays)) : 
    null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{plant.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/plants/${plant._id}`} className="flex w-full">View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Log Action</DropdownMenuItem>
              <DropdownMenuItem>Edit Plant</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete Plant</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Strain: {plant.strain}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs text-white ${statusColor}`}>
            {plant.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs text-white ${cycleColor}`}>
            {plant.growCycleType}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Age: {ageInDays} days</span>
          </div>
          <div className="flex items-center text-sm">
            <Sprout className="mr-2 h-4 w-4" />
            <span>Start Date: {new Date(plant.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <Ruler className="mr-2 h-4 w-4" />
            <span>Height: {currentHeight} cm</span>
          </div>
          {daysToHarvest !== null && (
            <div className="flex items-center text-sm">
              <Badge className="mr-2 h-4 w-4" />
              <span>Days to harvest: {daysToHarvest}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/plants/${plant._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;