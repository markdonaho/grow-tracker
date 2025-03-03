// src/app/settings/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  // Mock state for settings
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lightSchedule, setLightSchedule] = useState('18/6');
  const [units, setUnits] = useState('metric');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="grow">Grow Settings</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="units">Measurement Units</Label>
                <Select value={units} onValueChange={setUnits}>
                  <SelectTrigger id="units">
                    <SelectValue placeholder="Select units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (cm, ml, °C)</SelectItem>
                    <SelectItem value="imperial">Imperial (in, oz, °F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-7">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the application
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for scheduled tasks and alerts
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important alerts via email
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                  disabled={!notifications}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-time">Notification Time</Label>
                <Select defaultValue="8">
                  <SelectTrigger id="notification-time" disabled={!notifications}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6:00 AM</SelectItem>
                    <SelectItem value="7">7:00 AM</SelectItem>
                    <SelectItem value="8">8:00 AM</SelectItem>
                    <SelectItem value="9">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={!notifications}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="grow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grow Environment Settings</CardTitle>
              <CardDescription>Configure your grow environment defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="light-schedule">Default Light Schedule</Label>
                <Select value={lightSchedule} onValueChange={setLightSchedule}>
                  <SelectTrigger id="light-schedule">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24/0">24/0 (Seedling)</SelectItem>
                    <SelectItem value="18/6">18/6 (Vegetative)</SelectItem>
                    <SelectItem value="12/12">12/12 (Flowering)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temp-day">Default Day Temperature</Label>
                  <div className="flex items-center">
                    <Input 
                      id="temp-day" 
                      type="number" 
                      defaultValue="75" 
                      className="w-20 mr-2"
                    />
                    <span>°F</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temp-night">Default Night Temperature</Label>
                  <div className="flex items-center">
                    <Input 
                      id="temp-night" 
                      type="number" 
                      defaultValue="68" 
                      className="w-20 mr-2" 
                    />
                    <span>°F</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="humidity-veg">Vegetative Humidity</Label>
                  <div className="flex items-center">
                    <Input 
                      id="humidity-veg" 
                      type="number" 
                      defaultValue="60" 
                      className="w-20 mr-2" 
                    />
                    <span>%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="humidity-flower">Flowering Humidity</Label>
                  <div className="flex items-center">
                    <Input 
                      id="humidity-flower" 
                      type="number" 
                      defaultValue="40" 
                      className="w-20 mr-2" 
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nutrient-brand">Default Nutrient Brand</Label>
                <Select defaultValue="foxfarm">
                  <SelectTrigger id="nutrient-brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foxfarm">Fox Farm</SelectItem>
                    <SelectItem value="advanced">Advanced Nutrients</SelectItem>
                    <SelectItem value="general">General Hydroponics</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Grow Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Mark Donaho" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="mark@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive">Delete Account</Button>
              <Button>Update Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}