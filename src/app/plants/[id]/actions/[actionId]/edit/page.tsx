// src/app/plants/[id]/actions/[actionId]/edit/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ActionForm from '@/components/forms/action-form';
import { useEffect, useState } from 'react';
import { use } from "react";

interface EditActionPageProps {
  params: {
    id: string;
    actionId: string;
  };
}

// Define the action type
interface ActionData {
  actionType: "Watering" | "Feeding" | "Pruning" | "Training" | "Transplanting" | "Other";
  date: string;
  notes?: string;
}

export default function EditActionPage({ params }: EditActionPageProps) {
  // Unwrap the params object with React.use()
  const resolvedParams = use(Promise.resolve(params));
  const { id, actionId } = resolvedParams;
  const router = useRouter();
  const [action, setAction] = useState<ActionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch action data from the API
    // For Phase 1, we'll use mock data
    const mockAction: ActionData = {
      actionType: 'Watering',
      date: new Date().toISOString().split('T')[0],
      notes: 'Standard watering',
    };
    
    setAction(mockAction);
    setLoading(false);
  }, [actionId]);

  const handleActionUpdated = () => {
    // After updating an action, navigate back to the plant details
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
        <h1 className="text-3xl font-bold">Edit Action</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Details</CardTitle>
        </CardHeader>
        <CardContent>
          {action && (
            <ActionForm 
              initialData={action} 
              plantId={id} 
              actionId={actionId}
              onSuccess={handleActionUpdated} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}