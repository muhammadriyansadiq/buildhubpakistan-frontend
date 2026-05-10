'use client';

import { useState } from 'react';
import {
  FileText, MessageSquare, CheckCircle2, Clock, ChevronRight,
  Send, X, Package, MapPin, Calendar, DollarSign, User,
  ArrowRight, Filter, Plus, RefreshCw
} from 'lucide-react';

type RFQStatus = 'pending' | 'responded' | 'accepted';

interface RFQ {
  id: string;
  product: string;
  vendor: string;
  quantity: string;
  unit: string;
  location: string;
  submittedDate: string;
  status: RFQStatus;
  myBudget: string;
  vendorQuote?: string;
  vendorMessage?: string;
  img: string;
  messages: { sender: 'buyer' | 'vendor'; text: string; time: string }[];
}

const mockRFQs: RFQ[] = [
  {
    id: 'RFQ-2001',
    product: 'OPC Cement 50kg',
    vendor: 'Ahmed Materials',
    quantity: '500',
    unit: 'bags',
    location: 'Lahore',
    submittedDate: '2026-04-04',
    status: 'responded',
    myBudget: 'Rs. 550,000',
    vendorQuote: 'Rs. 525,000',
    vendorMessage: 'We can supply 500 bags at Rs. 1,050 per bag. Free delivery within Lahore. Can dispatch within 24 hours.',
    img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=80&h=60&fit=crop',
    messages: [
      { sender: 'buyer', text: 'I need 500 bags of OPC Cement. Please quote best price.', time: '2026-04-04 10:30' },
      { sender: 'vendor', text: 'We can supply 500 bags at Rs. 1,050 per bag. Free delivery within Lahore.', time: '2026-04-04 11:45' },
    ],
  },
  {
    id: 'RFQ-2002',
    product: 'TMT Steel Bar 10mm',
    vendor: 'Steel Mart PK',
    quantity: '20',
    unit: 'tons',
    location: 'Karachi',
    submittedDate: '2026-04-03',
    status: 'pending',
    myBudget: 'Rs. 1,800,000',
    img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=80&h=60&fit=crop',
    messages: [
      { sender: 'buyer', text: 'Require 20 tons of TMT 10mm for foundation work. Need by end of month.', time: '2026-04-03 09:00' },
    ],
  },
  {
    id: 'RFQ-2003',
    product: 'Floor Tiles 60×60cm',
    vendor: 'Tile World',
    quantity: '2000',
    unit: 'sqft',
    location: 'Islamabad',
    submittedDate: '2026-04-02',
    status: 'accepted',
    myBudget: 'Rs. 220,000',
    vendorQuote: 'Rs. 210,000',
    vendorMessage: 'Confirmed order. We will deliver in 2 batches. First batch within 72 hours.',
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=80&h=60&fit=crop',
    messages: [
      { sender: 'buyer', text: 'Need 2000 sqft of floor tiles for a residential project.', time: '2026-04-02 14:00' },
      { sender: 'vendor', text: 'We can provide at Rs. 105/sqft. Total Rs. 210,000. Delivery in 2 batches.', time: '2026-04-02 15:30' },
      { sender: 'buyer', text: 'Accepted. Please proceed with the first batch delivery.', time: '2026-04-02 16:00' },
      { sender: 'vendor', text: 'Confirmed order. We will deliver in 2 batches. First batch within 72 hours.', time: '2026-04-02 16:15' },
    ],
  },
  {
    id: 'RFQ-2004',
    product: 'Electrical Cable 2.5mm²',
    vendor: 'ElectroPak',
    quantity: '5000',
    unit: 'meters',
    location: 'Faisalabad',
    submittedDate: '2026-04-01',
    status: 'pending',
    myBudget: 'Rs. 90,000',
    img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=80&h=60&fit=crop',
    messages: [
      { sender: 'buyer', text: 'Need 5000m of 2.5mm electrical cable. Best price please.', time: '2026-04-01 11:00' },
    ],
  },
  {
    id: 'RFQ-2005',
    product: 'Wall Paint 20L',
    vendor: 'Paint Palace',
    quantity: '100',
    unit: 'cans',
    location: 'Lahore',
    submittedDate: '2026-03-30',
    status: 'responded',
    myBudget: 'Rs. 320,000',
    vendorQuote: 'Rs. 305,000',
    vendorMessage: 'Best deal: Rs. 3,050 per 20L can. Full set includes primer. Volume discount applied.',
    img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=80&h=60&fit=crop',
    messages: [
      { sender: 'buyer', text: 'Need 100 cans of Weathershield paint for villa project.', time: '2026-03-30 09:00' },
      { sender: 'vendor', text: 'Best deal: Rs. 3,050 per 20L can. Primer included. Volume discount applied.', time: '2026-03-30 10:30' },
    ],
  },
];

