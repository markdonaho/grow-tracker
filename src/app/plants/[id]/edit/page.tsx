// src/app/plants/[id]/edit/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PlantForm from '@/components/plants/plant-form';
import { usePlant } from '@/hooks/usePlants';
import { Skeleton } from '@/components/ui/skeleton';

interface EditPlantPageProps {
  params: {
    id: string;
  };
}

export default function EditPlantPage({ params }: EditPlantPageProps) {
  const { id } = params;
  const router = useRouter();
  const { plant, isLoading, isError } = usePlant(id);

  const handlePlantUpdated = () => {
    // After updating a plant, navigate back to the plant details
    router.push(`/plants/${id}`);
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/plants/${id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Plant</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !plant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/plants/${id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Plant</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not load plant data. Please try again later.</p>
            <Button className="mt-4" onClick={() => router.push(`/plants/${id}`)}>
              Return to Plant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formData = {
    name: plant.name,
    strain: plant.strain,
    status: plant.status,
    growCycleType: plant.growCycleType,
    notes: plant.notes || '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/plants/${id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Plant</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantForm 
            initialData={formData} 
            plantId={id} 
            onSuccess={handlePlantUpdated} 
          />
        </CardContent>
      </Card>
    </div>
  );
}