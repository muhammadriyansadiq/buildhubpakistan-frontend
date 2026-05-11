'use client';

import { useRouter } from 'next/navigation';
import {
  Package, HardHat, Wrench, Zap, ChevronRight, ArrowLeft
} from 'lucide-react';

const allCategories = [
  {
    id: 'cement-concrete',
    name: 'Cement & Concrete',
    icon: Package,
    count: '2,438 products',
    img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=400&h=300&fit=crop',
    description: 'All types of cement, concrete mix, and related materials',
    subcategories: ['OPC Cement', 'PPC Cement', 'White Cement', 'Concrete Mix', 'Ready Mix']
  },
  {
    id: 'steel-metal',
    name: 'Steel & Metal',
    icon: HardHat,
    count: '1,827 products',
    img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=400&h=300&fit=crop',
    description: 'TMT bars, angle iron, steel sheets, and metal products',
    subcategories: ['TMT Bars', 'Angle Iron', 'Steel Sheets', 'Wire Mesh', 'GI Pipes']
  },
  {
    id: 'tiles-flooring',
    name: 'Tiles & Flooring',
    icon: Package,
    count: '3,241 products',
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=400&h=300&fit=crop',
    description: 'Floor tiles, wall tiles, and decorative flooring options',
    subcategories: ['Floor Tiles', 'Wall Tiles', 'Bathroom Tiles', 'Outdoor Tiles', 'Marble']
  },
  {
    id: 'paints-coatings',
    name: 'Paints & Coatings',
    icon: Package,
    count: '987 products',
    img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=400&h=300&fit=crop',
    description: 'Interior paints, exterior paints, and protective coatings',
    subcategories: ['Interior Paint', 'Exterior Paint', 'Primers', 'Wood Stains', 'Specialty Coatings']
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: Wrench,
    count: '1,156 products',
    img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=400&h=300&fit=crop',
    description: 'Pipes, fittings, fixtures, and plumbing accessories',
    subcategories: ['UPVC Pipes', 'PPR Pipes', 'Fittings', 'Faucets', 'Sanitaryware']
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: Zap,
    count: '768 products',
    img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=400&h=300&fit=crop',
    description: 'Wires, cables, switches, and electrical equipment',
    subcategories: ['Wires & Cables', 'Switches', 'Circuit Breakers', 'LED Lights', 'Conduits']
  },
  {
    id: 'tools-hardware',
    name: 'Tools & Hardware',
    icon: Wrench,
    count: '542 products',
    img: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?w=400&h=300&fit=crop',
    description: 'Power tools, hand tools, and hardware accessories',
    subcategories: ['Power Tools', 'Hand Tools', 'Safety Equipment', 'Fasteners', 'Measuring Tools']
  },
  {
    id: 'services',
    name: 'Professional Services',
    icon: HardHat,
    count: '203 providers',
    img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=400&h=300&fit=crop',
    description: 'Engineers, architects, contractors, and skilled labor',
    subcategories: ['Engineers', 'Architects', 'Contractors', 'Masons', 'Electricians']
  },
  {
    id: 'wood-timber',
    name: 'Wood & Timber',
    icon: Package,
    count: '654 products',
    img: 'https://images.unsplash.com/photo-1551976669-2bb5e576f63e?w=400&h=300&fit=crop',
    description: 'Lumber, plywood, MDF, and wood-based materials',
    subcategories: ['Plywood', 'MDF Boards', 'Lumber', 'Wood Panels', 'Veneers']
  },
  {
    id: 'glass-aluminium',
    name: 'Glass & Aluminium',
    icon: Package,
    count: '432 products',
    img: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
    description: 'Glass sheets, aluminium sections, and window systems',
    subcategories: ['Glass Sheets', 'Aluminium Sections', 'Window Systems', 'Curtain Wall', 'Mirrors']
  },
  {
    id: 'doors-windows',
    name: 'Doors & Windows',
    icon: Package,
    count: '389 products',
    img: 'https://images.unsplash.com/photo-1614359632941-77f89212ed2c?w=400&h=300&fit=crop',
    description: 'Doors, windows, frames, and related hardware',
    subcategories: ['Wooden Doors', 'UPVC Windows', 'Aluminium Frames', 'Door Hardware', 'Shutters']
  },
  {
    id: 'roofing',
    name: 'Roofing Materials',
    icon: Package,
    count: '298 products',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    description: 'Roofing sheets, insulation, and waterproofing materials',
    subcategories: ['Metal Sheets', 'Roofing Tiles', 'Insulation', 'Waterproofing', 'Gutters']
  }
];

export default function AllCategories() {
  const router = useRouter();

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
            All Categories
          </h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            Browse our complete range of construction materials and professional services
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/category/${category.id}`)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ borderColor: '#E2E8F0' }}
              >
                {/* Image Header */}
                <div className="relative overflow-hidden" style={{ height: '180px' }}>
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <IconComponent size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold" style={{ color: '#ef4136' }}>
                      {category.count}
                    </span>
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                      style={{ color: '#3e3e3e' }}
                    />
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.subcategories.slice(0, 4).map((sub) => (
                      <span
                        key={sub}
                        className="px-2 py-1 rounded-md text-xs"
                        style={{ backgroundColor: '#F8F9FA', color: '#64748B' }}
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 4 && (
                      <span
                        className="px-2 py-1 rounded-md text-xs font-medium"
                        style={{ backgroundColor: '#ef4136', color: 'white' }}
                      >
                        +{category.subcategories.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
