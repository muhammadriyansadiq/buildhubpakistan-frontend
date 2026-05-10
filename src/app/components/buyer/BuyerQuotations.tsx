'use client';

import { useState } from 'react';
import {
  MessageSquare, Clock, CheckCircle2, ChevronRight,
  Send, FileText, Download, RefreshCw, ShoppingBag,
  Calendar, MapPin, Hash, User
} from 'lucide-react';
import { useQuotations, useQuotationDetails, useRespondToQuotationMutation } from '@/hooks/useQuotation';
import { toast } from 'sonner';
import { useEffect, useState as useReactState, useRef, useMemo } from 'react';
import { useCreateOrder } from '@/hooks/useOrder';
import { Upload, CreditCard, Building2, MapPinned, X } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  'pending': { label: 'Pending Review', color: '#F59E0B', bgColor: '#FFFBEB', icon: Clock },
  'replied': { label: 'Vendor Replied', color: '#2563EB', bgColor: '#EFF6FF', icon: MessageSquare },
  'accepted': { label: 'Quote Accepted', color: '#10B981', bgColor: '#ECFDF5', icon: CheckCircle2 },
};

interface BuyerQuotationsProps {
  selectedRFQ: string | null;
  setSelectedRFQ: (id: string | null) => void;
  newMessage: string;
  setNewMessage: (msg: string) => void;
}

