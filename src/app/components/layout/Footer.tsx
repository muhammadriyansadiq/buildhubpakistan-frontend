'use client';

import { HardHat, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useRouter } from 'next/navigation';
import logoImg from '@/imports/buildhub.png';

export default function Footer() {
  const router = useRouter();
  return (
    <footer style={{ backgroundColor: '#0d2e5e' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src={logoImg.src} alt="BHP Logo" className="h-8 w-auto mb-2" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Pakistan's premier B2B & B2C construction materials marketplace connecting vendors, service providers, and buyers.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/' },
                { label: 'Services', path: '/' },
                { label: 'RFQ Management', path: '/buyer/rfq' },
                { label: 'My Profile', path: '/buyer/profile' },
                { label: 'Become a Vendor', path: '/register' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => router.push(link.path)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Top Categories</h4>
            <ul className="space-y-2">
              {['Cement & Concrete', 'Steel & Metal', 'Tiles & Flooring', 'Paints & Coatings', 'Plumbing', 'Electrical'].map((cat) => (
                <li key={cat}>
                  <button className="text-sm text-white/60 hover:text-white transition-colors">{cat}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#ef4136' }} />
                Office 301, Business Tower, Main Boulevard Gulberg, Lahore, Pakistan
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} style={{ color: '#ef4136' }} />
                +92 300 123 4567
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} style={{ color: '#ef4136' }} />
                support@buildhubpak.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">© 2026 Build Hub Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((t) => (
              <button key={t} className="text-xs text-white/40 hover:text-white/70 transition-colors">{t}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}