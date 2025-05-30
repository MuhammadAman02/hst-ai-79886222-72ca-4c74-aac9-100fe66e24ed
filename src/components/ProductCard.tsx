import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  console.log('ProductCard rendered for:', product.name);

  const handleAddToCart = () => {
    console.log('Adding to cart:', product);
    onAddToCart(product);
  };

  return (
    <Card className="group hover-lift luxury-shadow border-0 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4 text-leather-700" />
          </Button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-gold-600 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-serif font-semibold text-leather-800 mb-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-leather-800">
            ${product.price}
          </span>
          
          <Button 
            onClick={handleAddToCart}
            className="bg-leather-700 hover:bg-leather-800 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;