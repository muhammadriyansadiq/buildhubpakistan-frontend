'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HardHat, Eye, EyeOff, Phone, Lock, ArrowRight, Building2 } from 'lucide-react';
import DemoNav from '../../components/layout/DemoNav';
import logoSvg from '../../../imports/svg-01.svg';
import buildhubLogo from '../../../imports/buildhub.png';
import { useLoginMutation } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ identifier: '', password: '' });

  const { mutateAsync: loginMutation, isPending: isLoading } = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      toast.error('Please enter both identifier and password');
      return;
    }

    try {
      const response = await loginMutation(form);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Logged in successfully!');

        // Redirect based on role or to home
        const userRole = response.data.user.role;
        if (userRole === 'Vendor') router.push('/vendor/dashboard');
        else if (userRole === 'Service Provider') router.push('/service/dashboard');
        else router.push('/');
      }
    } catch (err: any) {
      // Error is handled by apiClient interceptor toast
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F1F5F9' }}>
      <DemoNav />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6" style={{ background: 'linear-gradient(135deg, #000000 0%, #3e3e3e 100%)' }}>
              <div className="flex items-center justify-center mb-6">
                <img src={buildhubLogo.src} alt="BHP Logo" className="h-10 w-auto" />
              </div>
              <h1 className="text-white text-2xl font-bold">Welcome back</h1>
              <p className="text-white/60 text-sm mt-1">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Identifier */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#000000' }}>
                    Phone / Email
                  </label>
                  <div className="relative">
                    <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
                    <input
                      type="text"
                      value={form.identifier}
                      onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                      placeholder="+92 300 0000000 or email@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-blue-500"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', color: '#1E293B' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold" style={{ color: '#000000' }}>Password</label>
                    <button type="button" className="text-xs hover:underline" style={{ color: '#ef4136' }}>
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all focus:border-blue-500"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', color: '#1E293B' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: '#64748B' }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: '#ef4136' }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 border-t" style={{ borderColor: '#E2E8F0' }}></div>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>or continue with</span>
                  <div className="flex-1 border-t" style={{ borderColor: '#E2E8F0' }}></div>
                </div>

                {/* Social */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    className="py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#374151' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  {/* <button
                    type="button"
                    className="py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#374151' }}
                  >
                    <Building2 size={18} style={{ color: '#3e3e3e' }} />
                    Company
                  </button> */}
                </div>
              </form>

              {/* Register link */}
              <div className="mt-6 text-center">
                <span className="text-sm" style={{ color: '#64748B' }}>Not registered yet? </span>
                <button
                  onClick={() => router.push('/register')}
                  className="text-sm font-semibold hover:underline cursor-pointer"
                  style={{ color: '#ef4136' }}
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs" style={{ color: '#94A3B8' }}>
            <span>🔒 SSL Secured</span>
            <span>✅ Verified Vendors</span>
            <span>🇵🇰 Made in Pakistan</span>
          </div>
        </div>
      </div>
    </div>
  );
}