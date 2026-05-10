'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  HardHat, Package, Wrench, User, ChevronRight, Eye, EyeOff,
  Phone, Mail, Lock, Shield, CheckCircle2, ArrowLeft, RefreshCw
} from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';
import logoSvg from '../../../imports/svg-01.svg';
import { toast } from 'sonner';
import { useRegisterMutation, useVerifyOtpMutation } from '../../../hooks/useAuth';

type Step = 'role' | 'form' | 'otp';
type Role = 'vendor' | 'service' | 'buyer' | null;

const roles = [
  {
    id: 'vendor',
    title: 'Register as Vendor',
    subtitle: 'Sell construction materials',
    icon: Package,
    color: '#ef4136',
    bg: '#FFF7ED',
    border: '#FED7AA',
    perks: ['List unlimited products', 'Manage orders & inventory', 'Get verified badge', 'B2B & retail pricing'],
  },
  {
    id: 'service',
    title: 'Register as Service Provider',
    subtitle: 'Offer professional services',
    icon: Wrench,
    color: '#3e3e3e',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    perks: ['Create service gigs', 'Receive project requests', 'Build your portfolio', 'Fixed & hourly pricing'],
  },
  {
    id: 'buyer',
    title: 'Register as Buyer',
    subtitle: 'Purchase materials & hire professionals',
    icon: User,
    color: '#000000',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    perks: ['Browse verified vendors', 'Submit bulk RFQs', 'Track your orders', 'Exclusive deals'],
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', password: '', role: '',
  });
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const savedRole = sessionStorage.getItem('register_role') as Role;
    if (savedRole) setSelectedRole(savedRole);
    
    const savedForm = sessionStorage.getItem('register_form');
    if (savedForm) setForm(JSON.parse(savedForm));
    
    const savedUser = sessionStorage.getItem('register_user');
    if (savedUser) setRegisteredUser(JSON.parse(savedUser));
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (selectedRole) sessionStorage.setItem('register_role', selectedRole);
    sessionStorage.setItem('register_form', JSON.stringify(form));
    if (registeredUser) sessionStorage.setItem('register_user', JSON.stringify(registeredUser));
  }, [selectedRole, form, registeredUser]);

  // Auto-fill OTP if it exists in the user object
  useEffect(() => {
    if (registeredUser?.otp) {
      const otpStr = String(registeredUser.otp);
      if (otpStr.length === 6) {
        setOtp(otpStr.split(''));
      }
    }
  }, [registeredUser]);
  
  const { mutateAsync: registerStep1, isPending: isLoading } = useRegisterMutation();
  const { mutateAsync: verifyOtpStep2, isPending: isVerifyingOtp } = useVerifyOtpMutation();

  useEffect(() => {
    if (pathname === '/register/form') setStep('form');
    else if (pathname === '/register/verify') setStep('otp');
    else setStep('role');
  }, [pathname]);

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setForm({ ...form, role: role || '' });
    setStep('form');
    router.push('/register/form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let apiRole = 'User';
    if (selectedRole === 'vendor') apiRole = 'Vendor';
    else if (selectedRole === 'service') apiRole = 'Service Provider';

    try {
      const data = await registerStep1({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: apiRole,
      });

      if (data && (data.success || data.statusCode === 200 || data.statusCode === 201 || data.data)) {
        const userObj = data.data?.user || (Array.isArray(data.data) ? data.data[data.data.length - 1] : data.data);
        const onboardToken = data.data?.onboardToken;

        setRegisteredUser(userObj || null);

        // Save to localStorage for immediate use in dashboard and subsequent steps
        if (onboardToken) {
          localStorage.setItem('onboardToken', onboardToken);
        }
        if (userObj) {
          localStorage.setItem('user', JSON.stringify(userObj));
        }

        setStep('otp');
        setTimer(59);
        router.push('/register/verify');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error(error);
      // Removed alert, the API client will handle the global toast error.
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpComplete = async () => {
    if (otp.some(d => !d)) {
      toast.error("Please enter all 6 digits");
      return;
    }

    // Use selectedRole or fallback to registeredUser.role
    let currentRole = selectedRole;
    if (!currentRole && registeredUser?.role) {
      if (registeredUser.role === 'Vendor') currentRole = 'vendor';
      else if (registeredUser.role === 'Service Provider') currentRole = 'service';
      else if (registeredUser.role === 'Buyer') currentRole = 'buyer';
    }

    if (!currentRole) {
      toast.error("Role information missing. Please go back and select a role.");
      return;
    }
    
    try {
      const otpString = otp.join('');
      const phoneToVerify = registeredUser?.phone || form.phone;
      const data = await verifyOtpStep2({ otp: otpString, phone: phoneToVerify });
      
      if (data && (data.success || data.statusCode === 200 || data.data)) {
        // Clear storage on complete
        sessionStorage.removeItem('register_role');
        sessionStorage.removeItem('register_form');
        sessionStorage.removeItem('register_user');

        // Elevate onboardToken to token if verified
        const obToken = localStorage.getItem('onboardToken');
        if (obToken) {
           localStorage.setItem('token', obToken);
        }

        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }

        // Redirect based on user instruction
        if (currentRole === 'vendor') router.push('/vendor/dashboard');
        else if (currentRole === 'service') router.push('/service/dashboard');
        else router.push('/');
        toast.success(data.message || 'Phone verified successfully');
      } else {
        toast.error(data.message || 'OTP Verification failed');
      }
    } catch (error: any) {
      console.error(error);
      // Removed alert, the API client will handle the global toast error.
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F1F5F9' }}>
      <DemoNav />

      {/* Progress bar */}
      <div style={{ backgroundColor: '#3e3e3e' }} className="h-1">
        <div
          className="h-full transition-all duration-500"
          style={{
            backgroundColor: '#ef4136',
            width: step === 'role' ? '33%' : step === 'form' ? '66%' : '100%',
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src={logoSvg} alt="BHP Logo" className="h-10 w-auto" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {['Choose Role', 'Your Info', 'Verify Phone'].map((label, idx) => {
              const currentIdx = step === 'role' ? 0 : step === 'form' ? 1 : 2;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: idx <= currentIdx ? '#ef4136' : '#E2E8F0',
                        color: idx <= currentIdx ? 'white' : '#94A3B8',
                      }}
                    >
                      {idx < currentIdx ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <span className="text-xs hidden sm:block" style={{ color: idx <= currentIdx ? '#000000' : '#94A3B8' }}>
                      {label}
                    </span>
                  </div>
                  {idx < 2 && <ChevronRight size={14} style={{ color: '#CBD5E1' }} />}
                </div>
              );
            })}
          </div>

          {/* ─── STEP 1: Role Selector ─── */}
          {step === 'role' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Join Build Hub Pakistan</h1>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>Select your account type to get started</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id as Role)}
                      className="rounded-2xl border-2 p-5 text-left hover:shadow-lg transition-all duration-200 group"
                      style={{ backgroundColor: role.bg, borderColor: role.border }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: role.color }}
                        >
                          <Icon size={26} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-base" style={{ color: '#1E293B' }}>{role.title}</h3>
                              <p className="text-sm" style={{ color: '#64748B' }}>{role.subtitle}</p>
                            </div>
                            <ChevronRight size={20} style={{ color: role.color }} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            {role.perks.map((perk) => (
                              <span key={perk} className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                                <CheckCircle2 size={11} style={{ color: role.color }} /> {perk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
                Already registered?{' '}
                <button onClick={() => router.push('/login')} className="font-semibold hover:underline" style={{ color: '#ef4136' }}>
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* ─── STEP 2: Registration Form ─── */}
          {step === 'form' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { setStep('role'); router.push('/register'); }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={18} style={{ color: '#64748B' }} />
                </button>
                <div>
                  <h2 className="font-bold text-xl" style={{ color: '#000000' }}>Create Your Account</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    Registering as:{' '}
                    <span className="font-semibold" style={{ color: '#ef4136' }}>
                      {selectedRole === 'vendor' ? 'Vendor' : selectedRole === 'service' ? 'Service Provider' : 'Buyer'}
                    </span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        required
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Muhammad Ahmed"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+92 300 0000000"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>
                    Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff size={16} style={{ color: '#94A3B8' }} /> : <Eye size={16} style={{ color: '#94A3B8' }} />}
                    </button>
                  </div>
                  {/* Password strength */}
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full" style={{
                        backgroundColor: form.password.length >= i * 2 ? (i < 3 ? '#ef4136' : '#10B981') : '#E2E8F0'
                      }} />
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" required id="terms" className="mt-0.5" />
                  <label htmlFor="terms" className="text-xs" style={{ color: '#64748B' }}>
                    I agree to the{' '}
                    <span className="underline" style={{ color: '#000000' }}>Terms of Service</span> and{' '}
                    <span className="underline" style={{ color: '#000000' }}>Privacy Policy</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#ef4136' }}
                >
                  {isLoading ? 'Creating Account...' : 'Continue'}
                  {!isLoading && <ChevronRight size={18} />}
                </button>
              </form>
            </div>
          )}

          {/* ─── STEP 3: OTP Verification ─── */}
          {step === 'otp' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#FFF7ED' }}>
                <Shield size={36} style={{ color: '#ef4136' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>Verify Your Phone</h2>
              
              {registeredUser && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                  Welcome <strong>{registeredUser.fullName}</strong>! Your account has been created.
                </div>
              )}

              <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                We've sent a 6-digit OTP to
              </p>
              <p className="font-bold mb-6" style={{ color: '#000000' }}>
                {registeredUser?.phone || form.phone || '+92 300 0000000'}
              </p>

              {/* OTP inputs */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                    style={{
                      borderColor: digit ? '#ef4136' : '#E2E8F0',
                      backgroundColor: digit ? '#FFF7ED' : '#F8FAFC',
                      color: '#000000',
                    }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="mb-6">
                {timer > 0 ? (
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    Resend OTP in <span className="font-semibold" style={{ color: '#ef4136' }}>00:{timer.toString().padStart(2, '0')}</span>
                  </p>
                ) : (
                  <button
                    onClick={() => setTimer(59)}
                    className="text-sm font-semibold flex items-center gap-1 mx-auto hover:underline"
                    style={{ color: '#ef4136' }}
                  >
                    <RefreshCw size={14} /> Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleOtpComplete}
                disabled={isVerifyingOtp || otp.some(d => !d)}
                className="w-full py-3.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-70"
                style={{ 
                  backgroundColor: otp.every(d => d) ? '#ef4136' : '#94A3B8',
                  cursor: otp.every(d => d) ? 'pointer' : 'not-allowed'
                }}
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                onClick={() => { setStep('form'); router.push('/register/form'); }}
                className="mt-4 text-sm hover:underline flex items-center gap-1 mx-auto"
                style={{ color: '#64748B' }}
              >
                <ArrowLeft size={14} /> Change phone number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
