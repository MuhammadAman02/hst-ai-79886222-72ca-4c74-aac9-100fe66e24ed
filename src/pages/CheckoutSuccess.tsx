import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Mail, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { paymentIntent, cartItems, total, orderNumber } = location.state || {};

  console.log('CheckoutSuccess page rendered with order:', orderNumber);

  useEffect(() => {
    if (!paymentIntent || !cartItems || !orderNumber) {
      toast({
        title: "Invalid access",
        description: "No order information found. Redirecting to home page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Show success toast
    toast({
      title: "Order confirmed!",
      description: `Your order ${orderNumber} has been successfully placed.`,
    });
  }, [paymentIntent, cartItems, orderNumber, navigate, toast]);

  if (!paymentIntent || !cartItems || !orderNumber) {
    return null;
  }

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={0} onCartClick={() => {}} />
      
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-medium">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">{formatDate(Date.now())}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">Credit Card</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium">${total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>What's Next?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Order Confirmation</p>
                      <p className="text-sm text-gray-600">
                        You'll receive an email confirmation shortly with your order details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-gray-600">
                        Your order will be processed and prepared for shipping within 1-2 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-sm text-gray-600">
                        You'll receive tracking information once your order ships. Delivery typically takes 3-5 business days.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <Button 
                      onClick={handleViewOrders}
                      className="w-full bg-leather-700 hover:bg-leather-800"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Track Your Order
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleContinueShopping}
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Need Help?</h3>
                <p className="text-gray-600">
                  If you have any questions about your order, please don't hesitate to contact our customer service team.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;