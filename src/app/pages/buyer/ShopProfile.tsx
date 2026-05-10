'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser
} from '@/hooks/useAuth';
import {
  useProducts
} from '@/hooks/useProduct';
import {
  Star, MapPin, Mail, Calendar, CheckCircle2, Building2,
  ShoppingCart, Heart, Loader2, RefreshCw, ChevronRight,
  Package, Globe, Shield, Zap, Search, Filter, User, Phone
} from 'lucide-react';
import { useAddToCartMutation } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ShopProfileProps {
  sellerId: number;
}

export default function ShopProfile({ sellerId }: ShopProfileProps) {
  const router = useRouter();
  const { data: vendor, isLoading: userLoading, isError: userError } = useUser(sellerId);
  const { data: productsData, isLoading: productsLoading } = useProducts({ sellerId });

  const products = Array.isArray(productsData) ? productsData : [];
  const { mutateAsync: addToCart } = useAddToCartMutation();
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setAddingProductId(productId);
    try {
      await addToCart({ productId, quantity: 1 });
      toast.success('Product added to cart');
    } catch (error) {
      // Error is handled by apiClient toast
    } finally {
      setAddingProductId(null);
    }
  };

  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (userLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <RefreshCw size={48} className="animate-spin text-[#0D2E5E] mb-4" />
        <p className="text-sm font-bold text-gray-500 animate-pulse">Loading Shop Profile...</p>
      </div>
    );
  }

  if (userError || !vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Shield size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-[#0D2E5E] mb-2">Shop Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">The store you are looking for might have been removed or the ID is invalid.</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[#0D2E5E] text-white rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Shop Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#0D2E5E]">
        {vendor.shopCoverImage && (
          <img
            src={vendor.shopCoverImage}
            className="w-full h-full object-cover opacity-80"
            alt="Banner"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2E5E]/80 to-transparent" />
      </div>

      {/* Shop Profile Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-20 z-10 flex flex-col md:flex-row md:items-end gap-6 mb-10 pb-8 border-b border-gray-200">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] bg-white p-2 shadow-2xl border-4 border-white flex-shrink-0">
            <div className="w-full h-full rounded-[24px] overflow-hidden bg-gray-50 flex items-center justify-center">
              {vendor.logo ? (
                <img src={vendor.logo} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <Building2 size={48} className="text-[#0D2E5E] opacity-20" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-4 ">
            <div className="flex flex-wrap items-center gap-3 ">
              <h1 className="text-3xl md:text-4xl font-black text-white md:text-[#0D2E5E] drop-shadow-sm md:drop-shadow-none">
                {vendor.shopName || 'BuildHub Official Partner'}
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 shadow-sm">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified Vendor</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
              {vendor.businessAddress && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={16} className="text-[#ef4136]" />
                  <span className="text-sm font-semibold">{vendor.businessAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-sm font-semibold">Joined {new Date(vendor.createdAt).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pb-4">
            <button className="px-6 py-3 bg-[#0D2E5E] text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-900/20">
              <Zap size={18} /> Follow Store
            </button>
            <button className="p-3 bg-white text-[#0D2E5E] border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <Globe size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Shop Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border shadow-sm space-y-6" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-bold text-[#0D2E5E] flex items-center gap-2">
                <Shield size={18} className="text-[#ef4136]" /> Vendor Verification
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Business Owner</p>
                    <p className="text-sm font-bold text-[#0D2E5E]">{vendor.fullName || 'Verified Member'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-green-500">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Products</p>
                    <p className="text-sm font-bold text-[#0D2E5E]">{products.length} Items Listed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-purple-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Member Since</p>
                    <p className="text-sm font-bold text-[#0D2E5E]">
                      {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }) : 'Joined BuildHub'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-bold text-[#0D2E5E] mb-4">Contact & Support</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Mail size={16} className="text-[#ef4136] mt-1 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-gray-700 font-medium truncate">{vendor.email}</p>
                  </div>
                </div>
                {vendor.businessAddress && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={16} className="text-[#ef4136] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Location</p>
                      <p className="text-gray-700 font-medium leading-tight">{vendor.businessAddress}</p>
                    </div>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-start gap-3 text-sm">
                    <Phone size={16} className="text-[#ef4136] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-gray-700 font-medium">{vendor.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in this store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#0D2E5E] transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <Filter size={16} /> Filters
                </button>
                <div className="text-sm font-bold text-[#0D2E5E]">
                  {filteredProducts.length} Products Found
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const currentPrice = Number(product.price);
                  const originalPrice = product.retail ? Number(product.retail) : currentPrice;
                  const hasDiscount = originalPrice > currentPrice;
                  const discountPercent = hasDiscount ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={product.images?.[0] || 'https://placehold.co/300x300?text=Product'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt={product.title}
                        />
                        {hasDiscount && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#ef4136] text-white text-[10px] font-black rounded-lg">
                            -{discountPercent}% OFF
                          </div>
                        )}
                        <button
                          onClick={(e) => toggleWishlist(e, product.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:scale-110 transition-all"
                        >
                          <Heart
                            size={14}
                            className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                          />
                        </button>
                      </div>

                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#ef4136] uppercase tracking-wider mb-1">{product.brand || 'Premium'}</p>
                        <h4 className="text-sm font-bold text-[#0D2E5E] line-clamp-2 h-10 mb-3 group-hover:text-[#ef4136] transition-colors">
                          {product.title}
                        </h4>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400 line-through">
                              {hasDiscount && `Rs. ${originalPrice.toLocaleString()}`}
                            </p>
                            <p className="text-base font-black text-[#0D2E5E]">
                              Rs. {currentPrice.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            disabled={addingProductId === product.id}
                            className="w-10 h-10 rounded-xl bg-[#0D2E5E] text-white flex items-center justify-center hover:bg-[#ef4136] transition-all shadow-lg shadow-blue-900/10"
                          >
                            {addingProductId === product.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ShoppingCart size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Package size={40} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0D2E5E] mb-2">No Products Available</h3>
                <p className="text-gray-500 max-w-sm">This vendor hasn't listed any products matching your search yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
