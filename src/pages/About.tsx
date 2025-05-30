import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Cart, { CartItem } from '@/components/Cart';
import { useToast } from '@/hooks/use-toast';

const About = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  console.log('About page rendered');

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-leather-800 mb-4">
              About Crown Leather
            </h1>
            <p className="text-lg text-gray-600">
              Crafting premium leather goods with timeless elegance since 1985
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-serif font-bold text-leather-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 1985, Crown Leather began as a small family workshop with a simple mission: 
                to create exceptional leather goods that combine traditional craftsmanship with modern design. 
                What started as a passion project has grown into a renowned brand trusted by discerning customers worldwide.
              </p>
              <p className="text-gray-600">
                Every piece in our collection is meticulously handcrafted using only the finest Italian leather 
                and premium hardware. Our artisans bring decades of experience to each creation, ensuring that 
                every bag, wallet, and accessory meets our exacting standards of quality and durability.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-serif font-bold text-leather-800 mb-4">Our Craftsmanship</h2>
              <p className="text-gray-600 mb-4">
                At Crown Leather, we believe that true luxury lies in the details. Each piece undergoes 
                a rigorous 15-step quality control process, from the initial leather selection to the 
                final finishing touches. We use traditional techniques passed down through generations, 
                combined with modern innovations to create products that are both beautiful and functional.
              </p>
              <p className="text-gray-600">
                Our commitment to sustainability means we source our leather from certified tanneries 
                that adhere to the highest environmental standards. We believe in creating products 
                that not only look beautiful but also respect our planet.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-serif font-bold text-leather-800 mb-4">Our Promise</h2>
              <p className="text-gray-600 mb-4">
                When you choose Crown Leather, you're not just purchasing a product – you're investing 
                in a piece of art that will age beautifully and serve you for years to come. We stand 
                behind every item with our lifetime craftsmanship guarantee.
              </p>
              <p className="text-gray-600">
                Thank you for being part of our journey. We look forward to creating something 
                beautiful for you.
              </p>
            </div>
          </div>
        </div>
      </div>
      
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

export default About;