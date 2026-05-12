'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  HardHat, Package, Plus, BarChart2, ShoppingBag, Settings,
  Search, Filter, MoreVertical, Edit, Trash2, Upload, Image,
  AlertTriangle, TrendingUp, TrendingDown, Eye, Star, Clock,
  Truck, CheckCircle2, XCircle, ChevronRight, Bell, LogOut,
  ChevronDown, Tag, DollarSign, Box, RefreshCw, Download,
  Calendar, MapPin, User, Phone, ChevronUp, FileText, Send,
  Mail, MessageSquare, Store, Camera, Building2, CreditCard,
  Zap, Award, Shield, ChevronLeft, X, Loader2, Globe
} from 'lucide-react';
import BuildHubLogo from '@/imports/buildhub.png';
import {
  useQuotations,
  useQuotationDetails,
  useQuotationStats,
  useUpdateQuotationStatusMutation,
  QuotationStatus
} from '@/hooks/useQuotation';
import VendorQuotations from '@/app/components/vendor/VendorQuotations';
import { toast } from 'sonner';
import {
  useProducts,
  useCategories,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockStatusMutation,
  Product
} from '@/hooks/useProduct';
import {
  useOrders,
  useOrderStats,
  useUpdateOrderStatus,
  useUploadOrderImage,
  useOrderDetails,
  Order
} from '@/hooks/useOrder';
import {
  useCompleteBusinessStep3Mutation,
  useCompleteDocumentsStep4Mutation,
  useUser
} from '@/hooks/useAuth';

const navItems = [
  { id: 'products', label: 'Products Listing', icon: Package, path: '/vendor/dashboard/products' },
  { id: 'add-product', label: 'Add Product', icon: Plus, path: '/vendor/dashboard/add-product' },
  { id: 'inventory', label: 'Inventory', icon: Box, path: '/vendor/dashboard/inventory' },
  { id: 'stock-status', label: 'Stock Status', icon: CheckCircle2, path: '/vendor/dashboard/stock-status' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/vendor/dashboard/orders' },
  { id: 'rfq', label: 'RFQ Management', icon: FileText, path: '/vendor/dashboard/rfq' },
];

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

const mockProducts = [
  { id: 1, name: 'OPC Cement 50kg', category: 'Cement', sku: 'CEM-001', stock: 450, price: 1200, status: 'active', rating: 4.5, sales: 234, img: 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=60&h=60&fit=crop' },
  { id: 2, name: 'TMT Steel Bar 10mm', category: 'Steel', sku: 'STL-022', stock: 120, price: 8500, status: 'active', rating: 4.2, sales: 89, img: 'https://images.unsplash.com/photo-1761479867761-7a8b11f54449?w=60&h=60&fit=crop' },
  { id: 3, name: 'Floor Tiles 60x60', category: 'Tiles', sku: 'TIL-045', stock: 800, price: 2200, status: 'active', rating: 4.7, sales: 312, img: 'https://images.unsplash.com/photo-1695191388218-f6259600223f?w=60&h=60&fit=crop' },
  { id: 4, name: 'Wall Paint 20L', category: 'Paints', sku: 'PNT-012', stock: 65, price: 3500, status: 'low_stock', rating: 4.1, sales: 178, img: 'https://images.unsplash.com/photo-1698216543278-c382147e9fbf?w=60&h=60&fit=crop' },
  { id: 5, name: 'PVC Pipe 4 inch', category: 'Plumbing', sku: 'PLM-008', stock: 0, price: 450, status: 'out_of_stock', rating: 3.9, sales: 56, img: 'https://images.unsplash.com/photo-1556995378-e0a5c979ec57?w=60&h=60&fit=crop' },
  { id: 6, name: 'Electric Cable 2.5mm', category: 'Electrical', sku: 'ELC-031', stock: 220, price: 1800, status: 'active', rating: 4.4, sales: 145, img: 'https://images.unsplash.com/photo-1684543327925-ca57d94843d6?w=60&h=60&fit=crop' },
];

// Generate more realistic orders data
const generateMockOrders = () => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const buyers = ['Ahmad Construction Co.', 'Raza Builders', 'National Housing', 'Pak Contractors', 'City Developers', 'Elite Builders', 'Metro Construction', 'Prime Developers', 'Royal Builders', 'United Contractors'];
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Peshawar'];
  const products = ['OPC Cement 50kg', 'TMT Steel Bar 10mm', 'Floor Tiles 60x60', 'Wall Paint 20L', 'PVC Pipe 4 inch'];

  const orders = [];
  for (let i = 1; i <= 50; i++) {
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const orderItems = [];
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 20) + 1;
      const price = Math.floor(Math.random() * 10000) + 500;
      orderItems.push({ product, qty, price });
    }
    const total = orderItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const daysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    orders.push({
      id: `ORD-${String(1000 + i).padStart(4, '0')}`,
      buyer: buyers[Math.floor(Math.random() * buyers.length)],
      buyerPhone: `+92 300 ${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      items: orderItems,
      itemCount: itemCount,
      total: total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: orderDate.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      address: `${Math.floor(Math.random() * 999) + 1} Street ${Math.floor(Math.random() * 10) + 1}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
      paymentMethod: Math.random() > 0.5 ? 'COD' : 'Bank Transfer'
    });
  }
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const mockOrders = generateMockOrders();

const inventoryItems = [
  { name: 'OPC Cement 50kg', sku: 'CEM-001', current: 450, min: 100, max: 1000, category: 'Cement' },
  { name: 'TMT Steel Bar 10mm', sku: 'STL-022', current: 120, min: 50, max: 500, category: 'Steel' },
  { name: 'Floor Tiles 60x60', sku: 'TIL-045', current: 800, min: 200, max: 2000, category: 'Tiles' },
  { name: 'Wall Paint 20L', sku: 'PNT-012', current: 65, min: 80, max: 400, category: 'Paints' },
  { name: 'PVC Pipe 4 inch', sku: 'PLM-008', current: 0, min: 50, max: 300, category: 'Plumbing' },
  { name: 'Electric Cable 2.5mm', sku: 'ELC-031', current: 220, min: 100, max: 600, category: 'Electrical' },
];

// Categories will be fetched from API

// RFQ types and state constants
type Section = 'products' | 'add-product' | 'inventory' | 'stock-status' | 'orders' | 'rfq' | 'settings';
type OnboardingStep = 'store' | 'documents' | 'subscription' | 'payment';

