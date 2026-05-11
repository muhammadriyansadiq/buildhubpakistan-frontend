'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  HardHat, Wrench, Plus, MessageSquare, Settings, LogOut,
  Search, Edit, Trash2, Star, Clock, CheckCircle2, ChevronRight,
  Bell, User, MapPin, DollarSign, Briefcase, Phone, Mail,
  TrendingUp, Calendar, Eye, FileText, Send, XCircle, Download,
  ChevronDown, ChevronUp, CreditCard, ChevronLeft, Building2, Camera, Zap, Shield, Award
} from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';
import { useCompleteBusinessStep3Mutation, useCompleteDocumentsStep4Mutation } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Section = 'gigs' | 'create-gig' | 'rfq' | 'settings';
type OnboardingStep = 'setup' | 'documents' | 'subscription' | 'payment';

const subscriptionTiers = [
  {
    id: 'tier1',
    name: 'Tier 1 — Big Firm',
    price: '2,000',
    period: '/month',
    badge: 'Enterprise',
    badgeColor: '#0D2E5E',
    description: 'For large construction firms, design agencies, and enterprises',
    icon: Award,
    features: [
      'Up to 20 team members', 'Featured placement in search', 'Priority project assignments',
      'Dedicated account manager', 'Advanced portfolio showcase', 'Client review management',
      'Analytics dashboard', 'API access'
    ],
    color: '#0D2E5E',
    bg: '#EFF6FF',
  },
  {
    id: 'tier2',
    name: 'Tier 2 — Engineer',
    price: '500',
    period: '/month',
    badge: 'Professional',
    badgeColor: '#F97316',
    description: 'For individual engineers, architects, and consultants',
    icon: Star,
    features: [
      'Solo professional profile', 'Standard search placement', 'Portfolio & project showcase',
      'Client messaging', 'Gig management', 'Basic analytics', 'Review collection', 'Mobile app'
    ],
    color: '#F97316',
    bg: '#FFF7ED',
  },
  {
    id: 'tier3',
    name: 'Tier 3 — Labor',
    price: 'Free',
    period: 'forever',
    badge: 'Basic',
    badgeColor: '#10B981',
    description: 'For skilled labor, contractors, and daily wage workers',
    icon: User,
    features: [
      'Basic profile page', 'List your skills', 'Receive job requests',
      'Direct client contact', 'Availability status'
    ],
    color: '#10B981',
    bg: '#F0FDF4',
  },
];

const mockGigs = [
  { id: 1, title: 'Structural Engineering Design & Consultancy', category: 'Engineering', price: 15000, unit: 'per project', rating: 4.8, reviews: 34, status: 'active', requests: 12, description: 'Complete structural analysis and design for residential and commercial buildings.' },
  { id: 2, title: 'Architectural Interior Design', category: 'Architecture', price: 8000, unit: 'per room', rating: 4.6, reviews: 28, status: 'active', requests: 7, description: 'Modern interior design solutions for homes and offices.' },
  { id: 3, title: 'Electrical Wiring & Panel Installation', category: 'Electrical', price: 5000, unit: 'per floor', rating: 4.5, reviews: 19, status: 'paused', requests: 3, description: 'Complete electrical work including wiring, panel installation, and earthing.' },
  { id: 4, title: 'Civil Construction Labour Team', category: 'Labour', price: 3000, unit: 'per day', rating: 4.2, reviews: 45, status: 'active', requests: 18, description: 'Experienced masonry and construction labor team for any scale of project.' },
];

const occupations = [
  'Structural Engineer', 'Civil Engineer', 'Architect', 'Interior Designer',
  'Electrical Engineer', 'Plumbing Contractor', 'Mason', 'Welder',
  'Painter', 'Carpenter', 'Tiler', 'Concrete Worker', 'Project Manager', 'Quantity Surveyor'
];

const gigUnits = ['per project', 'per day', 'per hour', 'per sq ft', 'per floor', 'per room', 'per unit', 'fixed price'];

