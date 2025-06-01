import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderDate?: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  orders: Order[];
  customers: Customer[];
  products: AdminProduct[];
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    recentOrders: Order[];
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
  };
  adminSignIn: (email: string, password: string) => Promise<void>;
  adminSignOut: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateProduct: (productId: number, updates: Partial<AdminProduct>) => void;
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteProduct: (productId: number) => void;
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const { toast } = useToast();

  console.log('AdminProvider initialized');

  // Initialize with mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    console.log('Initializing admin mock data');
    
    // Mock orders
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        items: [
          { id: 1, name: 'Classic Leather Handbag', price: 299, quantity: 1, image: 'https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/a3d02df0-5b37-48cb-a51a-6616b39f1b36.png' }
        ],
        total: 299,
        status: 'processing',
        createdAt: '2024-01-15T10:30:00Z',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        items: [
          { id: 2, name: 'Executive Briefcase', price: 449, quantity: 1, image: 'https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/4c513aca-6933-4c0a-9205-f3949a53a651.png' },
          { id: 3, name: 'Vintage Wallet', price: 89, quantity: 2, image: 'https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/3dd0aa11-9b12-407e-863e-fa01c2b4d1e6.png' }
        ],
        total: 627,
        status: 'shipped',
        createdAt: '2024-01-14T15:45:00Z',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      }
    ];

    // Mock customers
    const mockCustomers: Customer[] = [
      {
        id: 'CUST-001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        totalOrders: 3,
        totalSpent: 847,
        createdAt: '2023-12-01T00:00:00Z',
        lastOrderDate: '2024-01-15T10:30:00Z'
      },
      {
        id: 'CUST-002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        totalOrders: 2,
        totalSpent: 627,
        createdAt: '2023-11-15T00:00:00Z',
        lastOrderDate: '2024-01-14T15:45:00Z'
      }
    ];

    // Mock products
    const mockProducts: AdminProduct[] = [
      {
        id: 1,
        name: "Classic Leather Handbag",
        price: 299,
        image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/a3d02df0-5b37-48cb-a51a-6616b39f1b36.png",
        category: "Handbags",
        description: "Elegant handcrafted leather handbag perfect for everyday use. Features premium Italian leather and gold-tone hardware.",
        stock: 25,
        isActive: true,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 2,
        name: "Executive Briefcase",
        price: 449,
        image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/4c513aca-6933-4c0a-9205-f3949a53a651.png",
        category: "Bags",
        description: "Professional leather briefcase with multiple compartments. Ideal for business professionals who value style and functionality.",
        stock: 15,
        isActive: true,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 3,
        name: "Vintage Wallet",
        price: 89,
        image: "https://hstengineer.lon1.digitaloceanspaces.com/messages/hst-ai-79886222-72ca-4c74-aac9-100fe66e24ed/attachments/3dd0aa11-9b12-407e-863e-fa01c2b4d1e6.png",
        category: "Wallets",
        description: "Compact leather wallet with RFID protection. Features multiple card slots and a bill compartment.",
        stock: 50,
        isActive: true,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      }
    ];

    setOrders(mockOrders);
    setCustomers(mockCustomers);
    setProducts(mockProducts);
  };

  const adminSignIn = async (email: string, password: string) => {
    console.log('Admin sign in attempt:', email);
    
    // Mock admin authentication
    if (email === 'admin@crownleather.com' && password === 'admin123') {
      const admin: AdminUser = {
        id: 'admin-1',
        email: 'admin@crownleather.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        createdAt: '2023-01-01T00:00:00Z'
      };
      
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuth', JSON.stringify(admin));
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const adminSignOut = () => {
    console.log('Admin signing out');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    console.log('Updating order status:', orderId, status);
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Order updated",
      description: `Order ${orderId} status changed to ${status}`,
    });
  };

  const updateProduct = (productId: number, updates: Partial<AdminProduct>) => {
    console.log('Updating product:', productId, updates);
    setProducts(prev =>
      prev.map(product =>
        product.id === productId 
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    );
    
    toast({
      title: "Product updated",
      description: "Product has been updated successfully",
    });
  };

  const addProduct = (product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Adding new product:', product);
    const newProduct: AdminProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    toast({
      title: "Product added",
      description: "New product has been added successfully",
    });
  };

  const deleteProduct = (productId: number) => {
    console.log('Deleting product:', productId);
    setProducts(prev => prev.filter(product => product.id !== productId));
    
    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully",
    });
  };

  const refreshData = () => {
    console.log('Refreshing admin data');
    initializeMockData();
  };

  // Calculate analytics
  const analytics = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    recentOrders: orders.slice(0, 5),
    topProducts: [
      { name: 'Classic Leather Handbag', sales: 15, revenue: 4485 },
      { name: 'Executive Briefcase', sales: 8, revenue: 3592 },
      { name: 'Vintage Wallet', sales: 25, revenue: 2225 }
    ]
  };

  // Check for existing admin session
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminAuth');
    if (savedAdmin) {
      try {
        const admin = JSON.parse(savedAdmin);
        setAdminUser(admin);
        setIsAdminAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved admin auth:', error);
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const value: AdminContextType = {
    isAdminAuthenticated,
    adminUser,
    orders,
    customers,
    products,
    analytics,
    adminSignIn,
    adminSignOut,
    updateOrderStatus,
    updateProduct,
    addProduct,
    deleteProduct,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};