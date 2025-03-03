// src/app/plants/[id]/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Edit, Plus, Upload } from "lucide-react";
import PlantMetrics from "@/components/plants/plant-metrics";
import PlantActions from "@/components/plants/plant-actions";
import { use } from "react"; // Import the use function from React

interface PlantDetailPageProps {
  params: {
    id: string;
  };
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  // Unwrap the params object with React.use()
  const resolvedParams = use(Promise.resolve(params));
  const { id } = resolvedParams;
  
  // In a real application, this would fetch data from your API
  const plant = {
    id,
    name: "Northern Lights",
    strain: "Northern Lights",
    status: "Growing",
    growCycleType: "Flowering",
    startDate: "2024-11-09",
    currentHeight: 24,
    notes: "This plant has been growing very well. Switched to flowering on January 5, 2025.",
    daysToHarvest: 24,
  };

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
        
        {/* Overview tab content remains the same */}
        <TabsContent value="overview" className="space-y-4">
          {/* ... */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="aspect-square bg-muted flex items-center justify-center rounded-md">
                  <p className="text-muted-foreground">No images yet</p>
                </div>
              </div>
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
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">January 5, 2025</p>
                <p>Switched to flowering cycle. Plant is looking healthy with good leaf development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function calculateAgeInDays(dateString: string) {
  const startDate = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}