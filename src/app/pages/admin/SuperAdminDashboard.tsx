'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  LayoutDashboard, Users, Package, Briefcase, ShoppingBag, FileText,
  Settings, LogOut, Search, Filter, Download, MoreVertical, Eye,
  Check, X, Clock, TrendingUp, DollarSign, AlertCircle, ChevronRight,
  Store, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, Ban,
  CheckCircle2, XCircle, Building, Shield, Tag, Bell, Activity,
  UserCheck, UserX, PackageCheck, PackageX, Layers, Percent, ChevronDown,
  Plus, Save, Smile, Upload, Image as ImageIcon, Truck, Loader2,
  CreditCard, Hash, FileCheck, ArrowLeft, Globe, Landmark
} from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';
import { useCategories, useProducts } from '@/hooks/useProduct';
import { useUsers, useUserById, useUpdateUserMutation } from '@/hooks/useUser';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrder';
import { toast } from 'sonner';

// Generate mock data for vendors pending approval
const generatePendingVendors = () => {
  const vendors = [];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan'];
  const categories = ['Cement & Concrete', 'Steel & Metal', 'Tiles & Flooring', 'Paints', 'Electrical'];
  const baseDate = new Date('2024-05-10T00:00:00Z').getTime();

  for (let i = 1; i <= 15; i++) {
    const daysAgo = i % 7;
    vendors.push({
      id: `VEN-${String(3000 + i).padStart(4, '0')}`,
      name: `${['Ahmed', 'Raza', 'Ali', 'Hassan', 'Farhan'][i % 5]} ${['Materials', 'Traders', 'Suppliers', 'Enterprises', 'Corp'][i % 5]}`,
      email: `vendor${i}@example.pk`,
      phone: `+92 300 ${String(1000000 + i * 12345).slice(-7)}`,
      city: cities[i % cities.length],
      category: categories[i % categories.length],
      registeredDate: new Date(baseDate - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: i % 3 === 0 ? 'pending' : (i % 3 === 1 ? 'approved' : 'rejected'),
      businessName: `${['Quality', 'Premium', 'Elite', 'Superior', 'Trust'][i % 5]} Building Supplies`,
      cnic: `35202-${String(1000000 + i * 54321).slice(-7)}-${i % 10}`,
      address: `${(i * 17) % 999 + 1} Main Boulevard, ${cities[(i + 1) % cities.length]}`,
      productsCount: (i * 3) % 50 + 5
    });
  }
  return vendors;
};

// Generate mock data for service providers pending approval
const generatePendingServiceProviders = () => {
  const providers = [];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan'];
  const occupations = ['Structural Engineer', 'Architect', 'Civil Engineer', 'Electrician', 'Plumber'];
  const baseDate = new Date('2024-05-10T00:00:00Z').getTime();

  for (let i = 1; i <= 12; i++) {
    const daysAgo = i % 7;
    providers.push({
      id: `SP-${String(4000 + i).padStart(4, '0')}`,
      name: `Eng. ${['Ahmad', 'Bilal', 'Zain', 'Usman', 'Kamran'][i % 5]} ${['Khan', 'Ahmed', 'Raza', 'Ali', 'Shah'][i % 5]}`,
      email: `engineer${i}@example.pk`,
      phone: `+92 321 ${String(2000000 + i * 23456).slice(-7)}`,
      city: cities[i % cities.length],
      occupation: occupations[i % occupations.length],
      registeredDate: new Date(baseDate - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: i % 3 === 0 ? 'pending' : (i % 3 === 1 ? 'approved' : 'rejected'),
      experience: `${(i % 15) + 2} years`,
      cnic: `35201-${String(3000000 + i * 34567).slice(-7)}-${i % 10}`,
      address: `${(i * 23) % 999 + 1} Street ${(i % 10) + 1}, ${cities[(i + 2) % cities.length]}`,
      gigsCount: (i % 10) + 1,
      rating: (3.5 + (i % 15) / 10).toFixed(1)
    });
  }
  return providers;
};

// Generate comprehensive orders data for super admin
const generateAllOrders = () => {
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  const paymentStatuses = ['paid', 'pending', 'partial', 'failed', 'refunded'];
  const orderTypes = ['Product', 'Service', 'Mixed'];
  const vendors = ['Ahmed Materials', 'Steel Mart PK', 'Tile World', 'Paint Palace', 'Build Pro', 'Quality Suppliers'];
  const buyers = ['Ali Construction', 'Raza Builders', 'National Housing', 'Elite Developers', 'Metro Builders', 'City Homes'];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala'];
  const products = ['OPC Cement 50kg', 'TMT Steel Bar 10mm', 'Floor Tiles 60x60', 'Wall Paint 20L', 'PVC Pipe 4 inch', 'Electric Cable'];
  const services = ['Structural Engineering', 'Electrical Installation', 'Plumbing Work', 'Civil Labour'];
  const baseDate = new Date('2024-05-10T00:00:00Z').getTime();

  const orders = [];
  for (let i = 1; i <= 80; i++) {
    const daysAgo = i % 45;
    const orderDate = new Date(baseDate - daysAgo * 24 * 60 * 60 * 1000);
    const status = statuses[i % statuses.length];
    const paymentStatus = paymentStatuses[i % paymentStatuses.length];
    const type = orderTypes[i % orderTypes.length];
    const itemCount = (i % 5) + 1;
    const totalAmount = 5000 + (i * 7890) % 500000;
    const commission = totalAmount * 0.05;

    orders.push({
      id: `ORD-${String(10000 + i).padStart(5, '0')}`,
      buyer: buyers[i % buyers.length],
      buyerEmail: 'buyer@example.pk',
      buyerPhone: `+92 300 ${String(4000000 + i * 34567).slice(-7)}`,
      vendor: vendors[i % vendors.length],
      vendorEmail: 'vendor@example.pk',
      vendorPhone: `+92 321 ${String(5000000 + i * 45678).slice(-7)}`,
      type,
      items: type === 'Product' ? products[i % products.length] :
             type === 'Service' ? services[i % services.length] :
             `${products[0]} + ${services[0]}`,
      itemCount,
      totalAmount,
      commission,
      city: cities[i % cities.length],
      deliveryAddress: `${(i * 31) % 999 + 1} Street ${(i % 10) + 1}, ${cities[(i + 3) % cities.length]}`,
      status,
      paymentStatus,
      paymentMethod: ['COD', 'Bank Transfer', 'Card', 'JazzCash'][i % 4],
      orderDate: orderDate.toISOString().split('T')[0],
      orderTime: `${String((i % 12) + 1).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
      deliveryDate: status === 'delivered' ? new Date(orderDate.getTime() + ((i % 10) + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      priority: i % 10 > 7 ? 'high' : 'normal',
      notes: ['Rush delivery requested', 'Fragile items', 'Contact before delivery', ''][i % 4],
      timeline: [
        { status: 'Order Placed', date: orderDate.toISOString(), completed: true },
        { status: 'Vendor Confirmed', date: new Date(orderDate.getTime() + 1 * 60 * 60 * 1000).toISOString(), completed: !['pending'].includes(status) },
        { status: 'Processing', date: new Date(orderDate.getTime() + 12 * 60 * 60 * 1000).toISOString(), completed: ['processing', 'shipped', 'delivered'].includes(status) },
        { status: 'Shipped', date: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), completed: ['shipped', 'delivered'].includes(status) },
        { status: 'Delivered', date: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), completed: status === 'delivered' }
      ]
    });
  }
  return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
};

const mockVendors = generatePendingVendors();
const mockServiceProviders = generatePendingServiceProviders();
const allOrders = generateAllOrders();

// Mock categories data
const initialCategories = [
  { id: 1, emoji: '🏗️', title: 'Cement & Concrete', description: 'All types of cement, concrete, and related building materials', productCount: 245, active: true, image: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=400&h=300&fit=crop' },
  { id: 2, emoji: '🔩', title: 'Steel & Metal', description: 'Steel bars, rods, sheets, and metal construction materials', productCount: 189, active: true, image: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=400&h=300&fit=crop' },
  { id: 3, emoji: '🏠', title: 'Tiles & Flooring', description: 'Floor tiles, wall tiles, marble, and flooring solutions', productCount: 312, active: true, image: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=400&h=300&fit=crop' },
  { id: 4, emoji: '🎨', title: 'Paints & Coatings', description: 'Interior & exterior paints, primers, and protective coatings', productCount: 156, active: true, image: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=400&h=300&fit=crop' },
  { id: 5, emoji: '🚰', title: 'Plumbing', description: 'Pipes, fittings, sanitary ware, and plumbing fixtures', productCount: 203, active: true, image: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=400&h=300&fit=crop' },
  { id: 6, emoji: '⚡', title: 'Electrical', description: 'Wires, cables, switches, fixtures, and electrical supplies', productCount: 178, active: true, image: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=400&h=300&fit=crop' },
  { id: 7, emoji: '🔨', title: 'Tools & Equipment', description: 'Hand tools, power tools, and construction equipment', productCount: 134, active: true, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop' },
  { id: 8, emoji: '🪵', title: 'Wood & Timber', description: 'Lumber, plywood, hardwood, and wooden materials', productCount: 98, active: false, image: 'https://images.unsplash.com/photo-1611264548091-e961f5dfb8cd?w=400&h=300&fit=crop' },
];

// Emoji options for categories
const emojiOptions = [
  '🏗️', '🔩', '🏠', '🎨', '🚰', '⚡', '🔨', '🪵', '🧱', '🪟',
  '🚪', '🪜', '🔧', '⚙️', '🛠️', '📦', '🏭', '🏢', '🏛️', '🌉',
  '🪴', '💡', '🔌', '🪠', '🧰', '📏', '📐', '🖌️', '🪣', '🧯',
  '🪙', '💰', '🔑', '🪪', '📋', '📊', '🎯', '✨', '🔒', '🛡️',
  '🌟', '⭐', '💎', '🏆', '🎖️', '🏅', '🥇', '🥈', '🥉', '🔱'
];

type Section = 'overview' | 'vendors' | 'service-providers' | 'buyers' | 'orders' | 'categories' | 'revenue' | 'settings';

function UserDetailModal({ userId, userRole, onClose, onApprove, onReject }: {
  userId: number;
  userRole: string;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const { data: userData, isLoading } = useUserById(userId);
  const user = userData?.data;

  const approvalConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    Pending: { label: 'Pending Review', color: '#92400E', bg: '#FEF3C7', icon: Clock },
    Approved: { label: 'Approved', color: '#166534', bg: '#DCFCE7', icon: CheckCircle2 },
    Rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2', icon: XCircle },
  };

  const InfoRow = ({ icon: Icon, label, value, copyable }: { icon: any; label: string; value?: string | null; copyable?: boolean }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#F8FAFC' }}>
          <Icon size={15} style={{ color: '#64748B' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium mb-0.5" style={{ color: '#94A3B8' }}>{label}</div>
          <div className="text-sm font-semibold break-all" style={{ color: '#1E293B' }}>{value}</div>
        </div>
      </div>
    );
  };

  const SectionCard = ({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
      <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <h3 className="font-bold text-sm" style={{ color: '#1E293B' }}>{title}</h3>
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Slide-in Panel */}
      <div
        className="relative ml-auto w-full max-w-2xl bg-gray-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Panel Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} style={{ color: '#64748B' }} />
            </button>
            <div>
              <h2 className="font-bold text-lg" style={{ color: '#1E293B' }}>
                {userRole === 'Vendor' ? 'Vendor' : 'Service Provider'} Details
              </h2>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Full profile and business information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={18} style={{ color: '#64748B' }} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 size={36} className="animate-spin" style={{ color: '#ef4136' }} />
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading details...</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <XCircle size={48} style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#64748B' }}>User data not found</p>
            </div>
          ) : (
            <div className="p-6 space-y-5">

              {/* Profile Hero */}
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                <div className="h-24 relative" style={{
                  background: userRole === 'Vendor'
                    ? 'linear-gradient(135deg, #ef4136 0%, #FF6B6B 50%, #ee5a24 100%)'
                    : 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #059669 100%)'
                }}>
                  {user.shopCoverImage && (
                    <img src={user.shopCoverImage} alt="Cover" className="w-full h-full object-cover absolute inset-0 opacity-40" />
                  )}
                </div>
                <div className="px-6 pb-5 -mt-10 relative">
                  <div className="flex items-end gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                      {user.logo ? (
                        <img src={user.logo} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold" style={{ color: '#64748B' }}>
                          {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 pt-10">
                      <h3 className="font-bold text-xl" style={{ color: '#1E293B' }}>{user.fullName}</h3>
                      <p className="text-sm" style={{ color: '#64748B' }}>
                        {user.shopName || user.role} • ID: #{user.id}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const a = approvalConfig[user.isApproved || 'Pending'];
                      const StatusIcon = a.icon;
                      return (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ color: a.color, backgroundColor: a.bg }}>
                          <StatusIcon size={13} /> {a.label}
                        </span>
                      );
                    })()}
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{
                      backgroundColor: user.status === 'Active' ? '#DCFCE7' : '#FEE2E2',
                      color: user.status === 'Active' ? '#166534' : '#991B1B'
                    }}>
                      {user.status}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{
                      backgroundColor: user.isPhoneVerified ? '#DBEAFE' : '#FEF3C7',
                      color: user.isPhoneVerified ? '#1E40AF' : '#92400E'
                    }}>
                      Phone {user.isPhoneVerified ? 'Verified' : 'Unverified'}
                    </span>
                    {user.isProfileComplete && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: '#F0FDF4', color: '#166534' }}>
                        Profile Complete
                      </span>
                    )}
                    {user.tier && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor: '#EDE9FE', color: '#5B21B6' }}>
                        {user.tier} Tier
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <SectionCard title="Personal Information" icon={User} color="#3B82F6">
                <InfoRow icon={User} label="Full Name" value={user.fullName} />
                <InfoRow icon={Mail} label="Email Address" value={user.email} />
                <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                <InfoRow icon={Hash} label="CNIC Number" value={user.cnicNumber} />
                <InfoRow icon={Shield} label="Account Type" value={user.accountType} />
                <InfoRow icon={Calendar} label="Registered On" value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                <InfoRow icon={Calendar} label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              </SectionCard>

              {/* Business Information (for Vendors) */}
              {(user.shopName || user.businessAddress || user.warehouseAddress || user.returnAddress || user.ntnNumber) && (
                <SectionCard title="Business Information" icon={Store} color="#F59E0B">
                  <InfoRow icon={Store} label="Shop / Business Name" value={user.shopName} />
                  <InfoRow icon={FileCheck} label="NTN Number" value={user.ntnNumber} />
                  <InfoRow icon={Building} label="Business Address" value={user.businessAddress} />
                  <InfoRow icon={Truck} label="Warehouse Address" value={user.warehouseAddress} />
                  <InfoRow icon={ArrowLeft} label="Return Address" value={user.returnAddress} />
                  <InfoRow icon={MapPin} label="General Address" value={user.address} />
                </SectionCard>
              )}

              {/* Bank / Payment Details */}
              {(user.accountTitle || user.accountNumber || user.ibanNumber || user.branchCode) && (
                <SectionCard title="Bank & Payment Details" icon={Landmark} color="#8B5CF6">
                  <InfoRow icon={User} label="Account Title" value={user.accountTitle} />
                  <InfoRow icon={CreditCard} label="Account Number" value={user.accountNumber} />
                  <InfoRow icon={Globe} label="IBAN Number" value={user.ibanNumber} />
                  <InfoRow icon={Hash} label="Branch Code" value={user.branchCode} />
                </SectionCard>
              )}

              {/* Onboarding Progress */}
              <SectionCard title="Onboarding Progress" icon={Activity} color="#10B981">
                <div className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: '#64748B' }}>Step {user.onboardingStep} of 5</span>
                    <span className="text-xs font-bold" style={{ color: '#10B981' }}>{Math.round((user.onboardingStep / 5) * 100)}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(user.onboardingStep / 5) * 100}%`,
                        background: 'linear-gradient(90deg, #10B981, #34D399)'
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex flex-col items-center gap-1">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: step <= user.onboardingStep ? '#10B981' : '#E2E8F0',
                            color: step <= user.onboardingStep ? 'white' : '#94A3B8'
                          }}
                        >
                          {step <= user.onboardingStep ? <Check size={14} /> : step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* Saved Addresses */}
              {user.addresses && user.addresses.length > 0 && (
                <SectionCard title={`Saved Addresses (${user.addresses.length})`} icon={MapPin} color="#EF4444">
                  {user.addresses.map((addr: any, idx: number) => (
                    <div key={addr.id || idx} className="py-3 border-b last:border-b-0" style={{ borderColor: '#F1F5F9' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                          {addr.label || `Address ${idx + 1}`}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: '#1E293B' }}>{addr.fullName}</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>
                        {addr.streetAddress}, {addr.city}, {addr.province} {addr.postalCode || ''}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs flex items-center gap-1" style={{ color: '#94A3B8' }}>
                          <Phone size={11} /> {addr.phone}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: '#94A3B8' }}>
                          <Mail size={11} /> {addr.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </SectionCard>
              )}

              {/* Receipt */}
              {user.receipt && (
                <SectionCard title="Payment Receipt" icon={FileText} color="#EF4444">
                  <div className="py-3">
                    <a
                      href={user.receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}
                    >
                      <Eye size={16} /> View Receipt
                    </a>
                  </div>
                </SectionCard>
              )}

            </div>
          )}
        </div>

        {/* Panel Footer - Actions */}
        {user && (
          <div className="bg-white border-t px-6 py-4 flex items-center gap-3 flex-shrink-0" style={{ borderColor: '#E2E8F0' }}>
            {user.isApproved !== 'Approved' && (
              <button
                onClick={() => onApprove(user.id)}
                className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#10B981' }}
              >
                <CheckCircle2 size={18} /> Approve {userRole === 'Vendor' ? 'Vendor' : 'Provider'}
              </button>
            )}
            {user.isApproved !== 'Rejected' && (
              <button
                onClick={() => onReject(user.id)}
                className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#EF4444' }}
              >
                <XCircle size={18} /> Reject
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#64748B' }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>((params?.section as Section) || 'overview');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // User fetching hooks
  const { data: vendorsData, isLoading: vendorsLoading } = useUsers({ role: 'Vendor' });
  const { data: serviceProvidersData, isLoading: serviceProvidersLoading } = useUsers({ role: 'Service Provider' });
  const { data: buyersData, isLoading: buyersLoading } = useUsers({ role: 'User' });
  const updateUserMutation = useUpdateUserMutation();

  // Orders fetching
  const [orderFilters, setOrderFilters] = useState({
    search: '',
    status: 'All', // Default to 'All'
    paymentStatus: 'all',
    orderType: 'all',
    dateRange: 'all',
    vendor: 'all',
    priority: 'all'
  });
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    status: orderFilters.status === 'All' ? undefined : orderFilters.status,
    search: orderFilters.search || undefined,
  });
  const updateOrderMutation = useUpdateOrderStatus();

  const vendors = vendorsData?.data || [];
  const serviceProviders = serviceProvidersData?.data || [];
  const buyers = buyersData?.data || [];

  // Category management state
  const { data: apiCategories, isLoading: categoriesLoading } = useCategories();
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    if (Array.isArray(apiCategories)) {
      setCategories(apiCategories.map((cat: any) => ({
        ...cat,
        emoji: '📦',
        active: cat.status === 'Active' || true,
        productCount: cat.products?.length || 0
      })));
    }
  }, [apiCategories]);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    emoji: '📦',
    title: '',
    description: '',
    image: '',
    active: true
  });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 15;

<<<<<<< Updated upstream
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };
=======
  const orders = ordersData?.data || [];
  const totalOrdersCount = ordersData?.total || 0;
>>>>>>> Stashed changes

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendors', icon: Store, badge: vendors.filter(v => v.isApproved === 'Pending').length },
    { id: 'service-providers', label: 'Service Providers', icon: Briefcase, badge: serviceProviders.filter(sp => sp.isApproved === 'Pending').length },
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'orders', label: 'All Orders', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'revenue', label: 'Revenue & Commission', icon: DollarSign },
  ];

  const navigate2 = (section: Section) => {
    setActiveSection(section);
    router.push(`/admin/super/${section}`);
  };

  const handleApprove = async (type: string, id: string | number) => {
    try {
      await updateUserMutation.mutateAsync({
        id,
        payload: { isApproved: 'Approved' }
      });
      toast.success(`${type} approved successfully!`);
      setSelectedItem(null);
    } catch (error) {
      toast.error(`Failed to approve ${type}`);
    }
  };

  const handleReject = async (type: string, id: string | number) => {
    try {
      await updateUserMutation.mutateAsync({
        id,
        payload: { isApproved: 'Rejected' }
      });
      toast.success(`${type} rejected successfully!`);
      setSelectedItem(null);
    } catch (error) {
      toast.error(`Failed to reject ${type}`);
    }
  };

  // Category management functions
  const handleSaveCategory = () => {
    if (!categoryForm.title.trim()) {
      alert('Please enter a category title');
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...categoryForm }
          : cat
      ));
      toast.success('Category updated successfully!');
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...categoryForm,
        productCount: 0
      };
      setCategories([...categories, newCategory]);
      toast.success('Category created successfully!');
    }

    // Reset form
    setCategoryForm({ emoji: '📦', title: '', description: '', image: '', active: true });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      emoji: category.emoji,
      title: category.title,
      description: category.description,
      image: category.image || '',
      active: category.active
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(categories.filter(cat => cat.id !== id));
      alert('Category deleted successfully!');
    }
  };

  const handleToggleCategoryStatus = (id: number) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, active: !cat.active } : cat
    ));
  };

  // Calculate platform stats
  const platformStats = {
    totalVendors: vendors.filter(v => v.isApproved === 'Approved').length,
    pendingVendors: vendors.filter(v => v.isApproved === 'Pending').length,
    totalServiceProviders: serviceProviders.filter(sp => sp.isApproved === 'Approved').length,
    pendingServiceProviders: serviceProviders.filter(sp => sp.isApproved === 'Pending').length,
    totalRevenue: 2450000,
    monthlyRevenue: 450000,
    totalOrders: 1247,
    activeOrders: 234,
    totalCategories: categories.filter(c => c.active).length
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col shadow-xl" style={{ backgroundColor: '#1E293B' }}>
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Build Hub</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>Super Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold mb-3 px-3" style={{ color: '#64748B' }}>MAIN MENU</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate2(item.id as Section)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  backgroundColor: isActive ? '#ef4136' : 'transparent',
                  color: isActive ? 'white' : '#94A3B8',
                }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}

          <div className="pt-4 border-t mt-4" style={{ borderColor: '#334155' }}>
            <p className="text-xs font-semibold mb-3 px-3" style={{ color: '#64748B' }}>SYSTEM</p>
            <button
              onClick={() => navigate2('settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
              style={{ color: '#94A3B8' }}
            >
              <Settings size={18} /> Platform Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
              style={{ color: '#94A3B8' }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <div>
              <div className="text-white text-sm font-medium">Super Admin</div>
              <div className="text-xs" style={{ color: '#64748B' }}>admin@buildhub.pk</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <h1 className="font-bold text-xl" style={{ color: '#1E293B' }}>
              {activeSection === 'overview' ? 'Platform Dashboard' :
               activeSection === 'vendors' ? 'Vendor Management' :
               activeSection === 'service-providers' ? 'Service Provider Management' :
               activeSection === 'buyers' ? 'Buyer Management' :
               activeSection === 'orders' ? 'All Orders' :
               activeSection === 'categories' ? 'Category Management' :
               activeSection === 'revenue' ? 'Revenue & Commission' : 'Platform Settings'}
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {activeSection === 'overview' ? 'Overview of platform metrics and activity' :
               activeSection === 'vendors' ? 'Approve and manage vendor accounts' :
               activeSection === 'service-providers' ? 'Approve and manage service provider accounts' :
               activeSection === 'categories' ? 'Manage product and service categories' :
               'Manage platform content and users'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl border hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
              <Bell size={20} style={{ color: '#64748B' }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4136' }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <Shield size={16} style={{ color: '#ef4136' }} />
              <span className="text-xs font-semibold" style={{ color: '#991B1B' }}>Super Admin Access</span>
            </div>
          </div>
        </header>

        <DemoNav />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ─── OVERVIEW DASHBOARD ─── */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `Rs. ${(platformStats.totalRevenue / 1000000).toFixed(2)}M`, icon: DollarSign, color: '#10B981', change: '+12%' },
                  { label: 'Active Orders', value: platformStats.activeOrders, icon: ShoppingBag, color: '#3B82F6', change: '+8%' },
                  { label: 'Total Vendors', value: platformStats.totalVendors, icon: Store, color: '#F59E0B', change: '+15%' },
                  { label: 'Service Providers', value: platformStats.totalServiceProviders, icon: Briefcase, color: '#8B5CF6', change: '+10%' },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${metric.color}15` }}>
                          <Icon size={20} style={{ color: metric.color }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{metric.change}</span>
                      </div>
                      <div className="font-bold text-2xl mb-1" style={{ color: '#1E293B' }}>{metric.value}</div>
                      <div className="text-xs" style={{ color: '#64748B' }}>{metric.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Pending Approvals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#1E293B' }}>Pending Vendors</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                      {platformStats.pendingVendors}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>Vendor registrations awaiting approval</p>
                  <button
                    onClick={() => navigate2('vendors')}
                    className="w-full py-2 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#ef4136' }}
                  >
                    Review Now
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#1E293B' }}>Pending Service Providers</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                      {platformStats.pendingServiceProviders}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>Service provider registrations awaiting approval</p>
                  <button
                    onClick={() => navigate2('service-providers')}
                    className="w-full py-2 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#ef4136' }}
                  >
                    Review Now
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#1E293B' }}>Active Categories</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                      {platformStats.totalCategories}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>Product and service categories on platform</p>
                  <button
                    onClick={() => navigate2('categories')}
                    className="w-full py-2 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#ef4136' }}
                  >
                    Manage Categories
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                <div className="p-5 border-b" style={{ borderColor: '#E2E8F0' }}>
                  <h3 className="font-semibold" style={{ color: '#1E293B' }}>Recent Platform Activity</h3>
                </div>
                <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {[
                    { action: 'New vendor registration', user: 'Ahmed Materials', time: '5 minutes ago', icon: Store, color: '#F59E0B' },
                    { action: 'Category created', user: 'Wood & Timber category added', time: '12 minutes ago', icon: Layers, color: '#8B5CF6' },
                    { action: 'Service provider approved', user: 'Eng. Bilal Khan', time: '25 minutes ago', icon: UserCheck, color: '#10B981' },
                    { action: 'New order placed', user: 'Order #ORD-2051', time: '1 hour ago', icon: ShoppingBag, color: '#3B82F6' },
                  ].map((activity, idx) => {
                    const Icon = activity.icon;
                    return (
                      <div key={idx} className="p-4 flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${activity.color}15` }}>
                          <Icon size={16} style={{ color: activity.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: '#1E293B' }}>{activity.action}</p>
                          <p className="text-xs" style={{ color: '#64748B' }}>{activity.user}</p>
                        </div>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>{activity.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── VENDOR MANAGEMENT ─── */}
          {activeSection === 'vendors' && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
                  {[
                    { id: 'all', label: 'All Vendors', count: vendors.length },
                    { id: 'Pending', label: 'Pending Approval', count: vendors.filter(v => v.isApproved === 'Pending').length },
                    { id: 'Approved', label: 'Approved', count: vendors.filter(v => v.isApproved === 'Approved').length },
                    { id: 'Rejected', label: 'Rejected', count: vendors.filter(v => v.isApproved === 'Rejected').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className="px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                      style={{
                        borderColor: selectedTab === tab.id ? '#ef4136' : 'transparent',
                        color: selectedTab === tab.id ? '#ef4136' : '#64748B'
                      }}
                    >
                      {tab.label}
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
                        backgroundColor: selectedTab === tab.id ? '#FEF3C7' : '#F1F5F9',
                        color: selectedTab === tab.id ? '#92400E' : '#64748B'
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by vendor name, email, or business..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Vendor List */}
                <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {vendorsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#ef4136' }} />
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading vendors...</p>
                    </div>
                  ) : vendors
                    .filter(v => {
                      if (selectedTab === 'all') return true;
                      return v.isApproved === selectedTab;
                    })
                    .filter(v => (v.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (v.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (v.shopName || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((vendor) => {
                      const statusConfig = {
                        Pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
                        Approved: { label: 'Approved', color: '#166534', bg: '#DCFCE7' },
                        Rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2' },
                      };
                      const s = statusConfig[vendor.isApproved as keyof typeof statusConfig] || statusConfig.Pending;

                      return (
                        <div key={vendor.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                                {vendor.logo ? (
                                  <img src={vendor.logo} alt={vendor.shopName ?? undefined} className="w-full h-full object-cover" />
                                ) : (
                                  <Store size={24} style={{ color: '#64748B' }} />
                                )}
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Vendor ID</div>
                                  <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>V-{vendor.id}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{vendor.fullName}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Shop/Business</div>
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{vendor.shopName || 'N/A'}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{vendor.tier || 'Standard'}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Contact</div>
                                  <div className="text-xs" style={{ color: '#64748B' }}>{vendor.email}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{vendor.phone}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Status</div>
                                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>
                                    {s.label}
                                  </span>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>Reg: {new Date(vendor.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedItem(vendor)}
                                className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} style={{ color: '#3B82F6' }} />
                              </button>
                              {selectedTab !== 'Approved' && (
                                <button
                                  onClick={() => handleApprove('Vendor', vendor.id)}
                                  className={`p-2 rounded-lg transition-colors ${vendor.isApproved === 'Approved' ? 'bg-green-50' : 'hover:bg-green-50'}`}
                                  title="Approve"
                                  disabled={vendor.isApproved === 'Approved'}
                                >
                                  <Check size={16} style={{ color: vendor.isApproved === 'Approved' ? '#10B981' : '#64748B' }} />
                                </button>
                              )}
                              <button
                                onClick={() => handleReject('Vendor', vendor.id)}
                                className={`p-2 rounded-lg transition-colors ${vendor.isApproved === 'Rejected' ? 'bg-red-50' : 'hover:bg-red-50'}`}
                                title="Reject"
                                disabled={vendor.isApproved === 'Rejected'}
                              >
                                <X size={16} style={{ color: vendor.isApproved === 'Rejected' ? '#EF4444' : '#64748B' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ─── SERVICE PROVIDER MANAGEMENT ─── */}
          {activeSection === 'service-providers' && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
                  {[
                    { id: 'all', label: 'All Providers', count: serviceProviders.length },
                    { id: 'Pending', label: 'Pending Approval', count: serviceProviders.filter(sp => sp.isApproved === 'Pending').length },
                    { id: 'Approved', label: 'Approved', count: serviceProviders.filter(sp => sp.isApproved === 'Approved').length },
                    { id: 'Rejected', label: 'Rejected', count: serviceProviders.filter(sp => sp.isApproved === 'Rejected').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className="px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                      style={{
                        borderColor: selectedTab === tab.id ? '#ef4136' : 'transparent',
                        color: selectedTab === tab.id ? '#ef4136' : '#64748B'
                      }}
                    >
                      {tab.label}
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
                        backgroundColor: selectedTab === tab.id ? '#FEF3C7' : '#F1F5F9',
                        color: selectedTab === tab.id ? '#92400E' : '#64748B'
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, or occupation..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Service Provider List */}
                <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {serviceProvidersLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#ef4136' }} />
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading providers...</p>
                    </div>
                  ) : serviceProviders
                    .filter(sp => {
                      if (selectedTab === 'all') return true;
                      return sp.isApproved === selectedTab;
                    })
                    .filter(sp => (sp.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (sp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (sp.role || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((provider) => {
                      const statusConfig = {
                        Pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
                        Approved: { label: 'Approved', color: '#166534', bg: '#DCFCE7' },
                        Rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2' },
                      };
                      const s = statusConfig[provider.isApproved as keyof typeof statusConfig] || statusConfig.Pending;

                      return (
                        <div key={provider.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
                                <Briefcase size={24} style={{ color: '#10B981' }} />
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Provider ID</div>
                                  <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>SP-{provider.id}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{provider.fullName}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Occupation</div>
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{provider.role}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>Status: {provider.status}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Contact</div>
                                  <div className="text-xs" style={{ color: '#64748B' }}>{provider.email}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{provider.phone}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Status</div>
                                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>
                                    {s.label}
                                  </span>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>Reg: {new Date(provider.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedItem(provider)}
                                className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} style={{ color: '#3B82F6' }} />
                              </button>
                              {selectedTab !== 'Approved' && (
                                <button
                                  onClick={() => handleApprove('Service Provider', provider.id)}
                                  className={`p-2 rounded-lg transition-colors ${provider.isApproved === 'Approved' ? 'bg-green-50' : 'hover:bg-green-50'}`}
                                  title="Approve"
                                  disabled={provider.isApproved === 'Approved'}
                                >
                                  <Check size={16} style={{ color: provider.isApproved === 'Approved' ? '#10B981' : '#64748B' }} />
                                </button>
                              )}
                              <button
                                onClick={() => handleReject('Service Provider', provider.id)}
                                className={`p-2 rounded-lg transition-colors ${provider.isApproved === 'Rejected' ? 'bg-red-50' : 'hover:bg-red-50'}`}
                                title="Reject"
                                disabled={provider.isApproved === 'Rejected'}
                              >
                                <X size={16} style={{ color: provider.isApproved === 'Rejected' ? '#EF4444' : '#64748B' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Settings Placeholder */}
          {activeSection === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="font-bold text-xl mb-4" style={{ color: '#1E293B' }}>Platform Settings</h2>
              <p style={{ color: '#64748B' }}>Platform configuration and settings will be available here.</p>
            </div>
          )}

          {/* ─── CATEGORY MANAGEMENT ─── */}
          {activeSection === 'categories' && (
            <div className="space-y-5">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg" style={{ color: '#1E293B' }}>Platform Categories</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Manage product and service categories</p>
                </div>
                <button
                  onClick={() => {
                    setCategoryForm({ emoji: '📦', title: '', description: '', image: '', active: true });
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#ef4136' }}
                >
                  <Plus size={18} /> Add Category
                </button>
              </div>

              {/* Category Form Modal */}
              {showCategoryForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryForm(false)}>
                  <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                      <h3 className="font-bold text-lg" style={{ color: '#1E293B' }}>
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                        Create a new category with emoji, title, and description
                      </p>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Emoji Picker */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>
                          Category Emoji *
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl hover:bg-gray-50 transition-colors"
                            style={{ borderColor: '#E2E8F0' }}
                          >
                            {categoryForm.emoji}
                          </button>
                          <div className="flex-1">
                            <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>
                              Click to select an emoji
                            </p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                              Choose an emoji that represents this category
                            </p>
                          </div>
                        </div>

                        {/* Emoji Options Grid */}
                        {showEmojiPicker && (
                          <div className="mt-3 p-4 rounded-xl border grid grid-cols-10 gap-2" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}>
                            {emojiOptions.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setCategoryForm({ ...categoryForm, emoji });
                                  setShowEmojiPicker(false);
                                }}
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl hover:bg-white transition-colors"
                                style={{
                                  backgroundColor: categoryForm.emoji === emoji ? '#FEF2F2' : 'transparent',
                                  border: categoryForm.emoji === emoji ? '2px solid #ef4136' : '1px solid #E2E8F0'
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>
                          Category Title *
                        </label>
                        <input
                          type="text"
                          value={categoryForm.title}
                          onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                          placeholder="e.g. Cement & Concrete"
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>
                          Description
                        </label>
                        <textarea
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Describe what products/services belong in this category..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>
                          Category Image
                        </label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={categoryForm.image}
                            onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                            style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                          />
                          {categoryForm.image && (
                            <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: '#E2E8F0' }}>
                              <img
                                src={categoryForm.image}
                                alt="Category preview"
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23F1F5F9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2394A3B8" font-size="16"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                                }}
                              />
                              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>
                                Preview
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                            <ImageIcon size={16} style={{ color: '#3B82F6', flexShrink: 0, marginTop: 2 }} />
                            <p className="text-xs" style={{ color: '#1E40AF' }}>
                              Recommended: 400x300px image. Use Unsplash or upload to an image hosting service and paste the URL here.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Active Status */}
                      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                        <input
                          type="checkbox"
                          id="category-active"
                          checked={categoryForm.active}
                          onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label htmlFor="category-active" className="text-sm font-medium cursor-pointer" style={{ color: '#334155' }}>
                          Active (visible to users on the platform)
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t flex items-center justify-end gap-3" style={{ borderColor: '#E2E8F0' }}>
                      <button
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                          setCategoryForm({ emoji: '📦', title: '', description: '', image: '', active: true });
                        }}
                        className="px-5 py-2.5 rounded-xl border font-semibold text-sm hover:bg-gray-50 transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCategory}
                        className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#ef4136' }}
                      >
                        <Save size={16} />
                        {editingCategory ? 'Update Category' : 'Create Category'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed" style={{ borderColor: '#E2E8F0' }}>
                    <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#ef4136' }} />
                    <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading categories...</p>
                  </div>
                ) : categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    {/* Category Image */}
                    {category.image && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 w-12 h-12 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                          {category.emoji}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm" style={{
                            backgroundColor: category.active ? 'rgba(220, 252, 231, 0.95)' : 'rgba(254, 226, 226, 0.95)',
                            color: category.active ? '#166534' : '#991B1B'
                          }}>
                            {category.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {!category.image && (
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#F8FAFC' }}>
                              {category.emoji}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1" style={{ color: '#1E293B' }}>
                                {category.title}
                              </h3>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                backgroundColor: category.active ? '#DCFCE7' : '#FEE2E2',
                                color: category.active ? '#166534' : '#991B1B'
                              }}>
                                {category.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {category.image && (
                        <div className="mb-3">
                          <h3 className="font-semibold mb-1" style={{ color: '#1E293B' }}>
                            {category.title}
                          </h3>
                        </div>
                      )}

                      <p className="text-sm mb-4 line-clamp-2" style={{ color: '#64748B' }}>
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                        <div className="text-xs" style={{ color: '#64748B' }}>
                          <span className="font-semibold" style={{ color: '#1E293B' }}>{category.productCount}</span> products
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} style={{ color: '#3B82F6' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Category Card */}
                <button
                  onClick={() => {
                    setCategoryForm({ emoji: '📦', title: '', description: '', image: '', active: true });
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }}
                  className="rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-colors min-h-[200px]"
                  style={{ borderColor: '#CBD5E1' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
                    <Plus size={24} style={{ color: '#64748B' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#64748B' }}>Add New Category</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── ORDERS MANAGEMENT ─── */}
          {activeSection === 'orders' && (() => {
            // Calculate order metrics (from all available data if possible, or current page)
            const orderMetrics = {
              total: totalOrdersCount,
              pending: orders.filter(o => o.orderStatus === 'Pending').length,
              processing: orders.filter(o => o.orderStatus === 'Processing').length,
              shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
              delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
              cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
              totalRevenue: orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + parseFloat(o.totalAmount || '0'), 0),
              pendingPayments: orders.filter(o => o.paymentStatus === 'Unpaid').length,
            };

            const paginatedOrders = orders;
            const totalPages = ordersData?.lastPage || 1;

            const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
              try {
                await updateOrderMutation.mutateAsync({ id: orderId, status: newStatus });
                toast.success(`Order #${orderId} status updated to ${newStatus}`);
              } catch (error) {
                toast.error(`Failed to update order status`);
              }
            };

            const handleBulkAction = (action: string) => {
              toast.info(`Bulk action "${action}" applied to ${selectedOrders.length} orders`);
              setSelectedOrders([]);
            };

            return (
              <div className="space-y-5">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Orders', value: orderMetrics.total, icon: ShoppingBag, color: '#3e3e3e', subtext: 'All time' },
                    { label: 'Pending', value: orderMetrics.pending, icon: Clock, color: '#F59E0B', subtext: 'Awaiting confirmation' },
                    { label: 'Shipped', value: orderMetrics.shipped, icon: Truck, color: '#3B82F6', subtext: 'Shipped orders' },
                    { label: 'Delivered', value: orderMetrics.delivered, icon: CheckCircle2, color: '#10B981', subtext: 'Completed' },
                    { label: 'Total Sales', value: `Rs. ${(orderMetrics.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: '#8B5CF6', subtext: 'Platform volume' },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${metric.color}15` }}>
                            <Icon size={18} style={{ color: metric.color }} />
                          </div>
                        </div>
                        <div className="font-bold text-xl mb-0.5" style={{ color: '#1E293B' }}>{metric.value}</div>
                        <div className="text-xs font-medium mb-0.5" style={{ color: '#64748B' }}>{metric.label}</div>
                        <div className="text-xs" style={{ color: '#94A3B8' }}>{metric.subtext}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Main Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                  {/* Status Tabs */}
                  <div className="flex border-b overflow-x-auto" style={{ borderColor: '#E2E8F0' }}>
                    {[
                      { id: 'All', label: 'All Orders', count: totalOrdersCount },
                      { id: 'Pending', label: 'Pending', count: orderMetrics.pending },
                      { id: 'Processing', label: 'Processing', count: orderMetrics.processing },
                      { id: 'Shipped', label: 'Shipped', count: orderMetrics.shipped },
                      { id: 'Delivered', label: 'Delivered', count: orderMetrics.delivered },
                      { id: 'Cancelled', label: 'Cancelled', count: orderMetrics.cancelled },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setOrderFilters({ ...orderFilters, status: tab.id });
                          setOrdersPage(1);
                        }}
                        className="px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                        style={{
                          borderColor: orderFilters.status === tab.id ? '#ef4136' : 'transparent',
                          color: orderFilters.status === tab.id ? '#ef4136' : '#64748B'
                        }}
                      >
                        {tab.label}
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
                          backgroundColor: orderFilters.status === tab.id ? '#FEF3C7' : '#F1F5F9',
                          color: orderFilters.status === tab.id ? '#92400E' : '#64748B'
                        }}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Filters Bar */}
                  <div className="p-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <div className="relative flex-1 min-w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        value={orderFilters.search}
                        onChange={(e) => {
                          setOrderFilters({ ...orderFilters, search: e.target.value });
                          setOrdersPage(1);
                        }}
                        placeholder="Search by Order ID, Buyer, Vendor, or Item..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                      />
                    </div>

                    <select
                      value={orderFilters.paymentStatus}
                      onChange={(e) => {
                        setOrderFilters({ ...orderFilters, paymentStatus: e.target.value });
                        setOrdersPage(1);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="failed">Failed</option>
                    </select>

                    <select
                      value={orderFilters.orderType}
                      onChange={(e) => {
                        setOrderFilters({ ...orderFilters, orderType: e.target.value });
                        setOrdersPage(1);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                    >
                      <option value="all">All Types</option>
                      <option value="Product">Products</option>
                      <option value="Service">Services</option>
                      <option value="Mixed">Mixed</option>
                    </select>

                    <select
                      value={orderFilters.dateRange}
                      onChange={(e) => {
                        setOrderFilters({ ...orderFilters, dateRange: e.target.value });
                        setOrdersPage(1);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">This Month</option>
                    </select>

                    <button
                      className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 hover:bg-white transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#64748B', backgroundColor: 'white' }}
                    >
                      <Download size={16} /> Export
                    </button>
                  </div>

                  {/* Bulk Actions Bar */}
                  {selectedOrders.length > 0 && (
                    <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#E2E8F0', backgroundColor: '#FEF3C7' }}>
                      <span className="text-sm font-semibold" style={{ color: '#92400E' }}>
                        {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                      </span>
                      <button
                        onClick={() => handleBulkAction('Mark as Confirmed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
                        style={{ backgroundColor: '#3B82F6', color: 'white' }}
                      >
                        Mark as Confirmed
                      </button>
                      <button
                        onClick={() => handleBulkAction('Mark as Shipped')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
                        style={{ backgroundColor: '#8B5CF6', color: 'white' }}
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => handleBulkAction('Export Selected')}
                        className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-white"
                        style={{ borderColor: '#92400E', color: '#92400E' }}
                      >
                        Export Selected
                      </button>
                      <button
                        onClick={() => setSelectedOrders([])}
                        className="ml-auto text-sm font-medium hover:underline"
                        style={{ color: '#64748B' }}
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}

                  {/* Orders List */}
                  <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {ordersLoading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#ef4136' }} />
                        <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading orders...</p>
                      </div>
                    ) : paginatedOrders.length > 0 ? paginatedOrders.map((order) => {
                      const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                        Pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
                        Processing: { label: 'Processing', color: '#8B5CF6', bg: '#EDE9FE' },
                        Shipped: { label: 'Shipped', color: '#06B6D4', bg: '#CFFAFE' },
                        Delivered: { label: 'Delivered', color: '#10B981', bg: '#DCFCE7' },
                        Cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
                      };

                      const paymentConfig: Record<string, { color: string; bg: string }> = {
                        Paid: { color: '#10B981', bg: '#DCFCE7' },
                        Unpaid: { color: '#F59E0B', bg: '#FEF3C7' },
                        Partial: { color: '#3B82F6', bg: '#DBEAFE' },
                        Failed: { color: '#EF4444', bg: '#FEE2E2' },
                      };

                      const s = statusConfig[order.orderStatus as keyof typeof statusConfig] || { label: order.orderStatus, color: '#64748B', bg: '#F1F5F9' };
                      const p = paymentConfig[order.paymentStatus as keyof typeof paymentConfig] || { color: '#64748B', bg: '#F1F5F9' };

                      return (
                        <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id.toString())}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrders([...selectedOrders, order.id.toString()]);
                                } else {
                                  setSelectedOrders(selectedOrders.filter(id => id !== order.id.toString()));
                                }
                              }}
                              className="w-4 h-4"
                            />

                            {/* Order Details */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Order ID</div>
                                <div className="font-mono font-semibold text-sm flex items-center gap-2" style={{ color: '#1E293B' }}>
                                  #{order.id}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Buyer</div>
                                <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{order.user?.fullName}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{order.address?.city || 'N/A'}</div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Payment Info</div>
                                <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{order.paymentMethod}</div>
                                <div className="text-xs mt-0.5 truncate" style={{ color: '#64748B' }}>
                                  ID: {order.transactionId || 'N/A'}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Items</div>
                                <div className="text-sm truncate max-w-[150px]" style={{ color: '#1E293B' }} title={order.items.map(i => i.product?.title).join(', ')}>
                                  {order.items[0]?.product?.title || 'No items'}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Amount</div>
                                <div className="font-bold text-sm" style={{ color: '#1E293B' }}>
                                  Rs. {parseFloat(order.totalAmount).toLocaleString()}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Status</div>
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1" style={{ color: s.color, backgroundColor: s.bg }}>
                                  {s.label}
                                </span>
                                <div className="block">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ color: p.color, backgroundColor: p.bg }}>
                                    {order.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <button
                              onClick={() => setSelectedOrderDetail(order)}
                              className="p-2 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                              title="View Details"
                            >
                              <Eye size={16} style={{ color: '#3B82F6' }} />
                            </button>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="p-12 text-center">
                        <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: '#CBD5E1' }} />
                        <p className="font-semibold text-lg mb-2" style={{ color: '#64748B' }}>No orders found</p>
                        <p className="text-sm" style={{ color: '#94A3B8' }}>Try adjusting your filters or search query</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                      <div className="text-sm" style={{ color: '#64748B' }}>
                        Showing {((ordersPage - 1) * ordersPerPage) + 1} to {Math.min(ordersPage * ordersPerPage, totalOrdersCount)} of {totalOrdersCount} orders
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOrdersPage(Math.max(1, ordersPage - 1))}
                          disabled={ordersPage === 1}
                          className="px-3 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (ordersPage <= 3) {
                              pageNum = i + 1;
                            } else if (ordersPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = ordersPage - 2 + i;
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => setOrdersPage(pageNum)}
                                className="w-10 h-10 rounded-lg text-sm font-semibold transition-colors"
                                style={{
                                  backgroundColor: ordersPage === pageNum ? '#ef4136' : 'transparent',
                                  color: ordersPage === pageNum ? 'white' : '#64748B'
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setOrdersPage(Math.min(totalPages, ordersPage + 1))}
                          disabled={ordersPage === totalPages}
                          className="px-3 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Detail Drawer */}
                {selectedOrderDetail && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrderDetail(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="p-6 border-b sticky top-0 bg-white z-10" style={{ borderColor: '#E2E8F0' }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg mb-1" style={{ color: '#1E293B' }}>Order Details</h3>
                            <p className="text-sm" style={{ color: '#64748B' }}>{selectedOrderDetail.id}</p>
                          </div>
                          <button
                            onClick={() => setSelectedOrderDetail(null)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                          >
                            <X size={20} style={{ color: '#64748B' }} />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Status Update */}
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Update Order Status</label>
                          <select
                            value={selectedOrderDetail.status}
                            onChange={(e) => handleUpdateOrderStatus(selectedOrderDetail.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none font-semibold"
                            style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>

                        {/* Order Timeline */}
                        <div>
                          <h4 className="font-semibold mb-3" style={{ color: '#1E293B' }}>Order Timeline</h4>
                          <div className="space-y-3">
                            {selectedOrderDetail.timeline.map((step: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  {step.completed ? (
                                    <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#CBD5E1' }} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium" style={{ color: step.completed ? '#1E293B' : '#94A3B8' }}>
                                    {step.status}
                                  </p>
                                  <p className="text-xs" style={{ color: '#94A3B8' }}>
                                    {new Date(step.date).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer & Vendor Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                            <h4 className="font-semibold text-sm mb-3" style={{ color: '#1E293B' }}>Buyer Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.buyer}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.buyerEmail}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.buyerPhone}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="mt-0.5" style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.deliveryAddress}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                            <h4 className="font-semibold text-sm mb-3" style={{ color: '#1E293B' }}>Vendor Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Store size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.vendor}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.vendorEmail}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.vendorPhone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Tag size={14} style={{ color: '#64748B' }} />
                                <span style={{ color: '#64748B' }}>{selectedOrderDetail.type}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment & Order Summary */}
                        <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                          <h4 className="font-semibold text-sm mb-3" style={{ color: '#1E293B' }}>Payment & Order Summary</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span style={{ color: '#64748B' }}>Order Amount</span>
                              <span className="font-semibold" style={{ color: '#1E293B' }}>Rs. {selectedOrderDetail.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span style={{ color: '#64748B' }}>Platform Commission (5%)</span>
                              <span className="font-semibold" style={{ color: '#8B5CF6' }}>Rs. {Math.round(selectedOrderDetail.commission).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span style={{ color: '#64748B' }}>Payment Method</span>
                              <span className="font-medium" style={{ color: '#1E293B' }}>{selectedOrderDetail.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span style={{ color: '#64748B' }}>Payment Status</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                                backgroundColor: selectedOrderDetail.paymentStatus === 'paid' ? '#DCFCE7' : '#FEF3C7',
                                color: selectedOrderDetail.paymentStatus === 'paid' ? '#166534' : '#92400E'
                              }}>
                                {selectedOrderDetail.paymentStatus}
                              </span>
                            </div>
                            {selectedOrderDetail.notes && (
                              <div className="pt-3 border-t" style={{ borderColor: '#E2E8F0' }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Notes</p>
                                <p className="text-sm" style={{ color: '#1E293B' }}>{selectedOrderDetail.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─── BUYER MANAGEMENT ─── */}
          {activeSection === 'buyers' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#1E293B' }}>Platform Buyers</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                      Total Buyers: {buyers.length}
                    </span>
                  </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search buyers by name, email, or phone..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Buyers List */}
                <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {buyersLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#ef4136' }} />
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Loading buyers...</p>
                    </div>
                  ) : buyers
                    .filter(b => (b.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (b.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (b.phone || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((buyer) => (
                      <div key={buyer.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                              <User size={24} style={{ color: '#6366F1' }} />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Buyer ID</div>
                                <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>B-{buyer.id}</div>
                                <div className="text-xs mt-1" style={{ color: '#64748B' }}>{buyer.fullName}</div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Contact Info</div>
                                <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{buyer.email}</div>
                                <div className="text-xs mt-1" style={{ color: '#64748B' }}>{buyer.phone}</div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Verification</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{
                                    backgroundColor: buyer.isPhoneVerified ? '#DCFCE7' : '#FEE2E2',
                                    color: buyer.isPhoneVerified ? '#166534' : '#991B1B'
                                  }}>
                                    Phone: {buyer.isPhoneVerified ? 'Verified' : 'Unverified'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Join Date</div>
                                <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{new Date(buyer.createdAt).toLocaleDateString()}</div>
                                <div className="text-xs mt-1" style={{ color: '#64748B' }}>Status: {buyer.status}</div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedItem(buyer)}
                              className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="View History"
                            >
                              <Eye size={16} style={{ color: '#3B82F6' }} />
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Deactivate Account"
                            >
                              <Ban size={16} style={{ color: '#EF4444' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {!buyersLoading && buyers.length === 0 && (
                    <div className="py-20 text-center">
                      <Users size={48} className="mx-auto mb-4 opacity-20" />
                      <p style={{ color: '#64748B' }}>No buyers found on the platform yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholders */}
          {['revenue'].includes(activeSection) && (
            <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="font-bold text-xl mb-4" style={{ color: '#1E293B' }}>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
              </h2>
              <p style={{ color: '#64748B' }}>This section is under development. Full functionality coming soon.</p>
            </div>
          )}

          {/* ─── USER DETAIL MODAL ─── */}
          {selectedItem && (
            <UserDetailModal
              userId={selectedItem.id}
              userRole={selectedItem.role}
              onClose={() => setSelectedItem(null)}
              onApprove={(id: number) => handleApprove(selectedItem.role === 'Vendor' ? 'Vendor' : 'Service Provider', id)}
              onReject={(id: number) => handleReject(selectedItem.role === 'Vendor' ? 'Vendor' : 'Service Provider', id)}
            />
          )}

        </main>
      </div>
    </div>
  );
}
