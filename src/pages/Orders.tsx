import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart, { CartItem } from '@/components/Cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserOrder {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const Orders = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  console.log('Orders page rendered for user:', user?.email);

  // Sample order data - in a real app, this would come from an API
  const userOrders: UserOrder[] = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15T10:30:00Z',
      status: 'delivered',
      total: 388.00,
      items: [
        {
          id: 1,
          name: 'Classic Leather Handbag',
          price: 299,
          quantity: 1,
          image: 'https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/a3d02df0-5b37-48cb-a51a-6616b39f1b36.png'
        },
        {
          id: 3,
          name: 'Vintage Wallet',
          price: 89,
          quantity: 1,
          image: 'https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/3dd0aa11-9b12-407e-863e-fa01c2b4d1e6.png'
        }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20T14:15:00Z',
      status: 'shipped',
      total: 449.00,
      items: [
        {
          id: 2,
          name: 'Executive Briefcase',
          price: 449,
          quantity: 1,
          image: 'https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/4c513aca-6933-4c0a-9205-f3949a53a651.png'
        }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-25T09:45:00Z',
      status: 'processing',
      total: 124.00,
      items: [
        {
          id: 4,
          name: 'Leather Belt',
          price: 79,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop&crop=center&auto=format&q=80'
        },
        {
          id: 6,
          name: 'Card Holder',
          price: 45,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&crop=center&auto=format&q=80'
        }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    }
  ];

  const getStatusIcon = (status: UserOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: UserOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
              You need to be signed in to view your orders.
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        cartItemsCount={cartItemsCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-leather-800 mb-4">
              My Orders
            </h1>
            <p className="text-lg text-gray-600">
              Track and manage your Crown Leather orders
            </p>
          </div>

          {/* Order Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${userOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userOrders.filter(order => order.status === 'delivered').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {userOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Ordered on {formatDate(order.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-bold text-leather-800">${order.total.toFixed(2)}</p>
                      </div>
                      
                      <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-leather-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>Shipping to:</p>
                      <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {userOrders.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  Start shopping to see your orders here.
                </p>
                <Button className="bg-leather-700 hover:bg-leather-800">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
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

export default Orders;