'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LayoutGrid, X } from 'lucide-react';

const sections = [
  {
    label: 'Authentication',
    color: '#ef4136',
    items: [
      { label: '🔐 Login', path: '/login' },
      { label: '📋 Role Selector', path: '/register' },
      { label: '📝 Register Form', path: '/register/form' },
      { label: '📱 OTP Verify', path: '/register/verify' },
    ],
  },
  {
    label: 'Vendor Flow',
    color: '#ef4136',
    items: [
      { label: '🏪 Store Setup', path: '/vendor/onboarding' },
      { label: '📊 Vendor Dashboard', path: '/vendor/dashboard' },
      { label: '📦 Products', path: '/vendor/dashboard/products' },
      { label: '➕ Add Product', path: '/vendor/dashboard/add-product' },
      { label: '📋 Inventory', path: '/vendor/dashboard/inventory' },
      { label: '🚚 Orders', path: '/vendor/dashboard/orders' },
    ],
  },
  {
    label: 'Service Provider',
    color: '#3e3e3e',
    items: [
      { label: '⚙️ Service Setup', path: '/service/onboarding' },
      { label: '📊 Service Dashboard', path: '/service/dashboard' },
      { label: '🎯 My Gigs', path: '/service/dashboard/gigs' },
      { label: '✏️ Create Gig', path: '/service/dashboard/create-gig' },
      { label: '📩 Requests', path: '/service/dashboard/requests' },
    ],
  },
  {
    label: 'Buyer / Marketplace',
    color: '#000000',
    items: [
      { label: '🏠 Home / Discovery', path: '/' },
      { label: '🛍️ Product Detail', path: '/product/1' },
      { label: '📬 RFQ Management', path: '/buyer/rfq' },
      { label: '👤 Profile & Orders', path: '/buyer/profile' },
    ],
  },
];

export default function DemoNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative z-50">
      <div style={{ backgroundColor: '#000000' }} className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Build Hub Pakistan — UI Demo</span>
          <span className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#ef4136' }}>
            All Screens
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-white transition-all"
          style={{ backgroundColor: open ? '#3e3e3e' : '#2a2a2a' }}
        >
          <LayoutGrid size={13} />
          Navigate Screens
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div
          className="absolute top-full right-0 w-full shadow-2xl border-b"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#3e3e3e' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/50">Click any screen to navigate instantly</p>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sections.map((section) => (
                <div key={section.label}>
                  <div
                    className="text-xs font-semibold mb-2 px-2 py-1 rounded"
                    style={{ color: section.color, backgroundColor: `${section.color}20` }}
                  >
                    {section.label}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          router.push(item.path);
                          setOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}