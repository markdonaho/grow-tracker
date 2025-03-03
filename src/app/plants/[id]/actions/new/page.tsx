// src/app/plants/[id]/actions/new/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ActionForm from '@/components/forms/action-form';
import { use } from "react";

interface NewActionPageProps {
  params: {
    id: string;
  };
}

export default function NewActionPage({ params }: NewActionPageProps) {
  // Unwrap the params object with React.use()
  const resolvedParams = use(Promise.resolve(params));
  const { id } = resolvedParams;
  const router = useRouter();

  const handleActionCreated = () => {
    // After creating an action, navigate back to the plant details
    router.push(`/plants/${id}`);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/plants/${id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Log New Action</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionForm 
            plantId={id} 
            onSuccess={handleActionCreated} 
          />
        </CardContent>
      </Card>
    </div>
  );
}