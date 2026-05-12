'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, SlidersHorizontal, Star, MapPin, X, Grid3x3, List, Loader2, ImageIcon, Search
} from 'lucide-react';
import { useGigs, useGigCategories } from '@/hooks/useGigs';

const locations = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];

const MIN_PRICE = 0;
const MAX_PRICE = 25000;

export default function AllServices() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'All'>('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('rating');
  const [categorySearch, setCategorySearch] = useState('');

  // Fetch real data
  const { data: categoriesData, isLoading: categoriesLoading } = useGigCategories();
  const { data: gigsData, isLoading: gigsLoading } = useGigs({
    page: 1,
    limit: 50, // Increased for better browsing
    gigCategoriesId: selectedCategoryId === 'All' ? undefined : selectedCategoryId,
    minPrice: priceRange.min,
    maxPrice: priceRange.max
  });

  const filteredCategories = categoriesData?.filter(cat =>
    cat.title?.toLowerCase().includes(categorySearch.toLowerCase())
  ) || [];

  const gigsList = gigsData?.data || [];

  // Filter remaining services (location and rating on frontend for now)
  const filteredServices = gigsList.filter(service => {
    if (selectedLocation !== 'All' && service.city !== selectedLocation) return false;
    // Add rating filter if needed (assuming all have 5.0 for now)
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
            Professional Services
          </h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            {filteredServices.length} service providers available
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
                      setSelectedCategoryId('All');
                      setSelectedLocation('All');
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
                    Price Range (Starting From)
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
                          step={500}
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
                          step={500}
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
                    Service Category
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
                        checked={selectedCategoryId === 'All'}
                        onChange={() => setSelectedCategoryId('All')}
                        className="w-4 h-4 accent-red-500"
                      />
                      <span className={`text-sm transition-colors ${selectedCategoryId === 'All' ? 'font-semibold text-red-600' : 'text-gray-600 group-hover:text-gray-900'}`}>All Categories</span>
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

                {/* Location */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Location
                  </h4>
                  <div className="space-y-2">
                    {locations.map((loc) => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="location"
                          checked={selectedLocation === loc}
                          onChange={() => setSelectedLocation(loc)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <span className={`text-sm transition-colors ${selectedLocation === loc ? 'font-semibold text-red-600' : 'text-gray-600 group-hover:text-gray-900'}`}>{loc}</span>
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
                    {[4.5, 4, 3, 0].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 accent-red-500"
                        />
                        <div className="flex items-center gap-1 transition-colors group-hover:text-gray-900">
                          <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                          <span className={`text-sm ${minRating === rating ? 'font-semibold text-red-600' : 'text-gray-600'}`}>
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
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
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

            {/* Services Grid/List */}
            {gigsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border" style={{ borderColor: '#E2E8F0' }}>
                <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#ef4136' }} />
                <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading services...</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => router.push(`/services/${service.id}`)}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div className="relative" style={{ height: '160px' }}>
                      <img src={service.images && service.images.length > 0 ? service.images[0] : 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=300&h=200&fit=crop'} alt={service.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                        {service.category?.title || 'Verified'}
                      </span>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                        <MapPin size={12} style={{ color: '#64748B' }} />
                        <span className="text-xs font-medium" style={{ color: '#3e3e3e' }}>{service.city || 'Pakistan'}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate" style={{ color: '#1E293B' }}>{service.title}</h3>
                      <p className="text-xs mb-3" style={{ color: '#64748B' }}>by {service.user?.fullName || 'Verified Provider'}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                          <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>5.0</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: '#ef4136' }}>Rs. {Number(service.price).toLocaleString()}</span>
                      </div>
                      <button
                        className="w-full py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#ef4136' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => router.push(`/services/${service.id}`)}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer flex group"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div className="relative w-64 flex-shrink-0">
                      <img src={service.images && service.images.length > 0 ? service.images[0] : 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=300&h=200&fit=crop'} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                        {service.category?.title || 'Verified'}
                      </span>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-1 truncate" style={{ color: '#3e3e3e' }}>{service.title}</h3>
                        <p className="text-sm mb-3" style={{ color: '#64748B' }}>by {service.user?.fullName || 'Verified Provider'}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>5.0 Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={16} style={{ color: '#64748B' }} />
                            <span className="text-sm" style={{ color: '#64748B' }}>{service.city || 'Pakistan'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: '#ef4136' }}>Rs. {Number(service.price).toLocaleString()}</span>
                        <button
                          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#ef4136' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredServices.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: '#3e3e3e' }}>No services found</p>
                <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Try adjusting your filters to see more results</p>
                <button
                  onClick={() => {
                    setSelectedCategoryId('All');
                    setSelectedLocation('All');
                    setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
                    setMinRating(0);
                  }}
                  className="px-6 py-2 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: '#10B981' }}
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