// Generate large dataset of RFQs for services
const generateServiceRFQs = () => {
  const statuses: ('pending' | 'quoted' | 'accepted' | 'rejected')[] = ['pending', 'quoted', 'accepted', 'rejected'];
  const clients = [
    'Hassan Developers', 'Noor Builders', 'Ali Construction', 'Pak Real Estate',
    'City Homes', 'Elite Properties', 'Metro Builders', 'Prime Construction',
    'Royal Developers', 'United Builders', 'Smart Homes', 'Vista Real Estate',
    'Skyline Construction', 'Golden Builders', 'Atlas Developers', 'Pearl Homes'
  ];
  const services = [
    'Structural Engineering Design', 'Architectural Interior Design', 'Electrical Installation',
    'Plumbing Work', 'Civil Construction Labour', 'Painting Services', 'Welding Work',
    'Carpentry Services', 'Tiling Work', 'HVAC Installation', 'Masonry Work', 'Landscaping'
  ];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Peshawar'];
  const baseDate = new Date('2024-05-10T00:00:00Z').getTime();

  const rfqs = [];
  for (let i = 1; i <= 75; i++) {
    const daysAgo = i % 30;
    const rfqDate = new Date(baseDate - daysAgo * 24 * 60 * 60 * 1000);
    const status = statuses[i % statuses.length];
    const service = services[i % services.length];
    const client = clients[i % clients.length];
    const budget = 10000 + (i * 1234) % 150000;
    const city = cities[i % cities.length];

    const conversation: any[] = [{
      id: 1,
      sender: 'client',
      text: `I need ${service} for my construction project in ${city}. My budget is around Rs. ${budget.toLocaleString()}. Please provide your quotation with timeline and deliverables.`,
      timestamp: `${rfqDate.toISOString().split('T')[0]} ${String((i % 12) + 1).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`
    }];

    if (status !== 'pending') {
      const quotedPrice = Math.floor(budget * (0.8 + (i % 40) / 100));
      conversation.push({
        id: 2,
        sender: 'provider',
        text: `Thank you for reaching out! I can provide ${service} for your project.\n\nQuoted Price: Rs. ${quotedPrice.toLocaleString()}\nTimeline: ${(i % 20) + 5} days\nDeliverables: Complete ${service.toLowerCase()} as per specifications\n\nI have ${(i % 10) + 5} years of experience in this field. All work will be done professionally with quality guarantee.\n\nLet me know if you'd like to proceed.`,
        timestamp: `${rfqDate.toISOString().split('T')[0]} ${String((i % 12) + 1).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
        quotedPrice,
        timeline: `${(i % 20) + 5} days`
      });
    }

    if (status === 'accepted') {
      conversation.push({
        id: 3,
        sender: 'client',
        text: 'Great! Your quotation looks good. Please proceed with the project.',
        timestamp: `${rfqDate.toISOString().split('T')[0]} ${String((i % 12) + 1).padStart(2, '0')}:${String((i * 19) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`
      });
    }

    if (status === 'rejected') {
      conversation.push({
        id: 3,
        sender: 'client',
        text: 'Thank you for the quote, but we have decided to go with another service provider.',
        timestamp: `${rfqDate.toISOString().split('T')[0]} ${String((i % 12) + 1).padStart(2, '0')}:${String((i * 21) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`
      });
    }

    rfqs.push({
      id: `RFQ-S${String(2000 + i).padStart(4, '0')}`,
      client,
      clientEmail: `${client.toLowerCase().replace(/\s+/g, '')}@example.pk`,
      clientPhone: `+92 ${300 + (i % 100)} ${String(1000000 + i * 54321).slice(-7)}`,
      date: rfqDate.toISOString().split('T')[0],
      time: `${String((i % 12) + 1).padStart(2, '0')}:${String((i * 23) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
      status,
      service,
      budget,
      description: `Need ${service.toLowerCase()} for construction project in ${city}.`,
      location: `${city}, ${['DHA', 'Bahria Town', 'Model Town', 'Gulberg', 'Johar Town'][i % 5]}`,
      expectedStart: new Date(rfqDate.getTime() + ((i % 15) + 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      conversation,
      priority: i % 10 > 7 ? 'high' : 'normal'
    });
  }

  return rfqs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const mockServiceRFQs = generateServiceRFQs();

export default function ServiceDashboard() {
  const params = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>((params?.section as Section) || 'gigs');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('setup');
  const [accountType, setAccountType] = useState<'labour' | 'engineer' | 'engineering_firm'>('labour');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [setupForm, setSetupForm] = useState({
    businessName: '', profilePicture: null as File | null,
    cnic: '', ntn: '', businessLocation: ''
  });
  const [bankForm, setBankForm] = useState({
    accountTitle: '', accountNumber: '', branchCode: '', ibanNumber: ''
  });

  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // If profile is not complete, force them to the settings/onboarding section
      if (parsedUser && !parsedUser.isProfileComplete) {
        setActiveSection('settings');
      }
    }
  }, []);

  const onboardingSteps = ['setup', 'documents', 'subscription', 'payment'];
  const onboardingStepIdx = onboardingSteps.indexOf(onboardingStep);

  const businessStep3Mutation = useCompleteBusinessStep3Mutation();
  const documentsStep4Mutation = useCompleteDocumentsStep4Mutation();

  const handleOnboardingNext = async () => {
    if (onboardingStep === 'setup') {
      try {
        await businessStep3Mutation.mutateAsync({
          shopName: setupForm.businessName,
          logo: setupForm.profilePicture,
          accountType: accountType,
          businessAddress: setupForm.businessLocation,
        });
        toast.success("Profile info saved");
        
        // Update local user state
        const updatedUser = { ...user, isProfileComplete: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        return;
      }
    } else if (onboardingStep === 'documents') {
      try {
        await documentsStep4Mutation.mutateAsync({
          accountTitle: bankForm.accountTitle,
          branchCode: bankForm.branchCode,
          accountNumber: bankForm.accountNumber,
          ibanNumber: bankForm.ibanNumber,
        });
        toast.success("Bank details saved");
      } catch (err) {
        return;
      }
    }

    const nextStep = onboardingSteps[onboardingStepIdx + 1] as OnboardingStep;
    if (nextStep) setOnboardingStep(nextStep);
  };

  const handleOnboardingBack = () => {
    const prevStep = onboardingSteps[onboardingStepIdx - 1] as OnboardingStep;
    if (prevStep) setOnboardingStep(prevStep);
  };
  const [gigForm, setGigForm] = useState({
    occupation: '', title: '', description: '', price: '', unit: '',
  });

  // RFQ state
  const [rfqStatusFilter, setRfqStatusFilter] = useState('all');
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [timeline, setTimeline] = useState('');
  const [rfqSearchQuery, setRfqSearchQuery] = useState('');
  const [rfqPage, setRfqPage] = useState(1);
  const [rfqDateFilter, setRfqDateFilter] = useState('all');
  const [rfqPriorityFilter, setRfqPriorityFilter] = useState('all');
  const rfqPerPage = 15;

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navItems = [
    { id: 'gigs', label: 'My Gigs', icon: Briefcase },
    { id: 'create-gig', label: 'Create Gig', icon: Plus },
    { id: 'rfq', label: 'RFQ Management', icon: FileText },
  ];

  const navigate2 = (section: Section) => {
    setActiveSection(section);
    router.push(`/service/dashboard/${section}`);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: 'Active', color: '#166534', bg: '#DCFCE7' },
      paused: { label: 'Paused', color: '#92400E', bg: '#FEF3C7' },
    };
    const s = map[status] || map.active;
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col shadow-xl" style={{ backgroundColor: '#064E3B' }}>
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: '#065F46' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F97316' }}>
              <HardHat size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Build Hub</div>
              <div className="text-xs" style={{ color: '#6EE7B7' }}>Service Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold mb-3 px-3" style={{ color: '#6EE7B7' }}>MAIN MENU</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isDisabled = user && !user.isProfileComplete && item.id !== 'settings';

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && navigate2(item.id as Section)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  backgroundColor: isActive ? '#10B981' : 'transparent',
                  color: isActive ? 'white' : '#A7F3D0',
                }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}

          <div className="pt-4 border-t mt-4" style={{ borderColor: '#065F46' }}>
            <button onClick={() => navigate2('settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all" style={{ backgroundColor: activeSection === 'settings' ? '#10B981' : 'transparent', color: activeSection === 'settings' ? 'white' : '#A7F3D0' }}>
              <Settings size={18} /> Settings
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm" style={{ color: '#A7F3D0' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t" style={{ borderColor: '#065F46' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1774600166818-e554a4d4c376?w=40&h=40&fit=crop&crop=faces" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Eng. Ahmad Raza</div>
              <div className="text-xs flex items-center gap-1" style={{ color: '#6EE7B7' }}>
                <CheckCircle2 size={11} /> Tier 2 — Engineer
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <h1 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>
              {activeSection === 'gigs' ? 'My Gigs' :
               activeSection === 'create-gig' ? 'Create New Gig' : 'RFQ Management'}
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {activeSection === 'gigs' ? 'Manage your active service offerings' :
               activeSection === 'create-gig' ? 'List a new professional service' : 'Manage quotation requests from clients'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl border hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
              <Bell size={20} style={{ color: '#64748B' }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#F97316' }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span className="text-xs font-semibold" style={{ color: '#166534' }}>Verified Provider</span>
            </div>
          </div>
        </header>

        <DemoNav />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ─── MY GIGS ─── */}
          {activeSection === 'gigs' && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Gigs', value: '3', icon: Briefcase, color: '#10B981' },
                  { label: 'Total Requests', value: '40', icon: MessageSquare, color: '#F97316' },
                  { label: 'Avg Rating', value: '4.5 ★', icon: Star, color: '#F59E0B' },
                  { label: 'This Month', value: 'Rs. 85K', icon: TrendingUp, color: '#0D2E5E' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                          <Icon size={20} style={{ color: s.color }} />
                        </div>
                      </div>
                      <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Gigs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {mockGigs.map((gig) => (
                  <div key={gig.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow" style={{ borderColor: '#E2E8F0' }}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {statusBadge(gig.status)}
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}>{gig.category}</span>
                          </div>
                          <h3 className="font-semibold text-sm leading-snug" style={{ color: '#1E293B' }}>{gig.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50">
                            <Edit size={14} style={{ color: '#3B82F6' }} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50">
                            <Trash2 size={14} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748B' }}>{gig.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
                        <div>
                          <span className="font-bold" style={{ color: '#0D2E5E', fontSize: '15px' }}>Rs. {gig.price.toLocaleString()}</span>
                          <span className="text-xs ml-1" style={{ color: '#94A3B8' }}>{gig.unit}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#64748B' }}>
                          <span className="flex items-center gap-1">
                            <Star size={12} style={{ color: '#F59E0B' }} /> {gig.rating} ({gig.reviews})
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} /> {gig.requests} requests
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Gig Card */}
                <button
                  onClick={() => navigate2('create-gig')}
                  className="rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#CBD5E1' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
                    <Plus size={22} style={{ color: '#64748B' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#64748B' }}>Create New Gig</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── CREATE GIG ─── */}
          {activeSection === 'create-gig' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5" style={{ borderColor: '#E2E8F0' }}>
                {/* Occupation */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Occupation *</label>
                  <select
                    value={gigForm.occupation}
                    onChange={(e) => setGigForm({ ...gigForm, occupation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  >
                    <option value="">Select your occupation...</option>
                    {occupations.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Gig Title *</label>
                  <input
                    type="text"
                    value={gigForm.title}
                    onChange={(e) => setGigForm({ ...gigForm, title: e.target.value })}
                    placeholder="e.g. I will design structural plans for your building"
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Description *</label>
                  <textarea
                    value={gigForm.description}
                    onChange={(e) => setGigForm({ ...gigForm, description: e.target.value })}
                    placeholder="Describe your service in detail — experience, scope of work, deliverables, timeline..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                {/* Price & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Price (Rs.) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: '#64748B' }}>Rs.</span>
                      <input
                        type="number"
                        value={gigForm.price}
                        onChange={(e) => setGigForm({ ...gigForm, price: e.target.value })}
                        placeholder="e.g. 15000"
                        className="w-full pl-8 pr-3 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Unit / Basis *</label>
                    <select
                      value={gigForm.unit}
                      onChange={(e) => setGigForm({ ...gigForm, unit: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option value="">Select unit...</option>
                      {gigUnits.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                {/* Contact Details (auto-fetched) */}
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#166534' }}>
                    <CheckCircle2 size={14} /> Contact Details (Auto-fetched from your profile)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Phone size={14} style={{ color: '#10B981' }} />
                      <span className="text-sm" style={{ color: '#334155' }}>+92 300 1234567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} style={{ color: '#10B981' }} />
                      <span className="text-sm" style={{ color: '#334155' }}>engineer.raza@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: '#10B981' }} />
                      <span className="text-sm" style={{ color: '#334155' }}>Lahore, Punjab</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} style={{ color: '#10B981' }} />
                      <span className="text-sm" style={{ color: '#334155' }}>Eng. Ahmad Raza</span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                  <button className="px-6 py-3 rounded-xl border font-semibold text-sm hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                    Save Draft
                  </button>
                  <button
                    onClick={() => navigate2('gigs')}
                    className="flex-1 py-3 rounded-xl text-white font-semibold hover:opacity-90 text-sm"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    Publish Gig
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── RFQ MANAGEMENT ─── */}
          {activeSection === 'rfq' && (() => {
            // Filter RFQs
            const filteredRFQs = mockServiceRFQs.filter((rfq) => {
              const matchesStatus = rfqStatusFilter === 'all' || rfq.status === rfqStatusFilter;
              const matchesSearch = rfq.id.toLowerCase().includes(rfqSearchQuery.toLowerCase()) ||
                rfq.client.toLowerCase().includes(rfqSearchQuery.toLowerCase()) ||
                rfq.service.toLowerCase().includes(rfqSearchQuery.toLowerCase());
              const matchesPriority = rfqPriorityFilter === 'all' || rfq.priority === rfqPriorityFilter;

              let matchesDate = true;
              if (rfqDateFilter !== 'all') {
                const rfqDate = new Date(rfq.date);
                const now = new Date();
                if (rfqDateFilter === 'today') {
                  matchesDate = rfqDate.toDateString() === now.toDateString();
                } else if (rfqDateFilter === 'week') {
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  matchesDate = rfqDate >= weekAgo;
                } else if (rfqDateFilter === 'month') {
                  matchesDate = rfqDate.getMonth() === now.getMonth() && rfqDate.getFullYear() === now.getFullYear();
                }
              }

              return matchesStatus && matchesSearch && matchesDate && matchesPriority;
            });

            const rfqCounts = {
              all: mockServiceRFQs.length,
              pending: mockServiceRFQs.filter(r => r.status === 'pending').length,
              quoted: mockServiceRFQs.filter(r => r.status === 'quoted').length,
              accepted: mockServiceRFQs.filter(r => r.status === 'accepted').length,
              rejected: mockServiceRFQs.filter(r => r.status === 'rejected').length,
            };

            // Pagination
            const totalPages = Math.ceil(filteredRFQs.length / rfqPerPage);
            const paginatedRFQs = filteredRFQs.slice(
              (rfqPage - 1) * rfqPerPage,
              rfqPage * rfqPerPage
            );

            const handleSendQuote = (rfqId: string) => {
              if (!replyMessage.trim() && !quotedPrice) return;

              alert(`Quote sent for ${rfqId}!\nMessage: ${replyMessage}\nQuoted Price: Rs. ${quotedPrice}\nTimeline: ${timeline}`);

              setReplyMessage('');
              setQuotedPrice('');
              setTimeline('');
              setSelectedRFQ(null);
            };

            const handleQuickQuote = (rfqId: string) => {
              setSelectedRFQ(rfqId);
            };

            const selectedRFQData = mockServiceRFQs.find(r => r.id === selectedRFQ);

            return (
              <div className="space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total RFQs', value: rfqCounts.all, color: '#10B981', icon: FileText },
                    { label: 'Pending', value: rfqCounts.pending, color: '#F59E0B', icon: Clock },
                    { label: 'Quoted', value: rfqCounts.quoted, color: '#3B82F6', icon: MessageSquare },
                    { label: 'Accepted', value: rfqCounts.accepted, color: '#10B981', icon: CheckCircle2 },
                    { label: 'Rejected', value: rfqCounts.rejected, color: '#EF4444', icon: XCircle },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                          <Icon size={18} style={{ color: s.color }} />
                        </div>
                        <div>
                          <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>{s.value}</div>
                          <div className="text-xs" style={{ color: '#64748B' }}>{s.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RFQ Table */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                  {/* Status Tabs */}
                  <div className="flex border-b overflow-x-auto" style={{ borderColor: '#E2E8F0' }}>
                    {[
                      { id: 'all', label: 'All RFQs', count: rfqCounts.all },
                      { id: 'pending', label: 'Pending', count: rfqCounts.pending },
                      { id: 'quoted', label: 'Quoted', count: rfqCounts.quoted },
                      { id: 'accepted', label: 'Accepted', count: rfqCounts.accepted },
                      { id: 'rejected', label: 'Rejected', count: rfqCounts.rejected },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setRfqStatusFilter(tab.id);
                          setRfqPage(1);
                        }}
                        className="px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                        style={{
                          borderColor: rfqStatusFilter === tab.id ? '#10B981' : 'transparent',
                          color: rfqStatusFilter === tab.id ? '#10B981' : '#64748B'
                        }}
                      >
                        {tab.label}
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
                          backgroundColor: rfqStatusFilter === tab.id ? '#DCFCE7' : '#F1F5F9',
                          color: rfqStatusFilter === tab.id ? '#166534' : '#64748B'
                        }}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Filters & Search */}
                  <div className="p-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: '#E2E8F0' }}>
                    <div className="relative flex-1 min-w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        value={rfqSearchQuery}
                        onChange={(e) => {
                          setRfqSearchQuery(e.target.value);
                          setRfqPage(1);
                        }}
                        placeholder="Search by RFQ ID, Client, or Service..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                    <select
                      value={rfqDateFilter}
                      onChange={(e) => {
                        setRfqDateFilter(e.target.value);
                        setRfqPage(1);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">This Month</option>
                    </select>
                    <select
                      value={rfqPriorityFilter}
                      onChange={(e) => {
                        setRfqPriorityFilter(e.target.value);
                        setRfqPage(1);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High Priority</option>
                      <option value="normal">Normal</option>
                    </select>
                    <button
                      className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0D2E5E' }}
                    >
                      <Download size={16} /> Export
                    </button>
                  </div>

                  {/* RFQ List Table */}
                  <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {paginatedRFQs.length > 0 ? paginatedRFQs.map((rfq) => {
                      const statusConfig = {
                        pending: { label: 'Pending Response', color: '#92400E', bg: '#FEF3C7' },
                        quoted: { label: 'Quote Sent', color: '#1E40AF', bg: '#DBEAFE' },
                        accepted: { label: 'Quote Accepted', color: '#166534', bg: '#DCFCE7' },
                        rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2' },
                      };
                      const s = statusConfig[rfq.status];

                      return (
                        <div key={rfq.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>RFQ ID</div>
                                <div className="font-mono font-semibold text-sm flex items-center gap-2" style={{ color: '#0D2E5E' }}>
                                  {rfq.id}
                                  {rfq.priority === 'high' && (
                                    <span className="px-1.5 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                                      High
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{rfq.date} {rfq.time}</div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Client</div>
                                <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{rfq.client}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{rfq.clientPhone}</div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Service Details</div>
                                <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{rfq.service}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Budget: Rs. {rfq.budget.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Location</div>
                                <div className="text-sm" style={{ color: '#1E293B' }}>{rfq.location}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Start: {rfq.expectedStart}</div>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Status</div>
                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>
                                  {s.label}
                                </span>
                                <div className="text-xs mt-1 flex items-center gap-1" style={{ color: '#94A3B8' }}>
                                  <MessageSquare size={11} /> {rfq.conversation.length} msg
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuickQuote(rfq.id)}
                                className="px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                                style={{
                                  backgroundColor: rfq.status === 'pending' ? '#10B981' : '#3B82F6',
                                  color: 'white'
                                }}
                              >
                                {rfq.status === 'pending' ? (
                                  <><Send size={14} /> Send Quote</>
                                ) : (
                                  <><Eye size={14} /> View</>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="p-12 text-center">
                        <FileText size={48} className="mx-auto mb-4" style={{ color: '#CBD5E1' }} />
                        <p className="font-semibold text-lg mb-2" style={{ color: '#64748B' }}>No RFQs found</p>
                        <p className="text-sm" style={{ color: '#94A3B8' }}>Try adjusting your filters or search query</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                      <div className="text-sm" style={{ color: '#64748B' }}>
                        Showing {((rfqPage - 1) * rfqPerPage) + 1} to {Math.min(rfqPage * rfqPerPage, filteredRFQs.length)} of {filteredRFQs.length} RFQs
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRfqPage(Math.max(1, rfqPage - 1))}
                          disabled={rfqPage === 1}
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
                            } else if (rfqPage <= 3) {
                              pageNum = i + 1;
                            } else if (rfqPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = rfqPage - 2 + i;
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => setRfqPage(pageNum)}
                                className="w-10 h-10 rounded-lg text-sm font-semibold transition-colors"
                                style={{
                                  backgroundColor: rfqPage === pageNum ? '#10B981' : 'transparent',
                                  color: rfqPage === pageNum ? 'white' : '#64748B'
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setRfqPage(Math.min(totalPages, rfqPage + 1))}
                          disabled={rfqPage === totalPages}
                          className="px-3 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* RFQ Details Modal/Drawer */}
                {selectedRFQData && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRFQ(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-white rounded-2xl">
                        {/* Header */}
                        <div className="p-5 border-b" style={{ borderColor: '#E2E8F0' }}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg mb-1" style={{ color: '#1E293B' }}>{selectedRFQData.id}</h3>
                              <p className="text-sm" style={{ color: '#64748B' }}>{selectedRFQData.service} • Budget: Rs. {selectedRFQData.budget.toLocaleString()}</p>
                            </div>
                            <div>
                              {(() => {
                                const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                                  pending: { label: 'Pending Response', color: '#92400E', bg: '#FEF3C7' },
                                  quoted: { label: 'Quote Sent', color: '#1E40AF', bg: '#DBEAFE' },
                                  accepted: { label: 'Quote Accepted', color: '#166534', bg: '#DCFCE7' },
                                  rejected: { label: 'Rejected', color: '#991B1B', bg: '#FEE2E2' },
                                };
                                const s = statusConfig[selectedRFQData.status] || statusConfig.pending;
                                return (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>
                                    {s.label}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Client Info */}
                          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                            <div>
                              <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Client</div>
                              <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{selectedRFQData.client}</div>
                              <div className="text-xs mt-1 flex items-center gap-1" style={{ color: '#64748B' }}>
                                <Mail size={11} /> {selectedRFQData.clientEmail}
                              </div>
                              <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#64748B' }}>
                                <Phone size={11} /> {selectedRFQData.clientPhone}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Project Details</div>
                              <div className="text-sm font-medium" style={{ color: '#1E293B' }}>{selectedRFQData.location}</div>
                              <div className="text-xs mt-1" style={{ color: '#64748B' }}>
                                Expected Start: {selectedRFQData.expectedStart}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Conversation Thread */}
                        <div className="p-5 max-h-96 overflow-y-auto space-y-4" style={{ backgroundColor: '#F8FAFC' }}>
                          {selectedRFQData.conversation.map((msg: any) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'provider' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-md ${msg.sender === 'provider' ? 'ml-auto' : 'mr-auto'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold" style={{ color: msg.sender === 'provider' ? '#10B981' : '#3e3e3e' }}>
                                    {msg.sender === 'provider' ? 'You (Service Provider)' : selectedRFQData.client}
                                  </span>
                                  <span className="text-xs" style={{ color: '#94A3B8' }}>{msg.timestamp}</span>
                                </div>
                                <div
                                  className="p-4 rounded-2xl"
                                  style={{
                                    backgroundColor: msg.sender === 'provider' ? '#10B981' : 'white',
                                    color: msg.sender === 'provider' ? 'white' : '#1E293B',
                                    border: msg.sender === 'provider' ? 'none' : '1px solid #E2E8F0'
                                  }}
                                >
                                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                  {msg.quotedPrice && (
                                    <div className="mt-3 pt-3" style={{ borderTop: msg.sender === 'provider' ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0' }}>
                                      <div className="text-xs mb-1" style={{ opacity: 0.9 }}>Quoted Price</div>
                                      <div className="font-bold text-lg">Rs. {msg.quotedPrice.toLocaleString()}</div>
                                      {msg.timeline && (
                                        <div className="text-xs mt-2">Timeline: {msg.timeline}</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        {selectedRFQData.status !== 'accepted' && selectedRFQData.status !== 'rejected' && (
                          <div className="p-5 border-t" style={{ borderColor: '#E2E8F0' }}>
                            <h4 className="font-semibold mb-3" style={{ color: '#1E293B' }}>
                              {selectedRFQData.status === 'pending' ? 'Send Quotation' : 'Update Quotation'}
                            </h4>

                            {/* Pricing Inputs */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>Quoted Price</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: '#64748B' }}>Rs.</span>
                                  <input
                                    type="number"
                                    value={quotedPrice}
                                    onChange={(e) => setQuotedPrice(e.target.value)}
                                    placeholder="Enter quoted price"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm outline-none"
                                    style={{ borderColor: '#E2E8F0' }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>Timeline</label>
                                <input
                                  type="text"
                                  value={timeline}
                                  onChange={(e) => setTimeline(e.target.value)}
                                  placeholder="e.g. 15 days"
                                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                                  style={{ borderColor: '#E2E8F0' }}
                                />
                              </div>
                            </div>

                            {/* Message Input */}
                            <div className="mb-3">
                              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>Quote Details & Terms</label>
                              <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Include your experience, deliverables, payment terms, and any other relevant details..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                                style={{ borderColor: '#E2E8F0' }}
                              />
                            </div>

                            {/* Send Button */}
                            <button
                              onClick={() => handleSendQuote(selectedRFQData.id)}
                              className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#10B981' }}
                            >
                              <Send size={18} />
                              {selectedRFQData.status === 'pending' ? 'Send Quotation' : 'Update Quotation'}
                            </button>
                          </div>
                        )}

                        {selectedRFQData.status === 'accepted' && (
                          <div className="p-5 border-t flex items-center gap-3" style={{ borderColor: '#E2E8F0', backgroundColor: '#F0FDF4' }}>
                            <CheckCircle2 size={20} style={{ color: '#16A34A' }} />
                            <div>
                              <p className="font-semibold text-sm" style={{ color: '#166534' }}>Quote Accepted!</p>
                              <p className="text-xs" style={{ color: '#15803D' }}>The client has accepted your quotation. You can now start the project.</p>
                            </div>
                            <button
                              className="ml-auto px-4 py-2 rounded-xl text-white font-semibold text-sm"
                              style={{ backgroundColor: '#16A34A' }}
                            >
                              View Project
                            </button>
                          </div>
                        )}

                        {selectedRFQData.status === 'rejected' && (
                          <div className="p-5 border-t flex items-center gap-3" style={{ borderColor: '#E2E8F0', backgroundColor: '#FEF2F2' }}>
                            <XCircle size={20} style={{ color: '#DC2626' }} />
                            <div className="flex-1">
                              <p className="font-semibold text-sm" style={{ color: '#991B1B' }}>Quote Rejected</p>
                              <p className="text-xs" style={{ color: '#B91C1C' }}>The client has declined your quotation and chose another service provider.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─── SETTINGS & ONBOARDING ─── */}
          {activeSection === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Progress Stepper */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2">
                  {[
                    { key: 'setup', label: 'Service Setup' },
                    { key: 'documents', label: 'Documents' },
                    { key: 'subscription', label: 'Subscription' },
                    { key: 'payment', label: 'Payment' },
                  ].map((s, idx) => (
                    <div key={s.key} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                          style={{
                            backgroundColor: idx <= onboardingStepIdx ? '#10B981' : '#F1F5F9',
                            color: idx <= onboardingStepIdx ? 'white' : '#94A3B8',
                            border: idx <= onboardingStepIdx ? 'none' : '2px solid #E2E8F0'
                          }}
                        >
                          {idx < onboardingStepIdx ? <CheckCircle2 size={20} /> : idx + 1}
                        </div>
                        <span className="text-xs font-semibold text-center" style={{ color: idx <= onboardingStepIdx ? '#10B981' : '#94A3B8' }}>{s.label}</span>
                      </div>
                      {idx < 3 && (
                        <div className="h-1 flex-1 mx-2 rounded-full" style={{ backgroundColor: idx < onboardingStepIdx ? '#10B981' : '#F1F5F9' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── STEP 1: Service Setup ─── */}
              {onboardingStep === 'setup' && (
                <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
                      <Wrench size={20} style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Service Profile Setup</h2>
                      <p className="text-sm" style={{ color: '#64748B' }}>Build your professional profile</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Business / Professional Name *</label>
                      <input type="text" value={setupForm.businessName} onChange={(e) => setSetupForm({...setupForm, businessName: e.target.value})} placeholder="e.g. Ahmed Engineering Services" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                    </div>

                    {/* Profile Photo */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Profile Picture *</label>
                      <input
                        type="file"
                        id="profile-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSetupForm({ ...setupForm, profilePicture: file });
                        }}
                      />
                      <div className="flex items-center gap-4">
                        <div
                          onClick={() => document.getElementById('profile-upload')?.click()}
                          className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                          style={{ borderColor: setupForm.profilePicture ? '#10B981' : '#CBD5E1', backgroundColor: '#F8FAFC' }}
                        >
                          {setupForm.profilePicture ? (
                            <div className="w-full h-full flex items-center justify-center bg-green-50">
                              <CheckCircle2 size={24} style={{ color: '#10B981' }} />
                            </div>
                          ) : (
                            <Camera size={24} style={{ color: '#94A3B8' }} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#334155' }}>Upload profile photo</p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>PNG, JPG — Min 200×200px</p>
                          <button
                            onClick={() => document.getElementById('profile-upload')?.click()}
                            className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
                            style={{ borderColor: '#CBD5E1', color: '#64748B' }}
                          >
                            {setupForm.profilePicture ? 'Change Photo' : 'Browse Photo'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Account Type *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'labour', label: 'Labour', icon: User, desc: 'Daily wage worker' },
                          { id: 'engineer', label: 'Engineer', icon: HardHat, desc: 'Solo professional' },
                          { id: 'engineering_firm', label: 'Engineering Firm', icon: Building2, desc: 'Registered firm' },
                        ].map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setAccountType(type.id as 'labour' | 'engineer' | 'engineering_firm')}
                              className="p-4 rounded-xl border-2 text-left transition-all"
                              style={{
                                borderColor: accountType === type.id ? '#10B981' : '#E2E8F0',
                                backgroundColor: accountType === type.id ? '#F0FDF4' : '#F8FAFC',
                              }}
                            >
                              <Icon size={20} className="mb-2" style={{ color: accountType === type.id ? '#10B981' : '#94A3B8' }} />
                              <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{type.label}</div>
                              <div className="text-xs" style={{ color: '#64748B' }}>{type.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CNIC / NTN */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>
                        {accountType === 'engineering_firm' ? 'NTN Number *' : 'CNIC Number *'}
                      </label>
                      <input
                        type="text"
                        value={accountType === 'engineering_firm' ? setupForm.ntn : setupForm.cnic}
                        onChange={(e) => {
                          if (accountType === 'engineering_firm') setSetupForm({...setupForm, ntn: e.target.value});
                          else setSetupForm({...setupForm, cnic: e.target.value});
                        }}
                        placeholder={accountType === 'engineering_firm' ? 'Enter NTN number' : 'XXXXX-XXXXXXX-X'}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Business Location *</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                        <input type="text" value={setupForm.businessLocation} onChange={(e) => setSetupForm({...setupForm, businessLocation: e.target.value})} placeholder="City, Province, Pakistan" className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                    <button onClick={handleOnboardingNext} className="px-8 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: '#10B981' }}>
                      Save & Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: Documents ─── */}
              {onboardingStep === 'documents' && (
                <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                      <FileText size={20} style={{ color: '#0D2E5E' }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Bank Details</h2>
                      <p className="text-sm" style={{ color: '#64748B' }}>Enter your bank account details for receiving payments</p>
                    </div>
                  </div>

                  <div className="space-y-5 mt-6">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Account Title *</label>
                      <input
                        type="text"
                        value={bankForm.accountTitle}
                        onChange={(e) => setBankForm({ ...bankForm, accountTitle: e.target.value })}
                        placeholder="e.g. Muhammad Ahmed"
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Bank Account Number *</label>
                      <input
                        type="text"
                        value={bankForm.accountNumber}
                        onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                        placeholder="e.g. 1234567890"
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Branch Code *</label>
                        <input
                          type="text"
                          value={bankForm.branchCode}
                          onChange={(e) => setBankForm({ ...bankForm, branchCode: e.target.value })}
                          placeholder="e.g. 0214"
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>IBAN Number *</label>
                        <input
                          type="text"
                          value={bankForm.ibanNumber}
                          onChange={(e) => setBankForm({ ...bankForm, ibanNumber: e.target.value })}
                          placeholder="e.g. PK00 ABCD 1234 5678 9012"
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                    <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button onClick={handleOnboardingNext} className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: '#10B981' }}>
                      Submit Details <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Subscription ─── */}
              {onboardingStep === 'subscription' && (
                <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                  <div className="text-center mb-8">
                    <h2 className="font-bold text-2xl" style={{ color: '#0D2E5E' }}>Choose Your Tier</h2>
                    <p className="text-sm mt-2" style={{ color: '#64748B' }}>Select the plan that matches your professional level</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {subscriptionTiers.map((tier) => {
                      const Icon = tier.icon;
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTier(tier.id)}
                          className="rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md"
                          style={{
                            borderColor: selectedTier === tier.id ? tier.color : '#E2E8F0',
                            backgroundColor: selectedTier === tier.id ? tier.bg : 'white',
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tier.color }}>
                              <Icon size={22} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div>
                                  <h3 className="font-bold" style={{ color: tier.color }}>{tier.name}</h3>
                                  <p className="text-xs" style={{ color: '#64748B' }}>{tier.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>
                                    {tier.price === 'Free' ? 'Free' : `Rs. ${tier.price}`}
                                  </div>
                                  <div className="text-xs" style={{ color: '#64748B' }}>{tier.period}</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                {tier.features.slice(0, 4).map((feat) => (
                                  <span key={feat} className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                                    <CheckCircle2 size={11} style={{ color: tier.color }} /> {feat}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1" style={{
                              borderColor: selectedTier === tier.id ? tier.color : '#CBD5E1',
                              backgroundColor: selectedTier === tier.id ? tier.color : 'transparent',
                            }}>
                              {selectedTier === tier.id && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      onClick={handleOnboardingNext}
                      disabled={!selectedTier}
                      className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ backgroundColor: selectedTier ? '#10B981' : '#94A3B8' }}
                    >
                      {selectedTier === 'tier3' ? 'Activate Free Account' : 'Proceed to Payment'} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 4: Payment ─── */}
              {onboardingStep === 'payment' && (
                <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
                      <CreditCard size={20} style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Subscription Payment</h2>
                      <p className="text-sm" style={{ color: '#64748B' }}>Secure checkout</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#166534' }}>
                          {selectedTier === 'tier1' ? 'Tier 1 — Big Firm' : 'Tier 2 — Engineer'}
                        </p>
                        <p className="text-xs" style={{ color: '#16A34A' }}>Monthly Subscription</p>
                      </div>
                      <p className="font-bold text-xl" style={{ color: '#0D2E5E' }}>
                        Rs. {selectedTier === 'tier1' ? '2,000' : '500'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Expiry</label>
                        <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>CVV</label>
                        <input type="text" placeholder="•••" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 p-3 rounded-xl" style={{ backgroundColor: '#FFF7ED' }}>
                    <Shield size={16} style={{ color: '#F97316' }} />
                    <p className="text-xs" style={{ color: '#9A3412' }}>Secured with 256-bit SSL encryption</p>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                    <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      onClick={() => navigate2('gigs')}
                      className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ backgroundColor: '#10B981' }}
                    >
                      <Zap size={18} /> Activate Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}        </main>
      </div>
    </div>
  );
}
