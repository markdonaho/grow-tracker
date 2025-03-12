# GrowTracker

GrowTracker is a containerized cultivation management system that helps growers track plants, log actions, monitor growth metrics, and manage their cultivation process from start to finish.

## Features

- **Plant Management**: Track individual plants from seedling to harvest
- **Action Logging**: Record watering, feeding, pruning, and training activities
- **Growth Tracking**: Monitor plant metrics over time with visual charts
- **Image Gallery**: Store and view photos of your plants at different growth stages
- **Task Scheduling**: Set reminders for upcoming cultivation tasks

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Storage**: MinIO (S3-compatible)
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development with MongoDB and MinIO)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grow-tracker.git
   cd grow-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
4. Start the MongoDB and MinIO containers:
   ```bash
   docker-compose up -d
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
grow-tracker/                    # Root project directory
├── public/                      # Static assets
├── src/                         # Source code
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API Routes
│   │   ├── dashboard/           # Dashboard page
│   │   ├── plants/              # Plants pages
│   │   └── ...                  # Other pages
│   ├── components/              # React components
│   │   ├── ui/                  # UI components from shadcn
│   │   ├── forms/               # Form components
│   │   ├── layouts/             # Layout components
│   │   ├── plants/              # Plant-specific components
│   │   └── dashboard/           # Dashboard components
│   ├── lib/                     # Utility libraries
│   │   ├── db/                  # Database utilities
│   │   ├── storage/             # Storage utilities
│   │   └── utils.ts             # General utility functions
│   └── types/                   # TypeScript type definitions
├── docker-compose.yml           # Local development containers
└── ...                          # Other configuration files
```

## Development Workflow

### Phase 1: Core Application Development (Current)
- Set up Next.js project with TypeScript
- Configure Tailwind CSS and shadcn/ui components
- Create basic folder structure
- Implement dashboard layout and navigation
- Create plant list and plant detail views
- Develop forms for adding/editing plants
- Build action logging interface
- Create growth tracking forms and display
- Implement basic image upload component
- Set up mock data service for development

### Phase 2: Data Layer Integration (Next)
- Set up MongoDB and MinIO connections
- Implement data models and CRUD operations
- Connect UI to API endpoints
- Implement image upload and storage flow

## Deployment

### Local Development
```bash
# Start MongoDB and MinIO containers
docker-compose up -d

# Run the Next.js development server
npm run dev
```

### Production (Kubernetes)
Kubernetes deployment instructions will be added in Phase 4.

## License

This project is licensed under the MIT License.


# GrowTracker - Phase 2 Implementation Guide

## Overview

Phase 2 focuses on data layer integration, moving from mock data to real database persistence and file storage using MongoDB and MinIO. This guide outlines the changes made and the steps to complete Phase 2 implementation.

## What's Implemented

### 1. Docker Environment
- Docker Compose setup with MongoDB, MongoDB Express, and MinIO containers
- Initialization script for MongoDB database and collections
- Environment variables configuration for local development

### 2. Database Connection
- MongoDB connection utility with connection pooling and caching
- Collection access with proper typing
- Document sanitization helpers for ObjectId handling

### 3. Storage Service
- MinIO integration for image storage (S3-compatible)
- Mock storage service option for development without MinIO
- File upload, download, and deletion capabilities
- Presigned URL generation for secure image access

### 4. Data Repositories
- Plants repository with CRUD operations
- Actions repository for tracking cultivation activities
- Images repository for metadata storage and retrieval

### 5. API Routes
- RESTful API endpoints for plants, actions, and images
- File upload endpoint with multipart form handling
- Specialized endpoints for growth metrics and plant harvesting

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grow-tracker.git
   cd grow-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Create required directories:
   ```bash
   mkdir -p docker/mongodb
   ```

5. Copy the MongoDB initialization script:
   ```bash
   cp init-mongo.js docker/mongodb/
   ```

6. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Access the application at http://localhost:3000

### Admin Interfaces
- MongoDB Express: http://localhost:8081
- MinIO Console: http://localhost:9001
  - Login with: minioadmin / minioadmin (default)

## Integration with UI Components

