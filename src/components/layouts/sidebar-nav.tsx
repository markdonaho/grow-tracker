// src/components/layouts/sidebar-nav.tsx
import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Sprout, 
  Droplets, 
  Calendar, 
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarNav: FC<SidebarNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="mr-2 h-4 w-4" /> },
    { href: '/plants', label: 'Plants', icon: <Sprout className="mr-2 h-4 w-4" /> },
    { href: '/actions', label: 'Actions', icon: <Droplets className="mr-2 h-4 w-4" /> },
    { href: '/schedule', label: 'Schedule', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="mr-2 h-4 w-4" /> },
  ];

  const mobileClasses = isOpen 
    ? 'fixed inset-y-0 left-0 w-64 transform translate-x-0 transition-transform ease-in-out duration-300 z-30'
    : 'fixed inset-y-0 left-0 w-64 transform -translate-x-full transition-transform ease-in-out duration-300 z-30';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`${mobileClasses} md:hidden bg-background border-r`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
              onClick={onClose}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background h-screen">
        <div className="flex items-center h-16 px-6 border-b">
          <h2 className="text-xl font-bold">GrowTracker</h2>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarNav;