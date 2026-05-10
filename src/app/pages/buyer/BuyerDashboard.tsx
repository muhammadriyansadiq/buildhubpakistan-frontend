'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Package, MessageSquare, User, Heart, MapPin, CreditCard,
  ShoppingBag, FileText, Settings, ChevronRight, TrendingUp,
  Clock, CheckCircle2, XCircle, AlertCircle, Search, Filter,
  Send, Paperclip, Eye, Download, Plus, Trash2, Edit2, Home,
  Building, Phone, Mail, Map, Camera, Save, X, Loader2
} from 'lucide-react';
import { useEffect } from 'react';
import apiClient from '@/api/api-client';
import { toast } from 'sonner';

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: ShoppingBag },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'quotations', label: 'Quotations (RFQ)', icon: MessageSquare },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  { id: 'profile', label: 'Profile Settings', icon: User },
];

const orders = [
  { id: 'ORD-2024-001', date: '2024-05-01', status: 'delivered', items: 3, total: 45600, vendor: 'Ahmed Materials', estimatedDelivery: '2024-05-05' },
  { id: 'ORD-2024-002', date: '2024-05-03', status: 'in-transit', items: 2, total: 23400, vendor: 'Steel Mart PK', estimatedDelivery: '2024-05-07' },
  { id: 'ORD-2024-003', date: '2024-05-04', status: 'processing', items: 5, total: 67800, vendor: 'Tile World', estimatedDelivery: '2024-05-08' },
  { id: 'ORD-2024-004', date: '2024-05-02', status: 'cancelled', items: 1, total: 12500, vendor: 'Tool House', estimatedDelivery: '-' },
];

