import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, X, CreditCard } from 'lucide-react';
import { Product } from './ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  console.log('Cart rendered with items:', cartItems);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    console.log('Updating quantity for item', id, 'to', newQuantity);
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    console.log('Stripe checkout initiated');
    
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Close cart and navigate to checkout page
      onClose();
      navigate('/checkout', {
        state: { cartItems }
      });
      
      console.log('Navigated to Stripe checkout page');
    } catch (error) {
      console.error('Checkout navigation error:', error);
      toast({
        title: "Checkout error",
        description: "Failed to proceed to checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl font-serif text-leather-800">
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button onClick={onClose} className="bg-leather-700 hover:bg-leather-800">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-leather-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="font-semibold text-leather-800">${item.price}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-leather-800">Subtotal:</span>
                    <span className="text-xl font-bold text-leather-800">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-medium text-leather-800 pt-2 border-t">
                      <span>Total:</span>
                      <span>${(total * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gold-500 hover:bg-gold-600 text-leather-900 font-semibold"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-leather-900 mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Secure Checkout with Stripe
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={onClose}>
                      Continue Shopping
                    </Button>
                  </div>
                  
                  <div className="text-center text-xs text-gray-500">
                    <p>Secure payment powered by Stripe</p>
                    <p>SSL encrypted • PCI compliant</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;