export default function BuyerQuotations({
  selectedRFQ,
  setSelectedRFQ,
  newMessage,
  setNewMessage
}: BuyerQuotationsProps) {
  const [userId, setUserId] = useReactState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) setUserId(user.id);
  }, []);

  const { data: quotationsData, isLoading } = useQuotations(userId ? { userId } : undefined);
  const quotations = Array.isArray(quotationsData?.data) ? quotationsData.data : [];

  const { data: rfqDetails, isLoading: isDetailsLoading } = useQuotationDetails(selectedRFQ);
  const respondMutation = useRespondToQuotationMutation();
  const createOrderMutation = useCreateOrder();
  const [newPrice, setNewPrice] = useReactState('');
  const [orderForm, setOrderForm] = useReactState({
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'Online',
    receipt: null as File | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const receiptPreview = useMemo(() => {
    if (!orderForm.receipt) return null;
    return URL.createObjectURL(orderForm.receipt);
  }, [orderForm.receipt]);

  const handleCreateOrder = async () => {
    if (!selectedRFQ) return;
    try {
      await createOrderMutation.mutateAsync({
        ...orderForm,
        quotationId: selectedRFQ
      });
      toast.success("Order created successfully!");
      setSelectedRFQ(null);
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  const handleSendQuote = async () => {
    if (!selectedRFQ || !newMessage) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await respondMutation.mutateAsync({
        id: selectedRFQ,
        price: Number(newPrice) || 0,
        reply: newMessage
      });
      toast.success("Message sent successfully!");
      setNewMessage('');
      setNewPrice('');
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw size={24} className="text-red-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-gray-500 font-medium tracking-tight">Syncing your quotations...</p>
      </div>
    );
  }

  if (selectedRFQ) {
    if (isDetailsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
          <RefreshCw size={40} className="animate-spin text-red-600 mb-4 opacity-50" />
          <p className="text-gray-500 font-medium">Opening conversation...</p>
        </div>
      );
    }

    const rfq = rfqDetails;
    if (!rfq) return null;

    const messages = [
      {
        id: 'initial',
        senderId: rfq.userId,
        text: `Required Quantity: ${rfq.requiredQuantity} ${rfq.product?.unit || 'Units'}\n\nRequirement: ${rfq.additionalRequirement || 'Initial requirement request.'}`,
        timestamp: new Date(rfq.createdAt).toLocaleString(),
      },
      ...(rfq.responses || []).map((res: any) => ({
        id: res.id,
        senderId: res.userId,
        text: res.reply || 'Here is our response for your request.',
        timestamp: new Date(res.createdAt).toLocaleString(),
        basePrice: res.price,
      }))
    ];

    const currentStatus = (rfq.status || 'pending').toLowerCase();
    const isAccepted = rfq.responses?.some((res: any) => res.quotationStatus === 'Accepted');
    const status = statusConfig[currentStatus] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => setSelectedRFQ(null)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center group-hover:border-red-100 group-hover:bg-red-50 transition-all">
            <ChevronRight size={18} className="rotate-180" />
          </div>
          Back to All Requests
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col min-h-[500px] max-h-[850px]">
          {/* Enhanced Chat Header */}
          <div className="p-6 bg-white border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-900 leading-tight">
                    {rfq.product?.title || 'Quotation Request'}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500">
                      <Hash size={12} /> {rfq.id}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <User size={14} className="text-slate-400" /> {rfq.product?.user?.shopName || 'Vendor'}
                    </span>
                  </div>
                </div>
              </div>
              <div 
                className="flex items-center px-4 py-2.5 rounded-2xl text-xs font-bold gap-2 shadow-sm border border-transparent transition-all" 
                style={{ color: status.color, backgroundColor: status.bgColor, borderColor: `${status.color}20` }}
              >
                <StatusIcon size={16} /> {status.label}
              </div>
            </div>
          </div>

          {/* Quotation Quick Details Bar */}
          <div className="bg-slate-50/50 px-6 py-3 border-b border-gray-100 flex items-center gap-8 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date:</span>
              <span className="text-xs font-semibold text-slate-600">{new Date(rfq.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location:</span>
              <span className="text-xs font-semibold text-slate-600">{rfq.deliveryLocation || 'Not Specified'}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <ShoppingBag size={14} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qty:</span>
              <span className="text-xs font-bold text-red-600">{rfq.requiredQuantity} Units</span>
            </div>
          </div>

          <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto relative bg-slate-50/50 overflow-x-hidden custom-scrollbar">
            <div className="relative z-10 space-y-6">
              {messages.map((msg) => {
                const isMe = msg.senderId === userId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1 duration-300`}>
                    <div className={`max-w-[75%] ${isMe ? 'ml-8' : 'mr-8'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {isMe && (
                          <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
                            You
                          </span>
                        )}
                        <span className="text-[9px] font-medium text-slate-300">{msg.timestamp}</span>
                      </div>

                      <div
                        className="p-2.5 shadow-sm relative bg-white"
                        style={{
                          borderRadius: isMe ? '14px 2px 14px 14px' : '2px 14px 14px 14px',
                          border: `1px solid ${isMe ? '#FEE2E2' : '#E2E8F0'}`,
                          borderLeft: !isMe ? `2px solid #2563EB` : '1px solid #FEE2E2',
                          borderRight: isMe ? `2px solid #EF4444` : '1px solid #E2E8F0',
                        }}
                      >
                        <p className="text-[13px] leading-snug text-slate-600 font-medium whitespace-pre-wrap">
                          {msg.text}
                        </p>

                        {msg.basePrice && (
                          <div className="mt-2 flex items-center justify-between gap-3 p-2 bg-slate-900 rounded-lg text-white">
                            <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70">Quote:</span>
                            <span className="text-sm font-black text-red-400">Rs. {Number(msg.basePrice).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isAccepted ? (
            <div className="px-6 py-6 bg-white border-t border-gray-100 shrink-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Quotation Accepted!</h3>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Complete your order details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="relative group">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Shipping Address</label>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-green-300 transition-all">
                        <MapPinned size={16} className="text-slate-400" />
                        <input
                          type="text"
                          value={orderForm.shippingAddress}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                          className="bg-transparent text-sm font-semibold text-slate-700 outline-none w-full"
                          placeholder="Enter delivery address"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Billing Address</label>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-green-300 transition-all">
                        <Building2 size={16} className="text-slate-400" />
                        <input
                          type="text"
                          value={orderForm.billingAddress}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, billingAddress: e.target.value }))}
                          className="bg-transparent text-sm font-semibold text-slate-700 outline-none w-full"
                          placeholder="Enter billing address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Payment Method</label>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-green-300 transition-all">
                        <CreditCard size={16} className="text-slate-400" />
                        <select
                          value={orderForm.paymentMethod}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                          className="bg-transparent text-sm font-semibold text-slate-700 outline-none w-full cursor-pointer"
                        >
                          <option value="Online">Online Payment</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="COD">Cash on Delivery</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Payment Receipt</label>
                      {!orderForm.receipt ? (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer group h-[100px]"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Upload size={18} className="text-slate-400 group-hover:text-green-600" />
                            <span className="text-[11px] font-bold text-slate-500 group-hover:text-green-700">Upload Receipt Image</span>
                          </div>
                        </button>
                      ) : (
                        <div className="relative h-[100px] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group shadow-inner">
                          {receiptPreview && (
                            <img 
                              src={receiptPreview} 
                              alt="Receipt Preview" 
                              className="w-full h-full object-contain bg-slate-100"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => setOrderForm(prev => ({ ...prev, receipt: null }))}
                              className="p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-all cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="absolute bottom-1 left-1 right-1 px-1.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-between shadow-sm border border-slate-100">
                            <span className="text-[8px] font-bold text-slate-600 truncate max-w-[100px]">
                              {orderForm.receipt.name}
                            </span>
                            <CheckCircle2 size={10} className="text-green-600" />
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, receipt: e.target.files?.[0] || null }))}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={createOrderMutation.isPending}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-base shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {createOrderMutation.isPending ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Place Order Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 pt-2 pb-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                  {/* Optional Price Input for Negotiation */}
                  <div className="w-48 bg-slate-50 rounded-[1.5rem] border border-slate-200 shadow-inner p-1 focus-within:border-red-200 transition-all">
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Offer Price"
                      className="w-full px-4 py-3 bg-transparent text-sm outline-none placeholder:text-slate-400 font-bold"
                    />
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-[1.5rem] border border-slate-200 shadow-inner p-1 focus-within:border-red-200 focus-within:ring-4 focus-within:ring-red-50 transition-all duration-300">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Negotiate or ask a question..."
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
              <p className="text-center mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Response usually arrives within 24 hours
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-3xl text-slate-800 tracking-tight mb-2">Quotations (RFQ)</h2>
          <p className="text-sm font-medium text-slate-400">Track, manage and negotiate your business quotes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {quotations.length > 0 ? (
          quotations.map((rfq: any) => {
            const currentStatus = rfq.status.toLowerCase();
            const status = statusConfig[currentStatus] || (rfq.responses?.length > 0 ? statusConfig.replied : statusConfig.pending);
            const StatusIcon = status.icon;
            const quotedPrice = rfq.responses?.[0]?.price;

            return (
              <div
                key={rfq.id}
                className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-1 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer group"
                onClick={() => setSelectedRFQ(String(rfq.id))}
              >
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
                        style={{ color: status.color, backgroundColor: status.bgColor }}
                      >
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <User size={14} className="text-slate-300" /> {rfq.product?.user?.shopName || 'Vendor'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MessageSquare size={14} className="text-slate-300" /> {rfq.responses?.length || 0} Messages
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Calendar size={14} className="text-slate-300" /> {new Date(rfq.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 line-clamp-1 italic mb-4">
                      "{rfq.additionalRequirement || 'No additional requirements provided.'}"
                    </p>

                    {quotedPrice && (
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Latest Quote:</span>
                        <span className="text-lg font-black text-red-500">Rs. {Number(quotedPrice).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <button className="w-full md:w-auto px-8 py-4 rounded-[1.25rem] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-red-200 cursor-pointer bg-slate-50 text-slate-600 border border-slate-100">
                    View Conversation <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No Active Quotations</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">
              Ready to start building? Request a quote from any product page to see it here.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
