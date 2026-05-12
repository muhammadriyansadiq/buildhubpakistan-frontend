'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Star, ShoppingCart, Heart, Zap,
  Wrench, CheckCircle2, ArrowRight, Flame, Clock, Truck, Shield, RefreshCw
} from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProduct';
import { useAddToCartMutation } from '@/hooks/useCart';
import { useGigs } from '@/hooks/useGigs';
import { Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import buildhubLogo from '../../../imports/buildhub.png';
import bestwayLogo from '../../../imports/bestway.png';
import luckyLogo from '../../../imports/lucky.png';
import ittefaqLogo from '../../../imports/ittefaq.png';
import princeLogo from '../../../imports/prince.png';
import iciLogo from '../../../imports/ici.png';
import abbLogo from '../../../imports/abb.webp';
import stileLogo from '../../../imports/stile.png';

const banners = [
  {
    id: 1,
    title: 'Monsoon Season Sale',
    subtitle: 'Up to 30% OFF on Cement & Steel',
    badge: 'Limited Offer',
    cta: 'Shop Now',
    img: 'https://images.unsplash.com/photo-1763926025477-423847028860?w=1200&h=400&fit=crop',
    overlay: 'rgba(13,46,94,0.75)',
  },
  {
    id: 2,
    title: 'Premium Tiles Collection',
    subtitle: 'Modern Designs for Every Space',
    badge: 'New Arrivals',
    cta: 'Explore Now',
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=1200&h=400&fit=crop',
    overlay: 'rgba(5,46,22,0.75)',
  },
  {
    id: 3,
    title: 'Find Skilled Professionals',
    subtitle: 'Engineers, Architects & Labor — Verified',
    badge: 'Services',
    cta: 'Browse Services',
    img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=1200&h=400&fit=crop',
    overlay: 'rgba(120,53,15,0.75)',
  },
];

// Categories will be fetched from API

// Mock services and brands remain as fallback or static info

// Mock services and brands remain as fallback or static info


const brands = [
  { name: 'Bestway', cat: 'Cement', color: '#1a4f8b', logo: bestwayLogo.src, local: true },
  { name: 'Lucky', cat: 'Cement', color: '#008374', logo: luckyLogo.src, local: true },
  { name: 'Ittefaq', cat: 'Steel', color: '#1e293b', logo: ittefaqLogo.src, local: true },
  { name: 'ICI Dulux', cat: 'Paints', color: '#e11d48', logo: iciLogo.src, local: true },
  { name: 'Shabbir Tiles', cat: 'Tiles', color: '#b91c1c', logo: stileLogo.src, local: true },
  { name: 'Prince', cat: 'Pipes', color: '#16a34a', logo: princeLogo.src, local: true },
  { name: 'Bosch', cat: 'Tools', color: '#dc2626', logo: 'https://ocsmedia.boschtools.com/media/professional/central_assets/bosch_logo/bosch.svg', local: true },
  { name: 'ABB', cat: 'Electric', color: '#ea580c', logo: abbLogo.src, local: true },
];

export default function BuyerHome() {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useState(() => {
    // We use useEffect to set hasMounted
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: gigsData, isLoading: gigsLoading } = useGigs({ limit: 4 });
  const products = Array.isArray(productsData) ? productsData : [];
  const categoriesList = Array.isArray(categoriesData) ? categoriesData.slice(0, 8) : [];
  const gigsList = gigsData?.data || [];

  const { mutateAsync: addToCart } = useAddToCartMutation();
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

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

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const discount = (orig: number, curr: number) => Math.round((1 - curr / orig) * 100);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: '360px' }}>
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-all duration-700"
            style={{ opacity: idx === currentBanner ? 1 : 0, zIndex: idx === currentBanner ? 1 : 0 }}
          >
            <img src={banner.img} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: banner.overlay }} />
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div className="max-w-lg">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ backgroundColor: '#ef4136' }}>
                  {banner.badge}
                </span>
                <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-2">{banner.title}</h2>
                <p className="text-white/80 text-base mb-5">{banner.subtitle}</p>
                <button
                  onClick={() => router.push('/product/1')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#ef4136', color: 'white' }}
                >
                  {banner.cta} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Banner navigation dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className="rounded-full transition-all"
              style={{ width: idx === currentBanner ? 24 : 8, height: 8, backgroundColor: idx === currentBanner ? '#ef4136' : 'rgba(255,255,255,0.5)' }}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          onClick={() => setCurrentBanner((p) => (p + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>

      {/* Trust strip */}
      <div style={{ backgroundColor: '#3e3e3e' }} className="py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-6 text-xs text-white">
          {[
            { icon: Shield, text: 'Verified Vendors Only' },
            { icon: Truck, text: 'Fast Shipping Nationwide' },
            { icon: CheckCircle2, text: 'Quality Guaranteed' },
            { icon: Clock, text: '48hr Order Fulfillment SLA' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <Icon size={14} style={{ color: '#ef4136' }} /> {text}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Browse by Category</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Explore our wide range of construction materials and services</p>
            </div>
            <button
              onClick={() => router.push('/categories')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm hover:gap-3 transition-all"
              style={{ backgroundColor: '#ef4136', color: 'white' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoriesLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border shadow-sm" style={{ borderColor: '#E2E8F0' }} />
              ))
            ) : categoriesList.length > 0 ? (
              categoriesList.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/category/${cat.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <div className="relative overflow-hidden" style={{ height: '140px' }}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
                          <ChevronRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-sm leading-tight line-clamp-1">{cat.title}</h3>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-[11px] mb-1 line-clamp-2 h-8" style={{ color: '#64748B' }}>
                      {cat.description || 'Quality products in this category'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: '#ef4136' }}>Explore</span>
                      <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#3e3e3e' }}>
                        Browse →
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">No categories found</div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame size={20} style={{ color: '#ef4136' }} />
              <h2 className="font-bold text-xl" style={{ color: '#3e3e3e' }}>Featured Products</h2>
              <img src={buildhubLogo.src} alt="BHP Logo" className="h-6 w-auto ml-1" />
            </div>
            <button
              onClick={() => router.push('/products')}
              className="text-sm font-medium flex items-center gap-1 hover:underline"
              style={{ color: '#ef4136' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {productsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border p-4 animate-pulse" style={{ borderColor: '#E2E8F0', height: '280px' }}>
                  <div className="w-full h-32 bg-gray-200 rounded-xl mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="w-8 h-8 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.slice(0, 12).map((product: any) => {
                const currentPrice = Number(product.price);
                const originalPrice = product.retail ? Number(product.retail) : currentPrice;
                const showDiscount = originalPrice > currentPrice;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div className="relative" style={{ height: '150px' }}>
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x280?text=No+Image'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onClick={() => router.push(`/product/${product.id}`)}
                      />
                      {/* Badge */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                        {product.category?.title || 'Featured'}
                      </span>
                      {/* Discount */}
                      {showDiscount && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                          -{discount(originalPrice, currentPrice)}%
                        </span>
                      )}
                      {/* Wishlist */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart
                          size={14}
                          style={{
                            fill: wishlist.includes(product.id) ? '#EF4444' : 'none',
                            color: wishlist.includes(product.id) ? '#EF4444' : '#64748B',
                          }}
                        />
                      </button>
                    </div>
                    <div className="p-3" onClick={() => router.push(`/product/${product.id}`)}>
                      <p className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>{product.brand || 'No Brand'}</p>
                      <p className="text-xs font-semibold leading-tight mb-1.5 h-8 line-clamp-2" style={{ color: '#1E293B' }}>{product.title}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={11} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                        <span style={{ color: '#64748B', fontSize: '11px' }}>4.5</span>
                        <span style={{ color: '#CBD5E1', fontSize: '11px' }}>(120)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold" style={{ color: '#3e3e3e', fontSize: '13px' }}>Rs. {hasMounted ? currentPrice.toLocaleString() : '...'}</span>
                          {showDiscount && (
                            <div style={{ color: '#94A3B8', fontSize: '11px', textDecoration: 'line-through' }}>
                              Rs. {hasMounted ? originalPrice.toLocaleString() : '...'}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, product.id)}
                          disabled={addingProductId === product.id}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          style={{ backgroundColor: '#ef4136' }}
                        >
                          {addingProductId === product.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ShoppingCart size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center">
                <RefreshCw size={48} className="mx-auto mb-4 animate-spin" style={{ color: '#CBD5E1' }} />
                <p className="text-lg font-semibold" style={{ color: '#64748B' }}>No products found</p>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Wrench size={20} style={{ color: '#10B981' }} />
              <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Top Services</h2>
              <img src={buildhubLogo.src} alt="BHP Logo" className="h-6 w-auto ml-1" />
            </div>
            <button
              onClick={() => router.push('/services')}
              className="text-sm font-medium flex items-center gap-1 hover:underline"
              style={{ color: '#ef4136' }}
            >
              Browse All Services <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gigsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border shadow-sm" style={{ borderColor: '#E2E8F0' }} />
              ))
            ) : gigsList.length > 0 ? (
              gigsList.map((gig) => (
                <div 
                  key={gig.id} 
                  onClick={() => router.push(`/services/${gig.id}`)}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer group" 
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <div className="relative" style={{ height: '120px' }}>
                    <img 
                      src={gig.images && gig.images.length > 0 ? gig.images[0] : 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=200&h=150&fit=crop'} 
                      alt={gig.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                      {gig.category?.title || 'Service'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#1E293B' }}>{gig.title}</h3>
                    <p className="text-xs mb-2" style={{ color: '#64748B' }}>by {gig.user?.fullName || 'Verified Provider'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1" style={{ color: '#F59E0B' }}>
                        <Star size={11} style={{ fill: '#F59E0B' }} /> 5.0
                      </span>
                      <span className="text-xs font-semibold" style={{ color: '#ef4136' }}>From Rs. {hasMounted ? Number(gig.price).toLocaleString() : '...'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">No services found</div>
            )}
          </div>
        </section>

        {/* Brands */}
        <section className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Trusted by Top Brands</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Shop from Pakistan's leading construction material brands</p>
            </div>
            <button className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: '#ef4136' }}>
              View All Brands <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 lg:gap-6">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="group flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-full aspect-square rounded-2xl flex items-center justify-center p-4 border-2 hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-white"
                  style={{ borderColor: '#F1F5F9' }}
                >
                  {/* Brand Visual */}
                  {(brand as any).local ? (
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="w-16 h-auto object-contain z-10 group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md z-10 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: brand.color }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                  )}
                  
                  {/* Subtle Context Image */}
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity"
                  />
                  
                  {/* Hover Overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{ backgroundColor: brand.color }}
                  />
                </div>
                <div className="text-center overflow-hidden w-full">
                  <p className="font-bold text-[11px] truncate" style={{ color: '#334155' }}>{brand.name}</p>
                  <p className="text-[9px] uppercase tracking-wider font-semibold opacity-60" style={{ color: brand.color }}>{brand.cat}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Vendor Banner */}
        <section
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0d2e5e 0%, #1e4080 100%)', padding: '40px 32px' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-white font-bold text-2xl mb-2">Start Selling on Build Hub Pakistan</h2>
              <p className="text-white/70">Join 5,000+ vendors and reach millions of construction buyers across Pakistan</p>
              <div className="flex items-center gap-4 mt-3">
                {['Free to register', 'Verified buyers', '24/7 support'].map((t) => (
                  <span key={t} className="text-xs text-white/60 flex items-center gap-1">
                    <CheckCircle2 size={12} style={{ color: '#ef4136' }} /> {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3.5 rounded-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ backgroundColor: '#ef4136' }}
            >
              <Zap size={18} /> Register as Vendor
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
