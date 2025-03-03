// src/components/layouts/header.tsx
import { FC } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 border-b flex items-center px-4 bg-background">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex items-center ml-4 md:ml-0">
        <h1 className="text-xl font-bold">GrowTracker</h1>
      </div>
    </header>
  );
};

export default Header;