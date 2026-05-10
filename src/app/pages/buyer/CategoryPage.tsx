'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, SlidersHorizontal, ChevronDown, Star, Heart, ShoppingCart,
  Grid3x3, List, X
} from 'lucide-react';

const categoryData: Record<string, any> = {
  'cement-concrete': {
    name: 'Cement & Concrete',
    description: 'High-quality cement and concrete products for all construction needs',
    subcategories: ['OPC Cement', 'PPC Cement', 'White Cement', 'Concrete Mix', 'Ready Mix'],
    brands: ['Bestway', 'Lucky', 'Maple Leaf', 'Fauji', 'Askari', 'DG Khan'],
  },
};

const products = [
  { id: 1, name: 'OPC Cement 50kg', brand: 'Bestway', price: 1200, originalPrice: 1400, rating: 4.5, reviews: 234, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Best Seller', vendor: 'Ahmed Materials', subcategory: 'OPC Cement' },
  { id: 2, name: 'PPC Cement 50kg', brand: 'Lucky', price: 1150, originalPrice: 1300, rating: 4.4, reviews: 189, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Popular', vendor: 'Build Mart', subcategory: 'PPC Cement' },
  { id: 3, name: 'White Cement 40kg', brand: 'Maple Leaf', price: 2400, originalPrice: 2700, rating: 4.6, reviews: 156, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Premium', vendor: 'Premium Supplies', subcategory: 'White Cement' },
  { id: 4, name: 'OPC Cement 50kg', brand: 'Fauji', price: 1180, originalPrice: 1350, rating: 4.3, reviews: 198, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Hot Deal', vendor: 'Construction Hub', subcategory: 'OPC Cement' },
  { id: 5, name: 'Ready Mix Concrete M20', brand: 'Bestway', price: 8500, originalPrice: 9200, rating: 4.7, reviews: 87, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Trending', vendor: 'Concrete Pro', subcategory: 'Ready Mix' },
  { id: 6, name: 'PPC Cement 50kg', brand: 'DG Khan', price: 1130, originalPrice: 1280, rating: 4.2, reviews: 167, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Value', vendor: 'Smart Build', subcategory: 'PPC Cement' },
  { id: 7, name: 'OPC Cement 50kg', brand: 'Askari', price: 1220, originalPrice: 1420, rating: 4.4, reviews: 201, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Quality', vendor: 'Elite Materials', subcategory: 'OPC Cement' },
  { id: 8, name: 'Concrete Mix 50kg', brand: 'Lucky', price: 950, originalPrice: 1100, rating: 4.1, reviews: 134, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=280&fit=crop', badge: 'Budget', vendor: 'Budget Builders', subcategory: 'Concrete Mix' },
];

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('popular');

  const category = categoryData[categoryId || 'cement-concrete'] || categoryData['cement-concrete'];

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const toggleFilter = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const discount = (orig: number, curr: number) => Math.round((1 - curr / orig) * 100);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(product.subcategory)) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (priceRange.min && product.price < parseInt(priceRange.min)) return false;
    if (priceRange.max && product.price > parseInt(priceRange.max)) return false;
    if (minRating > 0 && product.rating < minRating) return false;
    return true;
  });

  const activeFiltersCount = selectedSubcategories.length + selectedBrands.length +
    (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/categories')}
            className="flex items-center gap-2 mb-4 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            <ArrowLeft size={16} /> Back to All Categories
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bold text-3xl mb-2" style={{ color: '#3e3e3e' }}>
                {category.name}
              </h1>
              <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>
                {category.description}
              </p>
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>
                {filteredProducts.length} products available
              </p>
            </div>
          </div>
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
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedSubcategories([]);
                        setSelectedBrands([]);
                        setPriceRange({ min: '', max: '' });
                        setMinRating(0);
                      }}
                      className="text-xs font-medium"
                      style={{ color: '#ef4136' }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Price Range (Rs.)
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
                      style={{ borderColor: '#E2E8F0' }}
                    />
                    <span style={{ color: '#94A3B8' }}>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
                      style={{ borderColor: '#E2E8F0' }}
                    />
                  </div>
                </div>

                {/* Subcategories */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Type
                  </h4>
                  <div className="space-y-2">
                    {category.subcategories.map((sub: string) => (
                      <label key={sub} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub)}
                          onChange={() => toggleFilter(sub, setSelectedSubcategories)}
                          className="w-4 h-4 rounded accent-red-500"
                        />
                        <span className="text-sm" style={{ color: '#64748B' }}>{sub}</span>
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
                    {category.brands.map((brand: string) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleFilter(brand, setSelectedBrands)}
                          className="w-4 h-4 rounded accent-red-500"
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
                    {[4, 3, 2, 1].map((rating) => (
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
                            {rating}+ Stars
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
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
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

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
                <div
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold" style={{ color: '#3e3e3e' }}>Filters</h3>
                      <button onClick={() => setShowFilters(false)}>
                        <X size={20} style={{ color: '#64748B' }} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-6">
                    {/* Same filters as desktop */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>Price Range (Rs.)</h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                        />
                        <span style={{ color: '#94A3B8' }}>-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    setSelectedSubcategories([]);
                    setSelectedBrands([]);
                    setPriceRange({ min: '', max: '' });
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
