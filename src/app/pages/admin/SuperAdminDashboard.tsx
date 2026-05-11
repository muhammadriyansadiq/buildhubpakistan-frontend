'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  LayoutDashboard, Users, Package, Briefcase, ShoppingBag, FileText,
  Settings, LogOut, Search, Filter, Download, MoreVertical, Eye,
  Check, X, Clock, TrendingUp, DollarSign, AlertCircle, ChevronRight,
  Store, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, Ban,
  CheckCircle2, XCircle, Building, Shield, Tag, Bell, Activity,
  UserCheck, UserX, PackageCheck, PackageX, Layers, Percent, ChevronDown,
  Plus, Save, Smile, Upload, Image as ImageIcon, Truck
} from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';

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

export default function SuperAdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>((params?.section as Section) || 'overview');
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Category management state
  const [categories, setCategories] = useState(initialCategories);
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

  // Orders management state
  const [orderFilters, setOrderFilters] = useState({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    orderType: 'all',
    dateRange: 'all',
    vendor: 'all',
    priority: 'all'
  });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 15;

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendors', icon: Store, badge: mockVendors.filter(v => v.status === 'pending').length },
    { id: 'service-providers', label: 'Service Providers', icon: Briefcase, badge: mockServiceProviders.filter(sp => sp.status === 'pending').length },
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'orders', label: 'All Orders', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'revenue', label: 'Revenue & Commission', icon: DollarSign },
  ];

  const navigate2 = (section: Section) => {
    setActiveSection(section);
    router.push(`/admin/super/${section}`);
  };

  const handleApprove = (type: string, id: string) => {
    alert(`${type} ${id} approved successfully!`);
    setSelectedItem(null);
  };

  const handleReject = (type: string, id: string) => {
    alert(`${type} ${id} rejected!`);
    setSelectedItem(null);
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
      alert('Category updated successfully!');
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...categoryForm,
        productCount: 0
      };
      setCategories([...categories, newCategory]);
      alert('Category created successfully!');
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
    totalVendors: mockVendors.filter(v => v.status === 'approved').length,
    pendingVendors: mockVendors.filter(v => v.status === 'pending').length,
    totalServiceProviders: mockServiceProviders.filter(sp => sp.status === 'approved').length,
    pendingServiceProviders: mockServiceProviders.filter(sp => sp.status === 'pending').length,
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
                    { id: 'all', label: 'All Vendors', count: mockVendors.length },
                    { id: 'pending', label: 'Pending Approval', count: mockVendors.filter(v => v.status === 'pending').length },
                    { id: 'approved', label: 'Approved', count: mockVendors.filter(v => v.status === 'approved').length },
                    { id: 'rejected', label: 'Rejected', count: mockVendors.filter(v => v.status === 'rejected').length },
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
                  {mockVendors
                    .filter(v => selectedTab === 'all' || v.status === selectedTab)
                    .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                v.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((vendor) => {
                      const statusConfig = {
                        pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
                        approved: { label: 'Approved', color: '#166534', bg: '#DCFCE7' },
                        rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2' },
                      };
                      const s = statusConfig[vendor.status as keyof typeof statusConfig];

                      return (
                        <div key={vendor.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
                                <Store size={24} style={{ color: '#64748B' }} />
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Vendor ID</div>
                                  <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{vendor.id}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{vendor.name}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Business</div>
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{vendor.businessName}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{vendor.category}</div>
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
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>Reg: {vendor.registeredDate}</div>
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
                              {vendor.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove('Vendor', vendor.id)}
                                    className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                                    title="Approve"
                                  >
                                    <Check size={16} style={{ color: '#10B981' }} />
                                  </button>
                                  <button
                                    onClick={() => handleReject('Vendor', vendor.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Reject"
                                  >
                                    <X size={16} style={{ color: '#EF4444' }} />
                                  </button>
                                </>
                              )}
                              {vendor.status === 'approved' && (
                                <button
                                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Suspend"
                                >
                                  <Ban size={16} style={{ color: '#EF4444' }} />
                                </button>
                              )}
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
                    { id: 'all', label: 'All Providers', count: mockServiceProviders.length },
                    { id: 'pending', label: 'Pending Approval', count: mockServiceProviders.filter(sp => sp.status === 'pending').length },
                    { id: 'approved', label: 'Approved', count: mockServiceProviders.filter(sp => sp.status === 'approved').length },
                    { id: 'rejected', label: 'Rejected', count: mockServiceProviders.filter(sp => sp.status === 'rejected').length },
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
                  {mockServiceProviders
                    .filter(sp => selectedTab === 'all' || sp.status === selectedTab)
                    .filter(sp => sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 sp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 sp.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((provider) => {
                      const statusConfig = {
                        pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
                        approved: { label: 'Approved', color: '#166534', bg: '#DCFCE7' },
                        rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2' },
                      };
                      const s = statusConfig[provider.status as keyof typeof statusConfig];

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
                                  <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{provider.id}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>{provider.name}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Occupation</div>
                                  <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{provider.occupation}</div>
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>Exp: {provider.experience}</div>
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
                                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>Reg: {provider.registeredDate}</div>
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
                              {provider.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove('Service Provider', provider.id)}
                                    className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                                    title="Approve"
                                  >
                                    <Check size={16} style={{ color: '#10B981' }} />
                                  </button>
                                  <button
                                    onClick={() => handleReject('Service Provider', provider.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Reject"
                                  >
                                    <X size={16} style={{ color: '#EF4444' }} />
                                  </button>
                                </>
                              )}
                              {provider.status === 'approved' && (
                                <button
                                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Suspend"
                                >
                                  <Ban size={16} style={{ color: '#EF4444' }} />
                                </button>
                              )}
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
                {categories.map((category) => (
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
            // Filter orders
            const filteredOrders = allOrders.filter(order => {
              const matchesSearch = order.id.toLowerCase().includes(orderFilters.search.toLowerCase()) ||
                order.buyer.toLowerCase().includes(orderFilters.search.toLowerCase()) ||
                order.vendor.toLowerCase().includes(orderFilters.search.toLowerCase()) ||
                order.items.toLowerCase().includes(orderFilters.search.toLowerCase());
              const matchesStatus = orderFilters.status === 'all' || order.status === orderFilters.status;
              const matchesPayment = orderFilters.paymentStatus === 'all' || order.paymentStatus === orderFilters.paymentStatus;
              const matchesType = orderFilters.orderType === 'all' || order.type === orderFilters.orderType;
              const matchesVendor = orderFilters.vendor === 'all' || order.vendor === orderFilters.vendor;
              const matchesPriority = orderFilters.priority === 'all' || order.priority === orderFilters.priority;

              let matchesDate = true;
              if (orderFilters.dateRange !== 'all') {
                const orderDate = new Date(order.orderDate);
                const now = new Date();
                if (orderFilters.dateRange === 'today') {
                  matchesDate = orderDate.toDateString() === now.toDateString();
                } else if (orderFilters.dateRange === 'week') {
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  matchesDate = orderDate >= weekAgo;
                } else if (orderFilters.dateRange === 'month') {
                  matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                }
              }

              return matchesSearch && matchesStatus && matchesPayment && matchesType && matchesVendor && matchesPriority && matchesDate;
            });

            // Calculate order metrics
            const orderMetrics = {
              total: allOrders.length,
              pending: allOrders.filter(o => o.status === 'pending').length,
              processing: allOrders.filter(o => o.status === 'processing').length,
              shipped: allOrders.filter(o => o.status === 'shipped').length,
              delivered: allOrders.filter(o => o.status === 'delivered').length,
              cancelled: allOrders.filter(o => o.status === 'cancelled').length,
              totalRevenue: allOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0),
              totalCommission: allOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.commission, 0),
              pendingPayments: allOrders.filter(o => o.paymentStatus === 'pending').length,
              highPriority: allOrders.filter(o => o.priority === 'high').length
            };

            // Pagination
            const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
            const paginatedOrders = filteredOrders.slice(
              (ordersPage - 1) * ordersPerPage,
              ordersPage * ordersPerPage
            );

            const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
              alert(`Order ${orderId} status updated to ${newStatus}`);
            };

            const handleBulkAction = (action: string) => {
              alert(`Bulk action "${action}" applied to ${selectedOrders.length} orders`);
              setSelectedOrders([]);
            };

            return (
              <div className="space-y-5">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Orders', value: orderMetrics.total, icon: ShoppingBag, color: '#3e3e3e', subtext: 'All time' },
                    { label: 'Pending', value: orderMetrics.pending, icon: Clock, color: '#F59E0B', subtext: 'Awaiting confirmation' },
                    { label: 'In Transit', value: orderMetrics.shipped, icon: Truck, color: '#3B82F6', subtext: 'Shipped orders' },
                    { label: 'Delivered', value: orderMetrics.delivered, icon: CheckCircle2, color: '#10B981', subtext: 'Completed' },
                    { label: 'Commission', value: `Rs. ${(orderMetrics.totalCommission / 1000).toFixed(0)}K`, icon: DollarSign, color: '#8B5CF6', subtext: 'Platform earnings' },
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
                      { id: 'all', label: 'All Orders', count: allOrders.length },
                      { id: 'pending', label: 'Pending', count: orderMetrics.pending },
                      { id: 'confirmed', label: 'Confirmed', count: allOrders.filter(o => o.status === 'confirmed').length },
                      { id: 'processing', label: 'Processing', count: orderMetrics.processing },
                      { id: 'shipped', label: 'Shipped', count: orderMetrics.shipped },
                      { id: 'delivered', label: 'Delivered', count: orderMetrics.delivered },
                      { id: 'cancelled', label: 'Cancelled', count: orderMetrics.cancelled },
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
                    {paginatedOrders.length > 0 ? paginatedOrders.map((order) => {
                      const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                        pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
                        confirmed: { label: 'Confirmed', color: '#3B82F6', bg: '#DBEAFE' },
                        processing: { label: 'Processing', color: '#8B5CF6', bg: '#EDE9FE' },
                        shipped: { label: 'Shipped', color: '#06B6D4', bg: '#CFFAFE' },
                        delivered: { label: 'Delivered', color: '#10B981', bg: '#DCFCE7' },
                        cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
                        refunded: { label: 'Refunded', color: '#64748B', bg: '#F1F5F9' }
                      };

                      const paymentConfig: Record<string, { color: string; bg: string }> = {
                        paid: { color: '#10B981', bg: '#DCFCE7' },
                        pending: { color: '#F59E0B', bg: '#FEF3C7' },
                        partial: { color: '#3B82F6', bg: '#DBEAFE' },
                        failed: { color: '#EF4444', bg: '#FEE2E2' },
                        refunded: { color: '#64748B', bg: '#F1F5F9' }
                      };

                      const s = statusConfig[order.status];
                      const p = paymentConfig[order.paymentStatus];

                      return (
                        <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrders([...selectedOrders, order.id]);
                                } else {
                                  setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                }
                              }}
                              className="w-4 h-4"
                            />

                            {/* Order Details */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Order ID</div>
                                <div className="font-mono font-semibold text-sm flex items-center gap-2" style={{ color: '#1E293B' }}>
                                  {order.id}
                                  {order.priority === 'high' && (
                                    <span className="px-1.5 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                                      High Priority
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                  {order.orderDate} {order.orderTime}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Buyer</div>
                                <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{order.buyer}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{order.city}</div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Vendor</div>
                                <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{order.vendor}</div>
                                <div className="text-xs mt-0.5 px-1.5 py-0.5 rounded inline-block" style={{
                                  backgroundColor: order.type === 'Product' ? '#EFF6FF' : order.type === 'Service' ? '#F0FDF4' : '#FEF3C7',
                                  color: order.type === 'Product' ? '#1E40AF' : order.type === 'Service' ? '#166534' : '#92400E'
                                }}>
                                  {order.type}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Items</div>
                                <div className="text-sm" style={{ color: '#1E293B' }}>{order.items}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Amount</div>
                                <div className="font-bold text-sm" style={{ color: '#1E293B' }}>
                                  Rs. {order.totalAmount.toLocaleString()}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                                  Commission: Rs. {Math.round(order.commission).toLocaleString()}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Status</div>
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1" style={{ color: s.color, backgroundColor: s.bg }}>
                                  {s.label}
                                </span>
                                <div className="text-xs px-1.5 py-0.5 rounded inline-block" style={{ color: p.color, backgroundColor: p.bg }}>
                                  {order.paymentStatus}
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
                        Showing {((ordersPage - 1) * ordersPerPage) + 1} to {Math.min(ordersPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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

          {/* Other sections placeholders */}
          {['buyers', 'revenue'].includes(activeSection) && (
            <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="font-bold text-xl mb-4" style={{ color: '#1E293B' }}>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
              </h2>
              <p style={{ color: '#64748B' }}>This section is under development. Full functionality coming soon.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
