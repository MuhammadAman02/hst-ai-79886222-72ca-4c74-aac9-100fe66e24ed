import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { CartItem } from '@/components/Cart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  console.log('Checkout page rendered');

  useEffect(() => {
    // Get cart items from location state or redirect if empty
    const items = location.state?.cartItems || [];
    
    if (items.length === 0) {
      toast({
        title: "No items to checkout",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setCartItems(items);
  }, [location.state, navigate, toast]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful, redirecting to success page');
    
    // Navigate to success page with order details
    navigate('/checkout/success', {
      state: {
        paymentIntent,
        cartItems,
        total: total * 1.08, // Include tax
        orderNumber: `ORD-${Date.now()}`
      }
    });
  };

  const handleCancel = () => {
    console.log('Checkout cancelled, returning to cart');
    navigate('/', { state: { cartItems } });
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header 
          cartItemsCount={cartItemsCount} 
          onCartClick={() => setIsCartOpen(true)} 
        />
        
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-serif font-bold text-leather-800 mb-4">
              Please Sign In
            </h1>
            <p className="text-lg text-gray-600">
              You need to be signed in to complete your purchase.
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={cartItemsCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-leather-800 mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600">
              Complete your purchase securely with Stripe
            </p>
          </div>

          <CheckoutForm
            cartItems={cartItems}
            total={total}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;