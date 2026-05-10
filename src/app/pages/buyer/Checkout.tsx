'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, CreditCard, CheckCircle2, Package, ShoppingBag,
  User, Phone, Mail, Home, Building, Map, Wallet, Smartphone, Banknote, Check
} from 'lucide-react';

const orderItems = [
  {
    id: 1,
    name: 'OPC Cement 50kg',
    brand: 'Bestway',
    price: 1200,
    quantity: 50,
    img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=80&h=80&fit=crop'
  },
  {
    id: 2,
    name: 'TMT Steel Bar 10mm',
    brand: 'Ittefaq',
    price: 8500,
    quantity: 20,
    img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=80&h=80&fit=crop'
  },
  {
    id: 3,
    name: 'Floor Tiles 60×60cm',
    brand: 'Master Tiles',
    price: 2200,
    quantity: 100,
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=80&h=80&fit=crop'
  },
];

const savedAddresses = [
  {
    id: 1,
    label: 'Home',
    name: 'Ali Khan',
    phone: '+92 300 1234567',
    address: '123 Model Town, Block C',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54000',
    isDefault: true
  },
  {
    id: 2,
    label: 'Office',
    name: 'Ali Khan',
    phone: '+92 300 1234567',
    address: '45 DHA Phase 5, Commercial Area',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54792',
    isDefault: false
  },
];

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState<'address' | 'payment' | 'review' | 'success'>('address');
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'card' | 'jazzcash' | 'easypaisa'>('cod');

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: 'Punjab',
    postalCode: ''
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    setStep('success');
    window.scrollTo(0, 0);
  };

  const steps = [
    { id: 'address', label: 'Delivery Address', icon: MapPin },
    { id: 'payment', label: 'Payment Method', icon: CreditCard },
    { id: 'review', label: 'Review Order', icon: Package },
  ];

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-lg border p-12" style={{ borderColor: '#E2E8F0' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#DCFCE7' }}>
              <CheckCircle2 size={56} style={{ color: '#16A34A' }} />
            </div>
            <h1 className="font-bold text-3xl mb-3" style={{ color: '#3e3e3e' }}>Order Placed Successfully!</h1>
            <p className="text-lg mb-2" style={{ color: '#64748B' }}>
              Your order has been confirmed
            </p>
            <p className="mb-8" style={{ color: '#94A3B8' }}>
              Order ID: <span className="font-bold" style={{ color: '#3e3e3e' }}>#ORD-2024-{Math.floor(Math.random() * 1000)}</span>
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-sm mb-1" style={{ color: '#64748B' }}>Estimated Delivery</p>
                  <p className="font-bold text-lg" style={{ color: '#3e3e3e' }}>
                    {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm mb-1" style={{ color: '#64748B' }}>Total Amount</p>
                  <p className="font-bold text-2xl" style={{ color: '#ef4136' }}>
                    Rs. {total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/buyer/dashboard/orders')}
                className="flex-1 py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: '#ef4136' }}
              >
                Track Order
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-3 rounded-xl font-semibold border-2"
                style={{ borderColor: '#E2E8F0', color: '#3e3e3e' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 mb-4 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            <ArrowLeft size={16} /> Back to Cart
          </button>
          <h1 className="font-bold text-3xl mb-2" style={{ color: '#3e3e3e' }}>
            Checkout
          </h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isActive = s.id === step;
              const isCompleted =
                (step === 'payment' && idx === 0) ||
                (step === 'review' && idx <= 1);

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isActive || isCompleted ? 'shadow-lg' : ''
                      }`}
                      style={{
                        backgroundColor: isCompleted ? '#16A34A' : isActive ? '#ef4136' : '#E2E8F0',
                        color: isActive || isCompleted ? 'white' : '#94A3B8'
                      }}
                    >
                      {isCompleted ? <Check size={24} /> : <StepIcon size={24} />}
                    </div>
                    <p
                      className={`text-xs font-semibold text-center ${isActive ? 'font-bold' : ''}`}
                      style={{ color: isActive ? '#ef4136' : isCompleted ? '#16A34A' : '#94A3B8' }}
                    >
                      {s.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className="h-0.5 flex-1 mx-4"
                      style={{ backgroundColor: isCompleted ? '#16A34A' : '#E2E8F0' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Address Step */}
            {step === 'address' && (
              <div className="space-y-4">
                <h2 className="font-bold text-xl mb-4" style={{ color: '#3e3e3e' }}>Select Delivery Address</h2>

                {/* Saved Addresses */}
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`bg-white rounded-2xl shadow-sm border-2 p-6 cursor-pointer transition-all ${
                      selectedAddress.id === addr.id ? 'border-red-500 shadow-md' : ''
                    }`}
                    style={{ borderColor: selectedAddress.id === addr.id ? '#ef4136' : '#E2E8F0' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold" style={{ color: '#3e3e3e' }}>{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-semibold mb-1" style={{ color: '#3e3e3e' }}>{addr.name}</p>
                        <p className="text-sm mb-1" style={{ color: '#64748B' }}>{addr.phone}</p>
                        <p className="text-sm" style={{ color: '#64748B' }}>
                          {addr.address}, {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                      </div>
                      {selectedAddress.id === addr.id && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add New Address */}
                {!showNewAddress ? (
                  <button
                    onClick={() => setShowNewAddress(true)}
                    className="w-full py-4 rounded-2xl border-2 border-dashed font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    + Add New Address
                  </button>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
                    <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          <User size={14} className="inline mr-1" /> Full Name *
                        </label>
                        <input
                          type="text"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          <Phone size={14} className="inline mr-1" /> Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                          placeholder="+92 300 0000000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          <Mail size={14} className="inline mr-1" /> Email
                        </label>
                        <input
                          type="email"
                          value={newAddress.email}
                          onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          <Home size={14} className="inline mr-1" /> Street Address *
                        </label>
                        <input
                          type="text"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                          placeholder="House no, Building, Street"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          <Building size={14} className="inline mr-1" /> City *
                        </label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                          placeholder="Lahore"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          <Map size={14} className="inline mr-1" /> Province *
                        </label>
                        <select
                          value={newAddress.province}
                          onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                        >
                          <option>Punjab</option>
                          <option>Sindh</option>
                          <option>KPK</option>
                          <option>Balochistan</option>
                          <option>Islamabad</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-3 border rounded-xl outline-none"
                          style={{ borderColor: '#E2E8F0' }}
                          placeholder="54000"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        className="flex-1 py-3 rounded-xl font-semibold text-white"
                        style={{ backgroundColor: '#ef4136' }}
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setShowNewAddress(false)}
                        className="flex-1 py-3 rounded-xl font-semibold border-2"
                        style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#ef4136' }}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-4">
                <h2 className="font-bold text-xl mb-4" style={{ color: '#3e3e3e' }}>Select Payment Method</h2>

                {/* Payment Options */}
                {[
                  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
                  { id: 'bank', label: 'Bank Transfer', icon: Wallet, desc: 'Direct bank transfer' },
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, etc.' },
                  { id: 'jazzcash', label: 'JazzCash', icon: Smartphone, desc: 'Mobile wallet' },
                  { id: 'easypaisa', label: 'Easypaisa', icon: Smartphone, desc: 'Mobile wallet' },
                ].map((method) => {
                  const MethodIcon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`bg-white rounded-2xl shadow-sm border-2 p-5 cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-red-500 shadow-md' : ''
                      }`}
                      style={{ borderColor: paymentMethod === method.id ? '#ef4136' : '#E2E8F0' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: paymentMethod === method.id ? '#FEF2F2' : '#F8F9FA' }}
                          >
                            <MethodIcon size={24} style={{ color: paymentMethod === method.id ? '#ef4136' : '#64748B' }} />
                          </div>
                          <div>
                            <p className="font-bold mb-0.5" style={{ color: '#3e3e3e' }}>{method.label}</p>
                            <p className="text-sm" style={{ color: '#94A3B8' }}>{method.desc}</p>
                          </div>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('address')}
                    className="flex-1 py-4 rounded-xl font-semibold border-2"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('review')}
                    className="flex-1 py-4 rounded-xl font-bold text-white"
                    style={{ backgroundColor: '#ef4136' }}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                <h2 className="font-bold text-xl" style={{ color: '#3e3e3e' }}>Review Your Order</h2>

                {/* Delivery Address */}
                <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold" style={{ color: '#3e3e3e' }}>Delivery Address</h3>
                    <button
                      onClick={() => setStep('address')}
                      className="text-sm font-semibold"
                      style={{ color: '#ef4136' }}
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={20} style={{ color: '#64748B' }} />
                    <div>
                      <p className="font-semibold mb-1" style={{ color: '#3e3e3e' }}>{selectedAddress.name}</p>
                      <p className="text-sm" style={{ color: '#64748B' }}>{selectedAddress.phone}</p>
                      <p className="text-sm" style={{ color: '#64748B' }}>
                        {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold" style={{ color: '#3e3e3e' }}>Payment Method</h3>
                    <button
                      onClick={() => setStep('payment')}
                      className="text-sm font-semibold"
                      style={{ color: '#ef4136' }}
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wallet size={20} style={{ color: '#64748B' }} />
                    <p className="font-semibold" style={{ color: '#3e3e3e' }}>
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                      {paymentMethod === 'bank' && 'Bank Transfer'}
                      {paymentMethod === 'card' && 'Credit/Debit Card'}
                      {paymentMethod === 'jazzcash' && 'JazzCash'}
                      {paymentMethod === 'easypaisa' && 'Easypaisa'}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
                  <h3 className="font-bold mb-4" style={{ color: '#3e3e3e' }}>Order Items</h3>
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-3 border-b last:border-0" style={{ borderColor: '#E2E8F0' }}>
                        <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1" style={{ color: '#3e3e3e' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: '#94A3B8' }}>{item.brand} • Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold" style={{ color: '#3e3e3e' }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 py-4 rounded-xl font-semibold border-2"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#ef4136' }}
                  >
                    <CheckCircle2 size={20} /> Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-4" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: '#3e3e3e' }}>Order Summary</h2>

              {/* Items Preview */}
              <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span style={{ color: '#64748B' }}>{item.name} × {item.quantity}</span>
                    <span style={{ color: '#3e3e3e' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#64748B' }}>Subtotal</span>
                  <span style={{ color: '#3e3e3e' }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#64748B' }}>Shipping</span>
                  <span style={{ color: '#16A34A' }}>FREE</span>
                </div>
                <div className="border-t pt-3" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: '#3e3e3e' }}>Total</span>
                    <span className="font-bold text-2xl" style={{ color: '#ef4136' }}>
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