export default function VendorDashboard() {
  const params = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>((params?.section as Section) || 'products');

  const navigate2 = (section: Section) => {
    setActiveSection(section);
    router.push(`/vendor/dashboard/${section}`, { scroll: false });
  };

  // Sync active section with URL to prevent flickering on browser navigation
  useEffect(() => {
    if (params?.section && params.section !== activeSection) {
      setActiveSection(params.section as Section);
    }
  }, [params?.section]);


  // Quotation state (moved up to fix initialization error)
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || localStorage.getItem('onboardToken');
    }
    return null;
  });
  const [rfqStatusFilter, setRfqStatusFilter] = useState('all');
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [rfqSearchQuery, setRfqSearchQuery] = useState('');
  const [rfqPage, setRfqPage] = useState(1);
  const [replyMessage, setReplyMessage] = useState('');
  const [quoteBasePrice, setQuoteBasePrice] = useState('');
  const [quoteTotalPrice, setQuoteTotalPrice] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedOnboardToken = localStorage.getItem('onboardToken');
    const effectiveToken = savedToken || savedOnboardToken;
    if (effectiveToken) setToken(effectiveToken);

    // User is already initialized in state, so we just check for profile completion here
    if (user && !user.isProfileComplete) {
      setActiveSection('settings');
    }
  }, [user]);


  // RFQ Hooks
  const { data: rfqStatsData } = useQuotationStats({ sellerId: user?.id });
  const { data: rfqsData } = useQuotations({
    page: rfqPage,
    status: rfqStatusFilter === 'all' ? undefined : rfqStatusFilter,
    search: rfqSearchQuery || undefined,
    sellerId: user?.id
  });
  const updateQuotationStatusMutation = useUpdateQuotationStatusMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [tempPriceRange, setTempPriceRange] = useState({ min: '', max: '' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [itemsPerPage] = useState(10);

  // Orders State
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [addProductForm, setAddProductForm] = useState({
    title: '', description: '', price: '', brand: '', sku: '', unit: '',
    stockQuantity: '', categoryId: '', retail: '', wholesale: '', bulkb2b: '',
    images: [] as (File | string)[], warehousePrice: '', exFactoryPrice: '', exDestinationPrice: '',
    modelNumber: '', minimumOrder: '', origin: '', warranty: '',
    shippingDays: '', color: '', size: '', thickness: '', material: '', dimensions: '',
    city: 'Karachi', productStatus: 'Active'
  });

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [originalProductData, setOriginalProductData] = useState<any>(null);



  const rfqStats = rfqStatsData || { Pending: 0, Quoted: 0, Accepted: 0, Rejected: 0 };
  const rfqs = Array.isArray(rfqsData?.data) ? rfqsData.data : [];
  const rfqTotal = rfqsData?.total || 0;
  const rfqLastPage = rfqsData?.lastPage || 1;

  // Selected Quotation Details
  const { data: selectedRFQDetails, isLoading: isLoadingRFQDetails } = useQuotationDetails(selectedRFQ || '');
  const selectedRFQData = selectedRFQDetails;

  const handleUpdateQuotationStatus = async (id: number, status: string) => {
    try {
      await updateQuotationStatusMutation.mutateAsync({ id, status });
      toast.success(`Quotation marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update quotation status");
    }
  };


  const isFormDirty = () => {
    if (!editingProductId || !originalProductData) return true; // Always enable for new products

    // Compare each field to see if it changed
    const fieldsToCompare = [
      'title', 'description', 'price', 'brand', 'sku', 'unit', 'stockQuantity',
      'categoryId', 'retail', 'wholesale', 'bulkb2b', 'warehousePrice',
      'exFactoryPrice', 'exDestinationPrice', 'modelNumber', 'minimumOrder',
      'origin', 'warranty', 'shippingDays', 'color', 'size', 'thickness',
      'material', 'dimensions'
    ];

    for (const field of fieldsToCompare) {
      const originalValue = originalProductData[field]?.toString() || '';
      const currentValue = (addProductForm as any)[field]?.toString() || '';
      if (originalValue !== currentValue) return true;
    }

    // Special check for images - if length changes or we have new File objects
    if (addProductForm.images.length !== originalProductData.images.length) return true;
    if (addProductForm.images.some(img => img instanceof File)) return true;

    return false;
  };

  // Queries & Mutations
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    enabled: !!user?.isProfileComplete && (activeSection === 'add-product' || activeSection === 'products'),
    retry: false
  });
  const { data: productsData, isLoading: productsLoading } = useProducts(
    {
      sellerId: user?.id,
      page: currentPage,
      limit: itemsPerPage,
      categoryId: filterCategory === 'All' ? undefined : filterCategory,
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined
    },
    {
      enabled: !!user?.id && !!user?.isProfileComplete && (activeSection === 'products' || activeSection === 'stock-status'),
      retry: false
    }
  );

  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    sellerId: user?.id,
    page: currentOrderPage,
    limit: 10,
    orderStatus: orderStatusFilter === 'all' ? undefined : orderStatusFilter
  });

  const { data: orderStatsData } = useOrderStats({ sellerId: user?.id });
  const orderStats = orderStatsData || { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
  const statusCounts = {
    all: Object.values(orderStats).reduce((a: any, b: any) => a + b, 0),
    pending: orderStats.Pending || 0,
    processing: orderStats.Processing || 0,
    shipped: orderStats.Shipped || 0,
    delivered: orderStats.Delivered || 0,
    cancelled: orderStats.Cancelled || 0,
  };
  const updateStatusMutation = useUpdateOrderStatus();
  const uploadImageMutation = useUploadOrderImage();
  const { data: detailedOrder, isLoading: isOrderDetailsLoading } = useOrderDetails(selectedOrder?.id || '');

  const orders = ordersData?.data || [];
  const totalOrders = ordersData?.total || 0;
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const updateStockStatusMutation = useUpdateStockStatusMutation();

  const handleUpdateStockStatus = async (productIds: number[], status: string) => {
    try {
      await updateStockStatusMutation.mutateAsync({ productIds, stockStatus: status });
      toast.success(`Stock status updated to ${status}`);
      setSelectedProducts([]); // Always clear selection after update
    } catch (error) {
      toast.error("Failed to update stock status");
    }
  };

  // Safe Data Extraction
  const categories = Array.isArray((categoriesData as any)?.data)
    ? (categoriesData as any).data
    : Array.isArray(categoriesData) ? categoriesData : [];

  const products = Array.isArray((productsData as any)?.data)
    ? (productsData as any).data
    : Array.isArray(productsData) ? productsData : [];

  const totalProducts = (productsData as any)?.total || products.length;



  // Category search state
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Fallbacks for obsolete mock code to prevent ReferenceErrors
  const mockOrders: any[] = [];
  const orderSearchQuery = '';
  const dateFilter = 'all';
  const ordersPage = 1;
  const expandedOrderId = null;
  const ordersPerPage = 10;
  const setOrdersPage = (n: any) => { };
  const setExpandedOrderId = (s: any) => { };
  const setOrderSearchQuery = (s: any) => { };
  const setDateFilter = (s: any) => { };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((c: any) => (c.title || c.name || '').toLowerCase().includes(categorySearch.toLowerCase()))
    : [];
  const [rfqPriorityFilter, setRfqPriorityFilter] = useState('all');
  const rfqPerPage = 15;

  // Settings / Onboarding state
  const [settingsTab, setSettingsTab] = useState<'profile' | 'shop' | 'bank'>('profile');

  const { data: currentUserDetails, isLoading: userLoading } = useUser(user?.id || '');
  const isProfileComplete = currentUserDetails?.isProfileComplete || user?.isProfileComplete;

  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('store');
  const [accountType, setAccountType] = useState<'retailer' | 'wholesaler'>('retailer');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState({
    shopName: '', logo: null as File | null, shopCoverImage: null as File | null,
    address: '', cnicNumber: '', ntnNumber: '', businessLocation: '', warehouseLocation: '',
    returnLocation: '', accountType: 'retailer'
  });
  const [bankForm, setBankForm] = useState({
    accountTitle: '', accountNumber: '', branchCode: '', ibanNumber: ''
  });
  const onboardingSteps = ['store', 'documents', 'subscription', 'payment'];
  const onboardingStepIdx = onboardingSteps.indexOf(onboardingStep);

  const businessStep3Mutation = useCompleteBusinessStep3Mutation();
  const documentsStep4Mutation = useCompleteDocumentsStep4Mutation();

  const handleOnboardingNext = async () => {
    if (onboardingStep === 'store') {
      try {
        await businessStep3Mutation.mutateAsync({
          shopName: storeForm.shopName,
          logo: storeForm.logo,
          shopCoverImage: storeForm.shopCoverImage,
          address: storeForm.address,
          accountType: accountType,
          businessAddress: storeForm.businessLocation,
          warehouseAddress: storeForm.warehouseLocation,
          returnAddress: storeForm.returnLocation,
          cnicNumber: storeForm.cnicNumber,
          ntnNumber: storeForm.ntnNumber,
        });
        toast.success("Business info saved");
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

  const handleOnboardingBack = () => {
    const prevStep = onboardingSteps[onboardingStepIdx - 1] as OnboardingStep;
    if (prevStep) setOnboardingStep(prevStep);
  };

  const handlePublishProduct = async () => {
    try {
      if (!addProductForm.title || !addProductForm.price || !addProductForm.categoryId || !addProductForm.sku) {
        toast.error("Please fill all required fields");
        return;
      }

      const formData = new FormData();

      // Add all form fields to FormData, excluding fields the backend rejects
      Object.entries(addProductForm).forEach(([key, value]) => {
        if (key === 'images') {
          (value as any[]).forEach((img) => {
            if (img instanceof File) {
              formData.append(`images`, img);
            }
          });
        } else if (key !== 'city' && key !== 'productStatus' && value !== '' && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (editingProductId) {
        await updateProductMutation.mutateAsync({ id: editingProductId, payload: formData });
        toast.success("Product updated successfully");
      } else {
        await createProductMutation.mutateAsync(formData);
        toast.success("Product published successfully");
      }

      // Reset form
      setEditingProductId(null);
      setAddProductForm({
        title: '', description: '', price: '', brand: '', sku: '', unit: '',
        stockQuantity: '', categoryId: '', retail: '', wholesale: '', bulkb2b: '',
        images: [] as (File | string)[], warehousePrice: '', exFactoryPrice: '', exDestinationPrice: '',
        modelNumber: '', minimumOrder: '', origin: '', warranty: '',
        shippingDays: '', color: '', size: '', thickness: '', material: '', dimensions: '',
        city: 'Karachi', productStatus: 'Active'
      });
      navigate2('products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    const formData = {
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      brand: product.brand,
      sku: product.sku,
      unit: product.unit,
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.categoryId.toString(),
      retail: product.retail?.toString() || '',
      wholesale: product.wholesale?.toString() || '',
      bulkb2b: product.bulkb2b?.toString() || '',
      images: product.images,
      warehousePrice: product.warehousePrice?.toString() || '',
      exFactoryPrice: product.exFactoryPrice?.toString() || '',
      exDestinationPrice: product.exDestinationPrice?.toString() || '',
      modelNumber: product.modelNumber || '',
      minimumOrder: product.minimumOrder?.toString() || '',
      origin: product.origin || '',
      warranty: product.warranty || '',
      shippingDays: product.shippingDays || '',
      color: product.color || '',
      size: product.size || '',
      thickness: product.thickness || '',
      material: product.material || '',
      dimensions: product.dimensions || '',
    };
    setAddProductForm({ ...addProductForm, ...formData });
    setOriginalProductData({ ...formData, images: product.images });
    setActiveSection('add-product');
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Stock status state
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);



  const stats = [
    { label: 'Total Products', value: '126', icon: Package, color: '#3e3e3e', change: '+12%' },
    { label: 'Total Orders', value: '1,247', icon: ShoppingBag, color: '#ef4136', change: '+8%' },
    { label: 'Monthly Revenue', value: 'Rs. 2.4M', icon: DollarSign, color: '#10B981', change: '+23%' },
    { label: 'Avg Rating', value: '4.3 ★', icon: Star, color: '#F59E0B', change: '+0.2' },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: 'Active', color: '#166534', bg: '#DCFCE7' },
      paid: { label: 'Paid', color: '#166534', bg: '#DCFCE7' },
      low_stock: { label: 'Low Stock', color: '#92400E', bg: '#FEF3C7' },
      out_of_stock: { label: 'Out of Stock', color: '#991B1B', bg: '#FEE2E2' },
      pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
      processing: { label: 'Processing', color: '#5B21B6', bg: '#EDE9FE' },
      shipped: { label: 'Shipped', color: '#1E40AF', bg: '#DBEAFE' },
      delivered: { label: 'Delivered', color: '#166534', bg: '#DCFCE7' },
      cancelled: { label: 'Cancelled', color: '#991B1B', bg: '#FEE2E2' },
    };
    const s = map[status.toLowerCase()] || map.active;
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ color: s.color, backgroundColor: s.bg }}>
        {s.label}
      </span>
    );
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    const loadingToast = toast.loading(`Updating order status to ${newStatus}...`);
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
      toast.success(`Order marked as ${newStatus}`, { id: loadingToast });
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Failed to update status", { id: loadingToast });
    }
  };

  const handleUploadProof = async (orderId: number, file: File) => {
    const loadingToast = toast.loading("Uploading delivery proof...");
    try {
      await uploadImageMutation.mutateAsync({ id: orderId, image: file });
      toast.success("Delivery proof uploaded successfully", { id: loadingToast });
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Failed to upload proof", { id: loadingToast });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col shadow-xl" style={{ backgroundColor: '#0D2E5E' }}>
        {/* Logo */}
        <div className="p-6 border-b flex justify-center" style={{ borderColor: '#1E4080' }}>
          <img
            src={typeof BuildHubLogo === 'string' ? BuildHubLogo : BuildHubLogo.src}
            alt="Build Hub Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {token && user?.isProfileComplete && (
            <p className="text-xs font-semibold mb-3 px-3" style={{ color: '#94A3B8' }}>MAIN MENU</p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            // Strict check: Only show if we have a real token AND profile is complete
            const hasRealToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
            const isDisabled = (!hasRealToken || !user?.isProfileComplete) && item.id !== 'settings';

            if (isDisabled) return null;

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
            <p className="text-xs font-semibold mb-3 px-3" style={{ color: '#94A3B8' }}>ACCOUNT</p>
            <button
              onClick={() => navigate2('settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                backgroundColor: activeSection === 'settings' ? '#ef4136' : 'transparent',
                color: activeSection === 'settings' ? 'white' : '#94A3B8',
              }}
            >
              <Settings size={18} /> Settings
              {activeSection === 'settings' && <ChevronRight size={14} className="ml-auto" />}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
              style={{ color: '#94A3B8' }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t" style={{ borderColor: '#1E4080' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4136' }}>
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <div>
              <div className="text-white text-sm font-medium">Ahmed Materials</div>
              <div className="text-xs flex items-center gap-1" style={{ color: '#10B981' }}>
                <CheckCircle2 size={11} /> Verified Vendor
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <h1 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>
              {activeSection === 'products' ? 'Products Listing' :
                activeSection === 'add-product' ? 'Add New Product' :
                  activeSection === 'inventory' ? 'Inventory Management' :
                    activeSection === 'stock-status' ? 'Stock Status' :
                      activeSection === 'rfq' ? 'RFQ Management' :
                        activeSection === 'settings' ? 'Settings' : 'Orders'}
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {activeSection === 'products' ? 'Manage your product catalog' :
                activeSection === 'add-product' ? 'List a new product for sale' :
                  activeSection === 'inventory' ? 'Track your stock levels' :
                    activeSection === 'stock-status' ? 'Quickly update product availability status' :
                      activeSection === 'rfq' ? 'Manage quotation requests from buyers' :
                        activeSection === 'settings' ? 'Complete your store setup & manage your subscription' : 'Manage and fulfill customer orders'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0' }}>
              <Bell size={20} style={{ color: '#64748B' }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4136' }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <span className="text-xs font-semibold" style={{ color: '#166534' }}>Verified Vendor</span>
            </div>
          </div>
        </header>


        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-1 md:px-4 py-6">

          {/* ─── PRODUCTS LISTING ─── */}
          {activeSection === 'products' && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#E2E8F0' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                          <Icon size={20} style={{ color: s.color }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{s.change}</span>
                      </div>
                      <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-wrap gap-3 items-center" style={{ borderColor: '#E2E8F0' }}>
                <div className="relative flex-1 min-w-48">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-sm outline-none bg-white cursor-pointer min-w-40"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    <option value="All">All Categories</option>
                    {Array.isArray(categories) && categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.title || c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setTempPriceRange(priceRange);
                      setIsFilterModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-all cursor-pointer"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    <Filter size={18} /> Filter
                  </button>
                </div>

                <button
                  onClick={() => setActiveSection('add-product')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: '#ef4136' }}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {/* Price Filter Modal */}
              {isFilterModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold" style={{ color: '#0D2E5E' }}>Price Range Filter</h3>
                        <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <X size={20} style={{ color: '#64748B' }} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold block mb-1.5" style={{ color: '#64748B' }}>Min Price (Rs.)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={tempPriceRange.min}
                            onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                            style={{ borderColor: '#E2E8F0' }}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold block mb-1.5" style={{ color: '#64748B' }}>Max Price (Rs.)</label>
                          <input
                            type="number"
                            placeholder="1"
                            value={tempPriceRange.max}
                            onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                            style={{ borderColor: '#E2E8F0' }}
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={() => {
                            setPriceRange({ min: '', max: '' });
                            setTempPriceRange({ min: '', max: '' });
                            setIsFilterModalOpen(false);
                            setCurrentPage(1);
                          }}
                          className="flex-1 py-3 rounded-xl border font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
                          style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                        >
                          Clear Filters
                        </button>
                        <button
                          onClick={() => {
                            setPriceRange(tempPriceRange);
                            setIsFilterModalOpen(false);
                            setCurrentPage(1);
                          }}
                          className="flex-1 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 shadow-lg shadow-orange-200 transition-all cursor-pointer"
                          style={{ backgroundColor: '#F97316' }}
                        >
                          Apply Filter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: '#64748B' }}>PRODUCT</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold hidden md:table-cell" style={{ color: '#64748B' }}>CATEGORY</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: '#64748B' }}>PRICE</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold hidden sm:table-cell" style={{ color: '#64748B' }}>STOCK</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: '#64748B' }}>STATUS</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold hidden lg:table-cell" style={{ color: '#64748B' }}>RATING</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: '#64748B' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {products.length > 0 ? (
                      products
                        .filter((p: Product) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((product: Product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                  <div className="text-sm font-semibold" style={{ color: '#1E293B' }}>{product.title}</div>
                                  <div className="text-xs" style={{ color: '#94A3B8' }}>SKU: {product.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell">
                              <span className="text-sm" style={{ color: '#64748B' }}>{product.category?.title || product.category?.name || 'N/A'}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm font-semibold" style={{ color: '#0D2E5E' }}>
                                Rs. {Number(product.price || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell">
                              <span className="text-sm" style={{ color: Number(product.stockQuantity) === 0 ? '#EF4444' : Number(product.stockQuantity) < 10 ? '#F59E0B' : '#1E293B' }}>
                                {product.stockQuantity} {product.unit}
                              </span>
                            </td>
                            <td className="px-5 py-4">{statusBadge(product.productStatus || 'active')}</td>
                            <td className="px-5 py-4 hidden lg:table-cell">
                              <span className="text-sm font-medium flex items-center gap-1" style={{ color: '#F59E0B' }}>
                                ★ 4.5
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Edit"
                                >
                                  <Edit size={15} style={{ color: '#3B82F6' }} />
                                </button>

                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete"
                                >
                                  <Trash2 size={15} style={{ color: '#EF4444' }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-50">
                              <Package size={40} style={{ color: '#94A3B8' }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold" style={{ color: '#1E293B' }}>No Products Found</h3>
                              <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                                {searchQuery || filterCategory !== 'All'
                                  ? "Try adjusting your filters or search query"
                                  : "You haven't added any products yet."}
                              </p>
                            </div>
                            {!searchQuery && filterCategory === 'All' && (
                              <button
                                onClick={() => setActiveSection('add-product')}
                                className="mt-2 px-6 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                                style={{ backgroundColor: '#ef4136' }}
                              >
                                <Plus size={18} /> Add Your First Product
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI */}
              <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-2xl border" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Showing page <span className="font-semibold text-gray-900">{currentPage}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    Previous
                  </button>
                  <button
                    disabled={products.length < itemsPerPage}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── ORDERS LISTING ─── */}
          {activeSection === 'orders' && (
            <div className="space-y-5">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Orders', value: statusCounts.all, color: '#3e3e3e', icon: ShoppingBag },
                  { label: 'Pending', value: statusCounts.pending, color: '#F59E0B', icon: Clock },
                  { label: 'Processing', value: statusCounts.processing, color: '#8B5CF6', icon: RefreshCw },
                  { label: 'Shipped', value: statusCounts.shipped, color: '#3B82F6', icon: Truck },
                  { label: 'Delivered', value: statusCounts.delivered, color: '#10B981', icon: CheckCircle2 },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                        <Icon size={18} style={{ color: s.color }} />
                      </div>
                      <div>
                        <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>{s.value}</div>
                        <div className="text-xs" style={{ color: '#64748B' }}>{s.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SLA Reminder */}
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}>
                <Clock size={18} style={{ color: '#D97706' }} />
                <p className="text-sm" style={{ color: '#92400E' }}>
                  <strong>SLA Reminder:</strong> All pending orders must be shipped within <strong>48 hours</strong> of order placement.
                </p>
              </div>

              {/* Orders Table Container */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                {/* Status Tabs */}
                <div className="flex border-b overflow-x-auto" style={{ borderColor: '#E2E8F0' }}>
                  {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setOrderStatusFilter(status);
                        setCurrentOrderPage(1);
                      }}
                      className="px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                      style={{
                        borderColor: orderStatusFilter === status ? '#ef4136' : 'transparent',
                        color: orderStatusFilter === status ? '#ef4136' : '#64748B'
                      }}
                    >
                      {status === 'all' ? 'All Orders' : `${status} Orders`}
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
                        backgroundColor: orderStatusFilter === status ? '#ef413615' : '#F1F5F9',
                        color: orderStatusFilter === status ? '#ef4136' : '#64748B'
                      }}>
                        {status === 'all' ? statusCounts.all : (statusCounts as any)[status.toLowerCase()]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Filters & Actions */}
                <div className="p-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: '#E2E8F0' }}>
                  <div className="relative flex-1 min-w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => {
                        setOrderSearchQuery(e.target.value);
                        setCurrentOrderPage(1);
                      }}
                      placeholder="Search by Order ID, Buyer, or City..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <button
                    className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#0D2E5E' }}
                  >
                    <Download size={16} /> Export
                  </button>
                </div>

                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Order Info</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {orders.length > 0 ? (
                      orders.map((order: Order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="font-bold text-sm" style={{ color: '#0D2E5E' }}>ORD-{order.id}</div>
                            <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{order.user.fullName}</div>
                            <div className="text-xs" style={{ color: '#64748B' }}>{order.user.phone}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-bold text-sm" style={{ color: '#1E293B' }}>Rs. {parseFloat(order.totalAmount).toLocaleString()}</div>
                            <div className="text-[10px] uppercase font-bold" style={{ color: '#94A3B8' }}>{order.items.length} Items • {order.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-5">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className="text-xs font-bold py-1.5 px-3 rounded-lg border outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all"
                              style={{
                                backgroundColor: order.orderStatus === 'Pending' ? '#FEF3C7' : order.orderStatus === 'Delivered' ? '#F0FDF4' : '#F1F5F9',
                                color: order.orderStatus === 'Pending' ? '#92400E' : order.orderStatus === 'Delivered' ? '#166534' : '#475569',
                                borderColor: 'transparent'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                              className="p-2 rounded-xl hover:bg-blue-50 transition-all text-blue-600 border border-transparent hover:border-blue-100"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                              <ShoppingBag size={32} className="text-gray-300" />
                            </div>
                            <h3 className="font-bold text-gray-900">No Orders Found</h3>
                            <p className="text-sm text-gray-500">There are no orders matching your current criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Orders Pagination */}
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-sm text-gray-500">
                  Showing page <span className="font-bold text-gray-900">{currentOrderPage}</span> of <span className="font-bold text-gray-900">{ordersData?.lastPage || 1}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentOrderPage === 1}
                    onClick={() => setCurrentOrderPage(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl border text-sm font-bold transition-all disabled:opacity-40 hover:bg-gray-50"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentOrderPage === ordersData?.lastPage}
                    onClick={() => setCurrentOrderPage(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl border text-sm font-bold transition-all disabled:opacity-40 hover:bg-gray-50"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── ORDER DETAILS MODAL ─── */}
          {isOrderModalOpen && selectedOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">Order #ORD-{selectedOrder.id}</h3>
                      {statusBadge(detailedOrder?.orderStatus || selectedOrder.orderStatus)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {isOrderDetailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-10 h-10 animate-spin text-[#ef4136] mb-4" />
                      <p className="text-sm font-medium text-gray-500">Fetching order details...</p>
                    </div>
                  ) : (
                    <>
                      {/* Items List */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Order Items</h4>
                        <div className="space-y-3">
                          {(detailedOrder?.items || selectedOrder.items).map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                              <img src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                              <div className="flex-1">
                                <h5 className="font-bold text-gray-900">{item.product?.title || 'Unknown Product'}</h5>
                                <p className="text-xs text-gray-500">{item.product?.brand} • {item.quantity} {item.product?.unit}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">Rs. {parseFloat(item.totalItemPrice).toLocaleString()}</div>
                                <p className="text-[10px] text-gray-500">Rs. {parseFloat(item.priceAtPurchase).toLocaleString()} / unit</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer & Shipping */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Customer Info</h4>
                          <div className="space-y-1">
                            <div className="font-bold text-gray-900">{detailedOrder?.user?.fullName || selectedOrder.user.fullName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Mail size={14} /> {detailedOrder?.user?.email || selectedOrder.user.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone size={14} /> {detailedOrder?.user?.phone || selectedOrder.user.phone}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Shipping Address</h4>
                          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                            <div className="text-sm font-medium text-orange-900 flex items-start gap-2">
                              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                              {detailedOrder?.address ? (
                                <span>
                                  {detailedOrder.address.streetAddress}, {detailedOrder.address.city}, {detailedOrder.address.province}, {detailedOrder.address.postalCode}
                                </span>
                              ) : (
                                <span>
                                  {selectedOrder.address ?
                                    `${selectedOrder.address.streetAddress}, ${selectedOrder.address.city}, ${selectedOrder.address.province}, ${selectedOrder.address.postalCode}`
                                    : 'N/A'}
                                </span>
                              )}

                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Proof Section */}
                      <div className="pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Delivery Proof</h4>
                        {(detailedOrder?.vendorImage || selectedOrder.vendorImage) ? (
                          <div className="relative group rounded-2xl overflow-hidden h-50 border-2 border-dashed border-gray-200">
                            <img
                              src={(detailedOrder?.vendorImage || selectedOrder.vendorImage || '').replace('/upload/', '/upload/q_70/')}
                              alt="Delivery proof"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <label className="cursor-pointer bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl">
                                Change Proof
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUploadProof(selectedOrder.id, e.target.files[0])} />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group">
                            <Upload size={32} className="text-gray-300 group-hover:text-orange-400 mb-2" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-orange-900">Upload Delivery Proof</span>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase">JPG, PNG up to 5MB</p>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUploadProof(selectedOrder.id, e.target.files[0])} />
                          </label>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 border-t flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                  <div className="text-right flex-1">
                    <p className="text-xs text-gray-500 font-bold uppercase">Total Order Amount</p>
                    <div className="text-2xl font-black text-gray-900">
                      Rs. {parseFloat(detailedOrder?.totalAmount || selectedOrder.totalAmount).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── ADD PRODUCT ─── */}
          {activeSection === 'add-product' && (
            <div className="max-w-3xl">
              {/* SLA Alert */}
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-6" style={{ backgroundColor: '#FEF3C7', border: '2px solid #FCD34D' }}>
                <AlertTriangle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#92400E' }}>⏱ SLA Requirement</p>
                  <p className="text-sm mt-0.5" style={{ color: '#B45309' }}>
                    <strong>Orders must be shipped within 48 hours</strong> of confirmation. Failure to comply may result in account suspension.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6" style={{ borderColor: '#E2E8F0' }}>
                {/* Category Searchable Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Product Category *</label>

                  {/* Dropdown Toggle */}
                  <div
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between cursor-pointer transition-all"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  >
                    <span style={{ color: addProductForm.categoryId ? '#1E293B' : '#94A3B8' }}>
                      {addProductForm.categoryId
                        ? (categories.find((c: any) => c.id.toString() === addProductForm.categoryId.toString())?.title ||
                          categories.find((c: any) => c.id.toString() === addProductForm.categoryId.toString())?.name ||
                          'Select Category')
                        : 'Select Category'}
                    </span>
                    <ChevronDown size={18} style={{ color: '#64748B', transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'none' }} className="transition-transform" />
                  </div>

                  {/* Dropdown Menu */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border overflow-hidden animate-in fade-in zoom-in duration-200" style={{ borderColor: '#E2E8F0' }}>
                      {/* Search Input */}
                      <div className="p-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search category..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* Options List */}
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((c: any) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setAddProductForm({ ...addProductForm, categoryId: c.id.toString() });
                                setIsCategoryDropdownOpen(false);
                                setCategorySearch('');
                              }}
                              className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between group"
                            >
                              <span style={{ color: '#1E293B' }} className="group-hover:text-blue-600">{c.title || c.name}</span>
                              {addProductForm.categoryId.toString() === c.id.toString() && (
                                <CheckCircle2 size={16} className="text-blue-600" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs" style={{ color: '#94A3B8' }}>No categories found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Product Title *</label>
                  <input
                    type="text"
                    value={addProductForm.title}
                    onChange={(e) => setAddProductForm({ ...addProductForm, title: e.target.value })}
                    placeholder="e.g. OPC Cement 50kg Bag — Bestway"
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                {/* Brand & SKU & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Brand *</label>
                    <input
                      type="text"
                      value={addProductForm.brand}
                      onChange={(e) => setAddProductForm({ ...addProductForm, brand: e.target.value })}
                      placeholder="e.g. Bestway"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>SKU *</label>
                    <input
                      type="text"
                      value={addProductForm.sku}
                      onChange={(e) => setAddProductForm({ ...addProductForm, sku: e.target.value })}
                      placeholder="e.g. CEM-001"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Unit *</label>
                    <input
                      type="text"
                      value={addProductForm.unit}
                      onChange={(e) => setAddProductForm({ ...addProductForm, unit: e.target.value })}
                      placeholder="e.g. Bag, kg, ft"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Main Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Base Price (Rs.) *</label>
                    <input
                      type="number"
                      value={addProductForm.price}
                      onChange={(e) => setAddProductForm({ ...addProductForm, price: e.target.value })}
                      placeholder="e.g. 1200"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Stock Quantity *</label>
                    <input
                      type="number"
                      value={addProductForm.stockQuantity}
                      onChange={(e) => setAddProductForm({ ...addProductForm, stockQuantity: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Images / Videos */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Product Images & Videos *</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    id="product-files"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setAddProductForm({ ...addProductForm, images: [...addProductForm.images, ...Array.from(e.target.files)] });
                      }
                    }}
                  />
                  <label
                    htmlFor="product-files"
                    className="border-2 border-dashed rounded-xl p-8 text-center block cursor-pointer hover:bg-gray-50"
                    style={{ borderColor: '#CBD5E1' }}
                  >
                    <Image size={36} className="mx-auto mb-3" style={{ color: '#94A3B8' }} />
                    <p className="text-sm font-semibold" style={{ color: '#334155' }}>Click to upload images/videos</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{addProductForm.images.length} files selected</p>
                  </label>

                  {/* Image Previews */}
                  {addProductForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {addProductForm.images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                          <img
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              const newImgs = [...addProductForm.images];
                              newImgs.splice(idx, 1);
                              setAddProductForm({ ...addProductForm, images: newImgs });
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Description *</label>
                  <textarea
                    value={addProductForm.description}
                    onChange={(e) => setAddProductForm({ ...addProductForm, description: e.target.value })}
                    placeholder="Describe your product in detail — specifications, dimensions, brand, etc."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  />
                </div>

                {/* Pricing Tiers */}
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: '#334155' }}>
                    <Tag size={16} className="inline mr-2" style={{ color: '#ef4136' }} />
                    Pricing Tiers (Rs.)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'retail', label: 'Retail Price', desc: 'Per unit', placeholder: 'e.g. 1200' },
                      { key: 'wholesale', label: 'Wholesale Price', desc: 'Min 10 units', placeholder: 'e.g. 1100' },
                      { key: 'bulkb2b', label: 'Bulk Price', desc: 'Min 100 units', placeholder: 'e.g. 980' },
                    ].map((tier) => (
                      <div key={tier.key} className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                        <label className="text-xs font-semibold block mb-0.5" style={{ color: '#0D2E5E' }}>{tier.label}</label>
                        <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>{tier.desc}</p>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: '#64748B' }}>Rs.</span>
                          <input
                            type="number"
                            value={addProductForm[tier.key as keyof typeof addProductForm] as string}
                            onChange={(e) => setAddProductForm({ ...addProductForm, [tier.key]: e.target.value })}
                            placeholder={tier.placeholder}
                            className="w-full pl-8 pr-3 py-2.5 rounded-lg border text-sm outline-none"
                            style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#334155' }}>Minimum Order Quantity</label>
                    <input
                      type="number"
                      value={addProductForm.minimumOrder}
                      onChange={(e) => setAddProductForm({ ...addProductForm, minimumOrder: e.target.value })}
                      placeholder="e.g. 10"
                      className="w-32 px-3 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Additional Pricing & Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: '#334155' }}>Warehouse Price (Rs.)</label>
                    <input
                      type="number"
                      value={addProductForm.warehousePrice}
                      onChange={(e) => setAddProductForm({ ...addProductForm, warehousePrice: e.target.value })}
                      placeholder="e.g. 1150"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: '#334155' }}>Origin</label>
                    <input
                      type="text"
                      value={addProductForm.origin}
                      onChange={(e) => setAddProductForm({ ...addProductForm, origin: e.target.value })}
                      placeholder="e.g. Pakistan, China"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Product Specifications */}
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: '#334155' }}>
                    <Settings size={16} className="inline mr-2" style={{ color: '#64748B' }} />
                    Product Specifications
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { key: 'color', label: 'Color', placeholder: 'Blue' },
                      { key: 'size', label: 'Size', placeholder: 'Large' },
                      { key: 'material', label: 'Material', placeholder: 'Steel' },
                      { key: 'thickness', label: 'Thickness', placeholder: '10mm' },
                    ].map((spec) => (
                      <div key={spec.key}>
                        <label className="text-xs font-semibold block mb-1.5" style={{ color: '#0D2E5E' }}>{spec.label}</label>
                        <input
                          type="text"
                          value={addProductForm[spec.key as keyof typeof addProductForm] as string}
                          onChange={(e) => setAddProductForm({ ...addProductForm, [spec.key]: e.target.value })}
                          placeholder={spec.placeholder}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Warranty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Shipping Days</label>
                    <input
                      type="text"
                      value={addProductForm.shippingDays}
                      onChange={(e) => setAddProductForm({ ...addProductForm, shippingDays: e.target.value })}
                      placeholder="e.g. 2-3 working days"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Warranty</label>
                    <input
                      type="text"
                      value={addProductForm.warranty}
                      onChange={(e) => setAddProductForm({ ...addProductForm, warranty: e.target.value })}
                      placeholder="e.g. 1 Year Brand Warranty"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setAddProductForm({
                        title: '', description: '', price: '', brand: '', sku: '', unit: '',
                        stockQuantity: '', categoryId: '', retail: '', wholesale: '', bulkb2b: '',
                        images: [] as (File | string)[], warehousePrice: '', exFactoryPrice: '', exDestinationPrice: '',
                        modelNumber: '', minimumOrder: '', origin: '', warranty: '',
                        shippingDays: '', color: '', size: '', thickness: '', material: '', dimensions: '',
                        city: 'Karachi', productStatus: 'Active'
                      });
                      navigate2('products');
                    }}
                    className="px-6 py-3 rounded-xl border font-semibold text-sm hover:bg-gray-50"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishProduct}
                    disabled={createProductMutation.isPending || updateProductMutation.isPending || !isFormDirty()}
                    className="px-10 py-3.5 rounded-2xl text-white font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#F97316' }}
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending ? (
                      <>Saving... <RefreshCw size={20} className="animate-spin" /></>
                    ) : (
                      <>{editingProductId ? 'Update Product' : 'Publish Product'} <Send size={20} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── INVENTORY ─── */}
          {activeSection === 'inventory' && (
            <div className="space-y-5">
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total SKUs', value: '126', icon: Box, color: '#0D2E5E' },
                  { label: 'Low Stock Items', value: '8', icon: AlertTriangle, color: '#F59E0B' },
                  { label: 'Out of Stock', value: '3', icon: XCircle, color: '#EF4444' },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#E2E8F0' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}15` }}>
                        <Icon size={22} style={{ color: c.color }} />
                      </div>
                      <div>
                        <div className="font-bold text-2xl" style={{ color: '#0D2E5E' }}>{c.value}</div>
                        <div className="text-xs" style={{ color: '#64748B' }}>{c.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inventory table */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                  <h3 className="font-semibold" style={{ color: '#0D2E5E' }}>Stock Levels</h3>
                  <button className="flex items-center gap-1.5 text-sm" style={{ color: '#ef4136' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {inventoryItems.map((item) => {
                    const pct = item.max > 0 ? (item.current / item.max) * 100 : 0;
                    const isLow = item.current > 0 && item.current < item.min;
                    const isOut = item.current === 0;
                    return (
                      <div key={item.sku} className="px-5 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm" style={{ color: '#1E293B' }}>{item.name}</span>
                            {isOut && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: '#991B1B', backgroundColor: '#FEE2E2' }}>Out of Stock</span>}
                            {isLow && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: '#92400E', backgroundColor: '#FEF3C7' }}>Low Stock</span>}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs" style={{ color: '#94A3B8' }}>SKU: {item.sku}</span>
                            <span className="text-xs" style={{ color: '#94A3B8' }}>·</span>
                            <span className="text-xs" style={{ color: '#64748B' }}>{item.category}</span>
                          </div>
                          <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E2E8F0' }}>
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981',
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold" style={{ color: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#0D2E5E' }}>
                            {item.current}
                          </div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>/ {item.max} units</div>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Edit size={15} style={{ color: '#64748B' }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── ORDERS (DISABLED OLD MOCK) ─── */}
          {activeSection === 'orders' && false && (() => {
            // Filter orders
            const filteredOrders = [] as any;
            /*
            const filteredOrders = mockOrders.filter((order) => {
              ...
            });
            */


            // Pagination
            const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
            const paginatedOrders = filteredOrders.slice(
              (ordersPage - 1) * ordersPerPage,
              ordersPage * ordersPerPage
            );

            const handleStatusChange = (orderId: string, newStatus: string) => {
              const orderIndex = mockOrders.findIndex(o => o.id === orderId);
              if (orderIndex !== -1) {
                mockOrders[orderIndex].status = newStatus;
              }
            };

            return (
              <div className="space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Orders', value: statusCounts.all, color: '#3e3e3e', icon: ShoppingBag },
                    { label: 'Pending', value: statusCounts.pending, color: '#F59E0B', icon: Clock },
                    { label: 'Processing', value: statusCounts.processing, color: '#8B5CF6', icon: RefreshCw },
                    { label: 'Shipped', value: statusCounts.shipped, color: '#3B82F6', icon: Truck },
                    { label: 'Delivered', value: statusCounts.delivered, color: '#10B981', icon: CheckCircle2 },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                          <Icon size={18} style={{ color: s.color }} />
                        </div>
                        <div>
                          <div className="font-bold text-xl" style={{ color: '#0D2E5E' }}>{s.value}</div>
                          <div className="text-xs" style={{ color: '#64748B' }}>{s.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SLA Reminder */}
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}>
                  <Clock size={18} style={{ color: '#D97706' }} />
                  <p className="text-sm" style={{ color: '#92400E' }}>
                    <strong>SLA Reminder:</strong> All pending orders must be shipped within <strong>48 hours</strong> of order placement.
                  </p>
                </div>

                {/* Status Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto" style={{ borderColor: '#E2E8F0' }}>
                  <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
                    {[
                      { id: 'all', label: 'All Orders', count: statusCounts.all },
                      { id: 'Pending', label: 'Pending', count: statusCounts.pending },
                      { id: 'Processing', label: 'Processing', count: statusCounts.processing },
                      { id: 'Shipped', label: 'Shipped', count: statusCounts.shipped },
                      { id: 'Delivered', label: 'Delivered', count: statusCounts.delivered },
                      { id: 'Cancelled', label: 'Cancelled', count: statusCounts.cancelled },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setOrderStatusFilter(tab.id);
                          setOrdersPage(1);
                        }}
                        className="px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
                        style={{
                          borderColor: orderStatusFilter === tab.id ? '#ef4136' : 'transparent',
                          color: orderStatusFilter === tab.id ? '#ef4136' : '#64748B'
                        }}
                      >
                        {tab.label}
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
                          backgroundColor: orderStatusFilter === tab.id ? '#FEF3C7' : '#F1F5F9',
                          color: orderStatusFilter === tab.id ? '#92400E' : '#64748B'
                        }}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Filters & Actions */}
                  <div className="p-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: '#E2E8F0' }}>
                    <div className="relative flex-1 min-w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => {
                          setOrderSearchQuery(e.target.value);
                          setOrdersPage(1);
                        }}
                        placeholder="Search by Order ID, Buyer, or City..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                      />
                    </div>
                    <select
                      value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setOrdersPage(1);
                      }}
                      className="px-4 py-2.5 rounded-xl border text-sm outline-none flex items-center gap-2"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">This Month</option>
                    </select>
                    <button
                      className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0D2E5E' }}
                    >
                      <Download size={16} /> Export
                    </button>
                  </div>

                  {/* Orders List */}
                  <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                    {paginatedOrders.length > 0 ? paginatedOrders.map((order: any) => (
                      <div key={order.id}>
                        <div className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            {/* Order Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <button
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                {expandedOrderId === order.id ? (
                                  <ChevronUp size={18} style={{ color: '#64748B' }} />
                                ) : (
                                  <ChevronDown size={18} style={{ color: '#64748B' }} />
                                )}
                              </button>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Order ID</div>
                                  <div className="font-mono font-semibold text-sm" style={{ color: '#0D2E5E' }}>{order.id}</div>
                                  <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{order.date} {order.time}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Customer</div>
                                  <div className="font-semibold text-sm" style={{ color: '#1E293B' }}>{order.buyer}</div>
                                  <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#94A3B8' }}>
                                    <MapPin size={10} /> {order.city}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Amount</div>
                                  <div className="font-bold text-sm" style={{ color: '#0D2E5E' }}>Rs. {order.total.toLocaleString()}</div>
                                  <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{order.itemCount} items • {order.paymentMethod}</div>
                                </div>
                                <div>
                                  <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Status</div>
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold outline-none cursor-pointer"
                                    style={{ borderColor: '#E2E8F0' }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors" title="View Details">
                                <Eye size={16} style={{ color: '#3B82F6' }} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedOrderId === order.id && (
                          <div className="px-5 pb-5 border-t" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                              {/* Customer Details */}
                              <div>
                                <h4 className="font-semibold text-sm mb-3" style={{ color: '#1E293B' }}>Customer Details</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <User size={14} style={{ color: '#64748B' }} />
                                    <span style={{ color: '#64748B' }}>{order.buyer}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} style={{ color: '#64748B' }} />
                                    <span style={{ color: '#64748B' }}>{order.buyerPhone}</span>
                                  </div>
                                  <div className="flex items-start gap-2 text-sm">
                                    <MapPin size={14} className="mt-0.5" style={{ color: '#64748B' }} />
                                    <span style={{ color: '#64748B' }}>{order.address}, {order.city}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold text-sm mb-3" style={{ color: '#1E293B' }}>Order Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                      <span style={{ color: '#64748B' }}>{item.product} × {item.qty}</span>
                                      <span className="font-semibold" style={{ color: '#0D2E5E' }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 flex items-center justify-between font-bold" style={{ borderColor: '#E2E8F0' }}>
                                    <span style={{ color: '#1E293B' }}>Total</span>
                                    <span style={{ color: '#ef4136' }}>Rs. {order.total.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="p-12 text-center">
                        <Package size={48} className="mx-auto mb-4" style={{ color: '#CBD5E1' }} />
                        <p className="font-semibold text-lg mb-2" style={{ color: '#64748B' }}>No orders found</p>
                        <p className="text-sm" style={{ color: '#94A3B8' }}>Try adjusting your filters or search query</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                      <div className="text-sm" style={{ color: '#64748B' }}>
                        Showing {((ordersPage - 1) * ordersPerPage) + 1} to {Math.min(ordersPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOrdersPage(Math.max(1, ordersPage - 1))}
                          disabled={ordersPage === 1}
                          className="px-3 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (ordersPage <= 3) {
                              pageNum = i + 1;
                            } else if (ordersPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = ordersPage - 2 + i;
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => setOrdersPage(pageNum)}
                                className="w-10 h-10 rounded-lg text-sm font-semibold transition-colors"
                                style={{
                                  backgroundColor: ordersPage === pageNum ? '#ef4136' : 'transparent',
                                  color: ordersPage === pageNum ? 'white' : '#64748B'
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setOrdersPage(Math.min(totalPages, ordersPage + 1))}
                          disabled={ordersPage === totalPages}
                          className="px-3 py-2 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ─── STOCK STATUS ─── */}
          {activeSection === 'stock-status' && (
            <div className="space-y-5">
              {/* Info Banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#DBEAFE', border: '1px solid #93C5FD' }}>
                <AlertTriangle size={20} style={{ color: '#1E40AF', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#1E3A8A' }}>Quick Stock Status Update</p>
                  <p className="text-sm" style={{ color: '#1E40AF' }}>
                    Quickly mark products as in stock or out of stock. This updates product availability immediately on the marketplace.
                  </p>
                </div>
              </div>

              {/* Search & Bulk Actions */}
              <div className="bg-white rounded-2xl shadow-sm border p-4" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex flex-wrap gap-3 items-center mb-4">
                  <div className="relative flex-1 min-w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                    <input
                      type="text"
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                    />
                  </div>
                  {selectedProducts.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: '#64748B' }}>
                        {selectedProducts.length} selected
                      </span>
                      <button
                        onClick={() => handleUpdateStockStatus(selectedProducts, 'In Stock')}
                        disabled={updateStockStatusMutation.isPending}
                        className="px-4 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        <CheckCircle2 size={16} /> Mark In Stock
                      </button>
                      <button
                        onClick={() => handleUpdateStockStatus(selectedProducts, 'Out Of Stock')}
                        disabled={updateStockStatusMutation.isPending}
                        className="px-4 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        style={{ backgroundColor: '#EF4444' }}
                      >
                        <XCircle size={16} /> Mark Out of Stock
                      </button>
                    </div>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter((p: any) => (p.title || '').toLowerCase().includes(stockSearchQuery.toLowerCase()))
                    .map((product: any) => {
                      const isOutOfStock = product.stockStatus === "Out Of Stock" || product.stockStatus === null;
                      const currentStatus = isOutOfStock ? "Out Of Stock" : "In Stock";

                      return (
                        <div
                          key={product.id}
                          className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                          style={{ borderColor: '#E2E8F0' }}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts([...selectedProducts, product.id]);
                                } else {
                                  setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                }
                              }}
                              className="mt-1 accent-[#ef4136] cursor-pointer"
                            />
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Package size={24} className="text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-1 truncate" style={{ color: '#1E293B' }}>{product.title}</h4>
                              <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>SKU: {product.sku}</p>
                              <div className="flex items-center gap-2">
                                <button
                                  // onClick={() => handleUpdateStockStatus([product.id], currentStatus === 'In Stock' ? 'Out Of Stock' : 'In Stock')}
                                  disabled={updateStockStatusMutation.isPending}
                                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border-2 ${currentStatus === 'In Stock'
                                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                    }`}
                                >
                                  <div className={`w-2 h-2 rounded-full ${currentStatus === 'In Stock' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                  {currentStatus}
                                  {updateStockStatusMutation.isPending && <RefreshCw size={10} className="animate-spin ml-1" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {products.length === 0 && !productsLoading && (
                  <div className="p-12 text-center">
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No products found.</p>
                  </div>
                )}
                {productsLoading && (
                  <div className="p-12 text-center">
                    <RefreshCw size={32} className="mx-auto mb-4 animate-spin text-orange-500" />
                    <p className="text-gray-500">Loading products...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── RFQ MANAGEMENT ─── */}
          {activeSection === 'rfq' && <VendorQuotations />}

          {/* ─── SETTINGS & ONBOARDING ─── */}
          {activeSection === 'settings' && (
            <div className="max-w-6xl mx-auto space-y-6 px-2">

              {isProfileComplete ? (
                <div className="space-y-6">


                  {/* Settings Tabs */}
                  <div className="flex p-1.5 bg-gray-100 rounded-2xl overflow-x-auto custom-scrollbar">
                    {[
                      { id: 'profile', label: 'Profile Info', icon: User },
                      { id: 'shop', label: 'Shop Details', icon: Store },
                      { id: 'bank', label: 'Bank Details', icon: CreditCard },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSettingsTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${settingsTab === tab.id
                          ? 'bg-white text-[#ef4136] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        <tab.icon size={18} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-6">
                    {settingsTab === 'profile' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6" style={{ borderColor: '#E2E8F0' }}>
                          <h3 className="text-lg font-bold text-[#0D2E5E] flex items-center gap-2">
                            <User size={20} className="text-[#ef4136]" /> Personal Information
                          </h3>
                          <div className="space-y-4">
                            {[
                              { label: 'Full Name', value: currentUserDetails?.fullName, icon: User },
                              { label: 'Email Address', value: currentUserDetails?.email, icon: Mail },
                              { label: 'Phone Number', value: currentUserDetails?.phone, icon: Phone },
                              { label: 'Account Role', value: currentUserDetails?.role, icon: Shield },
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                  <item.icon size={18} className="text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                                  <p className="text-sm font-bold text-[#0D2E5E]">{item.value || 'N/A'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border shadow-sm flex flex-col items-center justify-center text-center space-y-4" style={{ borderColor: '#E2E8F0' }}>
                          <div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                            {currentUserDetails?.logo ? (
                              <img
                                src={currentUserDetails.logo}
                                alt="Logo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={48} className="text-[#ef4136]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-xl text-[#0D2E5E]">{currentUserDetails?.fullName}</h4>
                            <p className="text-sm text-gray-500">{currentUserDetails?.email}</p>
                          </div>
                          <div className="px-4 py-1.5 bg-[#0D2E5E] text-white rounded-full text-xs font-bold uppercase tracking-widest">
                            {currentUserDetails?.role} Account
                          </div>
                        </div>
                      </div>
                    )}

                    {settingsTab === 'shop' && (
                      <div className="space-y-6">
                        {/* Shop Banners */}
                        <div className="relative h-64 rounded-[40px] overflow-hidden bg-gray-200 border-4 border-white shadow-xl">
                          <img
                            src={currentUserDetails?.shopCoverImage || 'https://via.placeholder.com/1200x400'}
                            className="w-full h-full object-cover"
                            alt="Cover"
                          />
                          <div className="absolute bottom-6 left-6 flex items-end gap-6">
                            <div className="w-32 h-32 rounded-[24px] border-4 border-white shadow-2xl overflow-hidden bg-white">
                              <img
                                src={currentUserDetails?.logo || 'https://via.placeholder.com/200'}
                                className="w-full h-full object-cover"
                                alt="Logo"
                              />
                            </div>
                            <div className="mb-2">
                              <h4 className="text-2xl font-black text-white drop-shadow-lg">{currentUserDetails?.shopName}</h4>
                              <p className="text-white/90 font-bold flex items-center gap-1 drop-shadow-md">
                                <MapPin size={16} /> {currentUserDetails?.businessAddress || 'Location not set'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-2xl border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Account Type</p>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Tag size={18} />
                              </div>
                              <span className="font-bold text-[#0D2E5E] text-sm capitalize">{currentUserDetails?.accountType}</span>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Member Since</p>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                <Calendar size={18} />
                              </div>
                              <span className="font-bold text-[#0D2E5E] text-sm">
                                {new Date(currentUserDetails?.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Profile Status</p>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                <Zap size={18} />
                              </div>
                              <span className="font-bold text-[#0D2E5E] text-sm">
                                {currentUserDetails?.isProfileComplete ? '100% Complete' : 'Profile Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {settingsTab === 'bank' && (
                      <div className="space-y-6">
                        {/* Virtual Banking Card Preview */}
                        <div className="relative overflow-hidden bg-[#0D2E5E] rounded-[40px] p-8 md:p-10 text-white shadow-2xl">
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-20 -mb-20 blur-2xl" />

                          <div className="relative flex flex-col md:flex-row justify-between gap-8">
                            <div className="flex-1 space-y-10">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                  <Building2 size={24} className="text-white/80" />
                                </div>
                                <div>
                                  <p className="text-white/60 text-[9px] font-bold uppercase tracking-[1.5px]">Banking Profile</p>
                                  <h3 className="text-lg font-bold">{currentUserDetails?.accountTitle || 'Direct Deposit'}</h3>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[2px] mb-2">Account Identification</p>
                                  <div className="flex items-center gap-4">
                                    <p className="text-base md:text-lg font-mono tracking-[3px] font-medium">
                                      {currentUserDetails?.ibanNumber ?
                                        currentUserDetails.ibanNumber.match(/.{1,4}/g)?.join(' ') :
                                        '•••• •••• •••• ••••'
                                      }
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-8 md:gap-12">
                                  <div>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[2px] mb-1">Account Title</p>
                                    <p className="font-bold text-sm md:text-base">{currentUserDetails?.accountTitle || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[2px] mb-1">Branch Code</p>
                                    <p className="font-bold text-sm md:text-base">{currentUserDetails?.branchCode || 'N/A'}</p>
                                  </div>
                                  <div className="hidden lg:block">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[2px] mb-1">Status</p>
                                    <div className={`flex items-center gap-1.5 font-bold text-xs ${currentUserDetails?.isApproved === 'Approved' ? 'text-green-400' : 'text-orange-400'}`}>
                                      {currentUserDetails?.isApproved === 'Approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                      {currentUserDetails?.isApproved === 'Approved' ? 'VERIFIED' : 'PENDING'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex md:flex-col justify-between items-end">
                              <div className="w-16 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20">
                                <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">Secure</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <p className="text-white/30 text-[8px] font-bold mb-1 uppercase">Vendor Network</p>
                                <div className="text-xl font-black italic tracking-tighter opacity-80">
                                  B<span className="text-orange-500">HUB</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Information Grid */}
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
                          <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-[#0D2E5E]">Bank Details Summary</h4>
                              <p className="text-xs text-gray-400 font-medium tracking-wide">Detailed view of your registered banking credentials</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                              { label: 'Beneficiary Name', value: currentUserDetails?.accountTitle, icon: User, color: 'text-blue-500' },
                              { label: 'Banking Branch / Code', value: currentUserDetails?.branchCode, icon: MapPin, color: 'text-orange-500' },
                              { label: 'Account Number', value: currentUserDetails?.accountNumber, icon: CreditCard, color: 'text-purple-500' },
                              { label: 'International Format (IBAN)', value: currentUserDetails?.ibanNumber, icon: Globe, color: 'text-green-500' },
                            ].map((item, idx) => (
                              <div key={idx} className="group">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className={`p-1.5 rounded-lg bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}>
                                    <item.icon size={14} />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 uppercase">{item.label}</span>
                                </div>
                                <div className="relative">
                                  <p className="text-sm font-semibold text-[#0D2E5E] leading-snug">{item.value || 'Not provided'}</p>
                                  <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-orange-500 group-hover:w-full transition-all duration-300" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress Stepper */}
                  <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center gap-2">
                      {[
                        { key: 'store', label: 'Store Setup' },
                        { key: 'documents', label: 'Documents' },
                        { key: 'subscription', label: 'Subscription' },
                        { key: 'payment', label: 'Payment' },
                      ].map((s, idx) => (
                        <div key={s.key} className="flex items-center gap-2 flex-1">
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                              style={{
                                backgroundColor: idx <= onboardingStepIdx ? '#0D2E5E' : '#F1F5F9',
                                color: idx <= onboardingStepIdx ? 'white' : '#94A3B8',
                                border: idx <= onboardingStepIdx ? 'none' : '2px solid #E2E8F0'
                              }}
                            >
                              {idx < onboardingStepIdx ? <CheckCircle2 size={20} /> : idx + 1}
                            </div>
                            <span className="text-xs font-semibold text-center" style={{ color: idx <= onboardingStepIdx ? '#0D2E5E' : '#94A3B8' }}>{s.label}</span>
                          </div>
                          {idx < 3 && (
                            <div className="h-1 flex-1 mx-2 rounded-full" style={{ backgroundColor: idx < onboardingStepIdx ? '#0D2E5E' : '#F1F5F9' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── STEP 1: Store Setup ─── */}
                  {onboardingStep === 'store' && (
                    <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                          <Store size={20} style={{ color: '#0D2E5E' }} />
                        </div>
                        <div>
                          <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Store Setup</h2>
                          <p className="text-sm" style={{ color: '#64748B' }}>Tell us about your business</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Shop Name *</label>
                          <input
                            type="text"
                            value={storeForm.shopName}
                            onChange={(e) => setStoreForm({ ...storeForm, shopName: e.target.value })}
                            placeholder="e.g. Ahmed Building Materials"
                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                            style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: '#334155' }}>Shop Logo</label>
                            <input
                              type="file"
                              id="logo-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setStoreForm({ ...storeForm, logo: file });
                              }}
                            />
                            <div
                              onClick={() => document.getElementById('logo-upload')?.click()}
                              className="group relative border-2 border-dashed rounded-[32px] p-2 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300"
                              style={{
                                borderColor: storeForm.logo ? '#10B981' : '#E2E8F0',
                                backgroundColor: '#F8FAFC',
                                minHeight: '240px'
                              }}
                            >
                              {storeForm.logo ? (
                                <div className="relative w-full h-full flex flex-col items-center p-4">
                                  <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-4 transition-transform group-hover:scale-105 duration-300">
                                    <img
                                      src={URL.createObjectURL(storeForm.logo)}
                                      alt="Logo preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="bg-[#10B981]/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#10B981]" />
                                    <span className="text-xs font-bold text-[#065F46]">Logo Selected</span>
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[30px]">
                                    <p className="text-white font-bold text-sm">Change Logo</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center p-8">
                                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                                    <Camera size={32} className="text-[#94A3B8] group-hover:text-[#0D2E5E] transition-colors" />
                                  </div>
                                  <p className="font-bold text-gray-700 mb-1">Click to upload logo</p>
                                  <p className="text-xs text-gray-400">Recommended: 400x400px (1:1)</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-3" style={{ color: '#334155' }}>Shop Cover Image</label>
                            <input
                              type="file"
                              id="cover-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setStoreForm({ ...storeForm, shopCoverImage: file });
                              }}
                            />
                            <div
                              onClick={() => document.getElementById('cover-upload')?.click()}
                              className="group relative border-2 border-dashed rounded-[32px] p-2 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300"
                              style={{
                                borderColor: storeForm.shopCoverImage ? '#10B981' : '#E2E8F0',
                                backgroundColor: '#F8FAFC',
                                minHeight: '240px'
                              }}
                            >
                              {storeForm.shopCoverImage ? (
                                <div className="relative w-full h-full flex flex-col items-center p-4">
                                  <div className="w-full h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white mb-4 transition-transform group-hover:scale-[1.02] duration-300">
                                    <img
                                      src={URL.createObjectURL(storeForm.shopCoverImage)}
                                      alt="Cover preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="bg-[#10B981]/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#10B981]" />
                                    <span className="text-xs font-bold text-[#065F46]">Cover Image Selected</span>
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[30px]">
                                    <p className="text-white font-bold text-sm">Change Cover</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center p-8">
                                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                                    <Image size={32} className="text-[#94A3B8] group-hover:text-[#0D2E5E] transition-colors" />
                                  </div>
                                  <p className="font-bold text-gray-700 mb-1">Click to upload cover</p>
                                  <p className="text-xs text-gray-400">Recommended: 1200x400px (3:1)</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>CNIC Number *</label>
                            <input
                              type="text"
                              value={storeForm.cnicNumber}
                              onChange={(e) => setStoreForm({ ...storeForm, cnicNumber: e.target.value })}
                              placeholder="e.g. 42101-1234567-1"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>NTN Number (Optional)</label>
                            <input
                              type="text"
                              value={storeForm.ntnNumber}
                              onChange={(e) => setStoreForm({ ...storeForm, ntnNumber: e.target.value })}
                              placeholder="e.g. 1234567-8"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Shop Address *</label>
                            <input
                              type="text"
                              value={storeForm.address}
                              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                              placeholder="e.g. Store #4, Main Market, Lahore"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Account Type *</label>
                            <select
                              value={storeForm.accountType}
                              onChange={(e) => setStoreForm({ ...storeForm, accountType: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            >
                              <option value="retailer">Retailer</option>
                              <option value="wholesaler">Wholesaler</option>
                              <option value="manufacturer">Manufacturer</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={handleOnboardingNext}
                          disabled={businessStep3Mutation.isPending}
                          className="px-10 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                          style={{ backgroundColor: '#0D2E5E' }}
                        >
                          {businessStep3Mutation.isPending ? 'Saving...' : 'Save & Continue'} <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 2: Documents ─── */}
                  {onboardingStep === 'documents' && (
                    <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
                          <FileText size={20} style={{ color: '#16A34A' }} />
                        </div>
                        <div>
                          <h2 className="font-bold text-xl" style={{ color: '#0D2E5E' }}>Banking & Identity</h2>
                          <p className="text-sm" style={{ color: '#64748B' }}>Provide details for payments & verification</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#334155' }}>Account Title *</label>
                            <input
                              type="text"
                              value={bankForm.accountTitle}
                              onChange={(e) => setBankForm({ ...bankForm, accountTitle: e.target.value })}
                              placeholder="e.g. John Doe"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#334155' }}>Branch Code *</label>
                            <input
                              type="text"
                              value={bankForm.branchCode}
                              onChange={(e) => setBankForm({ ...bankForm, branchCode: e.target.value })}
                              placeholder="e.g. 0042"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#334155' }}>Account Number *</label>
                            <input
                              type="text"
                              value={bankForm.accountNumber}
                              onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                              placeholder="e.g. 1234567890"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#334155' }}>IBAN Number *</label>
                            <input
                              type="text"
                              value={bankForm.ibanNumber}
                              onChange={(e) => setBankForm({ ...bankForm, ibanNumber: e.target.value })}
                              placeholder="e.g. PK00 ABCD 1234 5678 9012"
                              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                              style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                        <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                          <ChevronLeft size={18} /> Back
                        </button>
                        <button
                          onClick={handleOnboardingNext}
                          disabled={documentsStep4Mutation.isPending}
                          className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#0D2E5E' }}
                        >
                          {documentsStep4Mutation.isPending ? (
                            <>Submitting... <RefreshCw size={18} className="animate-spin" /></>
                          ) : (
                            <>Submit Documents <ChevronRight size={18} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 3: Subscription ─── */}
                  {onboardingStep === 'subscription' && (
                    <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
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
                        <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                          <ChevronLeft size={18} /> Back
                        </button>
                        <button
                          onClick={() => setOnboardingStep('payment')}
                          className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#0D2E5E' }}
                        >
                          Proceed to Payment <ChevronRight size={18} />
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
                            <input type="date" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }} />
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
                        <button onClick={handleOnboardingBack} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                          <ChevronLeft size={18} /> Back
                        </button>
                        <button
                          onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            router.push('/login');
                            toast.success("Registration steps completed. Please login to continue.");
                          }}
                          className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#ef4136' }}
                        >
                          Finish Setup <CheckCircle2 size={18} />
                        </button>
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
