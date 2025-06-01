import { useState } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import Cart, { CartItem } from '@/components/Cart';
import Footer from '@/components/Footer';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

const Bags = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  console.log('Bags page rendered');

  // Bags products only with updated Travel Duffel image
  const bagsProducts: Product[] = [
    {
      id: 1,
      name: "Classic Leather Handbag",
      price: 299,
      image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/a3d02df0-5b37-48cb-a51a-6616b39f1b36.png",
      category: "Handbags",
      description: "Elegant handcrafted leather handbag perfect for everyday use. Features premium Italian leather and gold-tone hardware."
    },
    {
      id: 2,
      name: "Executive Briefcase",
      price: 449,
      image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/4c513aca-6933-4c0a-9205-f3949a53a651.png",
      category: "Bags",
      description: "Professional leather briefcase with multiple compartments. Ideal for business professionals who value style and functionality."
    },
    {
      id: 5,
      name: "Crossbody Bag",
      price: 199,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      category: "Handbags",
      description: "Stylish crossbody bag perfect for travel. Features adjustable strap and secure zipper closure."
    },
    {
      id: 7,
      name: "Travel Duffel",
      price: 349,
      image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/655f935a-7e91-4a8c-ab0d-ea214dca07db.png",
      category: "Bags",
      description: "Spacious leather duffel bag for weekend trips. Features reinforced handles and shoulder strap."
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
              Bags Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of handcrafted leather bags, from elegant handbags to professional briefcases.
            </p>
          </div>
        </div>
      </div>
      
      <ProductGrid 
        products={bagsProducts} 
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

export default Bags;