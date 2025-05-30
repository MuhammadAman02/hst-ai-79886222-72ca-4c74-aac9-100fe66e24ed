import { useState } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log('Header rendered with cart items:', cartItemsCount);

  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Bags', href: '#bags' },
    { name: 'Wallets', href: '#wallets' },
    { name: 'Accessories', href: '#accessories' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/a6722b78-c4d9-4094-a244-44da44c40a8d.png"
              alt="Crown Leather Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-leather-700 hover:text-leather-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-5 w-5 text-leather-700" />
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="h-5 w-5 text-leather-700" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5 text-leather-700" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-leather-700" />
              ) : (
                <Menu className="h-6 w-6 text-leather-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-leather-700 hover:text-leather-900 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;