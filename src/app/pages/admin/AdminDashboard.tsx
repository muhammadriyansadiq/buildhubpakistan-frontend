import { useState } from 'react';
import {
  Package, DollarSign, Clock, CheckCircle2, XCircle, Search,
  Filter, Download, MoreVertical, User, MapPin, Calendar,
  Phone, Mail, Truck, CreditCard, MessageSquare, X, ChevronRight,
  AlertCircle, TrendingUp, FileText, Tag, Building, Check, Eye
} from 'lucide-react';

// Generate realistic orders data
const generateOrders = () => {
  const statuses = ['new', 'processing', 'delivery', 'completed', 'cancelled'];
  const types = ['Material Order', 'Labour Service', 'Equipment Rental'];
  const materials = ['OPC Cement 50kg', 'TMT Steel Bar 10mm', 'Floor Tiles 60x60', 'Wall Paint 20L', 'PVC Pipe'];
  const services = ['Mason', 'Electrician', 'Plumber', 'Carpenter', 'Painter'];
  const vendors = ['Ahmed Materials', 'Steel Mart PK', 'Tile World', 'Paint Palace', 'Build Pro'];
  const customers = ['Ali Construction', 'Raza Builders', 'National Housing', 'Elite Developers', 'Metro Builders'];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Rawalpindi'];
  const paymentStatuses = ['paid', 'pending', 'partial', 'failed'];
  const baseDate = new Date('2024-05-10T00:00:00Z').getTime();

  const orders = [];
  for (let i = 1; i <= 50; i++) {
    const isService = i % 10 > 6;
    const status = statuses[i % statuses.length];
    const daysAgo = i % 15;
    const orderDate = new Date(baseDate - daysAgo * 24 * 60 * 60 * 1000);
    const deliveryDate = new Date(orderDate.getTime() + ((i % 7) + 2) * 24 * 60 * 60 * 1000);

    orders.push({
      id: `ORD-${String(2000 + i).padStart(4, '0')}`,
      customer: customers[i % customers.length],
      customerEmail: 'customer@example.com',
      customerPhone: `+92 300 ${String(1000000 + i * 12345).slice(-7)}`,
      vendor: vendors[i % vendors.length],
      vendorEmail: 'vendor@example.com',
      vendorPhone: `+92 321 ${String(2000000 + i * 23456).slice(-7)}`,
      type: isService ? 'Labour Service' : 'Material Order',
      item: isService ? services[i % services.length] : materials[i % materials.length],
      quantity: (i * 3) % 100 + 1,
      price: 5000 + (i * 1234) % 100000,
      city: cities[i % cities.length],
      address: `${(i * 17) % 999 + 1} Street ${(i % 10) + 1}, Block ${String.fromCharCode(65 + (i % 10))}`,
      status,
      paymentStatus: paymentStatuses[i % paymentStatuses.length],
      orderDate: orderDate.toISOString().split('T')[0],
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      notes: 'Customer requested early morning delivery',
      timeline: [
        { status: 'Order Placed', date: orderDate.toISOString(), completed: true },
        { status: 'Vendor Confirmed', date: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), completed: status !== 'new' },
        { status: 'In Processing', date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), completed: ['delivery', 'completed'].includes(status) },
        { status: 'Out for Delivery', date: deliveryDate.toISOString(), completed: status === 'completed' },
        { status: 'Delivered', date: deliveryDate.toISOString(), completed: status === 'completed' }
      ]
    });
  }
  return orders;
};

const allOrders = generateOrders();

