import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  console.log('Footer component rendered');

  return (
    <footer className="bg-leather-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 text-gold-400">
              Crown Leather
            </h3>
            <p className="text-gray-300 mb-4">
              Crafting premium leather goods with timeless elegance and uncompromising quality since 1985.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-gold-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-gold-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-gold-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Craftsmanship</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Care Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Handbags</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Wallets</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Belts</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gold-400" />
                <span className="text-gray-300 text-sm">123 Leather Street, Craft City, CC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gold-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gold-400" />
                <span className="text-gray-300 text-sm">info@crownleather.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-leather-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Crown Leather. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;