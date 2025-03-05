// src/app/plants/[id]/images/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ImageUpload from '@/components/upload/image-upload';
import { usePlant } from '@/hooks/usePlants';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageUploadPageProps {
  params: {
    id: string;
  };
}

export default function ImageUploadPage({ params }: ImageUploadPageProps) {
  const { id } = params;
  const router = useRouter();
  const { plant, isLoading, isError } = usePlant(id);

  const handleUploadComplete = () => {
    // Navigate back to the plant's images tab
    router.push(`/plants/${id}?tab=images`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/plants/${id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !plant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/plants/${id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Upload Images</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not load plant data. Please try again later.</p>
            <Button className="mt-4" onClick={() => router.push(`/plants/${id}`)}>
              Return to Plant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/plants/${id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Upload Images for {plant.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Plant Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload 
            entityType="Plant" 
            entityId={id} 
            onUploadComplete={handleUploadComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
}