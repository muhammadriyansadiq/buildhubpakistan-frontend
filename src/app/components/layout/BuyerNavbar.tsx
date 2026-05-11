'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, ShoppingCart, Heart, User, Bell, Menu, X,
  MapPin, Phone, Package, Wrench, LogOut
} from 'lucide-react';
import logoSvg from '@/imports/buildhub.png';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/api/api-client';
import { useCart } from '@/hooks/useCart';

export default function BuyerNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: cartItems } = useCart();
  const cartCount = cartItems?.length || 0;
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Fetch fresh user data from API
      if (parsedUser.id) {
        apiClient.get(`/users/${parsedUser.id}`)
          .then(response => {
            if (response.data.success) {
              const userData = response.data.data;
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          })
          .catch(error => {
            console.error('Error fetching fresh user data:', error);
          });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="shadow-md">
      {/* Top bar */}
      <div style={{ backgroundColor: '#3e3e3e' }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-white/70">
              <Phone size={12} /> +92 300 0000000
            </span>
            <span className="flex items-center gap-1 text-white/70">
              <MapPin size={12} /> Lahore, Pakistan
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => router.push('/vendor/dashboard')}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <Package size={12} /> Sell on BHP
            </button>
            <button
              onClick={() => router.push('/service/dashboard')}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <Wrench size={12} /> Offer Services
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button onClick={() => router.push('/')} className="flex items-center gap-2 flex-shrink-0">
              <img src={logoSvg.src} alt="BHP Logo" className="h-8 w-auto" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-4xl">
              <div className="flex rounded-lg overflow-hidden border-2" style={{ borderColor: '#ef4136' }}>
                <div className="flex items-center pl-3 pr-2 bg-white">
                  <select className="text-xs text-gray-600 bg-transparent border-r pr-2 border-gray-200 outline-none cursor-pointer">
                    <option>All</option>
                    <option>Products</option>
                    <option>Services</option>
                    <option>Brands</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, services, brands..."
                  className="flex-1 px-3 py-2.5 bg-white text-sm text-gray-700 outline-none"
                />
                <button
                  style={{ backgroundColor: '#ef4136' }}
                  className="px-5 flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline text-sm">Search</span>
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push('/buyer/dashboard/orders')}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <Bell size={20} />
                <span className="text-xs hidden md:block">Alerts</span>
              </button>
              <button
                onClick={() => router.push('/buyer/dashboard/wishlist')}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <Heart size={20} />
                <span className="text-xs hidden md:block">Wishlist</span>
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 relative cursor-pointer"
              >
                <ShoppingCart size={20} />
                <span className="text-xs hidden md:block">Cart</span>
                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ fontSize: '10px', backgroundColor: '#ef4136' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <LogOut size={20} />
                  <span className="text-xs hidden md:block">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Login</span>
                </button>
              )}

              {user && (
                <button
                  onClick={() => router.push('/buyer/dashboard')}
                  className="flex items-center gap-2.5 px-3 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  {user.logo ? (
                    <img
                      src={user.logo}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <div className="flex flex-col items-start -space-y-0.5">
                    <span className="text-[11px] font-semibold hidden md:block truncate max-w-[100px]">
                      {user.fullName || 'Account'}
                    </span>
                    <span className="text-[10px] opacity-60 hidden lg:block truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden px-2 py-1.5 text-white"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#000000' }} className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => router.push('/buyer/dashboard/orders')}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-sm"
            >
              <Bell size={16} /> Orders & Alerts
            </button>
            <button
              onClick={() => router.push('/buyer/dashboard/wishlist')}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-sm"
            >
              <Heart size={16} /> Wishlist
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-sm"
            >
              <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
            </button>
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
                <button
                  onClick={() => router.push('/buyer/dashboard')}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-sm"
                >
                  {user.logo ? (
                    <img
                      src={user.logo}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <User size={18} />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{user.fullName || 'My Account'}</span>
                    <span className="text-[10px] opacity-50">{user.email}</span>
                  </div>
                </button>

              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md text-sm"
              >
                <User size={16} /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}