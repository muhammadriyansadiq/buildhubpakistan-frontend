'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useRemoveFromCartMutation, useUpdateCartQuantityMutation } from '@/hooks/useCart';
import { toast } from 'sonner';
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, Tag,
  Shield, Truck, ArrowLeft, AlertCircle, RefreshCw
} from 'lucide-react';

const initialCartItems = [
  {
    id: 1,
    name: 'OPC Cement 50kg',
    brand: 'Bestway',
    price: 1200,
    originalPrice: 1400,
    quantity: 50,
    img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=120&h=120&fit=crop',
    inStock: true,
    vendor: 'Ahmed Materials'
  },
  {
    id: 2,
    name: 'TMT Steel Bar 10mm',
    brand: 'Ittefaq',
    price: 8500,
    originalPrice: 9200,
    quantity: 20,
    img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=120&h=120&fit=crop',
    inStock: true,
    vendor: 'Steel Mart PK'
  },
  {
    id: 3,
    name: 'Floor Tiles 60×60cm',
    brand: 'Master Tiles',
    price: 2200,
    originalPrice: 2600,
    quantity: 100,
    img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=120&h=120&fit=crop',
    inStock: true,
    vendor: 'Tile World'
  },
];

export default function Cart() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const { data: cartItemsData, isLoading: cartLoading } = useCart({ enabled: isAuthenticated });
  const cartItems = cartItemsData || [];

  const removeMutation = useRemoveFromCartMutation();
  const updateMutation = useUpdateCartQuantityMutation();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (id: number, currentQty: number, delta: number) => {
    const newQuantity = Math.max(1, currentQty + delta);
    updateMutation.mutate(
      { id, quantity: newQuantity },
      {
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update quantity');
        },
      }
    );
  };

  const removeItem = (id: number) => {
    removeMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Item removed from cart');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to remove item');
      },
    });
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const savings = 0; // The mock used originalPrice - price, but API doesn't provide originalPrice in cart response directly.
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 1500;
  const tax = 0;
  const total = subtotal - discount + shipping + tax;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEF2F2' }}>
            <ShoppingBag size={48} style={{ color: '#ef4136' }} />
          </div>
          <h2 className="font-bold text-2xl mb-2" style={{ color: '#3e3e3e' }}>Your cart is empty</h2>
          <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 mx-auto"
            style={{ backgroundColor: '#ef4136' }}
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </button>
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
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#ef4136' }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl mb-2" style={{ color: '#3e3e3e' }}>
                Shopping Cart
              </h1>
              <p className="text-sm" style={{ color: '#94A3B8' }}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm border p-4 mb-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center justify-around flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Shield size={18} style={{ color: '#10B981' }} />
                  <span className="text-sm font-medium" style={{ color: '#64748B' }}>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={18} style={{ color: '#10B981' }} />
                  <span className="text-sm font-medium" style={{ color: '#64748B' }}>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={18} style={{ color: '#10B981' }} />
                  <span className="text-sm font-medium" style={{ color: '#64748B' }}>Best Prices</span>
                </div>
              </div>
            </div>

            {/* Free Shipping Banner */}
            {/* {subtotal < 50000 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border p-4 mb-4 flex items-center gap-3" style={{ borderColor: '#BFDBFE' }}>
                <AlertCircle size={20} style={{ color: '#2563EB' }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: '#1E40AF' }}>
                    Add Rs. {(50000 - subtotal).toLocaleString()} more to get FREE shipping!
                  </p>
                  <div className="w-full h-2 bg-white rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(subtotal / 50000) * 100}%`, backgroundColor: '#2563EB' }}
                    />
                  </div>
                </div>
              </div>
            )} */}

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div
                      className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                      onClick={() => router.push(`/product/${item.productId}`)}
                    >
                      <img
                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://placehold.co/120x120?text=No+Image'}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3
                            className="font-bold mb-1 cursor-pointer hover:underline"
                            style={{ color: '#3e3e3e' }}
                            onClick={() => router.push(`/product/${item.productId}`)}
                          >
                            {item.product.title}
                          </h3>
                          <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                            {item.product.user?.shopName || 'Official Store'}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: '#3e3e3e' }}>
                              Rs. {Number(item.product.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} style={{ color: '#EF4444' }} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-xl" style={{ borderColor: '#E2E8F0' }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity, -1)}
                              className="p-2 hover:bg-gray-50 rounded-l-xl transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1 || updateMutation.isPending}
                            >
                              <Minus size={16} style={{ color: item.quantity <= 1 ? '#CBD5E1' : '#64748B' }} />
                            </button>
                            <span className="px-4 font-semibold" style={{ color: '#3e3e3e' }}>
                              {updateMutation.isPending && updateMutation.variables?.id === item.id ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity, 1)}
                              className="p-2 hover:bg-gray-50 rounded-r-xl transition-colors disabled:opacity-50"
                              disabled={updateMutation.isPending}
                            >
                              <Plus size={16} style={{ color: '#64748B' }} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg" style={{ color: '#3e3e3e' }}>
                            Rs. {(Number(item.product.price) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-4" style={{ borderColor: '#E2E8F0' }}>
              <h2 className="font-bold text-xl mb-4" style={{ color: '#3e3e3e' }}>Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#64748B' }}>
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border rounded-xl text-sm outline-none"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: '#f8f9fa', color: '#3e3e3e' }}
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium" style={{ color: '#16A34A' }}>
                    <Tag size={14} /> Coupon "{appliedCoupon}" applied!
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#64748B' }}>Subtotal ({cartItems.length} items)</span>
                  <span style={{ color: '#3e3e3e' }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#64748B' }}>You Saved</span>
                    <span style={{ color: '#16A34A' }}>- Rs. {savings.toLocaleString()}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#64748B' }}>Discount (10%)</span>
                    <span style={{ color: '#16A34A' }}>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#64748B' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#16A34A' : '#3e3e3e' }}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t pt-3" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg" style={{ color: '#3e3e3e' }}>Total</span>
                    <span className="font-bold text-2xl" style={{ color: '#ef4136' }}>
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-3 cursor-pointer"
                style={{ backgroundColor: '#ef4136' }}
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full py-3 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: '#E2E8F0', color: '#3e3e3e' }}
              >
                Continue Shopping
              </button>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>We accept</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['COD', 'Bank', 'Card', 'JazzCash', 'Easypaisa'].map((method) => (
                    <div
                      key={method}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: '#F8F9FA', color: '#64748B' }}
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
