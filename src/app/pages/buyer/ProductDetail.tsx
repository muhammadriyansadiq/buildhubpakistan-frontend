'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
import { useAddToCartMutation } from '@/hooks/useCart';
import { toast } from 'sonner';
import {
  Star, ShoppingCart, Heart, Share2, ChevronRight, Truck,
  Shield, RefreshCw, Award, Package, CheckCircle2, Minus, Plus,
  Tag, Zap, MapPin, Clock, ChevronDown, ChevronUp,
  Building2, FileText, Loader2, Mail, Calendar
} from 'lucide-react';
import { useCreateQuotationMutation } from '@/hooks/useQuotation';

const relatedProducts = [
  { id: 2, name: 'Sand (Fine Grade)', price: 850, img: 'https://images.unsplash.com/photo-1763926025477-423847028860?w=200&h=160&fit=crop', rating: 4.2 },
  { id: 3, name: 'Coarse Aggregate', price: 1100, img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=200&h=160&fit=crop', rating: 4.4 },
  { id: 4, name: 'Steel Bar 12mm', price: 10200, img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=200&h=160&fit=crop', rating: 4.6 },
];
const reviews = [
  { id: 1, name: 'Muhammad Hassan', rating: 5, date: '2026-04-01', comment: 'Excellent quality. Arrived on time and packaging was intact. Highly recommend.', helpful: 12 },
  { id: 2, name: 'Raza Builders', rating: 4, date: '2026-03-28', comment: 'Good product. Delivery was fast. Will order again in bulk.', helpful: 8 },
  { id: 3, name: 'Ali Construction', rating: 5, date: '2026-03-20', comment: 'Best price in the market. Vendor was very responsive. 5 stars!', helpful: 15 },
];

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id ? Number(params.id) : 0;

  const { data: product, isLoading, isError } = useProduct(productId);
  const addToCartMutation = useAddToCartMutation();

  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState('retail');
  const [inWishlist, setInWishlist] = useState(false);
  const [showRFQ, setShowRFQ] = useState(false);
  const [rfqQty, setRfqQty] = useState('');
  const [rfqLocation, setRfqLocation] = useState('');
  const [rfqNote, setRfqNote] = useState('');
  const createRFQMutation = useCreateQuotationMutation();
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <Award size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you are looking for might have been removed or is currently unavailable.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://placehold.co/600x500?text=No+Image+Available'];

  const priceTiers = [
    { id: 'retail', label: 'Retail', price: Number(product.retail || product.price), desc: `Min: 1 ${product.unit}` },
    { id: 'wholesale', label: 'Wholesale', price: Number(product.wholesale || product.price), desc: `Min: 10 ${product.unit}` },
    { id: 'bulk', label: 'Bulk / B2B', price: Number(product.bulkb2b || product.price), desc: `Min: 100 ${product.unit}` },
  ];

  const currentPrice = priceTiers.find((t) => t.id === selectedTier)?.price || Number(product.price);

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { productId, quantity },
      {
        onSuccess: () => {
          setAddedToCart(true);
          toast.success('Product added to cart!');
          setTimeout(() => setAddedToCart(false), 2000);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to add product to cart');
        },
      }
    );
  };

  const handleRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqQty || !rfqLocation) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createRFQMutation.mutateAsync({
        productId: productId,
        requiredQuantity: Number(rfqQty),
        deliveryLocation: rfqLocation,
        additionalRequirement: rfqNote,
      });
      toast.success('Quotation request sent successfully!');
      setShowRFQ(false);
      setRfqQty('');
      setRfqLocation('');
      setRfqNote('');
    } catch (error) {
      // Error is handled by apiClient toast
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC' }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
          <button onClick={() => router.push('/')} className="hover:underline" style={{ color: '#0D2E5E' }}>Home</button>
          <ChevronRight size={12} />
          <button className="hover:underline" style={{ color: '#0D2E5E' }}>{product.category?.title || 'Products'}</button>
          <ChevronRight size={12} />
          <span style={{ color: '#64748B' }}>{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm mb-3" style={{ height: '400px' }}>
              <img src={images[selectedImg]} alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className="rounded-xl overflow-hidden border-2 transition-all flex-1"
                  style={{
                    borderColor: selectedImg === idx ? '#F97316' : '#E2E8F0',
                    height: '80px',
                  }}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#F97316' }}>{product.status}</span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                {product.stockQuantity > 0 ? `In Stock — ${product.stockQuantity} ${product.unit}` : 'Out of Stock'}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>Verified Vendor</span>
            </div>

            <h1 className="text-2xl font-bold mb-1" style={{ color: '#0D2E5E' }}>
              {product.title}
            </h1>
            <p className="text-sm mb-3" style={{ color: '#64748B' }}>
              by <span className="font-semibold" style={{ color: '#F97316' }}>{product.user?.shopName || 'Official Store'}</span> · SKU: {product.sku}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} style={{ fill: s <= 4 ? '#F59E0B' : 'none', color: s <= 4 ? '#F59E0B' : '#CBD5E1' }} />
                ))}
              </div>
              <span className="font-semibold text-sm" style={{ color: '#1E293B' }}>4.5</span>
              <span className="text-sm" style={{ color: '#64748B' }}>(234 reviews)</span>
              <span className="text-sm" style={{ color: '#64748B' }}>·</span>
              <span className="text-sm" style={{ color: '#64748B' }}>1,247 sold</span>
            </div>

            {/* Pricing Tiers */}
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2" style={{ color: '#334155' }}>
                <Tag size={14} className="inline mr-1" style={{ color: '#F97316' }} />
                Select Pricing Tier
              </p>
              <div className="grid grid-cols-3 gap-2">
                {priceTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className="p-3 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: selectedTier === tier.id ? '#0D2E5E' : '#E2E8F0',
                      backgroundColor: selectedTier === tier.id ? '#EFF6FF' : '#F8FAFC',
                    }}
                  >
                    <div className="text-xs font-semibold mb-0.5" style={{ color: selectedTier === tier.id ? '#0D2E5E' : '#64748B' }}>
                      {tier.label}
                    </div>
                    <div className="font-bold text-sm" style={{ color: '#0D2E5E' }}>Rs. {tier.price.toLocaleString()}</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Price */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="font-bold" style={{ fontSize: '32px', color: '#0D2E5E' }}>
                Rs. {currentPrice.toLocaleString()}
              </span>
              {Number(product.retail) > currentPrice && (
                <>
                  <span className="text-base" style={{ color: '#94A3B8', textDecoration: 'line-through' }}>Rs. {Number(product.retail).toLocaleString()}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                    -{Math.round((1 - currentPrice / Number(product.retail)) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* COD Badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span className="text-sm font-semibold" style={{ color: '#166534' }}>Cash on Delivery (COD) Available</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <p className="text-sm font-semibold" style={{ color: '#334155' }}>Quantity:</p>
              <div className="flex items-center gap-2 border rounded-xl" style={{ borderColor: '#E2E8F0' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-100 rounded-l-xl transition-colors"
                >
                  <Minus size={16} style={{ color: '#64748B' }} />
                </button>
                <span className="w-10 text-center font-semibold" style={{ color: '#1E293B' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-gray-100 rounded-r-xl transition-colors"
                >
                  <Plus size={16} style={{ color: '#64748B' }} />
                </button>
              </div>
              <span className="text-sm" style={{ color: '#64748B' }}>
                Total: <strong style={{ color: '#0D2E5E' }}>Rs. {(currentPrice * quantity).toLocaleString()}</strong>
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                  style={{ backgroundColor: addedToCart ? '#10B981' : '#0D2E5E', color: 'white' }}
                >
                  {addedToCart ? <><CheckCircle2 size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                </button>
                <button
                  onClick={() => setInWishlist(!inWishlist)}
                  className="p-3.5 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    borderColor: inWishlist ? '#EF4444' : '#E2E8F0',
                    backgroundColor: inWishlist ? '#FEF2F2' : 'white',
                  }}
                >
                  <Heart
                    size={20}
                    style={{
                      fill: inWishlist ? '#EF4444' : 'none',
                      color: inWishlist ? '#EF4444' : '#64748B',
                    }}
                  />
                </button>
                <button className="p-3.5 rounded-xl border-2 flex items-center justify-center border hover:bg-gray-50" style={{ borderColor: '#E2E8F0' }}>
                  <Share2 size={20} style={{ color: '#64748B' }} />
                </button>
              </div>

              {/* RFQ Button */}
              <button
                onClick={() => setShowRFQ(true)}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 hover:shadow-md transition-all cursor-pointer"
                style={{ borderColor: '#F97316', color: '#F97316', backgroundColor: '#FFF7ED' }}
              >
                <FileText size={18} />
                Initiate Request for Quotation (RFQ) — Bulk / B2B
              </button>
            </div>

            {/* Seller Information Card */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm mb-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0D2E5E]">Seller Information</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Verified Vendor</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg" style={{ backgroundColor: '#0D2E5E' }}>
                  {product.user?.shopName?.charAt(0) || product.user?.fullName?.charAt(0) || 'B'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-[#0D2E5E]">{product.user?.shopName || 'Official Store'}</h4>
                  <p className="text-xs font-semibold text-gray-400 mb-2">by {product.user?.fullName}</p>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-[#1E293B]">4.9 Rating</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin size={12} className="text-[#F97316]" />
                      <span className="text-xs font-medium">{product.origin || 'Pakistan'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t" style={{ borderColor: '#F1F5F9' }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <Mail size={16} className="text-gray-400" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Support</p>
                      <p className="text-xs font-bold text-[#0D2E5E] truncate max-w-[120px]">{product.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Member Since</p>
                      <p className="text-xs font-bold text-[#0D2E5E]">
                        {product.user?.createdAt ? new Date(product.user.createdAt).getFullYear() : '2024'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/shop/${product.sellerId}`)}
                    className="w-full py-3.5 rounded-xl text-xs font-bold border-2 border-[#0D2E5E] text-[#0D2E5E] hover:bg-[#0D2E5E] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Building2 size={16} /> Visit Full Shop Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: 'Intra-city', value: 'Rs. 200', desc: 'Within Lahore' },
                { icon: MapPin, label: 'Inter-city', value: 'Rs. 500', desc: 'Nationwide' },
                { icon: Clock, label: 'Dispatch', value: '48 hours', desc: 'Max SLA' },
                { icon: RefreshCw, label: 'Returns', value: '7 days', desc: 'Easy returns' },
              ].map(({ icon: Icon, label, value, desc }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <Icon size={16} style={{ color: '#0D2E5E' }} />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#1E293B' }}>{label}: {value}</div>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border mb-10" style={{ borderColor: '#E2E8F0' }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-4 text-sm font-semibold capitalize transition-all border-b-2 -mb-px"
                style={{
                  borderBottomColor: activeTab === tab ? '#F97316' : 'transparent',
                  color: activeTab === tab ? '#F97316' : '#64748B',
                }}
              >
                {tab} {tab === 'reviews' && '(234)'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Model', value: product.modelNumber || 'N/A' },
                    { label: 'Weight/Unit', value: `${product.unit}` },
                    { label: 'Material', value: product.material || 'N/A' },
                    { label: 'Origin', value: product.origin || 'Pakistan' },
                    { label: 'Warranty', value: product.warranty || 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <span className="font-semibold" style={{ color: '#334155', width: '120px' }}>{label}:</span>
                      <span style={{ color: '#64748B' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                <table className="w-full">
                  <tbody>
                    {[
                      ['Brand', product.brand],
                      ['SKU', product.sku],
                      ['Unit', product.unit],
                      ['Color', product.color || 'N/A'],
                      ['Size', product.size || 'N/A'],
                      ['Thickness', product.thickness || 'N/A'],
                      ['Dimensions', product.dimensions || 'N/A'],
                      ['Material', product.material || 'N/A'],
                      ['Warranty', product.warranty || 'N/A'],
                      ['Shipping Days', product.shippingDays || 'N/A'],
                    ].map(([key, val], idx) => (
                      <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? '#F8FAFC' : 'white' }}>
                        <td className="px-4 py-2.5 text-sm font-semibold" style={{ color: '#334155', width: '45%' }}>{key}</td>
                        <td className="px-4 py-2.5 text-sm" style={{ color: '#64748B' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-5 last:border-0" style={{ borderColor: '#F1F5F9' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: '#0D2E5E' }}>
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{review.name}</div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>{review.date}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={13} style={{ fill: s <= review.rating ? '#F59E0B' : 'none', color: s <= review.rating ? '#F59E0B' : '#CBD5E1' }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: '#475569' }}>{review.comment}</p>
                    <button className="mt-2 text-xs" style={{ color: '#94A3B8' }}>
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="font-bold text-xl mb-5" style={{ color: '#0D2E5E' }}>Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((p) => (
              <div key={p.id} onClick={() => router.push(`/product/${p.id}`)} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md cursor-pointer transition-all" style={{ borderColor: '#E2E8F0' }}>
                <img src={p.img} alt={p.name} className="w-full object-cover" style={{ height: '140px' }} />
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: '#1E293B' }}>{p.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                      <span className="text-xs" style={{ color: '#64748B' }}>{p.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm" style={{ color: '#0D2E5E' }}>Rs. {p.price.toLocaleString()}</div>
                    <button className="mt-1 p-1.5 rounded-lg text-white" style={{ backgroundColor: '#F97316' }}>
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ Modal */}
      {showRFQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF7ED' }}>
                  <FileText size={20} style={{ color: '#F97316' }} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: '#0D2E5E' }}>Request for Quotation</h3>
                  <p className="text-xs" style={{ color: '#64748B' }}>{product.title} — {product.brand}</p>
                </div>
              </div>
              <button onClick={() => setShowRFQ(false)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#64748B' }}>✕</button>
            </div>
            <form onSubmit={handleRFQ} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Required Quantity *</label>
                <input type="number" value={rfqQty} onChange={(e) => setRfqQty(e.target.value)} placeholder="e.g. 500 bags" required className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Delivery Location *</label>
                <input
                  type="text"
                  value={rfqLocation}
                  onChange={(e) => setRfqLocation(e.target.value)}
                  placeholder="e.g. Muskan Chowrangi, Karachi"
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Additional Requirements (Optional)</label>
                <textarea
                  value={rfqNote}
                  onChange={(e) => setRfqNote(e.target.value)}
                  placeholder="Any specific requirements, delivery timeline, or pricing expectations..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                />
              </div>
              <button
                type="submit"
                disabled={createRFQMutation.isPending}
                className="w-full py-3.5 rounded-xl text-white font-semibold hover:opacity-90 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: '#F97316' }}
              >
                {createRFQMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Submit RFQ Request'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