To complete Phase 2, we need to update the UI components to use the real API endpoints:

### 1. Data Fetching with SWR
We've added SWR for data fetching with custom hooks:
- `usePlants` and `usePlant` for plant data
- `useActions` and `usePlantActions` for action data
- `useEntityImages` for image data
- `useGrowthMetrics` for plant growth measurements

These hooks provide:
- Automatic revalidation on focus or interval
- Loading and error states
- Mutation methods for real-time updates

### 2. Update UI components to fetch real data

Here's how to update each major section of the UI:

#### Plants List Page
```tsx
// src/app/plants/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlantCard from "@/components/plants/plant-card";
import { usePlants } from "@/hooks/usePlants";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlantsPage() {
  const { plants, isLoading, isError } = usePlants();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Plants</h1>
          <Button asChild>
            <Link href="/plants/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Plant
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-lg border p-6">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold">Error loading plants</h3>
        <p className="text-muted-foreground mt-2">
          There was a problem loading your plants. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plants</h1>
        <Button asChild>
          <Link href="/plants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Link>
        </Button>
      </div>

      {plants.length === 0 ? (
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold">No plants yet</h3>
          <p className="text-muted-foreground mt-2">
            Get started by adding your first plant.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <PlantCard key={plant._id?.toString()} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Plant Actions Component
```tsx
// src/components/plants/plant-actions.tsx
'use client';

import { FC } from 'react';
import { Calendar, Droplets, Scissors, Zap, Sprout } from 'lucide-react';
import { format } from 'date-fns';
import { usePlantActions } from '@/hooks/useActions';
import { Skeleton } from '@/components/ui/skeleton';

interface PlantActionsProps {
  plantId: string;
}

