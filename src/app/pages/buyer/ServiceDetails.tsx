'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Star, MapPin, CheckCircle2, MessageCircle, Phone, Shield,
  Clock, Award, Briefcase, Users, ChevronRight, Share2, Heart, ExternalLink, Loader2, SearchX
} from 'lucide-react';
import { useGig } from '@/hooks/useGigs';

// Mock service gigs data (in a real app, this would come from API)
const allServiceGigs = [
  {
    id: 1,
    title: 'Structural Engineering Design & Consultancy',
    category: 'Engineering',
    price: 15000,
    unit: 'per project',
    rating: 4.8,
    reviews: 34,
    status: 'active',
    description: 'Complete structural analysis and design for residential and commercial buildings. I have 10 years of experience in structural engineering and have completed 200+ projects successfully. Services include:\n\n• Structural design and analysis\n• Foundation design\n• Load calculations\n• Building safety assessments\n• Construction supervision\n\nAll work is done according to Pakistan Building Code and international standards. I provide detailed drawings, calculations, and reports.',
    provider: 'Eng. Ahmad Raza',
    whatsapp: '+923001234567',
    phone: '+923001234567',
    location: 'Lahore',
    img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=800&h=500&fit=crop',
    experience: '10 years',
    completedProjects: 200,
    responseTime: '2 hours',
    skills: ['AutoCAD', 'ETABS', 'SAP2000', 'Structural Analysis']
  },
  { id: 2, title: 'Architectural Interior Design', category: 'Architecture', price: 8000, unit: 'per room', rating: 4.6, reviews: 28, status: 'active', description: 'Modern interior design solutions for homes and offices. Creating beautiful, functional spaces tailored to your needs.\n\n• 3D visualization and renders\n• Space planning and layout\n• Material and color selection\n• Furniture and decor consultation\n• Complete project execution\n\nI specialize in contemporary, minimalist, and traditional Pakistani design styles.', provider: 'Arch. Fatima Khan', whatsapp: '+923119876543', phone: '+923119876543', location: 'Karachi', img: 'https://images.unsplash.com/photo-1770823556202-2eba715a415b?w=800&h=500&fit=crop', experience: '7 years', completedProjects: 150, responseTime: '1 hour', skills: ['3ds Max', 'V-Ray', 'Interior Styling'] },
  { id: 3, title: 'Electrical Wiring & Panel Installation', category: 'Electrical', price: 5000, unit: 'per floor', rating: 4.5, reviews: 19, status: 'active', description: 'Complete electrical work including wiring, panel installation, and earthing. Licensed electrician with 8 years experience.\n\n• Complete house/building wiring\n• DB panel installation\n• Earthing and grounding\n• Safety inspections\n• Emergency repairs\n\nUsing quality materials and following all safety standards.', provider: 'M. Ali Electric Co.', whatsapp: '+923215554321', phone: '+923215554321', location: 'Islamabad', img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=800&h=500&fit=crop', experience: '8 years', completedProjects: 300, responseTime: '30 minutes', skills: ['Industrial Wiring', 'Solar Panel Installation'] },
  { id: 4, title: 'Civil Construction Labour Team', category: 'Labour', price: 3000, unit: 'per day', rating: 4.2, reviews: 45, status: 'active', description: 'Experienced masonry and construction labor team for any scale of project. Skilled workers with quality workmanship guaranteed.\n\n• Brick/block masonry\n• Concrete work\n• Plastering and finishing\n• Tile installation\n• General construction labor\n\nTeam of 6-8 skilled workers available for daily or project basis.', provider: 'Master Builders', whatsapp: '+923008887777', phone: '+923008887777', location: 'Lahore', img: 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=800&h=500&fit=crop', experience: '15 years', completedProjects: 500, responseTime: '1 hour', skills: ['Masonry', 'Plastering', 'Concreting'] },
];

export default function ServiceDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: gigData, isLoading } = useGig(id);
  const service = gigData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={40} className="animate-spin" style={{ color: '#ef4136' }} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-[#1E293B]">Service Not Found</h2>
          <p className="text-gray-500 mb-8">The service you are looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => router.push('/services')}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#ef4136' }}
          >
            Browse All Services
          </button>
        </div>
      </div>
    );
  }

  const providerName = service.user?.fullName || 'Verified Provider';
  const providerPhone = service.user?.phone || '+923000000000';

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi ${providerName}! I'm interested in your service: ${service.title} listed on Build Hub.`);
    window.open(`https://wa.me/${providerPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${providerPhone}`;
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header / Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#ef4136] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Services
          </button>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-50 text-[#64748B] transition-colors">
              <Share2 size={20} />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <Heart size={20} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#64748B]'} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Hero Card */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <img src={service.images?.[0] || 'https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=800&h=500&fit=crop'} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2E5E]/90 via-[#0D2E5E]/20 to-transparent" />

                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md bg-white/20 border border-white/30">
                    {service.category?.title || 'Service'}
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <h1 className="text-white font-black text-2xl md:text-4xl leading-tight drop-shadow-lg mb-4">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-white/90">
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-lg">5.0</span>
                      <span className="text-sm opacity-70">(0 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin size={20} className="text-red-400" />
                      <span className="font-bold">{service.city || 'Pakistan'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About & Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="font-black text-xl mb-6 flex items-center gap-3 text-[#0D2E5E]">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Briefcase size={20} className="text-[#0D2E5E]" />
                  </div>
                  Service Description
                </h2>
                <div className="text-[#475569] leading-relaxed text-sm space-y-4 whitespace-pre-line">
                  {service.description}
                </div>
              </div>

              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <h2 className="font-black text-xl mb-6 text-[#0D2E5E]">Provider Portfolio</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Experience', value: (service.experieceYear || '0') + ' years', icon: Award, color: '#ef4136', bg: 'bg-red-50' },
                      { label: 'Delivery', value: service.deliveryDays + ' days', icon: CheckCircle2, color: '#10B981', bg: 'bg-emerald-50' },
                      { label: 'Availability', value: service.availability === 'yes' ? 'Available' : 'Busy', icon: Clock, color: '#3B82F6', bg: 'bg-blue-50' },
                      { label: 'Rating', value: '5.0', icon: Star, color: '#F59E0B', bg: 'bg-amber-50' },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 transition-transform hover:scale-105 cursor-default`}>
                        <stat.icon size={20} style={{ color: stat.color }} className="mb-2" />
                        <div className="font-black text-lg text-slate-800">{stat.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills/Tools Tags */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <h2 className="font-black text-xl mb-6 text-[#0D2E5E]">Qualification & Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {service.qualification?.split(',').map((q: string) => (
                      <span key={q} className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100">
                        {q.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-2xl text-[#0D2E5E]">Client Feedback</h3>
                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="font-black text-[#1E293B]">5.0</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">0 Reviews</span>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { name: 'Ali Hassan', rating: 5, comment: 'Excellent work! Very professional and completed on time. The structural drawings were very detailed and easy to follow for the site team.', date: '2 days ago', avatar: 'AH' },
                  { name: 'Sara Ahmed', rating: 4, comment: 'Good service, would recommend. Responded quickly to my queries regarding the foundation design.', date: '1 week ago', avatar: 'SA' },
                  { name: 'Bilal Khan', rating: 5, comment: 'Outstanding quality and attention to detail. Verified professional who knows the building codes perfectly.', date: '2 weeks ago', avatar: 'BK' },
                ].map((review, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-blue-100 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0D2E5E] flex items-center justify-center text-white font-black text-xs">
                          {review.avatar}
                        </div>
                        <div>
                          <div className="font-black text-sm text-[#1E293B]">{review.name}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className={i < review.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 sticky top-24">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#0D2E5E] to-[#1E40AF] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 overflow-hidden">
                    {service.user?.logo ? (
                      <img src={service.user.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      providerName.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-[#10B981] flex items-center justify-center text-white">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                </div>
                <h3 className="font-black text-xl text-[#0D2E5E] mb-1">{providerName}</h3>
                <div className="flex items-center justify-center gap-1.5 text-slate-400">
                  <MapPin size={14} className="text-red-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">{service.city || 'Pakistan'}</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-center border border-slate-100">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Service Starting From</div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-sm font-black text-[#0D2E5E] mt-2">Rs.</span>
                  <span className="text-4xl font-black text-[#ef4136] tracking-tighter">
                    {Number(service.price).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-500">{service.price_type}</div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleWhatsApp}
                  className="w-full group relative py-4 rounded-2xl font-black text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-3">
                    <MessageCircle size={22} />
                    <span>WhatsApp Inquiry</span>
                  </div>
                </button>

                <div className="relative">
                  {!showPhoneNumber ? (
                    <button
                      onClick={() => setShowPhoneNumber(true)}
                      className="w-full py-4 rounded-2xl font-black text-[#0D2E5E] bg-white border-2 border-[#0D2E5E]/10 hover:border-[#0D2E5E] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                      <Phone size={20} />
                      Show Contact Info
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="w-full py-4 rounded-2xl font-black text-[#ef4136] bg-red-50 border-2 border-red-100 flex items-center justify-center gap-3">
                        <Phone size={20} />
                        {providerPhone}
                      </div>
                      <button
                        onClick={handleCall}
                        className="w-full py-4 rounded-2xl font-black text-white bg-[#ef4136] shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                      >
                        <Phone size={22} className="animate-bounce" />
                        Call Professional Now
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Badge info */}
              <div className="mt-8 p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0D2E5E] flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-[#0D2E5E] uppercase tracking-wider mb-1">Build Hub Secure</h4>
                    <p className="text-[10px] leading-relaxed text-slate-500 font-bold">
                      This provider has been verified by our quality assurance team. Always discuss project scope before payments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share/Safety Links */}
              <div className="mt-8 flex items-center justify-center gap-6">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ef4136] transition-colors flex items-center gap-2">
                  <ExternalLink size={14} />
                  Terms of Service
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ef4136] transition-colors flex items-center gap-2">
                  <Shield size={14} />
                  Safety Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