const quotations = [
  {
    id: 'RFQ-2024-001',
    title: 'Bulk Cement Order - 500 bags',
    date: '2024-05-03',
    status: 'replied',
    messages: 3,
    vendor: 'Ahmed Materials',
    lastUpdate: '2 hours ago',
    basePrice: 585000,
    description: 'Need 500 bags of OPC cement 50kg for construction project in Lahore'
  },
  {
    id: 'RFQ-2024-002',
    title: 'TMT Steel Bars - Various sizes',
    date: '2024-05-04',
    status: 'pending',
    messages: 1,
    vendor: 'Steel Mart PK',
    lastUpdate: '1 day ago',
    basePrice: null,
    description: 'Requirement: 10mm (2 tons), 12mm (3 tons), 16mm (1.5 tons)'
  },
  {
    id: 'RFQ-2024-003',
    title: 'Premium Floor Tiles - 2000 sq ft',
    date: '2024-04-28',
    status: 'accepted',
    messages: 7,
    vendor: 'Tile World',
    lastUpdate: '3 days ago',
    basePrice: 440000,
    description: '60x60cm porcelain tiles, multiple designs needed'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  'delivered': { label: 'Delivered', color: '#16A34A', bgColor: '#DCFCE7', icon: CheckCircle2 },
  'in-transit': { label: 'In Transit', color: '#2563EB', bgColor: '#DBEAFE', icon: TrendingUp },
  'processing': { label: 'Processing', color: '#F59E0B', bgColor: '#FEF3C7', icon: Clock },
  'cancelled': { label: 'Cancelled', color: '#DC2626', bgColor: '#FEE2E2', icon: XCircle },
  'pending': { label: 'Pending', color: '#F59E0B', bgColor: '#FEF3C7', icon: Clock },
  'replied': { label: 'Admin Replied', color: '#2563EB', bgColor: '#DBEAFE', icon: MessageSquare },
  'accepted': { label: 'Accepted', color: '#16A34A', bgColor: '#DCFCE7', icon: CheckCircle2 },
};

export default function BuyerDashboard() {
  const router = useRouter();
  const params = useParams();
  const section = (params?.section as string) || 'overview';
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const renderContent = () => {
    switch (section) {
      case 'overview':
        return <DashboardOverview />;
      case 'orders':
        return <OrdersSection selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />;
      case 'quotations':
        return <QuotationsSection selectedRFQ={selectedRFQ} setSelectedRFQ={setSelectedRFQ} newMessage={newMessage} setNewMessage={setNewMessage} />;
      case 'wishlist':
        return <WishlistSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'payment':
        return <PaymentMethodsSection />;
      case 'profile':
        return <ProfileSettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  function DashboardOverview() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl mb-2" style={{ color: '#3e3e3e' }}>Welcome back, Ali Khan!</h2>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Here's what's happening with your orders and quotations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: '12', change: '+3 this month', color: '#ef4136', icon: Package },
            { label: 'Active Quotations', value: '3', change: '2 pending reply', color: '#2563EB', icon: MessageSquare },
            { label: 'Total Spent', value: 'Rs. 2.4M', change: '+12% vs last month', color: '#16A34A', icon: TrendingUp },
            { label: 'Wishlist Items', value: '8', change: '3 on sale now', color: '#F59E0B', icon: Heart },
          ].map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl shadow-sm border p-5" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <IconComponent size={24} style={{ color: stat.color }} />
                  </div>
                </div>
                <h3 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>{stat.value}</h3>
                <p className="text-xs mb-1" style={{ color: '#64748B' }}>{stat.label}</p>
                <p className="text-xs font-medium" style={{ color: stat.color }}>{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="font-bold text-lg" style={{ color: '#3e3e3e' }}>Recent Orders</h3>
            <button
              onClick={() => router.push('/buyer/dashboard/orders')}
              className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              style={{ color: '#ef4136' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: '#E2E8F0' }}>
            {orders.slice(0, 3).map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/buyer/dashboard/orders`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold" style={{ color: '#3e3e3e' }}>{order.id}</h4>
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ color: status.color, backgroundColor: status.bgColor }}>
                          <StatusIcon size={12} /> {status.label}
                        </span>
                      </div>
                      <p className="text-sm mb-1" style={{ color: '#64748B' }}>{order.items} items • {order.vendor}</p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>Ordered on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg mb-1" style={{ color: '#3e3e3e' }}>Rs. {order.total.toLocaleString()}</p>
                      <button className="text-sm font-medium flex items-center gap-1" style={{ color: '#ef4136' }}>
                        Track Order <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Quotations */}
        <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="font-bold text-lg" style={{ color: '#3e3e3e' }}>Active Quotations</h3>
            <button
              onClick={() => router.push('/buyer/dashboard/quotations')}
              className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              style={{ color: '#ef4136' }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: '#E2E8F0' }}>
            {quotations.slice(0, 2).map((rfq) => {
              const status = statusConfig[rfq.status];
              const StatusIcon = status.icon;
              return (
                <div key={rfq.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/buyer/dashboard/quotations`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold" style={{ color: '#3e3e3e' }}>{rfq.title}</h4>
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ color: status.color, backgroundColor: status.bgColor }}>
                          <StatusIcon size={12} /> {status.label}
                        </span>
                      </div>
                      <p className="text-sm mb-1" style={{ color: '#64748B' }}>{rfq.vendor} • {rfq.messages} messages</p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>Last updated: {rfq.lastUpdate}</p>
                    </div>
                    <button className="text-sm font-medium flex items-center gap-1" style={{ color: '#ef4136' }}>
                      View <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function OrdersSection({ selectedOrder, setSelectedOrder }: any) {
    if (selectedOrder) {
      const order = orders.find(o => o.id === selectedOrder);
      if (!order) return null;

      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Order #{order.id}</h2>
                <p className="text-sm" style={{ color: '#64748B' }}>Placed on {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                {(() => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <span className="inline-flex px-3 py-2 rounded-xl text-sm font-semibold items-center gap-2" style={{ color: status.color, backgroundColor: status.bgColor }}>
                      <StatusIcon size={16} /> {status.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Order Tracking Stepper */}
            <div className="mb-8">
              <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Order Status</h3>
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5" style={{ backgroundColor: '#E2E8F0' }} />
                <div
                  className="absolute top-5 left-0 h-0.5 transition-all duration-500"
                  style={{
                    backgroundColor: '#ef4136',
                    width: order.status === 'delivered' ? '100%' : order.status === 'in-transit' ? '66%' : order.status === 'processing' ? '33%' : '0%'
                  }}
                />
                <div className="relative flex justify-between">
                  {[
                    { label: 'Order Placed', date: '05 May, 10:30 AM', active: true },
                    { label: 'Processing', date: '05 May, 2:15 PM', active: order.status !== 'cancelled' },
                    { label: 'In Transit', date: order.status === 'in-transit' || order.status === 'delivered' ? '06 May, 9:00 AM' : 'Pending', active: order.status === 'in-transit' || order.status === 'delivered' },
                    { label: 'Delivered', date: order.status === 'delivered' ? '07 May, 3:45 PM' : 'Pending', active: order.status === 'delivered' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center" style={{ width: '25%' }}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${step.active ? 'shadow-lg' : ''}`}
                        style={{
                          backgroundColor: step.active ? '#ef4136' : '#E2E8F0',
                          color: 'white'
                        }}
                      >
                        {step.active ? <CheckCircle2 size={20} /> : <Clock size={20} style={{ color: '#94A3B8' }} />}
                      </div>
                      <p className="text-xs font-semibold text-center mb-1" style={{ color: step.active ? '#3e3e3e' : '#94A3B8' }}>
                        {step.label}
                      </p>
                      <p className="text-xs text-center" style={{ color: '#94A3B8' }}>{step.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                <h4 className="font-bold mb-3" style={{ color: '#3e3e3e' }}>Delivery Address</h4>
                <p className="text-sm mb-1" style={{ color: '#3e3e3e' }}>Ali Khan</p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  123 Model Town, Block C<br />
                  Lahore, Punjab 54000<br />
                  Phone: +92 300 1234567
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                <h4 className="font-bold mb-3" style={{ color: '#3e3e3e' }}>Payment Method</h4>
                <p className="text-sm mb-1" style={{ color: '#3e3e3e' }}>Cash on Delivery</p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Payment will be collected at delivery
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-bold mb-3" style={{ color: '#3e3e3e' }}>Order Items</h4>
              <div className="border rounded-xl divide-y" style={{ borderColor: '#E2E8F0' }}>
                {[
                  { name: 'OPC Cement 50kg', brand: 'Bestway', qty: 50, price: 1200, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=80&h=80&fit=crop' },
                  { name: 'TMT Steel Bar 10mm', brand: 'Ittefaq', qty: 20, price: 8500, img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=80&h=80&fit=crop' },
                  { name: 'Floor Tiles 60×60cm', brand: 'Master Tiles', qty: 100, price: 2200, img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=80&h=80&fit=crop' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h5 className="font-semibold mb-0.5" style={{ color: '#3e3e3e' }}>{item.name}</h5>
                      <p className="text-sm" style={{ color: '#64748B' }}>{item.brand} • Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold" style={{ color: '#3e3e3e' }}>Rs. {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#64748B' }}>Subtotal</span>
                    <span style={{ color: '#3e3e3e' }}>Rs. 45,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#64748B' }}>Delivery Charges</span>
                    <span style={{ color: '#3e3e3e' }}>Rs. 600</span>
                  </div>
                  <div className="border-t pt-2" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: '#3e3e3e' }}>Total</span>
                      <span className="font-bold text-xl" style={{ color: '#ef4136' }}>Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>My Orders</h2>
            <p className="text-sm" style={{ color: '#94A3B8' }}>Track and manage your orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-xl text-sm outline-none"
                style={{ borderColor: '#E2E8F0', width: '250px' }}
              />
            </div>
            <button className="p-2 border rounded-xl hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0' }}>
              <Filter size={18} style={{ color: '#64748B' }} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-all cursor-pointer"
                style={{ borderColor: '#E2E8F0' }}
                onClick={() => setSelectedOrder(order.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg" style={{ color: '#3e3e3e' }}>{order.id}</h3>
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ color: status.color, backgroundColor: status.bgColor }}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                      {order.items} items • Vendor: {order.vendor}
                    </p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                      Ordered on {new Date(order.date).toLocaleDateString()} • Est. Delivery: {order.estimatedDelivery}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl mb-2" style={{ color: '#3e3e3e' }}>Rs. {order.total.toLocaleString()}</p>
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 ml-auto" style={{ backgroundColor: '#ef4136', color: 'white' }}>
                      Track Order <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function QuotationsSection({ selectedRFQ, setSelectedRFQ, newMessage, setNewMessage }: any) {
    if (selectedRFQ) {
      const rfq = quotations.find(q => q.id === selectedRFQ);
      if (!rfq) return null;

      const messages = [
        { id: 1, sender: 'buyer', text: rfq.description, timestamp: '05 May, 10:30 AM', attachments: [] },
        ...(rfq.status !== 'pending' ? [
          { id: 2, sender: 'admin', text: 'Thank you for your inquiry. We can provide the cement at competitive rates.', timestamp: '05 May, 2:15 PM', attachments: [] },
          { id: 3, sender: 'admin', text: `Based on your requirement, we are offering:\n\nBase Price: Rs. ${rfq.basePrice?.toLocaleString()}\n\nThis includes:\n- 500 bags of OPC Cement 50kg (Bestway)\n- Free delivery within Lahore\n- Quality certification\n- 48-hour delivery guarantee\n\nLet us know if you'd like to proceed!`, timestamp: '05 May, 2:18 PM', attachments: ['quotation-document.pdf'], basePrice: rfq.basePrice, description: 'Complete quotation with terms and conditions' }
        ] : []),
        ...(rfq.status === 'accepted' ? [
          { id: 4, sender: 'buyer', text: 'This looks good. I accept the quotation. Please proceed with the order.', timestamp: '05 May, 4:30 PM', attachments: [] },
          { id: 5, sender: 'admin', text: 'Perfect! Your order has been confirmed. Order ID: ORD-2024-001. Expected delivery: 07 May 2024.', timestamp: '05 May, 4:45 PM', attachments: [] }
        ] : [])
      ];

      return (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedRFQ(null)}
            className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            ← Back to Quotations
          </button>

          <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-bold text-2xl mb-2" style={{ color: '#3e3e3e' }}>{rfq.title}</h2>
                  <div className="flex items-center gap-4 text-sm" style={{ color: '#64748B' }}>
                    <span>RFQ ID: {rfq.id}</span>
                    <span>•</span>
                    <span>Vendor: {rfq.vendor}</span>
                    <span>•</span>
                    <span>Created: {new Date(rfq.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {(() => {
                  const status = statusConfig[rfq.status];
                  const StatusIcon = status.icon;
                  return (
                    <span className="px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ color: status.color, backgroundColor: status.bgColor }}>
                      <StatusIcon size={16} /> {status.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="p-6" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${msg.sender === 'buyer' ? 'ml-12' : 'mr-12'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: msg.sender === 'buyer' ? '#ef4136' : '#2563EB' }}>
                          {msg.sender === 'buyer' ? 'You' : 'Admin / Vendor'}
                        </span>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>{msg.timestamp}</span>
                      </div>
                      <div
                        className="p-4 rounded-2xl"
                        style={{
                          backgroundColor: msg.sender === 'buyer' ? '#FEF2F2' : '#F0F9FF',
                          borderLeft: `3px solid ${msg.sender === 'buyer' ? '#ef4136' : '#2563EB'}`
                        }}
                      >
                        <p className="text-sm whitespace-pre-line" style={{ color: '#3e3e3e' }}>{msg.text}</p>

                        {/* Base Price and Description Fields */}
                        {msg.basePrice && msg.description && (
                          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: msg.sender === 'buyer' ? '#FECACA' : '#BFDBFE' }}>
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                              <span className="text-sm font-semibold" style={{ color: '#64748B' }}>Base Price:</span>
                              <span className="text-lg font-bold" style={{ color: '#16A34A' }}>
                                Rs. {msg.basePrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                              <p className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>Description:</p>
                              <p className="text-sm" style={{ color: '#3e3e3e' }}>{msg.description}</p>
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white">
                                <FileText size={18} style={{ color: '#ef4136' }} />
                                <span className="text-sm flex-1" style={{ color: '#3e3e3e' }}>{attachment}</span>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Download size={16} style={{ color: '#64748B' }} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-6 border-t" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl text-sm outline-none resize-none"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-3 border rounded-xl hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0' }}>
                    <Paperclip size={20} style={{ color: '#64748B' }} />
                  </button>
                  <button className="p-3 rounded-xl text-white" style={{ backgroundColor: '#ef4136' }}>
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Quotations (RFQ)</h2>
            <p className="text-sm" style={{ color: '#94A3B8' }}>Manage your quote requests and conversations</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: '#ef4136', color: 'white' }}
            onClick={() => router.push('/buyer/rfq')}
          >
            + New Request
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {quotations.map((rfq) => {
            const status = statusConfig[rfq.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-all cursor-pointer"
                style={{ borderColor: '#E2E8F0' }}
                onClick={() => setSelectedRFQ(rfq.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg" style={{ color: '#3e3e3e' }}>{rfq.title}</h3>
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ color: status.color, backgroundColor: status.bgColor }}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#64748B' }}>
                      {rfq.vendor} • {rfq.messages} messages
                    </p>
                    <p className="text-sm mb-3" style={{ color: '#64748B' }}>{rfq.description}</p>
                    {rfq.basePrice && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
                        <span className="text-xs font-semibold" style={{ color: '#166534' }}>Quoted Price:</span>
                        <span className="text-sm font-bold" style={{ color: '#16A34A' }}>Rs. {rfq.basePrice.toLocaleString()}</span>
                      </div>
                    )}
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Last updated: {rfq.lastUpdate}</p>
                  </div>
                  <button className="text-sm font-medium flex items-center gap-1 px-4 py-2 rounded-xl" style={{ backgroundColor: '#f8f9fa', color: '#ef4136' }}>
                    View Chat <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function WishlistSection() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>My Wishlist</h2>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Products you've saved for later</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
          <Heart size={48} className="mx-auto mb-4" style={{ color: '#CBD5E1' }} />
          <p className="text-lg font-semibold mb-2" style={{ color: '#3e3e3e' }}>Your wishlist is empty</p>
          <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Start adding products you love!</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-xl font-semibold"
            style={{ backgroundColor: '#ef4136', color: 'white' }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  function AddressesSection() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddNew, setShowAddNew] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
      label: '',
      fullName: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      province: 'Punjab',
      postalCode: '',
    });

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/addresses');
        setAddresses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchAddresses();
    }, []);

    const handleDelete = async (id: number) => {
      if (!confirm('Are you sure you want to delete this address?')) return;
      try {
        await apiClient.delete(`/addresses/${id}`);
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success('Address deleted successfully');
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    };

    const handleSaveAddress = async () => {
      try {
        setSaving(true);
        if (editingId) {
          await apiClient.put(`/addresses/${editingId}`, formData);
          toast.success('Address updated successfully');
        } else {
          await apiClient.post('/addresses', formData);
          toast.success('Address added successfully');
        }
        setShowAddNew(false);
        setEditingId(null);
        setFormData({
          label: '',
          fullName: '',
          email: '',
          phone: '',
          streetAddress: '',
          city: '',
          province: 'Punjab',
          postalCode: '',
        });
        fetchAddresses();
      } catch (error) {
        console.error('Failed to save address:', error);
      } finally {
        setSaving(false);
      }
    };

    const handleEdit = (addr: any) => {
      setEditingId(addr.id);
      setFormData({
        label: addr.label || '',
        fullName: addr.fullName,
        email: addr.email,
        phone: addr.phone,
        streetAddress: addr.streetAddress,
        city: addr.city,
        province: addr.province,
        postalCode: addr.postalCode || '',
      });
      setShowAddNew(true);
    };


    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Delivery Addresses</h2>
            <p className="text-sm" style={{ color: '#94A3B8' }}>Manage your saved delivery addresses</p>
          </div>
          <button
            onClick={() => setShowAddNew(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: '#ef4136', color: 'white' }}
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {showAddNew && (
          <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: '#3e3e3e' }}>
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => {
                setShowAddNew(false);
                setEditingId(null);
              }}>
                <X size={20} style={{ color: '#64748B' }} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  Address Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Home, Office, etc."
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  <User size={14} className="inline mr-1" /> Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  <Mail size={14} className="inline mr-1" /> Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  <Phone size={14} className="inline mr-1" /> Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="+92 300 0000000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  <Home size={14} className="inline mr-1" /> Street Address *
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="House no, Building, Street"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  <Building size={14} className="inline mr-1" /> City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Lahore"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  <Map size={14} className="inline mr-1" /> Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <option>Punjab</option>
                  <option>Sindh</option>
                  <option>KPK</option>
                  <option>Balochistan</option>
                  <option>Islamabad</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="54000"
                />
              </div>
            </div>


            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveAddress}
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#ef4136' }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                onClick={() => {
                  setShowAddNew(false);
                  setEditingId(null);
                }}
                className="flex-1 py-3 rounded-xl font-semibold border-2"
                style={{ borderColor: '#E2E8F0', color: '#64748B' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin" style={{ color: '#ef4136' }} />
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
            <MapPin size={48} className="mx-auto mb-4" style={{ color: '#CBD5E1' }} />
            <p className="text-lg font-semibold mb-2" style={{ color: '#3e3e3e' }}>No addresses found</p>
            <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Add your first delivery address to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                style={{ borderColor: '#E2E8F0' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
                      <Home size={20} style={{ color: '#ef4136' }} />
                    </div>
                    <div>
                      <span className="font-bold" style={{ color: '#3e3e3e' }}>{addr.label || 'Address'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} style={{ color: '#64748B' }} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold" style={{ color: '#3e3e3e' }}>{addr.fullName}</p>
                  <p className="text-sm flex items-center gap-2" style={{ color: '#64748B' }}>
                    <Phone size={14} /> {addr.phone}
                  </p>
                  <p className="text-sm flex items-center gap-2" style={{ color: '#64748B' }}>
                    <Mail size={14} /> {addr.email}
                  </p>
                  <p className="text-sm flex items-start gap-2" style={{ color: '#64748B' }}>
                    <MapPin size={14} className="mt-0.5" />
                    <span>{addr.streetAddress}, {addr.city}, {addr.province} {addr.postalCode}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function PaymentMethodsSection() {
    const [paymentMethods, setPaymentMethods] = useState([
      {
        id: 1,
        type: 'card',
        cardNumber: '**** **** **** 4532',
        cardHolder: 'Ali Khan',
        expiryDate: '12/25',
        cardType: 'Visa',
        isDefault: true
      },
      {
        id: 2,
        type: 'mobile',
        provider: 'JazzCash',
        phoneNumber: '+92 300 1234567',
        isDefault: false
      },
    ]);
    const [showAddNew, setShowAddNew] = useState(false);

    const handleDelete = (id: number) => {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    };

    const handleSetDefault = (id: number) => {
      setPaymentMethods(paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      })));
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Payment Methods</h2>
            <p className="text-sm" style={{ color: '#94A3B8' }}>Manage your saved payment methods</p>
          </div>
          <button
            onClick={() => setShowAddNew(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: '#ef4136', color: 'white' }}
          >
            <Plus size={16} /> Add Payment Method
          </button>
        </div>

        {showAddNew && (
          <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: '#3e3e3e' }}>Add Payment Method</h3>
              <button onClick={() => setShowAddNew(false)}>
                <X size={20} style={{ color: '#64748B' }} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { type: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { type: 'mobile', label: 'Mobile Wallet', icon: Phone },
                { type: 'bank', label: 'Bank Account', icon: Building },
              ].map((method) => {
                const MethodIcon = method.icon;
                return (
                  <button
                    key={method.type}
                    className="p-6 rounded-2xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <MethodIcon size={32} className="mx-auto mb-3" style={{ color: '#64748B' }} />
                    <p className="font-semibold text-sm" style={{ color: '#3e3e3e' }}>{method.label}</p>
                  </button>
                );
              })}
            </div>

            <div className="text-center py-8" style={{ color: '#94A3B8' }}>
              <p className="text-sm">Select a payment method type to continue</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              style={{ borderColor: '#E2E8F0' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: pm.type === 'card' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    }}
                  >
                    {pm.type === 'card' ? (
                      <CreditCard size={24} className="text-white" />
                    ) : (
                      <Phone size={24} className="text-white" />
                    )}
                  </div>
                  <div>
                    {pm.type === 'card' ? (
                      <>
                        <p className="font-bold" style={{ color: '#3e3e3e' }}>{pm.cardType} Card</p>
                        <p className="text-sm" style={{ color: '#94A3B8' }}>{pm.cardNumber}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold" style={{ color: '#3e3e3e' }}>{pm.provider}</p>
                        <p className="text-sm" style={{ color: '#94A3B8' }}>{pm.phoneNumber}</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(pm.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} style={{ color: '#EF4444' }} />
                </button>
              </div>

              {pm.type === 'card' && (
                <div className="flex items-center justify-between text-sm mb-4">
                  <span style={{ color: '#64748B' }}>Cardholder: {pm.cardHolder}</span>
                  <span style={{ color: '#64748B' }}>Exp: {pm.expiryDate}</span>
                </div>
              )}

              {pm.isDefault ? (
                <div className="px-3 py-2 rounded-lg text-center text-sm font-semibold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                  <CheckCircle2 size={14} className="inline mr-1" /> Default Payment Method
                </div>
              ) : (
                <button
                  onClick={() => handleSetDefault(pm.id)}
                  className="w-full py-2 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="bg-blue-50 rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: '#BFDBFE' }}>
          <AlertCircle size={20} style={{ color: '#2563EB' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#1E40AF' }}>
              Your payment information is secure
            </p>
            <p className="text-sm" style={{ color: '#3B82F6' }}>
              All payment details are encrypted and stored securely. We never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  function ProfileSettingsSection() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
      name: 'Ali Khan',
      email: 'ali.khan@example.com',
      phone: '+92 300 1234567',
      company: 'Khan Construction',
      businessType: 'Contractor',
      taxId: 'NTN-123456789',
      city: 'Lahore',
      province: 'Punjab'
    });

    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Profile Settings</h2>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Manage your account information and preferences</p>
        </div>

        {/* Profile Picture */}
        <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Profile Picture</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: '#ef4136' }}>
                AK
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#3e3e3e' }}>
                <Camera size={16} />
              </button>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#3e3e3e' }}>Upload Profile Picture</p>
              <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>JPG, PNG or GIF. Max size 2MB</p>
              <button className="px-4 py-2 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: '#3e3e3e' }}>Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
              style={{ backgroundColor: isEditing ? '#f8f9fa' : '#ef4136', color: isEditing ? '#64748B' : 'white' }}
            >
              {isEditing ? (
                <><X size={16} /> Cancel</>
              ) : (
                <><Edit2 size={16} /> Edit Profile</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Company Name
              </label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Business Type
              </label>
              <select
                value={profileData.businessType}
                onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              >
                <option>Contractor</option>
                <option>Builder</option>
                <option>Architect</option>
                <option>Individual</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Tax ID / NTN
              </label>
              <input
                type="text"
                value={profileData.taxId}
                onChange={(e) => setProfileData({ ...profileData, taxId: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                City
              </label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Province
              </label>
              <select
                value={profileData.province}
                onChange={(e) => setProfileData({ ...profileData, province: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-50"
                style={{ borderColor: '#E2E8F0' }}
              >
                <option>Punjab</option>
                <option>Sindh</option>
                <option>KPK</option>
                <option>Balochistan</option>
                <option>Islamabad</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="mt-6 px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2"
              style={{ backgroundColor: '#ef4136' }}
            >
              <Save size={16} /> Save Changes
            </button>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Change Password</h3>
          <div className="grid grid-cols-1 gap-4 max-w-md">
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none"
                style={{ borderColor: '#E2E8F0' }}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none"
                style={{ borderColor: '#E2E8F0' }}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl outline-none"
                style={{ borderColor: '#E2E8F0' }}
                placeholder="Confirm new password"
              />
            </div>
            <button
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#ef4136' }}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Account Actions</h3>
          <div className="space-y-3">
            <button className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
              Download My Data
            </button>
            <button className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-white ml-0 md:ml-3" style={{ backgroundColor: '#EF4444' }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border sticky top-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="p-5 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#ef4136' }}>
                    AK
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: '#3e3e3e' }}>Ali Khan</h3>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Buyer Account</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = section === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(`/buyer/dashboard/${item.id}`)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'shadow-sm' : 'hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: isActive ? '#FEF2F2' : 'transparent',
                        color: isActive ? '#ef4136' : '#64748B'
                      }}
                    >
                      <IconComponent size={18} />
                      {item.label}
                      {isActive && <ChevronRight size={16} className="ml-auto" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
