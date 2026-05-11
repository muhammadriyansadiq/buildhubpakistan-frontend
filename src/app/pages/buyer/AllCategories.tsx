'use client';

import { useRouter } from 'next/navigation';
import {
  Package, HardHat, Wrench, Zap, ChevronRight, ArrowLeft, ImageIcon
} from 'lucide-react';
import { useCategories } from '@/hooks/useProduct';

// Categories will be fetched from API

export default function AllCategories() {
  const router = useRouter();
  const { data: categoriesData, isLoading } = useCategories();
  const allCategories = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 mb-2 text-xs font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
          <h1 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>
            All Categories
          </h1>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Browse our complete range of construction materials and professional services
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border shadow-sm" style={{ borderColor: '#E2E8F0' }} />
            ))
          ) : allCategories.length > 0 ? (
            allCategories.map((category: any) => {
              return (
                <div
                  key={category.id}
                  onClick={() => router.push(`/category/${category.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  {/* Image Header */}
                  <div className="relative overflow-hidden shrink-0" style={{ height: '140px' }}>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    {/* Placeholder (Hidden by default if image exists, shown if image missing or fails) */}
                    <div className={`${category.image ? 'hidden' : ''} w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2`}>
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Package size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-sm leading-tight line-clamp-1">
                            {category.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold" style={{ color: '#ef4136' }}>
                          Browse Products
                        </span>
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                          style={{ color: '#3e3e3e' }}
                        />
                      </div>
                      <p className="text-[13px] mb-3 line-clamp-2 leading-relaxed" style={{ color: '#64748B' }}>
                        {category.description || 'Explore our complete range of materials and products in this category.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ backgroundColor: '#F8F9FA', color: '#64748B' }}
                      >
                        Quality Materials
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ backgroundColor: '#F8F9FA', color: '#64748B' }}
                      >
                        Verified Vendors
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
