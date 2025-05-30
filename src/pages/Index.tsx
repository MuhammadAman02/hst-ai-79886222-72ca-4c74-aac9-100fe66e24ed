import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Cart, { CartItem } from '@/components/Cart';
import Footer from '@/components/Footer';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  console.log('Index page rendered with cart items:', cartItems.length);

  // Sample products data with generated images (key fob removed)
  const products: Product[] = [
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
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      category: "Bags",
      description: "Professional leather briefcase with multiple compartments. Ideal for business professionals who value style and functionality."
    },
    {
      id: 3,
      name: "Vintage Wallet",
      price: 89,
      image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/3dd0aa11-9b12-407e-863e-fa01c2b4d1e6.png",
      category: "Wallets",
      description: "Compact leather wallet with RFID protection. Features multiple card slots and a bill compartment."
    },
    {
      id: 4,
      name: "Leather Belt",
      price: 79,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      category: "Accessories",
      description: "Premium leather belt with reversible design. Available in black and brown with polished buckle."
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
      id: 6,
      name: "Card Holder",
      price: 45,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      category: "Wallets",
      description: "Minimalist leather card holder. Slim design holds up to 8 cards with easy access."
    },
    {
      id: 7,
      name: "Travel Duffel",
      price: 349,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center&auto=format&q=80",
      category: "Bags",
      description: "Spacious leather duffel bag for weekend trips. Features reinforced handles and shoulder strap."
    }
  ];

  const handleAddToCart = (product: Product) => {
    console.log('Adding product to cart:', product);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('Updated existing item quantity:', updatedItems);
        return updatedItems;
      } else {
        const newItems = [...prevItems, { ...product, quantity: 1 }];
        console.log('Added new item to cart:', newItems);
        return newItems;
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    console.log('Updating quantity for item', id, 'to', quantity);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    console.log('Removing item from cart:', id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    console.log('Checkout initiated with items:', cartItems);
    
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Simulate checkout process
    toast({
      title: "Checkout initiated",
      description: "Redirecting to secure payment...",
    });

    // Here you would typically redirect to a payment processor
    // For demo purposes, we'll just show a success message after a delay
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: `Thank you for your purchase of ${cartItems.length} item(s). Total: $${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`,
      });
      
      // Clear cart after successful checkout
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
      
      <Hero />
      
      <ProductGrid 
        products={products} 
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

export default Index;