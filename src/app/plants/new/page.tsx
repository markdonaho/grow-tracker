// src/app/plants/new/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PlantForm from '@/components/plants/plant-form';

export default function NewPlantPage() {
  const router = useRouter();

  const handlePlantCreated = () => {
    // After creating a plant, navigate back to the plants list
    router.push('/plants');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/plants">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Plant</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantForm onSuccess={handlePlantCreated} />
        </CardContent>
      </Card>
    </div>
  );
}