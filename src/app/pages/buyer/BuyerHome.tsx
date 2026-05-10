'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Star, ShoppingCart, Heart, Zap,
  Wrench, CheckCircle2, ArrowRight, Flame, Clock, Truck, Shield, RefreshCw
} from 'lucide-react';
import { useProducts } from '@/hooks/useProduct';

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

const categories = [
  {
    id: 'cement-concrete',
    name: 'Cement & Concrete',
    count: '2.4K+ products',
    img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=400&h=300&fit=crop',
    description: 'All types of cement and concrete materials'
  },
  {
    id: 'steel-metal',
    name: 'Steel & Metal',
    count: '1.8K+ products',
    img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=400&h=300&fit=crop',
    description: 'TMT bars, angle iron, sheets & more'
  },
  {
    id: 'tiles-flooring',
    name: 'Tiles & Flooring',
    count: '3.2K+ products',
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=400&h=300&fit=crop',
    description: 'Floor, wall, and decorative tiles'
  },
  {
    id: 'paints-coatings',
    name: 'Paints & Coatings',
    count: '980+ products',
    img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=400&h=300&fit=crop',
    description: 'Interior & exterior paints'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    count: '1.1K+ products',
    img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=400&h=300&fit=crop',
    description: 'Pipes, fittings, and fixtures'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    count: '760+ products',
    img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=400&h=300&fit=crop',
    description: 'Wires, switches, and electrical supplies'
  },
  {
    id: 'tools-hardware',
    name: 'Tools & Hardware',
    count: '540+ products',
    img: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=400&h=300&fit=crop',
    description: 'Power tools and hand tools'
  },
  {
    id: 'services',
    name: 'Professional Services',
    count: '200+ providers',
    img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=400&h=300&fit=crop',
    description: 'Engineers, architects & labor'
  },
];

// Mock services and brands remain as fallback or static info

