'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, SlidersHorizontal, Star, MapPin, X, Grid3x3, List
} from 'lucide-react';

const allServices = [
  { id: 1, name: 'Structural Engineering', provider: 'Eng. Ahmad Raza', rating: 4.9, price: 'From Rs. 15,000', location: 'Lahore', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=300&h=200&fit=crop', badge: 'Top Rated', priceMin: 15000, category: 'Engineering' },
  { id: 2, name: 'Interior Architecture', provider: 'Arch. Fatima Khan', rating: 4.8, price: 'From Rs. 8,000', location: 'Karachi', img: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=300&h=200&fit=crop', badge: 'Featured', priceMin: 8000, category: 'Architecture' },
  { id: 3, name: 'Electrical Installation', provider: 'M. Ali Electric Co.', rating: 4.6, price: 'From Rs. 5,000', location: 'Islamabad', img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=300&h=200&fit=crop', badge: 'Verified', priceMin: 5000, category: 'Electrical' },
  { id: 4, name: 'Plumbing Services', provider: 'Khan Plumbers', rating: 4.5, price: 'From Rs. 3,000', location: 'Lahore', img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=300&h=200&fit=crop', badge: 'Popular', priceMin: 3000, category: 'Plumbing' },
  { id: 5, name: 'Civil Engineering', provider: 'Eng. Bilal Ahmed', rating: 4.7, price: 'From Rs. 12,000', location: 'Rawalpindi', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=300&h=200&fit=crop', badge: 'Certified', priceMin: 12000, category: 'Engineering' },
  { id: 6, name: 'HVAC Installation', provider: 'Cool Tech Services', rating: 4.4, price: 'From Rs. 6,000', location: 'Karachi', img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=300&h=200&fit=crop', badge: 'Expert', priceMin: 6000, category: 'HVAC' },
  { id: 7, name: 'Masonry Work', provider: 'Master Builders', rating: 4.6, price: 'From Rs. 4,000', location: 'Lahore', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=300&h=200&fit=crop', badge: 'Reliable', priceMin: 4000, category: 'Construction' },
  { id: 8, name: 'Painting & Finishing', provider: 'Pro Painters', rating: 4.3, price: 'From Rs. 2,500', location: 'Islamabad', img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=300&h=200&fit=crop', badge: 'Quality', priceMin: 2500, category: 'Painting' },
  { id: 9, name: 'Construction Management', provider: 'Build Pro Services', rating: 4.8, price: 'From Rs. 20,000', location: 'Karachi', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=300&h=200&fit=crop', badge: 'Premium', priceMin: 20000, category: 'Construction' },
  { id: 10, name: 'Carpentry Services', provider: 'Wood Masters', rating: 4.5, price: 'From Rs. 3,500', location: 'Lahore', img: 'https://images.unsplash.com/photo-1551976669-2bb5e576f63e?w=300&h=200&fit=crop', badge: 'Skilled', priceMin: 3500, category: 'Carpentry' },
  { id: 11, name: 'Welding & Fabrication', provider: 'Steel Works', rating: 4.4, price: 'From Rs. 4,500', location: 'Rawalpindi', img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=300&h=200&fit=crop', badge: 'Professional', priceMin: 4500, category: 'Fabrication' },
  { id: 12, name: 'Tiling Services', provider: 'Tile Experts', rating: 4.7, price: 'From Rs. 3,800', location: 'Islamabad', img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=300&h=200&fit=crop', badge: 'Experienced', priceMin: 3800, category: 'Tiling' },
];

const categories = ['All', 'Engineering', 'Architecture', 'Electrical', 'Plumbing', 'Construction', 'HVAC', 'Painting', 'Carpentry'];
const locations = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];

const MIN_PRICE = 0;
const MAX_PRICE = 25000;

export default function AllServices() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('rating');

  // Filter services
  const filteredServices = allServices.filter(service => {
    if (selectedCategory !== 'All' && service.category !== selectedCategory) return false;
    if (selectedLocation !== 'All' && service.location !== selectedLocation) return false;
    if (service.priceMin < priceRange.min || service.priceMin > priceRange.max) return false;
    if (minRating > 0 && service.rating < minRating) return false;
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
                      setSelectedCategory('All');
                      setSelectedLocation('All');
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
                    Price Range (Starting From)
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
                        step={500}
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10B981 0%, #10B981 ${(priceRange.min / MAX_PRICE) * 100}%, #E2E8F0 ${(priceRange.min / MAX_PRICE) * 100}%, #E2E8F0 100%)`
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
                        step={500}
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10B981 0%, #10B981 ${(priceRange.max / MAX_PRICE) * 100}%, #E2E8F0 ${(priceRange.max / MAX_PRICE) * 100}%, #E2E8F0 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#3e3e3e' }}>
                    Service Type
                  </h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-sm" style={{ color: '#64748B' }}>{cat}</span>
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
                      <label key={loc} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="location"
                          checked={selectedLocation === loc}
                          onChange={() => setSelectedLocation(loc)}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-sm" style={{ color: '#64748B' }}>{loc}</span>
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
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 accent-green-500"
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
                    <Grid3x3 size={16} style={{ color: viewMode === 'grid' ? '#10B981' : '#64748B' }} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List size={16} style={{ color: viewMode === 'list' ? '#10B981' : '#64748B' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Services Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                    <div 
                      key={service.id} 
                      onClick={() => router.push(`/services/${service.id}`)}
                      className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group" 
                      style={{ borderColor: '#E2E8F0' }}
                    >
                      <div className="relative" style={{ height: '160px' }}>
                        <img src={service.img} alt={service.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                          {service.badge}
                        </span>
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm">
                          <MapPin size={12} style={{ color: '#64748B' }} />
                          <span className="text-xs font-medium" style={{ color: '#3e3e3e' }}>{service.location}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1" style={{ color: '#1E293B' }}>{service.name}</h3>
                        <p className="text-xs mb-3" style={{ color: '#64748B' }}>by {service.provider}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Star size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>{service.rating}</span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: '#ef4136' }}>{service.price}</span>
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
                      <img src={service.img} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#ef4136' }}>
                        {service.badge}
                      </span>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xl mb-1" style={{ color: '#3e3e3e' }}>{service.name}</h3>
                        <p className="text-sm mb-3" style={{ color: '#64748B' }}>by {service.provider}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>{service.rating} Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={16} style={{ color: '#64748B' }} />
                            <span className="text-sm" style={{ color: '#64748B' }}>{service.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: '#ef4136' }}>{service.price}</span>
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
                    setSelectedCategory('All');
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
