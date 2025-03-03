// src/app/actions/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Droplets, Scissors, Sprout, Zap } from "lucide-react";

// Mock data for actions
const mockActions = [
  { id: '1', type: 'Watering', plantName: 'Northern Lights', date: 'Feb 3, 2025', details: 'Standard watering, soil was quite dry.' },
  { id: '2', type: 'Feeding', plantName: 'Northern Lights', date: 'Jan 28, 2025', details: 'Tiger Bloom - 10ml, Big Bloom - 6ml' },
  { id: '3', type: 'Pruning', plantName: 'Northern Lights', date: 'Jan 13, 2025', details: 'Trimmed fan leaves and everything above trellis' },
  { id: '4', type: 'Watering', plantName: 'White Widow', date: 'Jan 10, 2025', details: 'Standard watering' },
  { id: '5', type: 'Training', plantName: 'AK-47', date: 'Jan 6, 2025', details: 'Trimmed fan leaves. Took 2 clippings for clones.' },
  { id: '6', type: 'Watering', plantName: 'Northern Lights', date: 'Jan 2, 2025', details: 'Standard watering' },
  { id: '7', type: 'Watering', plantName: 'White Widow', date: 'Dec 27, 2024', details: 'Standard watering' },
  { id: '8', type: 'Pruning', plantName: 'Blueberry', date: 'Dec 15, 2024', details: 'Final trim before harvest' },
];

export default function ActionsPage() {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Watering':
        return <Droplets className="h-5 w-5" />;
      case 'Pruning':
        return <Scissors className="h-5 w-5" />;
      case 'Feeding':
        return <Sprout className="h-5 w-5" />;
      case 'Training':
        return <Zap className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Action History</h1>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="watering">Watering</TabsTrigger>
          <TabsTrigger value="feeding">Feeding</TabsTrigger>
          <TabsTrigger value="pruning">Pruning</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
              <CardDescription>Complete history of all plant activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockActions.map((action) => (
                  <div key={action.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start mt-1 mr-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        {getActionIcon(action.type)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{action.type}</h4>
                        <div className="text-sm text-muted-foreground">{action.date}</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Plant: {action.plantName}</p>
                      <p className="mt-2">{action.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {['watering', 'feeding', 'pruning', 'training'].map((actionType) => (
          <TabsContent key={actionType} value={actionType} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Activities</CardTitle>
                <CardDescription>History of {actionType} activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockActions
                    .filter(action => action.type.toLowerCase() === actionType)
                    .map((action) => (
                      <div key={action.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start mt-1 mr-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            {getActionIcon(action.type)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{action.type}</h4>
                            <div className="text-sm text-muted-foreground">{action.date}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Plant: {action.plantName}</p>
                          <p className="mt-2">{action.details}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}