'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HardHat, Wrench, Upload, MapPin, Clock, CreditCard,
  ChevronRight, ChevronLeft, CheckCircle2, Building2, User,
  FileText, Camera, Zap, Shield, Star, Award
} from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';

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
      'Up to 20 team members',
      'Featured placement in search',
      'Priority project assignments',
      'Dedicated account manager',
      'Advanced portfolio showcase',
      'Client review management',
      'Analytics dashboard',
      'API access',
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
      'Solo professional profile',
      'Standard search placement',
      'Portfolio & project showcase',
      'Client messaging',
      'Gig management',
      'Basic analytics',
      'Review collection',
      'Mobile app',
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
      'Basic profile page',
      'List your skills',
      'Receive job requests',
      'Direct client contact',
      'Availability status',
    ],
    color: '#10B981',
    bg: '#F0FDF4',
  },
];

export default function ServiceOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('setup');
  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('individual');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const steps = ['setup', 'documents', 'subscription', 'payment'];
  const stepIdx = steps.indexOf(step);

  const handleNext = () => {
    const nextStep = steps[stepIdx + 1] as OnboardingStep;
    if (nextStep) setStep(nextStep);
    else router.push('/service/dashboard');
  };

  const handleBack = () => {
    const prevStep = steps[stepIdx - 1] as OnboardingStep;
    if (prevStep) setStep(prevStep);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F1F5F9' }}>
      <DemoNav />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)' }} className="py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F97316' }}>
              <HardHat size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Build Hub Pakistan</div>
              <div className="text-xs" style={{ color: '#6EE7B7' }}>Service Provider Setup</div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {['Service Setup', 'Documents', 'Subscription', 'Payment'].map((s, idx) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: idx <= stepIdx ? '#10B981' : 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    {idx < stepIdx ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span className="text-xs text-white/60 hidden sm:block">{s}</span>
                </div>
                {idx < 3 && (
                  <div className="h-0.5 flex-1 mx-1 hidden sm:block" style={{ backgroundColor: idx < stepIdx ? '#10B981' : 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* ─── STEP 1: Service Setup ─── */}
          {step === 'setup' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
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
                  <input type="text" placeholder="e.g. Ahmed Engineering Services" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Profile Picture *</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' }}>
                      <Camera size={24} style={{ color: '#94A3B8' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#334155' }}>Upload profile photo</p>
                      <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>PNG, JPG — Min 200×200px</p>
                      <button className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: '#CBD5E1', color: '#64748B' }}>
                        Browse Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timings */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Availability Hours *</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Clock size={16} style={{ color: '#64748B' }} />
                      <input type="time" defaultValue="09:00" className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                    </div>
                    <span className="text-sm" style={{ color: '#64748B' }}>to</span>
                    <input type="time" defaultValue="18:00" className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Account Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'individual', label: 'Individual', icon: User, desc: 'Freelancer / Solo professional' },
                      { id: 'corporate', label: 'Corporate', icon: Building2, desc: 'Registered firm or company' },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setAccountType(type.id as 'individual' | 'corporate')}
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
                    {accountType === 'individual' ? 'CNIC Number *' : 'NTN Number *'}
                  </label>
                  <input
                    type="text"
                    placeholder={accountType === 'individual' ? 'XXXXX-XXXXXXX-X' : 'Enter NTN number'}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Business Location *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input type="text" placeholder="City, Province, Pakistan" className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button onClick={handleNext} className="px-8 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: '#10B981' }}>
                  Save & Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Documents ─── */}
          {step === 'documents' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                  <FileText size={20} style={{ color: '#0D2E5E' }} />
                </div>
                <div>
                  <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Documents & Verification</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Upload required documents</p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { id: 'cnic-front', label: 'CNIC — Front Side', desc: 'Clear photo of the front of your CNIC', required: true },
                  { id: 'cnic-back', label: 'CNIC — Back Side', desc: 'Clear photo of the back of your CNIC', required: true },
                  { id: 'cheque', label: 'Blank Bank Cheque', desc: 'Blank cheque to verify name & account match', required: true },
                  { id: 'auth', label: 'Authorization Letters', desc: 'Letters from brands you are authorized to sell/represent (if applicable)', required: false },
                ].map((doc) => (
                  <div key={doc.id}>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>
                      {doc.label} {doc.required ? <span style={{ color: '#EF4444' }}>*</span> : <span className="text-xs font-normal" style={{ color: '#94A3B8' }}>(Optional)</span>}
                    </label>
                    <p className="text-xs mb-2" style={{ color: '#64748B' }}>{doc.desc}</p>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#CBD5E1' }}>
                      <Upload size={28} className="mx-auto mb-2" style={{ color: '#94A3B8' }} />
                      <p className="text-sm font-semibold" style={{ color: '#334155' }}>Drag & drop or click to upload</p>
                      <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>PNG, JPG, PDF — Max 10MB</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button onClick={handleNext} className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: '#10B981' }}>
                  Submit Documents <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Subscription ─── */}
          {step === 'subscription' && (
            <div>
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
                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={handleNext}
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
          {step === 'payment' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
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
                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={() => router.push('/service/dashboard')}
                  className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <Zap size={18} /> Activate Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
