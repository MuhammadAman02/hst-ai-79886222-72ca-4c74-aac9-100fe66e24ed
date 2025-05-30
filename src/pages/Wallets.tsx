import { useState } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import Cart, { CartItem } from '@/components/Cart';
import Footer from '@/components/Footer';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

const Wallets = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  console.log('Wallets page rendered');

  // Wallets products only
  const walletsProducts: Product[] = [
    {
      id: 3,
      name: "Vintage Wallet",
      price: 89,
      image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/3dd0aa11-9b12-407e-863e-fa01c2b4d1e6.png",
      category: "Wallets",
      description: "Compact leather wallet with RFID protection. Features multiple card slots and a bill compartment."
    },
    {
      id: 6,
      name: "Card Holder",
      price: 45,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      category: "Wallets",
      description: "Minimalist leather card holder. Slim design holds up to 8 cards with easy access."
    }
  ];

  const handleAddToCart = (product: Product) => {
    console.log('Adding product to cart:', product);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Checkout initiated",
      description: "Redirecting to secure payment...",
    });

    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: `Thank you for your purchase of ${cartItems.length} item(s).`,
      });
      
      setCartItems([]);
      setIsCartOpen(false);
    }, 2000);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen">
      <Header 
        cartItemsCount={cartItemsCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-leather-800 mb-4">
              Wallets Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our sophisticated collection of leather wallets and card holders, crafted for the modern professional.
            </p>
          </div>
        </div>
      </div>
      
      <ProductGrid 
        products={walletsProducts} 
        onAddToCart={handleAddToCart} 
      />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      
      <Footer />
    </div>
  );
};

export default Wallets;