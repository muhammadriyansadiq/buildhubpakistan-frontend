'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, SlidersHorizontal, Star, Heart, ShoppingCart,
  Grid3x3, List, X, ChevronDown
} from 'lucide-react';

const allProducts = [
  { id: 1, name: 'OPC Cement 50kg', brand: 'Bestway', price: 1200, originalPrice: 1400, rating: 4.5, reviews: 234, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Best Seller', category: 'Cement', vendor: 'Ahmed Materials' },
  { id: 2, name: 'TMT Steel Bar 10mm', brand: 'Ittefaq', price: 8500, originalPrice: 9200, rating: 4.3, reviews: 89, img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=300&h=280&fit=crop', badge: 'Hot Deal', category: 'Steel', vendor: 'Steel Mart PK' },
  { id: 3, name: 'Floor Tiles 60×60cm', brand: 'Master Tiles', price: 2200, originalPrice: 2600, rating: 4.7, reviews: 312, img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=300&h=280&fit=crop', badge: 'Premium', category: 'Tiles', vendor: 'Tile World' },
  { id: 4, name: 'Weathershield Paint 20L', brand: 'ICI Dulux', price: 3500, originalPrice: 4000, rating: 4.4, reviews: 178, img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=300&h=280&fit=crop', badge: 'Trending', category: 'Paints', vendor: 'Paint Palace' },
  { id: 5, name: 'Power Drill 800W', brand: 'Bosch', price: 12500, originalPrice: 14000, rating: 4.6, reviews: 145, img: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=300&h=280&fit=crop', badge: 'New', category: 'Tools', vendor: 'Tool House' },
  { id: 6, name: 'UPVC Pipe 4 inch', brand: 'Prince', price: 450, originalPrice: 520, rating: 4.2, reviews: 67, img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=300&h=280&fit=crop', badge: 'Value', category: 'Plumbing', vendor: 'Plumb Pro' },
  { id: 7, name: 'PPC Cement 50kg', brand: 'Lucky', price: 1150, originalPrice: 1300, rating: 4.4, reviews: 198, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Popular', category: 'Cement', vendor: 'Build Mart' },
  { id: 8, name: 'Angle Iron 40x40mm', brand: 'Ittefaq', price: 6200, originalPrice: 6800, rating: 4.1, reviews: 76, img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=300&h=280&fit=crop', badge: 'Sale', category: 'Steel', vendor: 'Steel Mart PK' },
  { id: 9, name: 'Wall Tiles 30×60cm', brand: 'Shabbir Tiles', price: 1800, originalPrice: 2100, rating: 4.6, reviews: 234, img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=300&h=280&fit=crop', badge: 'New', category: 'Tiles', vendor: 'Tile Palace' },
  { id: 10, name: 'Emulsion Paint 18L', brand: 'Berger', price: 2800, originalPrice: 3200, rating: 4.3, reviews: 156, img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=300&h=280&fit=crop', badge: 'Featured', category: 'Paints', vendor: 'Paint Hub' },
  { id: 11, name: 'Hammer Drill Kit', brand: 'Makita', price: 15000, originalPrice: 17500, rating: 4.7, reviews: 189, img: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=300&h=280&fit=crop', badge: 'Premium', category: 'Tools', vendor: 'Tool Mart' },
  { id: 12, name: 'PVC Fittings Set', brand: 'Prince', price: 850, originalPrice: 1000, rating: 4.0, reviews: 92, img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=300&h=280&fit=crop', badge: 'Bundle', category: 'Plumbing', vendor: 'Plumb Solutions' },
  { id: 13, name: 'White Cement 40kg', brand: 'Maple Leaf', price: 2400, originalPrice: 2700, rating: 4.6, reviews: 156, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Premium', category: 'Cement', vendor: 'Premium Supplies' },
  { id: 14, name: 'Steel Sheets 2mm', brand: 'Aisha Steel', price: 7800, originalPrice: 8500, rating: 4.2, reviews: 98, img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=300&h=280&fit=crop', badge: 'Quality', category: 'Steel', vendor: 'Steel World' },
  { id: 15, name: 'Marble Tiles Premium', brand: 'Master Tiles', price: 4500, originalPrice: 5200, rating: 4.8, reviews: 267, img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=300&h=280&fit=crop', badge: 'Luxury', category: 'Tiles', vendor: 'Tile World' },
  { id: 16, name: 'Wood Stain 5L', brand: 'Dulux', price: 1800, originalPrice: 2100, rating: 4.1, reviews: 89, img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=300&h=280&fit=crop', badge: 'Special', category: 'Paints', vendor: 'Paint Palace' },
];

const categories = ['All', 'Cement', 'Steel', 'Tiles', 'Paints', 'Tools', 'Plumbing'];
const brands = ['All', 'Bestway', 'Ittefaq', 'Master Tiles', 'ICI Dulux', 'Bosch', 'Prince', 'Lucky'];

const MIN_PRICE = 0;
const MAX_PRICE = 20000;

export default function AllProducts() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('popular');

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const discount = (orig: number, curr: number) => Math.round((1 - curr / orig) * 100);

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (minRating > 0 && product.rating < minRating) return false;
    return true;
  });

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setPriceRange({ min: Math.min(value, priceRange.max), max: priceRange.max });
    } else {
      setPriceRange({ min: priceRange.min, max: Math.max(value, priceRange.min) });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 mb-4 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          <h1 className="font-bold text-3xl mb-2" style={{ color: '#3e3e3e' }}>
            All Products
          </h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            {filteredProducts.length} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border sticky top-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold" style={{ color: '#3e3e3e' }}>Filters</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedBrand('All');
                      setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
                      setMinRating(0);
                    }}
                    className="text-xs font-medium"
                    style={{ color: '#ef4136' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Price Range Slider */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#64748B' }}>Rs. {priceRange.min.toLocaleString()}</span>
                      <span style={{ color: '#64748B' }}>Rs. {priceRange.max.toLocaleString()}</span>
                    </div>

                    {/* Min Range Slider */}
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Minimum</label>
                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={100}
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ef4136 0%, #ef4136 ${(priceRange.min / MAX_PRICE) * 100}%, #E2E8F0 ${(priceRange.min / MAX_PRICE) * 100}%, #E2E8F0 100%)`
                        }}
                      />
                    </div>

                    {/* Max Range Slider */}
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Maximum</label>
                      <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={100}
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ef4136 0%, #ef4136 ${(priceRange.max / MAX_PRICE) * 100}%, #E2E8F0 ${(priceRange.max / MAX_PRICE) * 100}%, #E2E8F0 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Category
                  </h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <span className="text-sm" style={{ color: '#64748B' }}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Brands
                  </h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="brand"
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <span className="text-sm" style={{ color: '#64748B' }}>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Minimum Rating
                  </h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <div className="flex items-center gap-1">
                          <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                          <span className="text-sm" style={{ color: '#64748B' }}>
                            {rating > 0 ? `${rating}+ Stars` : 'All Ratings'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
                style={{ backgroundColor: '#f8f9fa', color: '#3e3e3e' }}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#64748B' }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm outline-none cursor-pointer"
                    style={{ borderColor: '#E2E8F0', color: '#3e3e3e' }}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                <div className="hidden md:flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid3x3 size={16} style={{ color: viewMode === 'grid' ? '#ef4136' : '#64748B' }} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List size={16} style={{ color: viewMode === 'list' ? '#ef4136' : '#64748B' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div className="relative" style={{ height: '180px' }}>
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onClick={() => router.push(`/product/${product.id}`)}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                        {product.badge}
                      </span>
                      {product.originalPrice && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                          -{discount(product.originalPrice, product.price)}%
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart
                          size={16}
                          style={{
                            fill: wishlist.includes(product.id) ? '#EF4444' : 'none',
                            color: wishlist.includes(product.id) ? '#EF4444' : '#64748B',
                          }}
                        />
                      </button>
                    </div>
                    <div className="p-3" onClick={() => router.push(`/product/${product.id}`)}>
                      <p className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>{product.brand}</p>
                      <p className="text-sm font-semibold leading-tight mb-2" style={{ color: '#1E293B' }}>{product.name}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                        <span style={{ color: '#64748B', fontSize: '11px' }}>{product.rating}</span>
                        <span style={{ color: '#CBD5E1', fontSize: '11px' }}>({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold" style={{ color: '#3e3e3e', fontSize: '14px' }}>Rs. {product.price.toLocaleString()}</span>
                          <div style={{ color: '#94A3B8', fontSize: '11px', textDecoration: 'line-through' }}>
                            Rs. {product.originalPrice.toLocaleString()}
                          </div>
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
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer flex"
                    style={{ borderColor: '#E2E8F0' }}
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <div className="relative w-48 flex-shrink-0">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                        {product.badge}
                      </span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{product.brand}</p>
                        <h3 className="font-bold text-lg mb-2" style={{ color: '#3e3e3e' }}>{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            <span style={{ color: '#64748B', fontSize: '13px' }}>{product.rating} ({product.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xl" style={{ color: '#3e3e3e' }}>Rs. {product.price.toLocaleString()}</span>
                          <span className="ml-2 text-sm" style={{ color: '#94A3B8', textDecoration: 'line-through' }}>
                            Rs. {product.originalPrice.toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm font-bold" style={{ color: '#166534' }}>
                            {discount(product.originalPrice, product.price)}% OFF
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="px-6 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#ef4136' }}
                        >
                          <ShoppingCart size={18} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: '#3e3e3e' }}>No products found</p>
                <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Try adjusting your filters to see more results</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedBrand('All');
                    setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
                    setMinRating(0);
                  }}
                  className="px-6 py-2 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: '#ef4136' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
