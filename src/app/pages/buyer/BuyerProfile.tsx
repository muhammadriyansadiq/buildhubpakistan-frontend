'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, MapPin, Phone, Mail, Camera, Edit, Package,
  CheckCircle2, Clock, Truck, Star, ChevronRight,
  Heart, Bell, Shield, Plus, Trash2, Home, Building2
} from 'lucide-react';

const orders = [
  {
    id: 'ORD-5001', date: '2026-04-04', total: 'Rs. 24,000', items: 2, status: 'processing',
    product: 'OPC Cement 50kg × 20',
    img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=60&h=50&fit=crop',
    vendor: 'Ahmed Materials',
    tracking: [
      { label: 'Order Placed', done: true, date: 'Apr 4, 2026 · 10:30 AM' },
      { label: 'Vendor Confirmed', done: true, date: 'Apr 4, 2026 · 11:00 AM' },
      { label: 'Dispatched', done: false, date: 'Expected: Apr 6, 2026' },
      { label: 'In Transit', done: false, date: '—' },
      { label: 'Delivered', done: false, date: '—' },
    ],
  },
  {
    id: 'ORD-4982', date: '2026-04-02', total: 'Rs. 17,000', items: 1, status: 'shipped',
    product: 'TMT Steel Bar 10mm × 2 tons',
    img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=60&h=50&fit=crop',
    vendor: 'Steel Mart PK',
    tracking: [
      { label: 'Order Placed', done: true, date: 'Apr 2, 2026 · 09:00 AM' },
      { label: 'Vendor Confirmed', done: true, date: 'Apr 2, 2026 · 09:45 AM' },
      { label: 'Dispatched', done: true, date: 'Apr 3, 2026 · 02:00 PM' },
      { label: 'In Transit', done: true, date: 'Apr 4, 2026 · 10:00 AM' },
      { label: 'Delivered', done: false, date: 'Expected: Apr 5, 2026' },
    ],
  },
  {
    id: 'ORD-4951', date: '2026-03-28', total: 'Rs. 44,000', items: 4, status: 'delivered',
    product: 'Floor Tiles 60×60 × 2000 sqft',
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=60&h=50&fit=crop',
    vendor: 'Tile World',
    tracking: [
      { label: 'Order Placed', done: true, date: 'Mar 28, 2026 · 11:00 AM' },
      { label: 'Vendor Confirmed', done: true, date: 'Mar 28, 2026 · 11:30 AM' },
      { label: 'Dispatched', done: true, date: 'Mar 29, 2026 · 09:00 AM' },
      { label: 'In Transit', done: true, date: 'Mar 30, 2026 · 08:00 AM' },
      { label: 'Delivered', done: true, date: 'Mar 31, 2026 · 02:30 PM' },
    ],
  },
];

const addresses = [
  { id: 1, label: 'Home', type: 'home', address: 'House 12, Johar Town, Lahore', default: true },
  { id: 2, label: 'Site Office', type: 'work', address: 'Plot 45-B, SITE Area, Karachi', default: false },
];

const tabs = ['Profile', 'Orders', 'Addresses', 'Wishlist', 'Settings'];

