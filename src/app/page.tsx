// src/app/page.tsx
import Link from 'next/link';
import { Sprout, Droplets, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 bg-gradient-to-b from-background to-muted">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Grow Smarter, Not Harder
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Track your cultivation from seed to harvest with GrowTracker's 
            comprehensive management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/plants">
                Browse Plants
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your grow
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Plant Tracking</CardTitle>
                <CardDescription>
                  Monitor each plant's lifecycle from seedling to harvest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Keep detailed records of strains, growth metrics, and notes for every plant in your garden.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Action Logging</CardTitle>
                <CardDescription>
                  Record watering, feeding, pruning, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Log all your cultivation activities with detailed timestamps and notes to optimize your grow process.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Schedule Management</CardTitle>
                <CardDescription>
                  Plan and track your cultivation schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Never miss a watering, feeding, or important cultivation task with our scheduling tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your cultivation?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            GrowTracker helps you maintain detailed records, track growth metrics, and manage your entire cultivation process.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} GrowTracker. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/plants" className="text-sm text-muted-foreground hover:text-foreground">
              Plants
            </Link>
            <Link href="/actions" className="text-sm text-muted-foreground hover:text-foreground">
              Actions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}