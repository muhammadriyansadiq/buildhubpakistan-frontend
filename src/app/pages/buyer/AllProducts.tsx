'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, SlidersHorizontal, Star, Heart, ShoppingCart,
  Grid3x3, List, X, ChevronDown, Search, Loader2
} from 'lucide-react';
import { useProducts, useCategories, Product, Category } from '@/hooks/useProduct';
import { useAddToCartMutation } from '@/hooks/useCart';
import { toast } from 'sonner';

const MIN_PRICE = 0;
const MAX_PRICE = 100000; // Increased for realistic range

export default function AllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('popular');
  const [categorySearch, setCategorySearch] = useState('');

  // Add to cart mutation
  const { mutateAsync: addToCart } = useAddToCartMutation();
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  // Fetch Categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const allCategoriesList = Array.isArray(categoriesData) ? categoriesData : [];

  // Fetch Products
  const { data: productsData, isLoading: productsLoading } = useProducts({
    categoryId: selectedCategoryId || undefined,
    name: searchQuery || undefined,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    page: 1,
    limit: 50,
  });
  const products = Array.isArray(productsData) ? productsData : [];

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setAddingProductId(productId);
    try {
      await addToCart({ productId, quantity: 1 });
      toast.success('Product added to cart');
    } catch (error) {
      // Handled by client
    } finally {
      setAddingProductId(null);
    }
  };

  const discount = (orig: number, curr: number) => Math.round((1 - curr / orig) * 100);

  const filteredCategories = allCategoriesList.filter(cat =>
    cat.title?.toLowerCase().includes(categorySearch.toLowerCase())
  );

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
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            {products.length} products available
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
                      setSelectedCategoryId(null);
                      setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
                      setMinRating(0);
                      setCategorySearch('');
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span style={{ color: '#64748B' }}>Rs. {priceRange.min.toLocaleString()}</span>
                      <span style={{ color: '#64748B' }}>Rs. {priceRange.max.toLocaleString()}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold mb-1 block" style={{ color: '#94A3B8' }}>Min Price</label>
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step={100}
                          value={priceRange.min}
                          onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-red-500"
                          style={{
                            background: `linear-gradient(to right, #ef4136 0%, #ef4136 ${(priceRange.min / MAX_PRICE) * 100}%, #E2E8F0 ${(priceRange.min / MAX_PRICE) * 100}%, #E2E8F0 100%)`
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold mb-1 block" style={{ color: '#94A3B8' }}>Max Price</label>
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step={100}
                          value={priceRange.max}
                          onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-red-500"
                          style={{
                            background: `linear-gradient(to right, #ef4136 0%, #ef4136 ${(priceRange.max / MAX_PRICE) * 100}%, #E2E8F0 ${(priceRange.max / MAX_PRICE) * 100}%, #E2E8F0 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Search & List */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Category
                  </h4>
                  <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border rounded-lg outline-none focus:border-red-500 transition-colors"
                      style={{ borderColor: '#E2E8F0' }}
                    />
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategoryId === null}
                        onChange={() => setSelectedCategoryId(null)}
                        className="w-4 h-4 accent-red-500"
                      />
                      <span className={`text-sm transition-colors ${selectedCategoryId === null ? 'font-semibold text-red-600' : 'text-gray-600 group-hover:text-gray-900'}`}>All Categories</span>
                    </label>
                    {categoriesLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                      ))
                    ) : filteredCategories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategoryId === cat.id}
                          onChange={() => setSelectedCategoryId(cat.id)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <span className={`text-sm transition-colors ${selectedCategoryId === cat.id ? 'font-semibold text-red-600' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {cat.title}
                        </span>
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
            {productsLoading ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                 {Array.from({ length: 8 }).map((_, i) => (
                   <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border shadow-sm" style={{ borderColor: '#E2E8F0' }} />
                 ))}
               </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product: Product) => {
                  const currentPrice = Number(product.price);
                  const originalPrice = product.retail ? Number(product.retail) : currentPrice;
                  const showDiscount = originalPrice > currentPrice;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                      style={{ borderColor: '#E2E8F0' }}
                    >
                      <div className="relative" style={{ height: '180px' }}>
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x280?text=No+Image'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onClick={() => router.push(`/product/${product.id}`)}
                        />
                        {product.stockStatus === 'In Stock' && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                            {product.stockStatus}
                          </span>
                        )}
                        {showDiscount && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                            -{discount(originalPrice, currentPrice)}%
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
                        <p className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>{product.brand || 'No Brand'}</p>
                        <p className="text-sm font-semibold leading-tight mb-2 h-10 line-clamp-2" style={{ color: '#1E293B' }}>{product.title}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                          <span style={{ color: '#64748B', fontSize: '11px' }}>4.5</span>
                          <span style={{ color: '#CBD5E1', fontSize: '11px' }}>(120)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold" style={{ color: '#3e3e3e', fontSize: '14px' }}>Rs. {currentPrice.toLocaleString()}</span>
                            {showDiscount && (
                              <div style={{ color: '#94A3B8', fontSize: '11px', textDecoration: 'line-through' }}>
                                Rs. {originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            disabled={addingProductId === product.id}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                            style={{ backgroundColor: '#ef4136' }}
                          >
                            {addingProductId === product.id ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product: Product) => {
                  const currentPrice = Number(product.price);
                  const originalPrice = product.retail ? Number(product.retail) : currentPrice;
                  const showDiscount = originalPrice > currentPrice;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer flex"
                      style={{ borderColor: '#E2E8F0' }}
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <div className="relative w-48 flex-shrink-0">
                        <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x280?text=No+Image'} alt={product.title} className="w-full h-full object-cover" />
                        {product.stockStatus === 'In Stock' && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                            {product.stockStatus}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{product.brand || 'No Brand'}</p>
                          <h3 className="font-bold text-lg mb-2" style={{ color: '#3e3e3e' }}>{product.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                              <span style={{ color: '#64748B', fontSize: '13px' }}>4.5 (120 reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xl" style={{ color: '#3e3e3e' }}>Rs. {currentPrice.toLocaleString()}</span>
                            {showDiscount && (
                              <>
                                <span className="ml-2 text-sm" style={{ color: '#94A3B8', textDecoration: 'line-through' }}>
                                  Rs. {originalPrice.toLocaleString()}
                                </span>
                                <span className="ml-2 text-sm font-bold" style={{ color: '#166534' }}>
                                  {discount(originalPrice, currentPrice)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            disabled={addingProductId === product.id}
                            className="px-6 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            style={{ backgroundColor: '#ef4136' }}
                          >
                            {addingProductId === product.id ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
                            {addingProductId === product.id ? 'Adding...' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!productsLoading && products.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: '#3e3e3e' }}>No products found</p>
                <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Try adjusting your filters to see more results</p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
                    setMinRating(0);
                    setCategorySearch('');
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