const columns: { id: RFQStatus; label: string; color: string; bg: string; icon: typeof Clock }[] = [
  { id: 'pending', label: 'Pending', color: '#92400E', bg: '#FEF3C7', icon: Clock },
  { id: 'responded', label: 'Responded', color: '#1E40AF', bg: '#DBEAFE', icon: MessageSquare },
  { id: 'accepted', label: 'Accepted', color: '#166534', bg: '#DCFCE7', icon: CheckCircle2 },
];

export default function RFQManagement() {
  const [activeRFQ, setActiveRFQ] = useState<RFQ | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<RFQStatus | 'all'>('all');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeRFQ) return;
    // In a real app, this would send a message
    setChatInput('');
  };

  const acceptQuote = (rfq: RFQ) => {
    // Mark as accepted
    setActiveRFQ({ ...rfq, status: 'accepted' });
  };

  const groupedRFQs = {
    pending: mockRFQs.filter((r) => r.status === 'pending'),
    responded: mockRFQs.filter((r) => r.status === 'responded'),
    accepted: mockRFQs.filter((r) => r.status === 'accepted'),
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#0D2E5E' }} className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-white font-bold text-2xl">RFQ Management</h1>
              <p className="text-white/60 text-sm mt-0.5">Track and manage your bulk quotation requests</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {[
                  { status: 'all', label: 'All' },
                  { status: 'pending', label: `Pending (${groupedRFQs.pending.length})` },
                  { status: 'responded', label: `Responded (${groupedRFQs.responded.length})` },
                  { status: 'accepted', label: `Accepted (${groupedRFQs.accepted.length})` },
                ].map(({ status, label }) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as RFQStatus | 'all')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: filterStatus === status ? '#F97316' : 'rgba(255,255,255,0.15)',
                      color: 'white',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { label: 'Total RFQs', value: mockRFQs.length },
              { label: 'Awaiting Response', value: groupedRFQs.pending.length },
              { label: 'Vendor Responded', value: groupedRFQs.responded.length },
              { label: 'Orders Placed', value: groupedRFQs.accepted.length },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-bold text-xl text-white">{value}</div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((col) => {
            const Icon = col.icon;
            const rfqs = filterStatus === 'all' ? groupedRFQs[col.id] : (filterStatus === col.id ? groupedRFQs[col.id] : []);
            return (
              <div key={col.id}>
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: col.bg }}>
                    <Icon size={16} style={{ color: col.color }} />
                  </div>
                  <h3 className="font-bold" style={{ color: '#0D2E5E' }}>{col.label}</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: col.color, backgroundColor: col.bg }}>
                    {groupedRFQs[col.id].length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {rfqs.map((rfq) => (
                    <div
                      key={rfq.id}
                      onClick={() => setActiveRFQ(rfq)}
                      className="bg-white rounded-2xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                      style={{ borderColor: '#E2E8F0' }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <img src={rfq.img} alt={rfq.product} className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-semibold" style={{ color: '#94A3B8' }}>{rfq.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: col.color, backgroundColor: col.bg }}>
                              {col.label}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm mt-0.5 truncate" style={{ color: '#1E293B' }}>{rfq.product}</h4>
                          <p className="text-xs" style={{ color: '#64748B' }}>{rfq.vendor}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 mb-3">
                        <span className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                          <Package size={11} /> {rfq.quantity} {rfq.unit}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                          <MapPin size={11} /> {rfq.location}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                          <DollarSign size={11} /> {rfq.myBudget}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                          <Calendar size={11} /> {rfq.submittedDate}
                        </span>
                      </div>

                      {rfq.vendorQuote && (
                        <div className="p-2 rounded-lg mb-2" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                          <p className="text-xs font-semibold" style={{ color: '#166534' }}>
                            Vendor Quote: {rfq.vendorQuote}
                          </p>
                        </div>
                      )}

                      <button className="w-full flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-lg transition-all hover:opacity-90"
                        style={{ backgroundColor: col.bg, color: col.color }}
                      >
                        <MessageSquare size={13} />
                        {rfq.status === 'pending' ? 'View Request' : rfq.status === 'responded' ? 'Review & Negotiate' : 'View Agreement'}
                      </button>
                    </div>
                  ))}

                  {rfqs.length === 0 && (
                    <div className="border-2 border-dashed rounded-2xl p-6 text-center" style={{ borderColor: '#E2E8F0' }}>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>No {col.label.toLowerCase()} RFQs</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Modal */}
      {activeRFQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: '80vh' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3">
                <img src={activeRFQ.img} alt={activeRFQ.product} className="w-10 h-8 rounded-lg object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: '#0D2E5E' }}>{activeRFQ.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                      color: activeRFQ.status === 'accepted' ? '#166534' : activeRFQ.status === 'responded' ? '#1E40AF' : '#92400E',
                      backgroundColor: activeRFQ.status === 'accepted' ? '#DCFCE7' : activeRFQ.status === 'responded' ? '#DBEAFE' : '#FEF3C7',
                    }}>
                      {activeRFQ.status.charAt(0).toUpperCase() + activeRFQ.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: '#64748B' }}>{activeRFQ.product} · {activeRFQ.vendor}</div>
                </div>
              </div>
              <button onClick={() => setActiveRFQ(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} style={{ color: '#64748B' }} />
              </button>
            </div>

            {/* RFQ Summary */}
            <div className="px-5 py-3 border-b" style={{ borderColor: '#F1F5F9', backgroundColor: '#F8FAFC' }}>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Quantity</p>
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{activeRFQ.quantity} {activeRFQ.unit}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>My Budget</p>
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>{activeRFQ.myBudget}</p>
                </div>
                {activeRFQ.vendorQuote && (
                  <div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Vendor Quote</p>
                    <p className="text-sm font-bold" style={{ color: '#10B981' }}>{activeRFQ.vendorQuote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ minHeight: '200px' }}>
              {activeRFQ.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs ${msg.sender === 'buyer' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className="flex items-center gap-1.5">
                      {msg.sender === 'vendor' && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#0D2E5E', fontSize: '10px' }}>V</div>
                      )}
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{msg.sender === 'buyer' ? 'You' : activeRFQ.vendor} · {msg.time.split(' ')[1]}</span>
                    </div>
                    <div
                      className="px-4 py-2.5 rounded-2xl text-sm"
                      style={{
                        backgroundColor: msg.sender === 'buyer' ? '#0D2E5E' : '#F1F5F9',
                        color: msg.sender === 'buyer' ? 'white' : '#1E293B',
                        borderBottomRightRadius: msg.sender === 'buyer' ? 4 : 16,
                        borderBottomLeftRadius: msg.sender === 'vendor' ? 4 : 16,
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accept Quote CTA */}
            {activeRFQ.status === 'responded' && activeRFQ.vendorQuote && (
              <div className="px-5 py-3 border-t" style={{ borderColor: '#E2E8F0', backgroundColor: '#F0FDF4' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#166534' }}>Vendor's Best Offer</p>
                    <p className="font-bold" style={{ color: '#0D2E5E' }}>{activeRFQ.vendorQuote}</p>
                  </div>
                  <button
                    onClick={() => acceptQuote(activeRFQ)}
                    className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 flex items-center gap-2"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    <CheckCircle2 size={16} /> Accept Quote
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input */}
            {activeRFQ.status !== 'accepted' && (
              <form onSubmit={sendMessage} className="p-4 border-t flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#0D2E5E' }}
                >
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
