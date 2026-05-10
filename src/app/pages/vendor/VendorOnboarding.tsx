'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HardHat, Store, Upload, MapPin, Clock, CreditCard,
  ChevronRight, ChevronLeft, CheckCircle2, Building2, User,
  FileText, Camera, Zap, Award, TrendingUp, Shield
} from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';

type OnboardingStep = 'store' | 'documents' | 'subscription' | 'payment';

const subscriptionPlans = [
  {
    id: 'manufacturer',
    name: 'Manufacturer',
    price: '270,000',
    period: '/Annual',
    badge: 'Most Popular',
    badgeColor: '#F97316',
    description: 'For large-scale manufacturers & distributors',
    features: [
      'Unlimited product listings',
      'Featured placement on homepage',
      'B2B pricing tiers support',
      'Dedicated account manager',
      'Priority customer support',
      'Advanced analytics dashboard',
      'Brand verification badge',
      'Bulk order management',
    ],
    color: '#0D2E5E',
    bg: '#EFF6FF',
  },
  {
    id: 'shopkeeper',
    name: 'Shopkeeper',
    price: '50,000',
    period: '/Annual',
    badge: 'Great Value',
    badgeColor: '#10B981',
    description: 'For retail shops & small vendors',
    features: [
      'Up to 200 product listings',
      'Standard search placement',
      'Retail pricing support',
      'Email & chat support',
      'Basic analytics',
      'Order management',
      'Inventory tracking',
      'Mobile app access',
    ],
    color: '#10B981',
    bg: '#F0FDF4',
  },
];