const services = [
  { id: 1, name: 'Structural Engineering', provider: 'Eng. Ahmad Raza', rating: 4.9, price: 'From Rs. 15,000', location: 'Lahore', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=200&h=150&fit=crop', badge: 'Top Rated', priceMin: 15000 },
  { id: 2, name: 'Interior Architecture', provider: 'Arch. Fatima Khan', rating: 4.8, price: 'From Rs. 8,000', location: 'Karachi', img: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=200&h=150&fit=crop', badge: 'Featured', priceMin: 8000 },
  { id: 3, name: 'Electrical Installation', provider: 'M. Ali Electric Co.', rating: 4.6, price: 'From Rs. 5,000', location: 'Islamabad', img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=200&h=150&fit=crop', badge: 'Verified', priceMin: 5000 },
  { id: 4, name: 'Plumbing Services', provider: 'Khan Plumbers', rating: 4.5, price: 'From Rs. 3,000', location: 'Lahore', img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=200&h=150&fit=crop', badge: 'Popular', priceMin: 3000 },
  { id: 5, name: 'Civil Engineering', provider: 'Eng. Bilal Ahmed', rating: 4.7, price: 'From Rs. 12,000', location: 'Rawalpindi', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=200&h=150&fit=crop', badge: 'Certified', priceMin: 12000 },
  { id: 6, name: 'HVAC Installation', provider: 'Cool Tech Services', rating: 4.4, price: 'From Rs. 6,000', location: 'Karachi', img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=200&h=150&fit=crop', badge: 'Expert', priceMin: 6000 },
  { id: 7, name: 'Masonry Work', provider: 'Master Builders', rating: 4.6, price: 'From Rs. 4,000', location: 'Lahore', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=200&h=150&fit=crop', badge: 'Reliable', priceMin: 4000 },
  { id: 8, name: 'Painting & Finishing', provider: 'Pro Painters', rating: 4.3, price: 'From Rs. 2,500', location: 'Islamabad', img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=200&h=150&fit=crop', badge: 'Quality', priceMin: 2500 },
];

const brands = [
  { name: 'Bestway', cat: 'Cement', products: '2.4K+', color: '#FFA726', bgColor: '#FFF3E0' },
  { name: 'Lucky', cat: 'Cement', products: '1.8K+', color: '#26A69A', bgColor: '#E0F2F1' },
  { name: 'Ittefaq', cat: 'Steel', products: '1.2K+', color: '#5C6BC0', bgColor: '#E8EAF6' },
  { name: 'ICI Dulux', cat: 'Paints', products: '980+', color: '#AB47BC', bgColor: '#F3E5F5' },
  { name: 'Master Tiles', cat: 'Tiles', products: '3.2K+', color: '#42A5F5', bgColor: '#E3F2FD' },
  { name: 'Prince', cat: 'Plumbing', products: '1.1K+', color: '#66BB6A', bgColor: '#E8F5E9' },
  { name: 'Bosch', cat: 'Tools', products: '540+', color: '#EF5350', bgColor: '#FFEBEE' },
  { name: 'ABB', cat: 'Electrical', products: '760+', color: '#FFA726', bgColor: '#FFF3E0' },
];

export default function BuyerHome() {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const products = Array.isArray(productsData) ? productsData : [];

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
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/category/${cat.id}`)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                style={{ borderColor: '#E2E8F0' }}
              >
                <div className="relative overflow-hidden" style={{ height: '140px' }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
                        <ChevronRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs mb-1" style={{ color: '#64748B' }}>{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: '#ef4136' }}>{cat.count}</span>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#3e3e3e' }}>
                      Browse →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame size={20} style={{ color: '#ef4136' }} />
              <h2 className="font-bold text-xl" style={{ color: '#3e3e3e' }}>Featured Products</h2>
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
                          <span className="font-bold" style={{ color: '#3e3e3e', fontSize: '13px' }}>Rs. {currentPrice.toLocaleString()}</span>
                          {showDiscount && (
                            <div style={{ color: '#94A3B8', fontSize: '11px', textDecoration: 'line-through' }}>
                              Rs. {originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#ef4136' }}
                        >
                          <ShoppingCart size={14} />
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
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer" style={{ borderColor: '#E2E8F0' }}>
                <div className="relative" style={{ height: '120px' }}>
                  <img src={service.img} alt={service.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#10B981' }}>
                    {service.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#1E293B' }}>{service.name}</h3>
                  <p className="text-xs mb-2" style={{ color: '#64748B' }}>by {service.provider}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs flex items-center gap-1" style={{ color: '#F59E0B' }}>
                      <Star size={11} style={{ fill: '#F59E0B' }} /> {service.rating}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
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

          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="group flex-shrink-0 cursor-pointer"
              >
                <div className="relative">
                  {/* Brand Logo Card */}
                  <div
                    className="w-40 h-28 rounded-2xl flex flex-col items-center justify-center p-4 border-2 hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                  >
                    {/* Gradient background on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${brand.bgColor} 0%, white 100%)`
                      }}
                    />

                    {/* Logo */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: brand.color }}
                      >
                        <span className="text-white font-bold text-lg">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm" style={{ color: '#3e3e3e' }}>{brand.name}</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>{brand.cat}</p>
                      </div>
                    </div>

                    {/* Decorative circle */}
                    <div
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
                      style={{ backgroundColor: brand.color }}
                    />
                  </div>

                  {/* Product count badge */}
                  <div
                    className="absolute -top-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold shadow-md"
                    style={{ backgroundColor: brand.color, color: 'white' }}
                  >
                    {brand.products}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation hint */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {brands.slice(0, 4).map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: idx === 0 ? '#ef4136' : '#E2E8F0' }}
              />
            ))}
          </div>
        </section>

        {/* CTA Vendor Banner */}
        <section
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #3e3e3e 0%, #1a1a1a 100%)', padding: '40px 32px' }}
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
