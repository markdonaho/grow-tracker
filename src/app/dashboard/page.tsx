// src/app/dashboard/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/dashboard/stats-card";
import RecentActions from "@/components/dashboard/recent-actions";
import { usePlants } from "@/hooks/usePlants";
import { useRecentActions } from "@/hooks/useActions";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays } from "date-fns";

export default function DashboardPage() {
  const { plants, isLoading: plantsLoading } = usePlants();
  const { actions, isLoading: actionsLoading } = useRecentActions(10);
  
  // Calculate dashboard stats
  const activePlants = plants?.filter(p => p.status === 'Growing') || [];
  const harvestedPlants = plants?.filter(p => p.status === 'Harvested') || [];
  const recentHarvests = harvestedPlants.filter(p => {
    const harvestDate = new Date(p.harvestDate || p.updatedAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return harvestDate >= ninetyDaysAgo;
  });
  
  // Estimate days to harvest for flowering plants
  let daysToHarvest = null;
  const floweringPlants = activePlants.filter(p => p.growCycleType === 'Flowering');
  if (floweringPlants.length > 0) {
    // Find the plant closest to harvest (assuming 9 weeks/63 days flowering period)
    const today = new Date();
    let minDays = Infinity;
    
    floweringPlants.forEach(plant => {
      // If there's an action that marks the switch to flowering
      const actions = plant.actions || [];
      const switchToFloweringAction = actions.find(a => 
        a.notes && a.notes.toLowerCase().includes('switch to flower')
      );
      
      let daysInFlowering;
      if (switchToFloweringAction) {
        const floweringStartDate = new Date(switchToFloweringAction.date);
        daysInFlowering = Math.floor((today - floweringStartDate) / (1000 * 60 * 60 * 24));
      } else {
        // Estimate based on plant age
        const plantAge = Math.floor((today - new Date(plant.startDate)) / (1000 * 60 * 60 * 24));
        // Assume plants spend 4 weeks in veg before flowering
        daysInFlowering = Math.max(0, plantAge - 28);
      }
      
      const remainingDays = Math.max(0, 63 - daysInFlowering);
      if (remainingDays < minDays) {
        minDays = remainingDays;
      }
    });
    
    daysToHarvest = minDays === Infinity ? null : minDays;
  }
  
  // Count actions in the last week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentActionsCount = actions?.filter(a => new Date(a.date) >= weekAgo).length || 0;
  
  // Create upcoming tasks
  const upcomingTasks = [];
  
  // Simple watering schedule - add watering tasks for each active plant
  activePlants.forEach(plant => {
    const plantActions = actions?.filter(a => 
      a.plantId.toString() === plant._id?.toString()
    ) || [];
    
    const lastWateringAction = plantActions
      .filter(a => a.actionType === 'Watering')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (lastWateringAction) {
      const lastWateringDate = new Date(lastWateringAction.date);
      const nextWateringDate = addDays(lastWateringDate, 3); // Assume watering every 3 days
      
      if (nextWateringDate > new Date()) {
        upcomingTasks.push({
          id: `watering-${plant._id}`,
          type: 'Watering',
          plantName: plant.name,
          date: nextWateringDate
        });
      }
    }
  });
  
  // Sort by date
  upcomingTasks.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  if (plantsLoading || actionsLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Active Plants"
              value={activePlants.length.toString()}
              description="Currently growing"
              icon="plant"
            />
            <StatsCard
              title="Harvested"
              value={recentHarvests.length.toString()}
              description="Last 90 days"
              icon="package"
            />
            <StatsCard
              title="Days to Harvest"
              value={daysToHarvest !== null ? daysToHarvest.toString() : "N/A"}
              description="Current estimate"
              icon="calendar"
            />
            <StatsCard
              title="Actions"
              value={recentActionsCount.toString()}
              description="Last week"
              icon="activity"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across all plants</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActions />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Scheduled tasks for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length === 0 ? (
                  <p className="text-muted-foreground">No upcoming tasks</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingTasks.slice(0, 5).map(task => (
                      <div key={task.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{task.type} - {task.plantName}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(task.date, 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Metrics</CardTitle>
              <CardDescription>Compare growth rates across plants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Growth metrics visualization will be implemented in a future phase</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}