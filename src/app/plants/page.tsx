// src/app/plants/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlantCard from "@/components/plants/plant-card";
import { usePlants } from "@/hooks/usePlants";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlantsPage() {
  const { plants, isLoading, isError } = usePlants();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Plants</h1>
          <Button asChild>
            <Link href="/plants/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Plant
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-lg border p-6">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold">Error loading plants</h3>
        <p className="text-muted-foreground mt-2">
          There was a problem loading your plants. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plants</h1>
        <Button asChild>
          <Link href="/plants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Link>
        </Button>
      </div>

      {plants.length === 0 ? (
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold">No plants yet</h3>
          <p className="text-muted-foreground mt-2">
            Get started by adding your first plant.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <PlantCard key={plant._id?.toString()} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}