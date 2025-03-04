// src/app/plants/[id]/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Edit, Plus, Upload } from "lucide-react";
import PlantMetrics from "@/components/plants/plant-metrics";
import PlantActions from "@/components/plants/plant-actions";
import PlantImages from "@/components/plants/plant-images";
import { usePlant } from "@/hooks/usePlants";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useImage } from "@/hooks/useImages";
import { calculateAgeInDays } from "@/lib/utils";

interface PlantDetailPageProps {
  params: {
    id: string;
  };
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const { plant, isLoading, isError } = usePlant(id);
  const coverImageId = plant?.coverImageId;
  const { image: coverImage } = useImage(coverImageId || "");
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/plants">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (isError || !plant) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold">Error loading plant</h3>
        <p className="text-muted-foreground mt-2">
          There was a problem loading the plant details. Please try again later.
        </p>
        <Button className="mt-4" onClick={() => router.push('/plants')}>
          Return to Plants
        </Button>
      </div>
    );
  }

  const ageInDays = calculateAgeInDays(plant.startDate);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/plants">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{plant.name}</h1>
          <div className="px-2 py-1 rounded-full text-xs text-white bg-green-500">
            {plant.status}
          </div>
          <div className="px-2 py-1 rounded-full text-xs text-white bg-purple-500">
            {plant.growCycleType}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/plants/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/plants/${id}/actions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Log Action
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Plant Information</CardTitle>
                  <CardDescription>Basic details about this plant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Strain</p>
                    <p>{plant.strain}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p>{plant.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Cycle</p>
                    <p>{plant.growCycleType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p>{format(new Date(plant.startDate), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Age</p>
                    <p>{ageInDays} days</p>
                  </div>
                  {plant.harvestDate && (
                    <div>
                      <p className="text-sm font-medium">Harvest Date</p>
                      <p>{format(new Date(plant.harvestDate), 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Growth progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <PlantMetrics plantId={id} />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {plant.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{plant.notes}</p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
              <CardDescription>Last few actions performed</CardDescription>
            </CardHeader>
            <CardContent>
              <PlantActions plantId={id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Action History</CardTitle>
                <CardDescription>All actions performed on this plant</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/plants/${id}/actions/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Action
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <PlantActions plantId={id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Plant Images</CardTitle>
                <CardDescription>Visual growth progression</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/plants/${id}/images`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <PlantImages plantId={id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Detailed Notes</CardTitle>
                <CardDescription>Journal entries and observations</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/plants/${id}/notes/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {plant.notes ? (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">{format(new Date(plant.updatedAt), 'MMMM d, yyyy')}</p>
                  <p>{plant.notes}</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No notes added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}