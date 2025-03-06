// src/app/actions/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Droplets, Scissors, Sprout, Zap } from "lucide-react";
import { useRecentActions } from "@/hooks/useActions";
import { format } from 'date-fns';
// import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlant } from "@/hooks/usePlants";
import { Action } from "@/types/action";

export default function ActionsPage() {
  const { actions, isLoading, isError } = useRecentActions(50); // Get more actions for filtering
  // const [activeTab, setActiveTab] = useState('all');

  const getActionIcon = (type: string): React.ReactNode => {
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

  const renderActions = (filteredActions: Action[]) => {
    if (filteredActions.length === 0) {
      return (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">No actions found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredActions.map((action) => (
          <ActionItem key={action._id?.toString()} action={action} getActionIcon={getActionIcon} />
        ))}
      </div>
    );
  };

  if (isLoading) {
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
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start mt-1 mr-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-40 mt-1" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold">Error loading actions</h3>
        <p className="text-muted-foreground mt-2">
          There was a problem loading the action history. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Action History</h1>
      
      <Tabs 
        defaultValue="all" 
        className="space-y-4"
        // onValueChange={setActiveTab}
      >
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
              {renderActions(actions)}
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
                {renderActions(actions.filter(action => 
                  action.actionType.toLowerCase() === actionType
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Define interface for ActionItem props
interface ActionItemProps {
  action: Action;
  getActionIcon: (type: string) => React.ReactNode;
}

function ActionItem({ action, getActionIcon }: ActionItemProps) {
  const { plant } = usePlant(action.plantId.toString());
  
  return (
    <div className="flex border-b pb-4 last:border-0 last:pb-0">
      <div className="flex items-start mt-1 mr-4">
        <div className="p-2 rounded-full bg-primary/10">
          {getActionIcon(action.actionType)}
        </div>
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{action.actionType}</h4>
          <div className="text-sm text-muted-foreground">{format(new Date(action.date), 'MMM d, yyyy')}</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Plant: {plant?.name || 'Unknown'}</p>
        <p className="mt-2">{action.notes || 'No details provided'}</p>
      </div>
    </div>
  );
}