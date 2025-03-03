// src/app/plants/[id]/images/page.tsx
"use client";

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import ImageUpload from "@/components/upload/image-upload";

interface ImagesPageProps {
  params: {
    id: string;
  };
}

export default function ImagesPage({ params }: ImagesPageProps) {
  const { id } = params;
  const [images, setImages] = useState<{ id: string; url: string; date: string }[]>([]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'Plant');
      formData.append('entityId', id);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // In a real app, you'd refresh the images list from the server
      // For now, we'll add a mock entry
      setImages(prev => [
        ...prev,
        { 
          id: data._id || `mock-${Date.now()}`,
          url: URL.createObjectURL(file),
          date: new Date().toLocaleDateString()
        }
      ]);

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/plants/${id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Plant Images</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload 
            onUpload={handleImageUpload} 
            entityType="Plant" 
            entityId={id} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="aspect-square rounded-md overflow-hidden">
                  <img 
                    src={image.url} 
                    alt="Plant" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-square bg-muted flex items-center justify-center rounded-md max-w-md mx-auto">
              <p className="text-muted-foreground">No images uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}