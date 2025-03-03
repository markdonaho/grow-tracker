// src/app/plants/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlantCard from "@/components/plants/plant-card";

const mockPlants = [
  {
    id: "1",
    name: "Northern Lights",
    strain: "Northern Lights",
    status: "Growing",
    growCycleType: "Flowering",
    startDate: "2024-11-09",
    currentHeight: 24,
    daysToHarvest: 24,
  },
  {
    id: "2",
    name: "White Widow Mother",
    strain: "White Widow",
    status: "Growing",
    growCycleType: "Vegetative",
    startDate: "2024-10-15",
    currentHeight: 18,
    daysToHarvest: null,
  },
  {
    id: "3",
    name: "AK-47 Clone #1",
    strain: "AK-47",
    status: "Growing",
    growCycleType: "Vegetative",
    startDate: "2025-01-10",
    currentHeight: 8,
    daysToHarvest: null,
  },
  {
    id: "4",
    name: "Blueberry Harvest",
    strain: "Blueberry",
    status: "Harvested",
    growCycleType: "Flowering",
    startDate: "2024-09-01",
    harvestDate: "2024-12-15",
    currentHeight: 30,
    daysToHarvest: 0,
  },
];

export default function PlantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plants</h1>
        <Button asChild>
          <Link href="/plants/new">  {/* This is the correct path */}
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}