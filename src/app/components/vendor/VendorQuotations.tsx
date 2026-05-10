'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Download, Clock, MessageSquare,
  CheckCircle2, XCircle, Send, ChevronRight, Eye,
  Calendar, User, MapPin, Phone, RefreshCw, X, ShoppingBag,
  ArrowLeft, Tag, Info
} from 'lucide-react';
import {
  useQuotations,
  useQuotationDetails,
  useQuotationStats,
  useRespondToQuotationMutation,
  useUpdateQuotationStatusMutation
} from '@/hooks/useQuotation';
import { toast } from 'sonner';

const statusConfig: any = {
  Pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7', icon: Clock },
  Quoted: { label: 'Quoted', color: '#1E40AF', bg: '#DBEAFE', icon: Send },
  Accepted: { label: 'Accepted', color: '#166534', bg: '#DCFCE7', icon: CheckCircle2 },
  Rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2', icon: XCircle },
};

export default function VendorQuotations() {
  const [user, setUser] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Response states
  const [replyMessage, setReplyMessage] = useState('');
  const [quotePrice, setQuotePrice] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const { data: statsData } = useQuotationStats({ sellerId: user?.id });
  const { data: rfqsData, isLoading: isLoadingList } = useQuotations({
    page,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
    sellerId: user?.id
  });

  const { data: rfq, isLoading: isLoadingDetails } = useQuotationDetails(selectedRFQ);
  const respondMutation = useRespondToQuotationMutation();
  const updateStatusMutation = useUpdateQuotationStatusMutation();

  const handleSendQuote = async () => {
    if (!selectedRFQ || !quotePrice || !replyMessage) {
      toast.error("Please provide both price and a message");
      return;
    }

    try {
      await respondMutation.mutateAsync({
        id: selectedRFQ,
        price: Number(quotePrice),
        reply: replyMessage
      });
      toast.success("Quote sent successfully!");
      setReplyMessage('');
      setQuotePrice('');
    } catch (error) {
      toast.error("Failed to send quote");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedRFQ) return;
    try {
      await updateStatusMutation.mutateAsync({ id: selectedRFQ, status });
      toast.success(`RFQ marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const stats = statsData || { Pending: 0, Quoted: 0, Accepted: 0, Rejected: 0 };
  const rfqs = Array.isArray(rfqsData?.data) ? rfqsData.data : [];
  const totalRFQs = rfqsData?.total || 0;
  const lastPage = rfqsData?.lastPage || 1;

  if (selectedRFQ && rfq) {
    const messages = [
      {
        id: 'initial',
        sender: 'buyer',
        text: `Required Quantity: ${rfq.requiredQuantity} ${rfq.product?.unit || 'Units'}\n\nRequirement: ${rfq.additionalRequirement || 'Initial requirement request.'}`,
        timestamp: new Date(rfq.createdAt).toLocaleString(),
        basePrice: undefined as number | undefined
      },
      ...(rfq.responses || []).map((res: any) => ({
        id: res.id,
        sender: 'vendor',
        text: res.reply,
        basePrice: res.price,
        timestamp: new Date(res.createdAt).toLocaleString(),
      }))
    ];

    return (
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Back Button */}
        <button
          onClick={() => setSelectedRFQ(null)}
          className="group flex items-center gap-2 mb-6 text-slate-500 hover:text-red-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-red-50 w-fit"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to RFQ List
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col min-h-[600px] max-h-[900px]">
          {/* Header */}
          <div className="p-6 bg-white border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shadow-inner">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-black text-2xl text-slate-800 tracking-tight">#{rfq.id} - {rfq.product?.title || 'Quotation Request'}</h2>
                    <span
                      className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5"
                      style={{
                        color: statusConfig[rfq.status]?.color || '#64748b',
                        backgroundColor: statusConfig[rfq.status]?.bg || '#f1f5f9'
                      }}
                    >
                      {statusConfig[rfq.status]?.label || rfq.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5"><User size={14} /> {rfq.user?.fullName}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(rfq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdateStatus('Accepted')}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  Accept Request
                </button>
                <button
                  onClick={() => handleUpdateStatus('Rejected')}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <XCircle size={18} />
                  Reject Request
                </button>
                <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                <button className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                  <Info size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="px-6 py-4 bg-slate-50/80 backdrop-blur-md border-b border-gray-100 flex flex-wrap items-center gap-y-3 gap-x-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Tag size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty Required</p>
                <p className="text-sm font-bold text-slate-700">{rfq.requiredQuantity} {rfq.product?.unit || 'Units'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-slate-400 shadow-sm">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Location</p>
                <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]" title={rfq.deliveryLocation}>{rfq.deliveryLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Buyer</p>
                <p className="text-sm font-bold text-slate-700">{rfq.user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Chat Flow */}
          <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto relative bg-slate-50/50 overflow-x-hidden custom-scrollbar">
            {/* Building Background Image with low opacity */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none bg-cover bg-center bg-no-repeat mix-blend-multiply"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")' }}
            />

            <div className="relative z-10 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] sm:max-w-xl ${msg.sender === 'vendor' ? 'ml-12' : 'mr-12'}`}>
                    <div className={`flex items-center gap-2 mb-1.5 ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {msg.sender === 'vendor' ? 'You (Quote)' : 'Buyer Request'}
                      </span>
                      <span className="text-[10px] font-medium text-slate-300">• {msg.timestamp}</span>
                    </div>

                    <div className={`p-5 rounded-3xl shadow-sm ${msg.sender === 'vendor'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.text}
                      </p>

                      {msg.basePrice && (
                        <div className={`mt-4 p-4 rounded-2xl flex items-center justify-between ${msg.sender === 'vendor' ? 'bg-white/10' : 'bg-red-50'
                          }`}>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Offered Price</p>
                            <p className="text-2xl font-black">Rs. {Number(msg.basePrice).toLocaleString()}</p>
                          </div>
                          {/* <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${msg.sender === 'vendor' ? 'bg-white/20' : 'bg-white'
                            }`}>
                          </div> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Input Area */}
          <div className="px-6 pt-4 pb-6 bg-white border-t border-gray-100 shrink-0">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Input */}
                <div className="relative">
                  <input
                    type="number"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="Enter Quote Price (PKR)"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all"
                  />
                </div>

                {/* Message Input */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner p-1 focus-within:border-red-200 focus-within:ring-4 focus-within:ring-red-50 transition-all duration-300">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Add terms, conditions or a message for the buyer..."
                      rows={1}
                      className="w-full px-5 py-3.5 bg-transparent text-sm outline-none resize-none placeholder:text-slate-400 font-medium custom-scrollbar"
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendQuote}
                    disabled={respondMutation.isPending}
                    className="w-14 h-14 rounded-2xl text-white shadow-xl shadow-red-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group shrink-0 disabled:opacity-50"
                    style={{ backgroundColor: '#ef4136' }}
                  >
                    {respondMutation.isPending ? (
                      <RefreshCw size={24} className="animate-spin" />
                    ) : (
                      <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Your quote will be visible to the buyer immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-3xl text-slate-800 tracking-tight mb-2">RFQ Management</h2>
          <p className="text-sm font-medium text-slate-400">Handle and respond to quotation requests from potential buyers</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 font-bold text-sm hover:shadow-lg transition-all">
          <Download size={18} /> Export RFQs
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending', value: stats.Pending, color: '#F59E0B', icon: Clock },
          { label: 'Quoted', value: stats.Quoted, color: '#3B82F6', icon: Send },
          { label: 'Accepted', value: stats.Accepted, color: '#10B981', icon: CheckCircle2 },
          { label: 'Rejected', value: stats.Rejected, color: '#EF4444', icon: XCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-center gap-4 group hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${s.color}10` }}>
                <Icon size={24} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                <p className="text-2xl font-black text-slate-800">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-50 overflow-x-auto no-scrollbar">
          {['all', 'Pending', 'Quoted', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className="px-8 py-5 text-sm font-bold whitespace-nowrap border-b-4 transition-all"
              style={{
                borderColor: statusFilter === status ? '#ef4136' : 'transparent',
                color: statusFilter === status ? '#0d2e5e' : '#94a3b8'
              }}
            >
              {status === 'all' ? 'All Requests' : status}
              <span className="ml-2 px-2 py-0.5 rounded-lg text-[10px] font-black" style={{
                backgroundColor: statusFilter === status ? '#ef4136' : '#f1f5f9',
                color: statusFilter === status ? 'white' : '#64748B'
              }}>
                {status === 'all' ? Object.values(stats).reduce((a: any, b: any) => a + b, 0) : (stats as any)[status] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="divide-y divide-slate-50">
          {isLoadingList ? (
            <div className="p-20 text-center">
              <RefreshCw size={48} className="mx-auto mb-4 animate-spin text-red-600" />
              <p className="font-bold text-slate-400">Loading your RFQs...</p>
            </div>
          ) : rfqs.length > 0 ? (
            rfqs.map((rfq: any) => {
              const status = statusConfig[rfq.status] || { label: rfq.status, color: '#64748b', bg: '#f1f5f9', icon: Clock };
              const StatusIcon = status.icon;

              return (
                <div
                  key={rfq.id}
                  className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedRFQ(rfq.id.toString())}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform duration-500">
                        <ShoppingBag size={20} />
                      </div>
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                        {rfq.product?.title || 'Quotation Request'}
                      </h3>
                      <span
                        className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5"
                        style={{ color: status.color, backgroundColor: status.bg }}
                      >
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <User size={14} className="text-slate-300" /> {rfq.user?.fullName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MessageSquare size={14} className="text-slate-300" /> {rfq.responses?.length || 0} Messages
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Calendar size={14} className="text-slate-300" /> {new Date(rfq.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 line-clamp-1 italic">
                      "{rfq.additionalRequirement || 'No additional requirements provided.'}"
                    </p>
                  </div>

                  <button className="w-full md:w-auto px-8 py-4 rounded-[1.25rem] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-red-200 cursor-pointer bg-slate-50 text-slate-600 border border-slate-100">
                    Respond to RFQ <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <FileText size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No Requests Yet</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto">
                When buyers request quotations for your products, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
