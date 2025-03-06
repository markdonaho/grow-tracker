// src/app/schedule/page.tsx
"use client";

// import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { enUS } from 'date-fns/locale';

// Setup the localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Mock event data - combine both planned and historical events
const mockEvents = [
  {
    id: 1,
    title: 'Watering - Northern Lights',
    start: new Date(2025, 2, 5), // March 5, 2025
    end: new Date(2025, 2, 5),
    type: 'watering',
    completed: false,
  },
  {
    id: 2,
    title: 'Feeding - All Plants',
    start: new Date(2025, 2, 10), // March 10, 2025
    end: new Date(2025, 2, 10),
    type: 'feeding',
    completed: false,
  },
  {
    id: 3,
    title: 'Pruning - White Widow',
    start: new Date(2025, 2, 15), // March 15, 2025
    end: new Date(2025, 2, 15),
    type: 'pruning',
    completed: false,
  },
  {
    id: 4,
    title: 'Harvest - Northern Lights',
    start: new Date(2025, 2, 28), // March 28, 2025
    end: new Date(2025, 2, 28),
    type: 'harvest',
    completed: false,
  },
  // Historical events
  {
    id: 5,
    title: 'Watering - All Plants',
    start: new Date(2025, 2, 1), // March 1, 2025
    end: new Date(2025, 2, 1),
    type: 'watering',
    completed: true,
  },
  {
    id: 6,
    title: 'Pruning - Northern Lights',
    start: new Date(2025, 1, 25), // Feb 25, 2025
    end: new Date(2025, 1, 25),
    type: 'pruning',
    completed: true,
  },
];

export default function SchedulePage() {
  // const [ setSelectedDate] = useState(new Date());
  
  // Function to get event style based on event type
  interface CalendarEvent {
    type: string;
    completed: boolean;
  }
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#10b981'; // Default green
    
    switch (event.type) {
      case 'watering':
        backgroundColor = '#0ea5e9'; // Blue
        break;
      case 'feeding':
        backgroundColor = '#8b5cf6'; // Purple
        break;
      case 'pruning':
        backgroundColor = '#f59e0b'; // Amber
        break;
      case 'harvest':
        backgroundColor = '#f43f5e'; // Red
        break;
    }
    
    // Apply a muted style for completed events
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: event.completed ? 0.6 : 1,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    
    return {
      style,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cultivation Calendar</CardTitle>
          <CardDescription>Schedule and track all your cultivation tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={mockEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents
              .filter(event => !event.completed && event.start > new Date())
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(event.start, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Complete
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}