export default function VendorOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('store');
  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('individual');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [form, setForm] = useState({
    shopName: '', logo: null as File | null, openTime: '09:00', closeTime: '18:00',
    address: '', cnic: '', ntn: '', businessLocation: '', warehouseLocation: '',
    returnLocation: '',
  });

  const steps = ['store', 'documents', 'subscription', 'payment'];
  const stepIdx = steps.indexOf(step);

  const handleNext = () => {
    const nextStep = steps[stepIdx + 1] as OnboardingStep;
    if (nextStep) setStep(nextStep);
    else router.push('/vendor/dashboard');
  };

  const handleBack = () => {
    const prevStep = steps[stepIdx - 1] as OnboardingStep;
    if (prevStep) setStep(prevStep);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F1F5F9' }}>
      <DemoNav />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D2E5E 0%, #1E4D8C 100%)' }} className="py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F97316' }}>
              <HardHat size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold">Build Hub Pakistan</div>
              <div className="text-xs" style={{ color: '#F97316' }}>Vendor Setup</div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {[
              { key: 'store', label: 'Store Setup' },
              { key: 'documents', label: 'Documents' },
              { key: 'subscription', label: 'Subscription' },
              { key: 'payment', label: 'Payment' },
            ].map((s, idx) => (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      backgroundColor: idx <= stepIdx ? '#F97316' : 'rgba(255,255,255,0.2)',
                      color: 'white',
                    }}
                  >
                    {idx < stepIdx ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span className="text-xs text-white/60 hidden sm:block">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className="h-0.5 flex-1 mx-1 hidden sm:block" style={{ backgroundColor: idx < stepIdx ? '#F97316' : 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* ─── STEP 1: Store Setup ─── */}
          {step === 'store' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF7ED' }}>
                  <Store size={20} style={{ color: '#F97316' }} />
                </div>
                <div>
                  <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Store Setup</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Tell us about your business</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Shop Name *</label>
                  <input
                    type="text"
                    value={form.shopName}
                    onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                    placeholder="e.g. Ahmed Building Materials"
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Shop Logo</label>
                  <div
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#CBD5E1' }}
                  >
                    <Camera size={28} className="mx-auto mb-2" style={{ color: '#94A3B8' }} />
                    <p className="text-sm font-medium" style={{ color: '#64748B' }}>Click to upload logo</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>PNG, JPG up to 5MB. Recommended: 200×200px</p>
                  </div>
                </div>

                {/* Timings */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Business Hours *</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Clock size={16} style={{ color: '#64748B' }} />
                      <input
                        type="time"
                        value={form.openTime}
                        onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                        className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                    <span className="text-sm" style={{ color: '#64748B' }}>to</span>
                    <input
                      type="time"
                      value={form.closeTime}
                      onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                      className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Account Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'individual', label: 'Individual', icon: User, desc: 'Personal business owner' },
                      { id: 'corporate', label: 'Corporate', icon: Building2, desc: 'Registered company' },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setAccountType(type.id as 'individual' | 'corporate')}
                          className="p-4 rounded-xl border-2 text-left transition-all"
                          style={{
                            borderColor: accountType === type.id ? '#0D2E5E' : '#E2E8F0',
                            backgroundColor: accountType === type.id ? '#EFF6FF' : '#F8FAFC',
                          }}
                        >
                          <Icon size={20} className="mb-2" style={{ color: accountType === type.id ? '#0D2E5E' : '#94A3B8' }} />
                          <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{type.label}</div>
                          <div className="text-xs" style={{ color: '#64748B' }}>{type.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CNIC / NTN */}
                <div>
                  {accountType === 'individual' ? (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>CNIC Number *</label>
                      <input
                        type="text"
                        value={form.cnic}
                        onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                        placeholder="XXXXX-XXXXXXX-X"
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>NTN Number *</label>
                      <input
                        type="text"
                        value={form.ntn}
                        onChange={(e) => setForm({ ...form, ntn: e.target.value })}
                        placeholder="Enter NTN number"
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  )}
                </div>

                {/* Locations */}
                {[
                  { key: 'address', label: 'Business Address *', placeholder: 'Street, City, Province' },
                  { key: 'businessLocation', label: 'Business Location (Google Maps Link)', placeholder: 'https://maps.google.com/...' },
                  { key: 'warehouseLocation', label: 'Warehouse Location', placeholder: 'Street, City, Province' },
                  { key: 'returnLocation', label: 'Return Address', placeholder: 'Address for returns & refunds' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>{field.label}</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button onClick={handleNext} className="px-8 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0D2E5E' }}>
                  Save & Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Documents ─── */}
          {step === 'documents' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                  <FileText size={20} style={{ color: '#0D2E5E' }} />
                </div>
                <div>
                  <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Documents & Verification</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Upload required documents for account verification</p>
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6 mt-4" style={{ backgroundColor: '#FFF7ED', borderLeft: '4px solid #F97316' }}>
                <p className="text-sm font-semibold" style={{ color: '#9A3412' }}>Important Notice</p>
                <p className="text-xs mt-1" style={{ color: '#C2410C' }}>
                  The name on your CNIC and the Bank Account name must match. Your blank cheque is used for this verification.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { id: 'cnic-front', label: 'CNIC — Front Side', desc: 'Clear photo of the front of your National Identity Card', required: true },
                  { id: 'cnic-back', label: 'CNIC — Back Side', desc: 'Clear photo of the back of your National Identity Card', required: true },
                  { id: 'cheque', label: 'Blank Bank Cheque', desc: 'A blank cheque with your name and account number visible (for CNIC name & bank account verification)', required: true },
                ].map((doc) => (
                  <div key={doc.id}>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>
                      {doc.label} {doc.required && <span style={{ color: '#EF4444' }}>*</span>}
                    </label>
                    <p className="text-xs mb-2" style={{ color: '#64748B' }}>{doc.desc}</p>
                    <div
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#CBD5E1' }}
                    >
                      <Upload size={32} className="mx-auto mb-3" style={{ color: '#94A3B8' }} />
                      <p className="text-sm font-semibold" style={{ color: '#334155' }}>
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>PNG, JPG, PDF — Max 10MB</p>
                      <button
                        className="mt-3 px-4 py-2 rounded-lg text-sm font-medium border hover:bg-gray-100 transition-colors"
                        style={{ borderColor: '#CBD5E1', color: '#64748B' }}
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button onClick={handleNext} className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0D2E5E' }}>
                  Submit Documents <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Subscription ─── */}
          {step === 'subscription' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="font-bold text-2xl" style={{ color: '#0D2E5E' }}>Choose Your Subscription Plan</h2>
                <p className="text-sm mt-2" style={{ color: '#64748B' }}>
                  Select a plan that best fits your business size and needs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {subscriptionPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className="rounded-2xl border-2 p-6 text-left transition-all hover:shadow-lg"
                    style={{
                      borderColor: selectedPlan === plan.id ? plan.color : '#E2E8F0',
                      backgroundColor: selectedPlan === plan.id ? plan.bg : 'white',
                    }}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: plan.badgeColor }}>
                        {plan.badge}
                      </span>
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{
                        borderColor: selectedPlan === plan.id ? plan.color : '#CBD5E1',
                        backgroundColor: selectedPlan === plan.id ? plan.color : 'transparent',
                      }}>
                        {selectedPlan === plan.id && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>

                    <h3 className="font-bold text-xl mb-1" style={{ color: plan.color }}>{plan.name}</h3>
                    <p className="text-sm mb-4" style={{ color: '#64748B' }}>{plan.description}</p>

                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="text-xs font-semibold" style={{ color: '#64748B' }}>Rs.</span>
                      <span className="font-bold" style={{ fontSize: '28px', color: '#0D2E5E' }}>{plan.price}</span>
                      <span className="text-sm" style={{ color: '#64748B' }}>{plan.period}</span>
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-sm" style={{ color: '#374151' }}>
                          <CheckCircle2 size={14} style={{ color: plan.color, flexShrink: 0 }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedPlan}
                  className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: selectedPlan ? '#0D2E5E' : '#94A3B8' }}
                >
                  Proceed to Payment <CreditCard size={18} />
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
                  <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Advance Payment</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Complete your subscription activation</p>
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#166534' }}>
                      {selectedPlan === 'manufacturer' ? 'Manufacturer Plan' : 'Shopkeeper Plan'}
                    </p>
                    <p className="text-xs" style={{ color: '#16A34A' }}>Annual Subscription</p>
                  </div>
                  <p className="font-bold text-xl" style={{ color: '#0D2E5E' }}>
                    Rs. {selectedPlan === 'manufacturer' ? '270,000' : '50,000'}
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
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Expiry Date</label>
                    <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>CVV</label>
                    <input type="text" placeholder="•••" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Name on Card</label>
                  <input type="text" placeholder="Muhammad Ahmed" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 p-3 rounded-xl" style={{ backgroundColor: '#FFF7ED' }}>
                <Shield size={18} style={{ color: '#F97316' }} />
                <p className="text-xs" style={{ color: '#9A3412' }}>Your payment is secured with 256-bit SSL encryption</p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={() => router.push('/vendor/dashboard')}
                  className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#F97316' }}
                >
                  <Zap size={18} /> Activate Subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
