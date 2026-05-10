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
import BuyerQuotations from '@/app/components/buyer/BuyerQuotations';
import { useOrders } from '@/hooks/useOrder';
import { useQuotations } from '@/hooks/useQuotation';

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
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) setUserId(user.id);
  }, []);

  const { data: ordersData, isLoading: isOrdersLoading } = useOrders(userId ? { userId } : undefined);
  const { data: rfqsData, isLoading: isRfqsLoading } = useQuotations(userId ? { userId } : undefined);
  
  const orders = ordersData?.data || [];
  const rfqs = rfqsData?.data || [];

  const renderContent = () => {
    switch (section) {
      case 'overview':
        return <DashboardOverview orders={orders} isOrdersLoading={isOrdersLoading} rfqs={rfqs} isRfqsLoading={isRfqsLoading} />;
      case 'orders':
        return <OrdersSection selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} orders={orders} isOrdersLoading={isOrdersLoading} />;
      case 'quotations':
        return <BuyerQuotations selectedRFQ={selectedRFQ} setSelectedRFQ={setSelectedRFQ} newMessage={newMessage} setNewMessage={setNewMessage} />;
      case 'wishlist':
        return <WishlistSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'payment':
        return <PaymentMethodsSection />;
      case 'profile':
        return <ProfileSettingsSection />;
      default:
        return <DashboardOverview orders={orders} isOrdersLoading={isOrdersLoading} rfqs={rfqs} isRfqsLoading={isRfqsLoading} />;
    }
  };

  function DashboardOverview({ orders, isOrdersLoading, rfqs, isRfqsLoading }: { orders: any[], isOrdersLoading: boolean, rfqs: any[], isRfqsLoading: boolean }) {
    const stats = [
      { label: 'Total Orders', value: orders.length.toString(), change: 'Lifetime activity', color: '#ef4136', icon: Package },
      { label: 'Active Quotations', value: rfqs.length.toString(), change: 'Pending & Quoted', color: '#2563EB', icon: MessageSquare },
      { label: 'Total Spent', value: `Rs. ${orders.reduce((acc, o) => acc + Number(o.totalAmount), 0).toLocaleString()}`, change: 'Total volume', color: '#16A34A', icon: TrendingUp },
      { label: 'Wishlist Items', value: '0', change: 'Keep track of items', color: '#F59E0B', icon: Heart },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl mb-2" style={{ color: '#3e3e3e' }}>Welcome back!</h2>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Here's what's happening with your orders and quotations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
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
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
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
            {isOrdersLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="animate-spin text-red-600" size={32} />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500 font-medium">No orders yet</p>
              </div>
            ) : (
              orders.slice(0, 3).map((order) => {
                const statusKey = order.orderStatus.toLowerCase();
                const status = statusConfig[statusKey] || statusConfig['pending'];
                const StatusIcon = status.icon;
                return (
                  <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/buyer/dashboard/orders`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold" style={{ color: '#3e3e3e' }}>ORD-{order.id}</h4>
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ color: status.color, backgroundColor: status.bgColor }}>
                            <StatusIcon size={12} /> {status.label}
                          </span>
                        </div>
                        <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                          {order.items?.length || 0} items • {order.items?.[0]?.product?.brand || 'BHP Product'}
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg mb-1" style={{ color: '#3e3e3e' }}>Rs. {Number(order.totalAmount).toLocaleString()}</p>
                        <button className="text-sm font-medium flex items-center gap-1" style={{ color: '#ef4136' }}>
                          Track Order <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Quotations */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mt-6" style={{ borderColor: '#E2E8F0' }}>
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
            {isRfqsLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="animate-spin text-red-600" size={32} />
              </div>
            ) : rfqs.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500 font-medium">No quotations yet</p>
              </div>
            ) : (
              rfqs.slice(0, 3).map((rfq: any) => {
                const latestResponse = rfq.responses?.[rfq.responses.length - 1];
                const statusKey = (latestResponse?.quotationStatus || 'Pending').toLowerCase();
                const status = statusConfig[statusKey] || statusConfig['pending'];
                const StatusIcon = status.icon;

                return (
                  <div key={rfq.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/buyer/dashboard/quotations`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold" style={{ color: '#3e3e3e' }}>{rfq.product?.title || 'BHP Product Request'}</h4>
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{ color: status.color, backgroundColor: status.bgColor }}>
                            <StatusIcon size={12} /> {status.label}
                          </span>
                        </div>
                        <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                          Qty: {rfq.requiredQuantity} • {rfq.responses?.length || 0} messages
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>Created on {new Date(rfq.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button className="text-sm font-medium flex items-center gap-1" style={{ color: '#ef4136' }}>
                        View <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  function OrdersSection({ selectedOrder, setSelectedOrder, orders, isOrdersLoading }: any) {
    if (selectedOrder) {
      const order = orders.find((o: any) => `ORD-${o.id}` === selectedOrder || o.id.toString() === selectedOrder);
      if (!order) return null;

      const statusKey = order.orderStatus.toLowerCase();
      const status = statusConfig[statusKey] || statusConfig['pending'];
      const StatusIcon = status.icon;

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
                <h2 className="font-bold text-2xl mb-1" style={{ color: '#3e3e3e' }}>Order #ORD-{order.id}</h2>
                <p className="text-sm" style={{ color: '#64748B' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex px-3 py-2 rounded-xl text-sm font-semibold items-center gap-2" style={{ color: status.color, backgroundColor: status.bgColor }}>
                  <StatusIcon size={16} /> {status.label}
                </span>
              </div>
            </div>

            {/* Order Tracking Stepper */}
            <div className="mb-8 overflow-x-auto pb-4">
              <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Order Status</h3>
              <div className="relative min-w-[600px] px-4">
                <div className="absolute top-5 left-10 right-10 h-0.5" style={{ backgroundColor: '#E2E8F0' }} />
                <div
                  className="absolute top-5 left-10 h-0.5 transition-all duration-500"
                  style={{
                    backgroundColor: '#ef4136',
                    width: order.orderStatus === 'Delivered' ? '100%' : order.orderStatus === 'Shipped' ? '66%' : order.orderStatus === 'Processing' ? '33%' : '5%'
                  }}
                />
                <div className="relative flex justify-between">
                  {[
                    { label: 'Order Placed', active: true },
                    { label: 'Processing', active: ['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) },
                    { label: 'Shipped', active: ['Shipped', 'Delivered'].includes(order.orderStatus) },
                    { label: 'Delivered', active: order.orderStatus === 'Delivered' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center" style={{ width: '25%' }}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${step.active ? 'shadow-lg shadow-red-100' : ''}`}
                        style={{
                          backgroundColor: step.active ? '#ef4136' : '#E2E8F0',
                          color: 'white'
                        }}
                      >
                        {step.active ? <CheckCircle2 size={20} /> : <Clock size={20} style={{ color: '#94A3B8' }} />}
                      </div>
                      <p className="text-xs font-bold text-center mb-1" style={{ color: step.active ? '#3e3e3e' : '#94A3B8' }}>
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                <h4 className="font-bold mb-3" style={{ color: '#3e3e3e' }}>Delivery Address</h4>
                <p className="text-sm mb-1 font-bold" style={{ color: '#3e3e3e' }}>{order.address?.fullName || order.user?.fullName}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  {order.address?.streetAddress}, {order.address?.city}<br />
                  {order.address?.province} {order.address?.postalCode}<br />
                  <span className="font-medium">Phone: {order.address?.phone || order.user?.phone}</span>
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                <h4 className="font-bold mb-3" style={{ color: '#3e3e3e' }}>Payment Information</h4>
                <p className="text-sm mb-1" style={{ color: '#3e3e3e' }}><span className="font-bold">Method:</span> {order.paymentMethod}</p>
                <p className="text-sm mb-1" style={{ color: '#3e3e3e' }}><span className="font-bold">Transaction ID:</span> {order.transactionId || 'N/A'}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Status: <span className="font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase" style={{ 
                    backgroundColor: order.paymentStatus === 'Paid' ? '#DCFCE7' : '#FEF3C7',
                    color: order.paymentStatus === 'Paid' ? '#16A34A' : '#F59E0B'
                  }}>{order.paymentStatus}</span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-bold mb-3" style={{ color: '#3e3e3e' }}>Order Items</h4>
              <div className="border rounded-xl divide-y overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <img 
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=80&h=80&fit=crop'} 
                      alt={item.product?.title} 
                      className="w-16 h-16 rounded-lg object-cover shadow-sm" 
                    />
                    <div className="flex-1">
                      <h5 className="font-bold mb-0.5" style={{ color: '#3e3e3e' }}>{item.product?.title}</h5>
                      <p className="text-xs font-medium" style={{ color: '#64748B' }}>{item.product?.brand} • Qty: {item.quantity} {item.product?.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#3e3e3e' }}>Rs. {Number(item.totalItemPrice).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Rs. {Number(item.priceAtPurchase).toLocaleString()} / {item.product?.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 p-5 rounded-2xl" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500" style={{ color: '#64748B' }}>Total Amount</span>
                  <span className="font-black text-2xl" style={{ color: '#ef4136' }}>Rs. {Number(order.totalAmount).toLocaleString()}</span>
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
                className="pl-10 pr-4 py-2 border rounded-xl text-sm outline-none bg-white"
                style={{ borderColor: '#E2E8F0', width: '250px' }}
              />
            </div>
            <button className="p-2 border rounded-xl hover:bg-gray-50 transition-colors bg-white" style={{ borderColor: '#E2E8F0' }}>
              <Filter size={18} style={{ color: '#64748B' }} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isOrdersLoading ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed p-16 text-center" style={{ borderColor: '#E2E8F0' }}>
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-slate-200" />
              </div>
              <p className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">No orders found</p>
              <p className="text-slate-400 text-sm mb-8">You haven't placed any orders yet. Start shopping!</p>
              <button 
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg"
              >
                Explore Marketplace
              </button>
            </div>
          ) : (
            orders.map((order: any) => {
              const statusKey = order.orderStatus.toLowerCase();
              const status = statusConfig[statusKey] || statusConfig['pending'];
              const StatusIcon = status.icon;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-sm border p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                  style={{ borderColor: '#E2E8F0' }}
                  onClick={() => setSelectedOrder(`ORD-${order.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="font-black text-xl tracking-tight" style={{ color: '#3e3e3e' }}>ORD-{order.id}</h3>
                        <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm" style={{ color: status.color, backgroundColor: status.bgColor }}>
                          <StatusIcon size={14} /> {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center">
                        <p className="text-xs font-bold flex items-center gap-1.5 text-slate-500">
                          <Package size={14} /> {order.items?.length || 0} Items
                        </p>
                        <p className="text-xs font-bold flex items-center gap-1.5 text-slate-500">
                          <Building size={14} /> {order.items?.[0]?.product?.brand || 'BHP Vendor'}
                        </p>
                        <p className="text-xs font-bold flex items-center gap-1.5 text-slate-400 uppercase tracking-tighter">
                          Ordered {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl mb-3 tracking-tighter" style={{ color: '#3e3e3e' }}>Rs. {Number(order.totalAmount).toLocaleString()}</p>
                      <button className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-auto shadow-lg shadow-red-100 group-hover:scale-105 transition-all" style={{ backgroundColor: '#ef4136', color: 'white' }}>
                        Track Order <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'shadow-sm' : 'hover:bg-gray-50'
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
