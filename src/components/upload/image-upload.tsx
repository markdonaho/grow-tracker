// src/components/upload/image-upload.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
  entityType: string;
  entityId: string;
  maxFiles?: number;
}

export default function ImageUpload({ 
  onUpload, 
  entityType, 
  entityId, 
  maxFiles = 5 
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Limit the number of files
      const totalFiles = [...selectedFiles, ...newFiles];
      if (totalFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} images.`);
        return;
      }
      
      setSelectedFiles([...selectedFiles, ...newFiles]);
      
      // Create previews for the new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of selectedFiles) {
        await onUpload(file);
      }
      
      // Clear selections after successful upload
      setPreviews([]);
      setSelectedFiles([]);
      
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag and drop or click to upload images
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, GIF up to 5MB each
        </p>
      </div>
      
      {previews.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Selected Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <Card 
                key={index} 
                className="relative aspect-square overflow-hidden group"
              >
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
          
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-4"
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      )}
    </div>
  );
}