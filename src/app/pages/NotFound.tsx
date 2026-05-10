'use client';

import { useRouter } from 'next/navigation';
import { HardHat, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F1F5F9' }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#FFF7ED' }}>
          <HardHat size={40} style={{ color: '#F97316' }} />
        </div>
        <h1 className="font-bold text-4xl mb-2" style={{ color: '#0D2E5E' }}>404</h1>
        <p className="text-lg mb-1" style={{ color: '#334155' }}>Page Not Found</p>
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>The page you are looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto hover:opacity-90"
          style={{ backgroundColor: '#0D2E5E' }}
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}
