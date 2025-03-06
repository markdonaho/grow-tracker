// src/components/plants/plant-images.tsx
"use client";

import { FC } from "react";
import { useEntityImages } from "@/hooks/useImages";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { imagesApi } from "@/lib/api-mutations";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';

interface PlantImagesProps {
  plantId: string;
}

const PlantImages: FC<PlantImagesProps> = ({ plantId }) => {
  const { images, isLoading, isError: imageError, mutate } = useEntityImages("Plant", plantId);

  const handleDeleteImage = async (imageId: string) => {
    try {
      await imagesApi.delete(imageId);
      toast.success("Image deleted successfully");
      mutate();
     
    } catch {
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    );
  }

  if (imageError) {
    return <div>Error loading images. Please try again.</div>;
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center rounded-md max-w-md mx-auto">
        <p className="text-muted-foreground">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image._id?.toString()} className="group relative aspect-square rounded-md overflow-hidden">
          <Image
            src={image.url}
            alt={image.filename}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteImage(image._id?.toString() || '')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantImages;