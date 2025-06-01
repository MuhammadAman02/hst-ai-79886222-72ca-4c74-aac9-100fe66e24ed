import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Eye, 
  Search, 
  Mail,
  User,
  Calendar,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { useAdmin, Customer } from '@/contexts/AdminContext';

const CustomersTab = () => {
  const { customers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);

  console.log('CustomersTab rendered with', customers.length, 'customers');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleViewCustomer = (customer: Customer) => {
    console.log('Viewing customer:', customer.id);
    setSelectedCustomer(customer);
    setIsCustomerDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000) return { tier: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (totalSpent >= 500) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 200) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-600">Manage customer accounts and view purchase history</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Spent</p>
                <p className="text-2xl font-bold">
                  ${customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(0) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.totalSpent >= 1000).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
              const tierInfo = getCustomerTier(customer.totalSpent);
              return (
                <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-leather-700 text-white rounded-full flex items-center justify-center font-medium">
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                      </div>
                      
                      <div>
                        <p className="font-medium text-lg">{customer.firstName} {customer.lastName}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {customer.email}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Joined</p>
                        <p className="font-medium">{formatDate(customer.createdAt)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="font-medium">{customer.totalOrders}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="font-medium">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Last Order</p>
                        <p className="font-medium">
                          {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={tierInfo.color}>
                        {tierInfo.tier}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No customers found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-10 h-10 bg-leather-700 text-white rounded-full flex items-center justify-center font-medium">
                      {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
                    </div>
                    <span>{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-medium">{selectedCustomer.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{formatDate(selectedCustomer.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer Tier</p>
                    <Badge className={getCustomerTier(selectedCustomer.totalSpent).color}>
                      {getCustomerTier(selectedCustomer.totalSpent).tier}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Purchase Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      ${selectedCustomer.totalOrders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-gray-600">Avg. Order Value</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Last Order</p>
                          <p className="text-sm text-gray-600">
                            {selectedCustomer.lastOrderDate ? formatDate(selectedCustomer.lastOrderDate) : 'No orders yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Account Created</p>
                          <p className="text-sm text-gray-600">{formatDate(selectedCustomer.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersTab;