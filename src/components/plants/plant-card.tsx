// src/components/plants/plant-card.tsx
import { FC } from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { Plant, Ruler, Calendar, Badge, MoreVertical } from 'lucide-react';
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

interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    strain: string;
    status: string;
    growCycleType: string;
    startDate: string;
    harvestDate?: string;
    currentHeight: number;
    daysToHarvest: number | null;
  };
}

const PlantCard: FC<PlantCardProps> = ({ plant }) => {
  const ageInDays = calculateAgeInDays(plant.startDate);
  const statusColor = getStatusColor(plant.status);
  const cycleColor = getCycleColor(plant.growCycleType);

  function calculateAgeInDays(dateString: string) {
    const startDate = new Date(dateString);
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
                <Link href={`/plants/${plant.id}`} className="flex w-full">View Details</Link>
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
            <Plant className="mr-2 h-4 w-4" />
            <span>Start Date: {new Date(plant.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <Ruler className="mr-2 h-4 w-4" />
            <span>Height: {plant.currentHeight} cm</span>
          </div>
          {plant.daysToHarvest !== null && (
            <div className="flex items-center text-sm">
              <Badge className="mr-2 h-4 w-4" />
              <span>Days to harvest: {plant.daysToHarvest}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/plants/${plant.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;