const PlantActions: FC<PlantActionsProps> = ({ plantId }) => {
  const { actions, isLoading, isError } = usePlantActions(plantId);
  
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
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-start mt-1 mr-4">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <div className="w-full">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-4 text-center">
        <p>Error loading actions. Please try again.</p>
      </div>
    );
  }
  
  if (actions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No actions recorded yet. Log your first action to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div key={action._id?.toString()} className="flex border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-start mt-1 mr-4">
            <div className="p-2 rounded-full bg-primary/10">
              {getActionIcon(action.actionType)}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{action.actionType}</h4>
              <div className="text-sm text-muted-foreground">
                {format(new Date(action.date), 'MMM d, yyyy')}
              </div>
            </div>
            <p className="mt-1">{action.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantActions;
```

### 3. Add error handling and loading states

Add a toast notification system for feedback:

```tsx
// src/components/ui/toast-utils.ts
import { toast } from 'sonner';

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
```

Update forms to use the API mutation functions and show feedback:

```tsx
// Example in src/components/plants/plant-form.tsx
// Inside onSubmit handler:

const onSubmit = async (values: PlantFormValues) => {
  const loadingToast = showLoadingToast(
    isEditing ? 'Updating plant...' : 'Creating plant...'
  );
  
  try {
    if (isEditing) {
      await plantsApi.update(plantId!, values);
      showSuccessToast('Plant updated successfully');
    } else {
      await plantsApi.create(values);
      showSuccessToast('Plant created successfully');
    }
    
    dismissToast(loadingToast);
    
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/plants');
      router.refresh();
    }
  } catch (error) {
    dismissToast(loadingToast);
    showErrorToast(error instanceof Error ? error.message : 'An error occurred');
  }
};
```

### 4. Image Uploads and Display

Updating the image upload component:

```tsx
// src/components/upload/image-upload.tsx (simplified)
"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { imagesApi } from "@/lib/api-mutations";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast-utils";
import { useEntityImages } from "@/hooks/useImages";
import { EntityType } from "@/types/image";

interface ImageUploadProps {
  entityType: EntityType;
  entityId: string;
  maxFiles?: number;
  onUploadComplete?: () => void;
}

export default function ImageUpload({ 
  entityType, 
  entityId, 
  maxFiles = 5,
  onUploadComplete 
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useEntityImages(entityType, entityId);

  // ... file selection handlers ...

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of selectedFiles) {
        await imagesApi.upload(file, entityType, entityId);
      }
      
      // Clear selections after successful upload
      setPreviews([]);
      setSelectedFiles([]);
      
      // Refresh the images list
      mutate();
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      showSuccessToast('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      showErrorToast('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // ... UI render ...
}
```

Display uploaded images:

```tsx
// src/components/plants/plant-images.tsx
"use client";

import { FC } from "react";
import { useEntityImages } from "@/hooks/useImages";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { imagesApi } from "@/lib/api-mutations";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast-utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PlantImagesProps {
  plantId: string;
}

const PlantImages: FC<PlantImagesProps> = ({ plantId }) => {
  const { images, isLoading, isError, mutate } = useEntityImages("Plant", plantId);

  const handleDeleteImage = async (imageId: string) => {
    try {
      await imagesApi.delete(imageId);
      showSuccessToast("Image deleted successfully");
      mutate();
    } catch (error) {
      showErrorToast("Failed to delete image");
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

  if (isError) {
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
          <img
            src={image.url}
            alt={image.filename}
            className="w-full h-full object-cover"
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
```

## Next Steps

After completing the UI integration, the next phase (Phase 3) will focus on containerization:

1. Create Dockerfile for the Next.js application
2. Update Docker Compose for production
3. Create deployment scripts and documentation
4. Implement backup and restore procedures
5. Set up proper logging and monitoring

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Check the connection string in `.env.local`
   - Ensure the MongoDB container is running

2. **Google Cloud Storage Issues**
   - Verify your `GOOGLE_APPLICATION_CREDENTIALS` path
   - Check permissions on the service account
   - Ensure the Cloud Storage API is enabled

3. **TypeScript Errors**
   - Run `npm install` to ensure all type definitions are installed
   - Check the imports in your files for correct paths
   - Make sure `tsconfig.json` includes all necessary paths

4. **UI Integration Issues**
   - Check browser console for errors
   - Use SWR's built-in error states for debugging
   - Try development mode with `USE_LOCAL_STORAGE=true` for simplified testing
```




# Grow Tracker

A [brief description of your application - e.g., "web application for tracking plant growth using Next.js, MongoDB, and MinIO for storage"].

## Table of Contents

1.  [Overview](#overview)
2.  [Prerequisites](#prerequisites)
3.  [Local Development](#local-development)
4.  [Containerization](#containerization)
    *   [Dockerfile](#dockerfile)
    *   [Docker Compose](#docker-compose)
5.  [CI/CD with GitHub Actions](#ci/cd-with-github-actions)
6.  [Deployment](#deployment)
    *   [Kubernetes (Optional)](#kubernetes-optional)
7.  [Environment Variables](#environment-variables)
8.  [Contributing](#contributing)
9.  [License](#license)

## Overview

[Expand on the description of your application. Explain its purpose, main features, and technologies used.]

This application is built using:

*   [Next.js](https://nextjs.org/): [Briefly describe its role]
*   [MongoDB](https://www.mongodb.com/): [Briefly describe its role]
*   [MinIO](https://min.io/): [Briefly describe its role]

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (version 18 or higher)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/)
*   [Docker Compose](https://docs.docker.com/compose/)
*   [GitHub Account](https://github.com/)

## Local Development

1.  Clone the repository:

    ```
    git clone [your-repository-url]
    cd grow-tracker
    ```

2.  Install dependencies:

    ```
    npm install
    # or
    yarn install
    ```

3.  Configure environment variables:

    *   Create a `.env.local` file based on the `.env.example` file.
    *   Fill in the required values (MongoDB URI, MinIO credentials, etc.).

4.  Run the development server:

    ```
    npm run dev
    # or
    yarn dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

## Containerization

This project is containerized using Docker for consistent development, deployment, and scaling.

### Dockerfile

The `Dockerfile` is located at the root of the project. It uses a multi-stage build process:

1.  **Development Stage:**  For local development with hot-reloading.
2.  **Build Stage:** Builds the Next.js application for production.
3.  **Production Stage:** Creates a minimal image to serve the built application.

[Include a snippet of your Dockerfile here - the one we've been working on.  This helps with discoverability and understanding.]

To build the production image:

