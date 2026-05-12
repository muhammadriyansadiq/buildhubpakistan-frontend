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
import { useCreateGigMutation, useGigs, useUpdateGigMutation, useDeleteGigMutation, useGigCategories } from '@/hooks/useGigs';
import { useCategories } from '@/hooks/useProduct';
import { toast } from 'sonner';

type Section = 'gigs' | 'create-gig' | 'settings';
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

export default function ServiceDashboard() {
  const params = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>((params?.section as Section) || 'gigs');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('setup');
  const [accountType, setAccountType] = useState<'labour' | 'engineer' | 'engineering_firm'>('labour');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [setupForm, setSetupForm] = useState({
    businessName: '', profilePicture: null as File | null,
    cnicNumber: '', ntnNumber: '', businessLocation: ''
  });
  const [bankForm, setBankForm] = useState({
    accountTitle: '', accountNumber: '', branchCode: '', ibanNumber: ''
  });

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser && !parsedUser.isProfileComplete) {
        setActiveSection('settings');
      }
    }
  }, []);

  const businessStep3Mutation = useCompleteBusinessStep3Mutation();
  const documentsStep4Mutation = useCompleteDocumentsStep4Mutation();

  const [gigForm, setGigForm] = useState({
    title: '', description: '', price: '', price_type: 'Per Day',
    city: '', areaCoverage: '', availability: 'yes', experieceYear: '',
    minProjectSize: '', deliveryDays: '', gigStatus: 'Active',
    qualification: '', gigCategoriesId: '', images: [] as File[]
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: categories } = useGigCategories();
  const { data: gigsData, isLoading: isLoadingGigs } = useGigs({ userId: user?.id, page: 1, limit: 10 });
  const gigs = gigsData?.data || [];
  const createGigMutation = useCreateGigMutation();
  const updateGigMutation = useUpdateGigMutation();
  const deleteGigMutation = useDeleteGigMutation();

  const [editingGigId, setEditingGigId] = useState<number | null>(null);

  if (!mounted) return null;

  const onboardingSteps = ['setup', 'documents', 'subscription', 'payment'];
  const onboardingStepIdx = onboardingSteps.indexOf(onboardingStep);

  const handleOnboardingNext = async () => {
    if (onboardingStep === 'setup') {
      try {
        await businessStep3Mutation.mutateAsync({
          shopName: setupForm.businessName,
          logo: setupForm.profilePicture,
          accountType: accountType,
          businessAddress: setupForm.businessLocation,
          cnicNumber: setupForm.cnicNumber,
          ntnNumber: setupForm.ntnNumber,
        });
        toast.success("Profile info saved");
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

  const handleActivateAccount = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Registration steps completed. Please login to continue.");
    router.push('/login');
  };

  const handleOnboardingBack = () => {
    const prevStep = onboardingSteps[onboardingStepIdx - 1] as OnboardingStep;
    if (prevStep) setOnboardingStep(prevStep);
  };

  const handleEditClick = (gig: any) => {
    setEditingGigId(gig.id);
    setGigForm({
      title: gig.title,
      description: gig.description,
      price: gig.price.toString(),
      price_type: gig.price_type,
      city: gig.city,
      areaCoverage: gig.areaCoverage,
      availability: gig.availability,
      experieceYear: gig.experieceYear?.toString() || '',
      minProjectSize: gig.minProjectSize,
      deliveryDays: gig.deliveryDays?.toString() || '',
      gigStatus: gig.gigStatus,
      qualification: gig.qualification,
      gigCategoriesId: gig.gigCategoriesId.toString(),
      images: []
    });
    setImagePreviews(gig.images || []);
    setActiveSection('create-gig');
  };

  const handleDeleteGig = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      try {
        await deleteGigMutation.mutateAsync(id);
        toast.success("Gig deleted successfully");
      } catch (err) {
        toast.error("Failed to delete gig");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const updatedImages = [...gigForm.images, ...files];
      setGigForm({ ...gigForm, images: updatedImages });

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const previewToRemove = imagePreviews[index];

    // If it's a new image (blob URL), we need to find its index in gigForm.images
    if (previewToRemove.startsWith('blob:')) {
      // Find how many blob URLs came before this one to get the index in gigForm.images
      const blobCount = imagePreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      const newImages = gigForm.images.filter((_, i) => i !== blobCount);
      setGigForm({ ...gigForm, images: newImages });
    }

    // Always remove from previews
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handlePublishGig = async () => {
    try {
      if (!gigForm.title || !gigForm.price || !gigForm.gigCategoriesId) {
        toast.error("Please fill required fields");
        return;
      }

      const formData = new FormData();
      Object.entries(gigForm).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach(file => formData.append('images', file));
        } else {
          formData.append(key, value.toString());
        }
      });

      // Handle existing images for updates
      if (editingGigId) {
        const existingUrls = imagePreviews.filter(p => !p.startsWith('blob:'));
        existingUrls.forEach(url => formData.append('existingImages', url));
      }

      if (editingGigId) {
        await updateGigMutation.mutateAsync({ id: editingGigId, payload: formData });
        toast.success("Gig updated successfully!");
      } else {
        await createGigMutation.mutateAsync(formData);
        toast.success("Gig published successfully!");
      }

      setEditingGigId(null);
      setGigForm({
        title: '', description: '', price: '', price_type: 'Per Day',
        city: '', areaCoverage: '', availability: 'yes', experieceYear: '',
        minProjectSize: '', deliveryDays: '', gigStatus: 'Active',
        qualification: '', gigCategoriesId: '', images: []
      });
      setImagePreviews([]);
      navigate2('gigs');
    } catch (err) {
      toast.error(editingGigId ? "Failed to update gig" : "Failed to publish gig");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navItems = [
    { id: 'gigs', label: 'My Gigs', icon: Briefcase },
    { id: 'create-gig', label: 'Create Gig', icon: Plus },
  ];

  const navigate2 = (section: Section) => {
    setActiveSection(section);
    router.push(`/service/dashboard/${section}`);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col shadow-xl" style={{ backgroundColor: '#0D2E5E' }}>
        <div className="p-6 border-b flex justify-center" style={{ borderColor: '#1E4080' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
              <HardHat size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Build Hub</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>Service Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {(!user || user?.isProfileComplete) && (
            <p className="text-xs font-semibold mb-3 px-3" style={{ color: '#94A3B8' }}>MAIN MENU</p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isDisabled = !user || !user.isProfileComplete;

            if (isDisabled && item.id !== 'settings') return null;

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
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}

          <div className="pt-4 border-t mt-4" style={{ borderColor: '#1E4080' }}>
            <button onClick={() => navigate2('settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all" style={{ backgroundColor: activeSection === 'settings' ? '#ef4136' : 'transparent', color: activeSection === 'settings' ? 'white' : '#94A3B8' }}>
              <Settings size={18} /> Settings
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm" style={{ color: '#94A3B8' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#1E4080' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white/10 flex items-center justify-center">
              {user?.logo ? (
                <img src={user.logo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-white/60" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.fullName || 'Provider'}</div>
              <div className="text-xs flex items-center gap-1" style={{ color: '#10B981' }}>
                <CheckCircle2 size={11} className="flex-shrink-0" />
                <span className="truncate">{user?.isProfileComplete ? (user.accountType || user.role) : 'Incomplete Profile'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <h1 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>
              {activeSection === 'gigs' ? 'My Gigs' :
                activeSection === 'create-gig' ? (editingGigId ? 'Edit Gig' : 'Create New Gig') : 'Settings'}
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {activeSection === 'gigs' ? 'Manage your active service offerings' :
                activeSection === 'create-gig' ? (editingGigId ? 'Update your service details' : 'List a new professional service') : 'Update your profile and account settings'}
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

        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'gigs' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Gigs', value: gigs.length.toString(), icon: Briefcase, color: '#10B981' },
                  { label: 'Total Requests', value: '0', icon: MessageSquare, color: '#F97316' },
                  { label: 'Avg Rating', value: '5.0 ★', icon: Star, color: '#F59E0B' },
                  { label: 'This Month', value: 'Rs. 0', icon: TrendingUp, color: '#0D2E5E' },
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {isLoadingGigs ? (
                  [1, 2].map(i => (
                    <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border" style={{ borderColor: '#E2E8F0' }} />
                  ))
                ) : (
                  gigs.map((gig) => (
                    <div key={gig.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow" style={{ borderColor: '#E2E8F0' }}>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: '#166534', backgroundColor: '#DCFCE7' }}>
                                {gig.gigStatus}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}>{gig.category?.title}</span>
                            </div>
                            <h3 className="font-semibold text-sm leading-snug" style={{ color: '#1E293B' }}>{gig.title}</h3>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditClick(gig)} className="p-1.5 rounded-lg hover:bg-blue-50">
                              <Edit size={14} style={{ color: '#3B82F6' }} />
                            </button>
                            <button onClick={() => handleDeleteGig(gig.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                              <Trash2 size={14} style={{ color: '#EF4444' }} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748B' }}>{gig.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
                          <div>
                            <span className="font-bold" style={{ color: '#0D2E5E', fontSize: '15px' }}>Rs. {Number(gig.price).toLocaleString()}</span>
                            <span className="text-xs ml-1" style={{ color: '#94A3B8' }}>{gig.price_type}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: '#64748B' }}>
                            <span className="flex items-center gap-1">
                              <Star size={12} style={{ color: '#F59E0B' }} /> 5.0 (0)
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={12} /> 0 requests
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <button
                  onClick={() => {
                    setEditingGigId(null);
                    setGigForm({
                      title: '', description: '', price: '', price_type: 'Per Day',
                      city: '', areaCoverage: '', availability: 'yes', experieceYear: '',
                      minProjectSize: '', deliveryDays: '', gigStatus: 'Active',
                      qualification: '', gigCategoriesId: '', images: []
                    });
                    setImagePreviews([]);
                    setActiveSection('create-gig');
                  }}
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

          {activeSection === 'create-gig' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-[32px] shadow-sm border p-8 space-y-8" style={{ borderColor: '#E2E8F0' }}>
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#0D2E5E' }}>
                    <Plus size={24} className="text-[#ef4136]" /> {editingGigId ? 'Edit Service Gig' : 'Create Service Gig'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Fill in the details below to list your professional service</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Category *</label>
                    <select
                      value={gigForm.gigCategoriesId}
                      onChange={(e) => setGigForm({ ...gigForm, gigCategoriesId: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option value="">Select category...</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title || cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Gig Title *</label>
                    <input
                      type="text"
                      value={gigForm.title}
                      onChange={(e) => setGigForm({ ...gigForm, title: e.target.value })}
                      placeholder="e.g. Expert Labourer Services"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Description *</label>
                    <textarea
                      value={gigForm.description}
                      onChange={(e) => setGigForm({ ...gigForm, description: e.target.value })}
                      placeholder="Describe your service in detail..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none resize-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Price (Rs.) *</label>
                    <input
                      type="number"
                      value={gigForm.price}
                      onChange={(e) => setGigForm({ ...gigForm, price: e.target.value })}
                      placeholder="e.g. 200"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Price Type *</label>
                    <select
                      value={gigForm.price_type}
                      onChange={(e) => setGigForm({ ...gigForm, price_type: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option>Per Day</option>
                      <option>Per Hour</option>
                      <option>Fixed Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>City *</label>
                    <input
                      type="text"
                      value={gigForm.city}
                      onChange={(e) => setGigForm({ ...gigForm, city: e.target.value })}
                      placeholder="e.g. Karachi"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Area Coverage</label>
                    <input
                      type="text"
                      value={gigForm.areaCoverage}
                      onChange={(e) => setGigForm({ ...gigForm, areaCoverage: e.target.value })}
                      placeholder="e.g. Gulshan Iqbal"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Experience (Years)</label>
                    <input
                      type="number"
                      value={gigForm.experieceYear}
                      onChange={(e) => setGigForm({ ...gigForm, experieceYear: e.target.value })}
                      placeholder="e.g. 2"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Qualification</label>
                    <input
                      type="text"
                      value={gigForm.qualification}
                      onChange={(e) => setGigForm({ ...gigForm, qualification: e.target.value })}
                      placeholder="e.g. Graduate"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Delivery Days</label>
                    <input
                      type="number"
                      value={gigForm.deliveryDays}
                      onChange={(e) => setGigForm({ ...gigForm, deliveryDays: e.target.value })}
                      placeholder="e.g. 22"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Availability</label>
                    <select
                      value={gigForm.availability}
                      onChange={(e) => setGigForm({ ...gigForm, availability: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-100 transition-all"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option value="yes">Available</option>
                      <option value="no">Not Available</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                  <label className="block text-sm font-semibold mb-4" style={{ color: '#334155' }}>Gig Media (Upload Multiple Photos)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border shadow-sm group bg-gray-50">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all group" style={{ borderColor: '#E2E8F0' }}>
                      <Plus size={24} className="text-gray-400 group-hover:text-[#ef4136] transition-colors mb-1" />
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#ef4136] transition-colors uppercase tracking-wider">Add Photo</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="pt-8 border-t flex justify-end" style={{ borderColor: '#F1F5F9' }}>
                  <button
                    onClick={handlePublishGig}
                    disabled={createGigMutation.isPending || updateGigMutation.isPending}
                    className="w-full md:w-auto min-w-[200px] py-4 px-8 rounded-2xl text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                    style={{ backgroundColor: '#ef4136' }}
                  >
                    {createGigMutation.isPending || updateGigMutation.isPending ? 'Saving...' : (editingGigId ? 'Update Service Gig' : 'Publish Service Gig')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {user?.isProfileComplete ? (
                <div className="space-y-6">
                  {/* Profile Header Card */}
                  <div className="bg-white rounded-[32px] shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center">
                          {user.logo ? (
                            <img src={user.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={48} className="text-slate-300" />
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#10B981] border-4 border-white flex items-center justify-center text-white shadow-lg">
                          <CheckCircle2 size={20} />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                          <h2 className="text-3xl font-black text-[#0D2E5E]">{user.shopName || user.fullName}</h2>
                          <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {user.isApproved || 'Active'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-medium">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-[#ef4136]" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-[#ef4136]" />
                            <span>{user.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-[#ef4136]" />
                            <span>{user.businessAddress || 'Karachi, Pakistan'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Information */}
                    <div className="bg-white rounded-[32px] shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                      <h3 className="text-lg font-black text-[#0D2E5E] mb-6 flex items-center gap-2">
                        <Shield size={20} className="text-[#ef4136]" /> Business Information
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Full Name', value: user.fullName },
                          { label: 'Account Type', value: user.accountType || 'Professional' },
                          { label: 'CNIC Number', value: user.cnicNumber },
                          { label: 'NTN Number', value: user.ntnNumber || 'Not Provided' },
                          { label: 'Role', value: user.role },
                          { label: 'Status', value: user.status },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                            <span className="text-sm font-bold text-[#0D2E5E]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bank Information */}
                    <div className="bg-white rounded-[32px] shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                      <h3 className="text-lg font-black text-[#0D2E5E] mb-6 flex items-center gap-2">
                        <CreditCard size={20} className="text-[#ef4136]" /> Settlement Details
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Account Title', value: user.accountTitle },
                          { label: 'Bank Account', value: user.accountNumber },
                          { label: 'Branch Code', value: user.branchCode },
                          { label: 'IBAN', value: user.ibanNumber },
                          { label: 'Onboarding', value: `Step ${user.onboardingStep}/4` },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                            <span className="text-sm font-bold text-[#0D2E5E] truncate max-w-[180px]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D2E5E] rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/20">
                    <div className="flex items-center gap-4 text-center md:text-left">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Zap size={24} className="text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Need to update your details?</h4>
                        <p className="text-blue-100/70 text-sm">Contact support to modify your business or bank information.</p>
                      </div>
                    </div>
                    <button className="px-8 py-3 rounded-2xl bg-white text-[#0D2E5E] font-black text-sm hover:bg-blue-50 transition-colors shadow-lg">
                      Contact Support
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
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
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Business Name *</label>
                          <input type="text" value={setupForm.businessName} onChange={(e) => setSetupForm({ ...setupForm, businessName: e.target.value })} placeholder="e.g. Ahmed Engineering Services" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-3" style={{ color: '#334155' }}>Profile Picture *</label>
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
                          <div
                            onClick={() => document.getElementById('profile-upload')?.click()}
                            className="group relative border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                            style={{
                              borderColor: setupForm.profilePicture ? '#10B981' : '#E2E8F0',
                              backgroundColor: '#F8FAFC',
                              minHeight: '200px'
                            }}
                          >
                            {setupForm.profilePicture ? (
                              <div className="relative flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border-4 border-white mb-4">
                                  <img src={URL.createObjectURL(setupForm.profilePicture)} alt="Profile preview" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-bold text-[#065F46]">Photo Selected</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Camera size={32} className="text-[#94A3B8] mx-auto mb-4" />
                                <p className="font-bold text-gray-700 mb-1">Click to upload photo</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Account Type *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: 'labour', label: 'Labour', icon: User },
                              { id: 'engineer', label: 'Engineer', icon: HardHat },
                              { id: 'engineering_firm', label: 'Firm', icon: Building2 },
                            ].map((type) => (
                              <button
                                key={type.id}
                                onClick={() => setAccountType(type.id as any)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${accountType === type.id ? 'bg-[#F0FDF4] border-[#10B981]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}
                              >
                                <type.icon size={20} className="mb-2" style={{ color: accountType === type.id ? '#10B981' : '#94A3B8' }} />
                                <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{type.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>CNIC Number *</label>
                            <input type="text" value={setupForm.cnicNumber} onChange={(e) => setSetupForm({ ...setupForm, cnicNumber: e.target.value })} placeholder="XXXXX-XXXXXXX-X" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>NTN Number</label>
                            <input type="text" value={setupForm.ntnNumber} onChange={(e) => setSetupForm({ ...setupForm, ntnNumber: e.target.value })} placeholder="Enter NTN" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Location *</label>
                          <input type="text" value={setupForm.businessLocation} onChange={(e) => setSetupForm({ ...setupForm, businessLocation: e.target.value })} placeholder="City, Pakistan" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
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
                          <p className="text-sm" style={{ color: '#64748B' }}>For receiving payments</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Account Title *</label>
                          <input type="text" value={bankForm.accountTitle} onChange={(e) => setBankForm({ ...bankForm, accountTitle: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Account Number *</label>
                          <input type="text" value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Branch Code</label>
                            <input type="text" value={bankForm.branchCode} onChange={(e) => setBankForm({ ...bankForm, branchCode: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>IBAN Number</label>
                            <input type="text" value={bankForm.ibanNumber} onChange={(e) => setBankForm({ ...bankForm, ibanNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                        <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>Back</button>
                        <button onClick={handleOnboardingNext} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: '#10B981' }}>Submit Details</button>
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 3: Subscription ─── */}
                  {onboardingStep === 'subscription' && (
                    <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                      <div className="text-center mb-8">
                        <h2 className="font-bold text-2xl" style={{ color: '#0D2E5E' }}>Choose Your Tier</h2>
                      </div>

                      <div className="grid grid-cols-1 gap-4 mb-6">
                        {subscriptionTiers.map((tier) => (
                          <button
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id)}
                            className={`rounded-2xl border-2 p-5 text-left transition-all ${selectedTier === tier.id ? 'border-[#10B981] bg-[#F0FDF4]' : 'border-[#E2E8F0] bg-white'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: tier.color }}>
                                  <tier.icon size={22} className="text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold" style={{ color: tier.color }}>{tier.name}</h3>
                                  <p className="text-xs text-gray-500">{tier.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>{tier.price === 'Free' ? 'Free' : `Rs. ${tier.price}`}</div>
                                <div className="text-xs text-gray-500">{tier.period}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>Back</button>
                        <button
                          onClick={handleOnboardingNext}
                          disabled={!selectedTier}
                          className={`flex-1 py-3 rounded-xl text-white font-semibold ${selectedTier ? 'bg-[#10B981]' : 'bg-gray-300'}`}
                        >
                          {selectedTier === 'tier3' ? 'Activate Free Account' : 'Proceed to Payment'}
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
                        </div>
                      </div>

                      <div className="p-4 rounded-xl mb-6 bg-[#F0FDF4] border border-[#BBF7D0]">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#166534]">
                            {selectedTier === 'tier1' ? 'Tier 1 — Big Firm' : 'Tier 2 — Engineer'}
                          </p>
                          <p className="font-bold text-xl text-[#0D2E5E]">Rs. {selectedTier === 'tier1' ? '2,000' : '500'}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5">Card Number</label>
                          <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-[#F8FAFC]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-1.5">Expiry</label>
                            <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-[#F8FAFC]" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1.5">CVV</label>
                            <input type="text" placeholder="•••" className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-[#F8FAFC]" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                        <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>Back</button>
                        <button onClick={handleActivateAccount} className="flex-1 py-3 rounded-xl text-white font-semibold bg-[#ef4136]">Finish Setup</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