export default function AdminDashboard() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [drawerOrder, setDrawerOrder] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    vendor: 'all',
    city: 'all',
    payment: 'all',
    dateRange: 'all'
  });

  // Filter orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.item.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesVendor = filters.vendor === 'all' || order.vendor === filters.vendor;
    const matchesCity = filters.city === 'all' || order.city === filters.city;
    const matchesPayment = filters.payment === 'all' || order.paymentStatus === filters.payment;

    return matchesSearch && matchesStatus && matchesVendor && matchesCity && matchesPayment;
  });

  // Calculate KPIs
  const kpis = {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'new').length,
    inProgress: allOrders.filter(o => o.status === 'processing').length,
    completed: allOrders.filter(o => o.status === 'completed').length,
    revenue: allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0)
  };

  // Group orders by status for Kanban
  const ordersByStatus = {
    new: filteredOrders.filter(o => o.status === 'new'),
    processing: filteredOrders.filter(o => o.status === 'processing'),
    delivery: filteredOrders.filter(o => o.status === 'delivery'),
    completed: filteredOrders.filter(o => o.status === 'completed'),
    cancelled: filteredOrders.filter(o => o.status === 'cancelled')
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    new: { label: 'New Orders', color: '#D97706', bg: '#FEF3C7', icon: AlertCircle },
    processing: { label: 'Processing', color: '#2563EB', bg: '#DBEAFE', icon: Clock },
    delivery: { label: 'Delivery', color: '#7C3AED', bg: '#EDE9FE', icon: Truck },
    completed: { label: 'Completed', color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2', icon: XCircle }
  };

  const paymentStatusBadge = (status: string) => {
    const colors = {
      paid: { bg: '#DCFCE7', color: '#166534' },
      pending: { bg: '#FEF3C7', color: '#92400E' },
      partial: { bg: '#DBEAFE', color: '#1E40AF' },
      failed: { bg: '#FEE2E2', color: '#991B1B' }
    };
    const c = colors[status as keyof typeof colors] || colors.pending;
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-semibold capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
        {status}
      </span>
    );
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const OrderCard = ({ order }: { order: any }) => {
    const isSelected = selectedOrders.includes(order.id);
    const statusInfo = statusConfig[order.status];
    const StatusIcon = statusInfo.icon;

    return (
      <div
        className={`bg-white rounded-xl shadow-sm border-2 p-4 hover:shadow-lg transition-all cursor-pointer group ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'
        }`}
        onClick={() => setDrawerOrder(order)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                toggleOrderSelection(order.id);
              }}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="font-mono text-xs font-bold" style={{ color: '#3e3e3e' }}>
              {order.id}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDrawerOrder(order);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
          >
            <Eye size={14} style={{ color: '#64748B' }} />
          </button>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <User size={14} style={{ color: '#64748B' }} />
            <span className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>
              {order.customer}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={14} style={{ color: '#64748B' }} />
            <span className="text-xs truncate" style={{ color: '#64748B' }}>
              {order.item}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building size={14} style={{ color: '#64748B' }} />
            <span className="text-xs truncate" style={{ color: '#64748B' }}>
              {order.vendor}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <MapPin size={12} style={{ color: '#94A3B8' }} />
            <span className="text-xs" style={{ color: '#94A3B8' }}>{order.city}</span>
          </div>
          <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{order.deliveryDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: '#3e3e3e' }}>
            Rs. {order.price.toLocaleString()}
          </span>
          {paymentStatusBadge(order.paymentStatus)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#0F172A' }}>
                Order Management
              </h1>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Manage construction material orders and labour service bookings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#475569' }}>
                <Download size={16} className="inline mr-2" />
                Export
              </button>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Total Orders', value: kpis.total, icon: Package, color: '#3e3e3e', change: '+12%' },
              { label: 'Pending Orders', value: kpis.pending, icon: AlertCircle, color: '#D97706', change: '-8%' },
              { label: 'In Progress', value: kpis.inProgress, icon: Clock, color: '#2563EB', change: '+5%' },
              { label: 'Completed', value: kpis.completed, icon: CheckCircle2, color: '#16A34A', change: '+18%' },
              { label: 'Revenue', value: `Rs. ${(kpis.revenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#7C3AED', change: '+23%' }
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white rounded-xl p-5 border" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}10` }}>
                      <Icon size={20} style={{ color: kpi.color }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: kpi.change.startsWith('+') ? '#16A34A' : '#DC2626' }}>
                      {kpi.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#0F172A' }}>
                    {kpi.value}
                  </div>
                  <div className="text-xs" style={{ color: '#64748B' }}>{kpi.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[300px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search orders, customers, items..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ borderColor: '#E2E8F0' }}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-100"
              style={{ borderColor: '#E2E8F0' }}
            >
              <option value="all">All Status</option>
              <option value="new">New Orders</option>
              <option value="processing">Processing</option>
              <option value="delivery">Delivery</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.vendor}
              onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
              className="px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-100"
              style={{ borderColor: '#E2E8F0' }}
            >
              <option value="all">All Vendors</option>
              <option value="Ahmed Materials">Ahmed Materials</option>
              <option value="Steel Mart PK">Steel Mart PK</option>
              <option value="Tile World">Tile World</option>
            </select>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-100"
              style={{ borderColor: '#E2E8F0' }}
            >
              <option value="all">All Cities</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
            <select
              value={filters.payment}
              onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
              className="px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-100"
              style={{ borderColor: '#E2E8F0' }}
            >
              <option value="all">Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
              <span className="text-sm font-medium" style={{ color: '#1E40AF' }}>
                {selectedOrders.length} orders selected
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#475569' }}>
                  Assign
                </button>
                <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#475569' }}>
                  Mark Completed
                </button>
                <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#DC2626' }}>
                  Cancel
                </button>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="p-1.5 hover:bg-white rounded-lg"
                >
                  <X size={16} style={{ color: '#64748B' }} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Object.entries(ordersByStatus).map(([status, orders]) => {
              const statusInfo = statusConfig[status];
              const StatusIcon = statusInfo.icon;
              return (
                <div key={status} className="flex-shrink-0 w-80">
                  <div className="bg-white rounded-xl shadow-sm border mb-3 p-4" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={18} style={{ color: statusInfo.color }} />
                        <span className="font-semibold" style={{ color: '#0F172A' }}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                        {orders.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                    {orders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-8 text-sm" style={{ color: '#94A3B8' }}>
                        No orders in this status
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC' }}>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length}
                        onChange={() => {
                          if (selectedOrders.length === filteredOrders.length) {
                            setSelectedOrders([]);
                          } else {
                            setSelectedOrders(filteredOrders.map(o => o.id));
                          }
                        }}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>ORDER ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>CUSTOMER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>ITEM</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>VENDOR</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>CITY</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>AMOUNT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>PAYMENT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#475569' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {filteredOrders.slice(0, 20).map((order) => {
                    const statusInfo = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-mono text-sm font-semibold" style={{ color: '#0F172A' }}>
                            {order.id}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium" style={{ color: '#1E293B' }}>
                            {order.customer}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>{order.item}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>{order.vendor}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm" style={{ color: '#64748B' }}>{order.city}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                            Rs. {order.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {paymentStatusBadge(order.paymentStatus)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setDrawerOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} style={{ color: '#64748B' }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Right Drawer */}
      {drawerOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setDrawerOrder(null)}
          />
          <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: '#0F172A' }}>
                    Order Details
                  </h2>
                  <p className="text-sm font-mono" style={{ color: '#64748B' }}>{drawerOrder.id}</p>
                </div>
                <button
                  onClick={() => setDrawerOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} style={{ color: '#64748B' }} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#475569' }}>
                  Update Status
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border text-sm font-medium outline-none"
                  style={{ borderColor: '#E2E8F0' }}
                  defaultValue={drawerOrder.status}
                >
                  <option value="new">New Order</option>
                  <option value="processing">Processing</option>
                  <option value="delivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Order Summary</h3>
                <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#64748B' }}>Type</span>
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{drawerOrder.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#64748B' }}>Item</span>
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{drawerOrder.item}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#64748B' }}>Quantity</span>
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{drawerOrder.quantity} units</span>
                  </div>
                  <div className="border-t pt-3" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>Total Amount</span>
                      <span className="text-lg font-bold" style={{ color: '#ef4136' }}>Rs. {drawerOrder.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Order Timeline</h3>
                <div className="space-y-4">
                  {drawerOrder.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          {event.completed ? (
                            <Check size={16} style={{ color: '#16A34A' }} />
                          ) : (
                            <Clock size={16} style={{ color: '#94A3B8' }} />
                          )}
                        </div>
                        {idx < drawerOrder.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${event.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold mb-1" style={{ color: event.completed ? '#0F172A' : '#94A3B8' }}>
                          {event.status}
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Customer Information</h3>
                <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <User size={16} style={{ color: '#64748B' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1E293B' }}>{drawerOrder.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} style={{ color: '#64748B' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>{drawerOrder.customerPhone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} style={{ color: '#64748B' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>{drawerOrder.customerEmail}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5" style={{ color: '#64748B' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>
                      {drawerOrder.address}, {drawerOrder.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Vendor Information</h3>
                <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Building size={16} style={{ color: '#64748B' }} />
                    <p className="text-sm font-medium" style={{ color: '#1E293B' }}>{drawerOrder.vendor}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} style={{ color: '#64748B' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>{drawerOrder.vendorPhone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} style={{ color: '#64748B' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>{drawerOrder.vendorEmail}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Payment Information</h3>
                <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#64748B' }}>Payment Status</span>
                    {paymentStatusBadge(drawerOrder.paymentStatus)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#64748B' }}>Payment Method</span>
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>Cash on Delivery</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Notes</h3>
                <textarea
                  defaultValue={drawerOrder.notes}
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none"
                  style={{ borderColor: '#E2E8F0' }}
                  rows={3}
                  placeholder="Add notes about this order..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: '#ef4136' }}>
                  Save Changes
                </button>
                <button className="px-4 py-3 rounded-lg font-semibold border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
