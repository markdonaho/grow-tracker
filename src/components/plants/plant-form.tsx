// src/components/plants/plant-form.tsx
'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { plantsApi } from '@/lib/api-mutations';
import { showSuccessToast, showErrorToast } from '@/lib/utils';

// Define the form schema with Zod
const plantFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  strain: z.string().min(2, 'Strain must be at least 2 characters.'),
  status: z.enum(['Growing', 'Harvested', 'Archived']),
  growCycleType: z.enum(['Vegetative', 'Flowering']),
  notes: z.string().optional(),
});

type PlantFormValues = z.infer<typeof plantFormSchema>;

interface PlantFormProps {
  initialData?: PlantFormValues;
  plantId?: string;
  onSuccess?: () => void;
}

const PlantForm: FC<PlantFormProps> = ({ initialData, plantId, onSuccess }) => {
  const router = useRouter();
  const isEditing = !!plantId;

  // Initialize form with react-hook-form
  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: initialData || {
      name: '',
      strain: '',
      status: 'Growing',
      growCycleType: 'Vegetative',
      notes: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: PlantFormValues) => {
    try {
      if (isEditing) {
        // Update existing plant
        await plantsApi.update(plantId, values);
        showSuccessToast('Plant updated successfully');
      } else {
        // Create new plant
        await plantsApi.create({
          ...values,
          startDate: new Date(),
          growthMetrics: []
        });
        showSuccessToast('Plant created successfully');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/plants');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving plant:', error);
      showErrorToast('Failed to save plant. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Name</FormLabel>
              <FormControl>
                <Input placeholder="Northern Lights #4" {...field} />
              </FormControl>
              <FormDescription>
                A unique name to identify this plant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strain</FormLabel>
              <FormControl>
                <Input placeholder="Northern Lights" {...field} />
              </FormControl>
              <FormDescription>
                The cannabis strain variety.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Growing">Growing</SelectItem>
                    <SelectItem value="Harvested">Harvested</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current status of the plant.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="growCycleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Cycle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Vegetative">Vegetative</SelectItem>
                    <SelectItem value="Flowering">Flowering</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current growth cycle stage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about this plant..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Plant' : 'Create Plant'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PlantForm;