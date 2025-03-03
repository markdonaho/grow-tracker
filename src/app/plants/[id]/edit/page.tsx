// src/app/plants/[id]/edit/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PlantForm from '@/components/plants/plant-form';
import { useEffect, useState } from 'react';

interface EditPlantPageProps {
  params: {
    id: string;
  };
}

// Define the plant data type
interface PlantData {
  name: string;
  strain: string;
  status: "Growing" | "Harvested" | "Archived";
  growCycleType: "Vegetative" | "Flowering";
  notes?: string;
}

export default function EditPlantPage({ params }: EditPlantPageProps) {
  const { id } = params;
  const router = useRouter();
  const [plant, setPlant] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch plant data from the API
    // For Phase 1, we'll use mock data
    const mockPlant: PlantData = {
      name: "Northern Lights",
      strain: "Northern Lights",
      status: "Growing",
      growCycleType: "Flowering",
      notes: "This plant has been growing very well. Switched to flowering on January 5, 2025."
    };
    
    setPlant(mockPlant);
    setLoading(false);
  }, [id]);

  const handlePlantUpdated = () => {
    // After updating a plant, navigate back to the plant details
    router.push(`/plants/${id}`);
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          {plant && (
            <PlantForm 
              initialData={plant} 
              plantId={id} 
              onSuccess={handlePlantUpdated} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}