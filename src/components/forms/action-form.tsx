// src/components/forms/action-form.tsx
'use client';

import { FC, useState } from 'react';
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
import { actionsApi } from '@/lib/api-mutations';
import { showSuccessToast, showErrorToast } from '@/lib/utils';
import { X } from 'lucide-react';
import { ActionType } from '@/types/action';

const actionTypes = [
  'Watering',
  'Feeding',
  'Pruning',
  'Training',
  'Transplanting',
  'Other',
] as const;

// Action form schema
const actionFormSchema = z.object({
  plantId: z.string().min(1, 'Plant ID is required'),
  actionType: z.enum(actionTypes),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  notes: z.string().optional(),
});

type ActionFormValues = z.infer<typeof actionFormSchema>;

interface Nutrient {
  name: string;
  quantity: number;
  unit: string;
}

interface ActionFormProps {
  plantId: string;
  initialData?: Partial<ActionFormValues>;
  actionId?: string;
  onSuccess?: () => void;
}

const ActionForm: FC<ActionFormProps> = ({
  plantId,
  initialData,
  actionId,
  onSuccess,
}) => {
  const router = useRouter();
  const isEditing = !!actionId;
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [nutrientName, setNutrientName] = useState('');
  const [nutrientQuantity, setNutrientQuantity] = useState('');
  const [nutrientUnit, setNutrientUnit] = useState('ml');

  // Initialize form with react-hook-form
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      plantId: plantId,
      actionType: (initialData?.actionType as ActionType) || 'Watering',
      date: initialData?.date || new Date().toISOString().slice(0, 10),
      notes: initialData?.notes || '',
    },
  });

  const actionType = form.watch('actionType');

  const addNutrient = () => {
    if (!nutrientName || !nutrientQuantity) {
      showErrorToast('Please provide a name and quantity');
      return;
    }

    setNutrients([
      ...nutrients,
      {
        name: nutrientName,
        quantity: parseFloat(nutrientQuantity),
        unit: nutrientUnit,
      },
    ]);

    // Reset the inputs
    setNutrientName('');
    setNutrientQuantity('');
  };

  const removeNutrient = (index: number) => {
    const newNutrients = [...nutrients];
    newNutrients.splice(index, 1);
    setNutrients(newNutrients);
  };

  // Submit handler
  const onSubmit = async (values: ActionFormValues) => {
    try {
      // Convert string date to Date object
      const formattedValues = {
        ...values,
        date: new Date(values.date) // Convert string to Date object
      };
  
      // Prepare details object for nutrients if present
      const details = actionType === 'Feeding' && nutrients.length > 0
        ? { nutrients }
        : undefined;
  
      if (isEditing) {
        await actionsApi.update(actionId, {
          ...formattedValues,
          details,
        });
        showSuccessToast('Action updated successfully');
      } else {
        await actionsApi.create({
          ...formattedValues,
          details,
        });
        showSuccessToast('Action logged successfully');
      }
  
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/plants/${plantId}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving action:', error);
      showErrorToast('Failed to save action. Please try again.');
    }
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="actionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The type of action performed on the plant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                When this action was performed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {actionType === 'Feeding' && (
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Nutrients</h3>
            
            {nutrients.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Added Nutrients:</h4>
                <ul className="space-y-2">
                  {nutrients.map((nutrient, index) => (
                    <li key={index} className="flex items-center justify-between bg-background p-2 rounded">
                      <span>
                        {nutrient.name}: {nutrient.quantity}{nutrient.unit}
                      </span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeNutrient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Input 
                    placeholder="Name (e.g., Tiger Bloom)" 
                    value={nutrientName}
                    onChange={(e) => setNutrientName(e.target.value)}
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Quantity" 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={nutrientQuantity}
                    onChange={(e) => setNutrientQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <Select 
                    value={nutrientUnit}
                    onValueChange={setNutrientUnit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="tsp">tsp</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline"
                onClick={addNutrient}
              >
                Add Nutrient
              </Button>
              <p className="text-sm text-muted-foreground">
                Add the nutrients used in this feeding.
              </p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Details about this action..."
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
            {isEditing ? 'Update Action' : 'Log Action'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ActionForm;