export default function BuyerProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Muhammad Hassan Raza',
    phone: '+92 300 1234567',
    email: 'hassan.raza@gmail.com',
    city: 'Lahore',
    businessName: 'Hassan Developers',
    role: 'buyer',
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
      processing: { label: 'Processing', color: '#5B21B6', bg: '#EDE9FE', icon: Clock },
      shipped: { label: 'Shipped', color: '#1D4ED8', bg: '#DBEAFE', icon: Truck },
      delivered: { label: 'Delivered', color: '#166534', bg: '#DCFCE7', icon: CheckCircle2 },
    };
    const s = map[status] || map.processing;
    const Icon = s.icon;
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ color: s.color, backgroundColor: s.bg }}>
        <Icon size={12} /> {s.label}
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC' }} className="min-h-screen">
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D2E5E 0%, #1E4D8C 100%)' }} className="py-10 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl overflow-hidden" style={{ backgroundColor: '#F97316' }}>
              MH
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
              <Camera size={14} style={{ color: '#0D2E5E' }} />
            </button>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">{profile.name}</h1>
            <p className="text-white/60 text-sm">{profile.businessName}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white" style={{ backgroundColor: '#F97316' }}>
                <CheckCircle2 size={11} /> Verified Buyer
              </span>
              <span className="text-xs text-white/50 flex items-center gap-1">
                <MapPin size={12} /> {profile.city}
              </span>
            </div>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-6 text-center">
            {[
              { value: '24', label: 'Orders' },
              { value: '5', label: 'Active RFQs' },
              { value: '12', label: 'Wishlist' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-bold text-xl text-white">{value}</div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white shadow-sm" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px"
              style={{
                borderBottomColor: activeTab === tab ? '#F97316' : 'transparent',
                color: activeTab === tab ? '#F97316' : '#64748B',
              }}
            >
              {tab}
              {tab === 'Orders' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ─── PROFILE ─── */}
        {activeTab === 'Profile' && (
          <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg" style={{ color: '#0D2E5E' }}>Personal Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#64748B' }}
              >
                <Edit size={15} /> {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: 'name', label: 'Full Name', icon: User, type: 'text' },
                { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
                { key: 'email', label: 'Email Address', icon: Mail, type: 'email' },
                { key: 'city', label: 'City', icon: MapPin, type: 'text' },
                { key: 'businessName', label: 'Business Name', icon: Building2, type: 'text' },
              ].map(({ key, label, icon: Icon, type }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      type={type}
                      value={profile[key as keyof typeof profile]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      disabled={!editMode}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={{
                        borderColor: editMode ? '#CBD5E1' : '#F1F5F9',
                        backgroundColor: editMode ? '#F8FAFC' : '#F8FAFC',
                        color: '#1E293B',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {editMode && (
              <div className="flex gap-3 mt-6 pt-5 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#0D2E5E' }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {activeTab === 'Orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                {/* Order header */}
                <div className="p-5 flex items-center gap-4">
                  <img src={order.img} alt={order.product} className="w-14 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-semibold" style={{ color: '#94A3B8' }}>{order.id}</span>
                      {statusBadge(order.status)}
                    </div>
                    <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>{order.product}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>by {order.vendor} · {order.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-sm" style={{ color: '#0D2E5E' }}>{order.total}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{order.items} items</div>
                  </div>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <ChevronRight
                      size={18}
                      style={{ color: '#64748B', transform: expandedOrder === order.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                    />
                  </button>
                </div>

                {/* Tracking timeline */}
                {expandedOrder === order.id && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: '#F1F5F9' }}>
                    <p className="text-xs font-semibold mb-4 mt-4" style={{ color: '#64748B' }}>ORDER TRACKING</p>
                    <div className="relative pl-6">
                      {order.tracking.map((step, idx) => (
                        <div key={step.label} className="relative mb-4 last:mb-0">
                          {/* Vertical line */}
                          {idx < order.tracking.length - 1 && (
                            <div
                              className="absolute left-0 top-5 w-0.5 h-full -translate-x-1/2"
                              style={{ backgroundColor: step.done ? '#10B981' : '#E2E8F0', left: '-18px' }}
                            />
                          )}
                          {/* Dot */}
                          <div
                            className="absolute w-4 h-4 rounded-full flex items-center justify-center border-2"
                            style={{
                              left: '-26px',
                              top: '2px',
                              backgroundColor: step.done ? '#10B981' : 'white',
                              borderColor: step.done ? '#10B981' : '#E2E8F0',
                            }}
                          >
                            {step.done && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: step.done ? '#1E293B' : '#94A3B8' }}>{step.label}</p>
                            <p className="text-xs" style={{ color: step.done ? '#10B981' : '#94A3B8' }}>{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── ADDRESSES ─── */}
        {activeTab === 'Addresses' && (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-2xl shadow-sm border p-5 flex items-start gap-4" style={{ borderColor: '#E2E8F0' }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  {addr.type === 'home' ? <Home size={22} style={{ color: '#0D2E5E' }} /> : <Building2 size={22} style={{ color: '#0D2E5E' }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold" style={{ color: '#1E293B' }}>{addr.label}</span>
                    {addr.default && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: '#166534', backgroundColor: '#DCFCE7' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: '#64748B' }}>{addr.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-blue-50">
                    <Edit size={16} style={{ color: '#3B82F6' }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} style={{ color: '#EF4444' }} />
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full rounded-2xl border-2 border-dashed p-5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors" style={{ borderColor: '#CBD5E1' }}>
              <Plus size={18} style={{ color: '#64748B' }} />
              <span className="text-sm font-medium" style={{ color: '#64748B' }}>Add New Address</span>
            </button>
          </div>
        )}

        {/* ─── WISHLIST ─── */}
        {activeTab === 'Wishlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'OPC Cement 50kg', price: 'Rs. 1,200', img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=300&h=180&fit=crop' },
              { name: 'Steel Bar 10mm', price: 'Rs. 8,500', img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=300&h=180&fit=crop' },
              { name: 'Weathershield Paint 20L', price: 'Rs. 3,500', img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=300&h=180&fit=crop' },
            ].map((item) => (
              <div key={item.name} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all" style={{ borderColor: '#E2E8F0' }}>
                <div className="relative" style={{ height: '140px' }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
                    <Heart size={14} style={{ fill: '#EF4444', color: '#EF4444' }} />
                  </button>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{item.name}</p>
                    <p className="font-bold text-sm" style={{ color: '#0D2E5E' }}>{item.price}</p>
                  </div>
                  <button className="p-2 rounded-xl text-white" style={{ backgroundColor: '#F97316' }}>
                    <Package size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeTab === 'Settings' && (
          <div className="space-y-4">
            {[
              { icon: Bell, label: 'Notifications', desc: 'Order updates, RFQ responses, promotions' },
              { icon: Shield, label: 'Security', desc: 'Password, 2FA, login activity' },
              { icon: Phone, label: 'Linked Accounts', desc: 'Google, Facebook, phone number' },
              { icon: User, label: 'Privacy', desc: 'Data visibility and sharing preferences' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm border p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EFF6FF' }}>
                  <Icon size={20} style={{ color: '#0D2E5E' }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#1E293B' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{desc}</p>
                </div>
                <ChevronRight size={18} style={{ color: '#94A3B8' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
