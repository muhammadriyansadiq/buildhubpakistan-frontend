'use client';

import { useState } from 'react';
import {
  MessageSquare, Clock, CheckCircle2, ChevronRight,
  Send, FileText, Download, RefreshCw, ShoppingBag,
  Calendar, MapPin, Hash, User
} from 'lucide-react';
import { useQuotations, useQuotationDetails } from '@/hooks/useQuotation';
import { useEffect, useState as useReactState } from 'react';

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
        sender: 'buyer',
        text: `Required Quantity: ${rfq.requiredQuantity} ${rfq.product?.unit || 'Units'}\n\nRequirement: ${rfq.additionalRequirement || 'Initial requirement request.'}`,
        timestamp: new Date(rfq.createdAt).toLocaleString(),
      },
      ...(rfq.responses || []).map((res: any) => ({
        id: res.id,
        sender: 'admin',
        text: res.reply || 'Here is our quote for your request.',
        timestamp: new Date(res.createdAt).toLocaleString(),
        basePrice: res.price,
        description: 'Quotation details provided by vendor'
      }))
    ];

    const currentStatus = (rfq.status || 'pending').toLowerCase();
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

          {/* Refined Conversation Thread */}
          <div className="flex-1 px-6 pt-4 pb-4 overflow-y-auto relative bg-slate-50/50 overflow-x-hidden custom-scrollbar">
            {/* Building Background Image with low opacity */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none bg-cover bg-center bg-no-repeat mix-blend-multiply"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")' }}
            />
            
            <div className="relative z-10 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] sm:max-w-xl ${msg.sender === 'buyer' ? 'ml-12' : 'mr-12'}`}>
                    <div className={`flex items-center gap-2 mb-1.5 ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {msg.sender === 'buyer' ? 'You' : 'Vendor Response'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-medium text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div
                      className="p-5 shadow-xl shadow-slate-200/20 relative"
                      style={{
                        backgroundColor: msg.sender === 'buyer' ? '#ffffff' : '#ffffff',
                        borderRadius: msg.sender === 'buyer' ? '28px 4px 28px 28px' : '4px 28px 28px 28px',
                        border: `1px solid ${msg.sender === 'buyer' ? '#FEE2E2' : '#E2E8F0'}`,
                        borderLeft: msg.sender !== 'buyer' ? `4px solid #2563EB` : '1px solid #FEE2E2',
                        borderRight: msg.sender === 'buyer' ? `4px solid #EF4444` : '1px solid #E2E8F0',
                      }}
                    >
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{msg.text}</p>

                      {/* Premium Price Quote Block */}
                      {msg.basePrice && (
                        <div className="mt-5 p-5 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Proposed Quote</p>
                              <p className="text-2xl font-black">Rs. {Number(msg.basePrice).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                              <CheckCircle2 size={24} className="text-white" />
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-xs font-medium italic opacity-90 leading-snug">
                              "{msg.description || 'Terms and conditions apply as per vendor policy.'}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modern Message Input Area */}
          <div className="px-6 pt-2 pb-4 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-4 max-w-5xl mx-auto">
              <div className="flex-1 bg-slate-50 rounded-[1.5rem] border border-slate-200 shadow-inner p-1 focus-within:border-red-200 focus-within:ring-4 focus-within:ring-red-50 transition-all duration-300">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a question about this quote..."
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
                className="w-14 h-14 rounded-2xl text-white shadow-xl shadow-red-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group shrink-0" 
                style={{ backgroundColor: '#ef4136' }}
              >
                <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </div>
            <p className="text-center mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Response usually arrives within 24 hours
            </p>
          </div>
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
