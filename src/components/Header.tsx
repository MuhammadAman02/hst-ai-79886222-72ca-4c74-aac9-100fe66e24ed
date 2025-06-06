import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import UserMenu from './auth/UserMenu';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  console.log('Header rendered with cart items:', cartItemsCount, 'current path:', location.pathname, 'user:', user?.email);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Bags', href: '/bags' },
    { name: 'Wallets', href: '/wallets' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  const handleSignInClick = () => {
    console.log('Sign in button clicked');
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    console.log('Sign up button clicked');
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img 
                  src="https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/a6722b78-c4d9-4094-a244-44da44c40a8d.png"
                  alt="Crown Leather Logo"
                  className="h-12 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActivePage(item.href)
                      ? 'text-gold-600 border-b-2 border-gold-600'
                      : 'text-leather-700 hover:text-leather-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-5 w-5 text-leather-700" />
              </Button>
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignInClick}
                    className="text-leather-700 hover:text-leather-900"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSignUpClick}
                    className="bg-leather-700 hover:bg-leather-800 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile auth button */}
              {!isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="sm:hidden"
                  onClick={handleSignInClick}
                >
                  <User className="h-5 w-5 text-leather-700" />
                </Button>
              )}

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
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium ${
                      isActivePage(item.href)
                        ? 'text-gold-600 bg-gold-50'
                        : 'text-leather-700 hover:text-leather-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile auth buttons */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-leather-700"
                      onClick={() => {
                        handleSignInClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="w-full bg-leather-700 hover:bg-leather-800 text-white"
                      onClick={() => {
                        handleSignUpClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;