import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Package, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('UserMenu rendered for user:', user?.email);

  const handleSignOut = () => {
    console.log('User signing out');
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const handleOrdersClick = () => {
    console.log('Navigating to orders page');
    navigate('/orders');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked - functionality to be implemented');
    toast({
      title: "Coming soon",
      description: "Profile management is coming soon!",
    });
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked - functionality to be implemented');
    toast({
      title: "Coming soon",
      description: "Wishlist feature is coming soon!",
    });
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked - functionality to be implemented');
    toast({
      title: "Coming soon",
      description: "Settings page is coming soon!",
    });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-leather-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <span className="hidden sm:block text-sm font-medium text-leather-700">
              {user.firstName}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleOrdersClick}>
          <Package className="mr-2 h-4 w-4" />
          <span>Orders</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleWishlistClick}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Wishlist</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;