import { useState, useEffect } from 'react';
import { useStripe as useStripeHook, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, MapPin, User, Mail } from 'lucide-react';
import { useStripe } from '@/contexts/StripeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/components/Cart';

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  onPaymentSuccess: (paymentIntent: any) => void;
  onCancel: () => void;
}

const CheckoutForm = ({ cartItems, total, onPaymentSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripeHook();
  const elements = useElements();
  const { createPaymentIntent, confirmPayment, isProcessing, setProcessing } = useStripe();
  const { user } = useAuth();
  const { toast } = useToast();

  const [billingDetails, setBillingDetails] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });

  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  console.log('CheckoutForm rendered with total:', total, 'items:', cartItems.length);

  useEffect(() => {
    // Create payment intent when component mounts
    const initializePayment = async () => {
      try {
        const intent = await createPaymentIntent(total, cartItems);
        setPaymentIntent(intent);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        toast({
          title: "Payment initialization failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
    };

    if (cartItems.length > 0 && total > 0) {
      initializePayment();
    }
  }, [total, cartItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Processing payment...');

    if (!stripe || !elements || !paymentIntent) {
      console.error('Stripe not loaded or payment intent missing');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('Card element not found');
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (paymentMethodError) {
        console.error('Payment method creation failed:', paymentMethodError);
        setCardError(paymentMethodError.message || 'Payment method creation failed');
        setProcessing(false);
        return;
      }

      console.log('Payment method created:', paymentMethod);

      // Confirm payment
      const { error: confirmError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: paymentMethod.id
        }
      );

      if (confirmError) {
        console.error('Payment confirmation failed:', confirmError);
        setCardError(confirmError.message || 'Payment failed');
        
        toast({
          title: "Payment failed",
          description: confirmError.message || "Please try again with a different payment method.",
          variant: "destructive",
        });
      } else if (confirmedPaymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', confirmedPaymentIntent);
        
        toast({
          title: "Payment successful!",
          description: `Your order of $${total.toFixed(2)} has been processed successfully.`,
        });

        onPaymentSuccess(confirmedPaymentIntent);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setCardError('An unexpected error occurred. Please try again.');
      
      toast({
        title: "Payment error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Secure Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          name="name"
                          value={billingDetails.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          name="email"
                          value={billingDetails.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        name="address.line1"
                        value={billingDetails.address.line1}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <Input
                        name="address.city"
                        value={billingDetails.address.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <Input
                        name="address.state"
                        value={billingDetails.address.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">ZIP Code</label>
                      <Input
                        name="address.postal_code"
                        value={billingDetails.address.postal_code}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Details</label>
                    <div className="p-3 border rounded-md">
                      <CardElement options={cardElementOptions} />
                    </div>
                    {cardError && (
                      <p className="text-red-600 text-sm mt-2">{cardError}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    className="flex-1 bg-leather-700 hover:bg-leather-800"
                    disabled={!stripe || isProcessing || !paymentIntent}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Pay $${(total * 1.08).toFixed(2)}`
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Your payment information is secure and encrypted
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;