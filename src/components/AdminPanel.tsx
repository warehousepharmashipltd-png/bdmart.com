/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  TrendingUp,
  Inbox,
  CheckCircle,
  Truck,
  FolderPlus,
  HelpCircle,
  Lock,
  MapPin,
  Settings,
  FileText,
  Download,
  Printer,
  Eye,
  CheckSquare,
  Users,
  UserPlus,
  Landmark,
  Megaphone
} from 'lucide-react';
import { Product, Order, Category, AdminAccount } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus'], courierName?: string) => void;
  onResetData: () => void;
  officeAddress: string;
  officePhone: string;
  officeEmail: string;
  bkashNumber: string;
  nagadNumber: string;
  adminAccounts: AdminAccount[];
  couriers: string[];
  promoMessage: string;
  onUpdateOfficeContact: (address: string, phone: string, email: string) => void;
  onUpdatePaymentNumbers: (bkash: string, nagad: string) => void;
  onUpdateAdminAccounts: (accounts: AdminAccount[]) => void;
  onUpdateCouriers: (couriers: string[]) => void;
  onUpdatePromoMessage: (message: string) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onResetData,
  officeAddress,
  officePhone,
  officeEmail,
  bkashNumber,
  nagadNumber,
  adminAccounts,
  couriers,
  promoMessage,
  onUpdateOfficeContact,
  onUpdatePaymentNumbers,
  onUpdateAdminAccounts,
  onUpdateCouriers,
  onUpdatePromoMessage
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'invoices' | 'settings'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const currentInvoice = selectedInvoice ? (orders.find(o => o.id === selectedInvoice.id) || selectedInvoice) : null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<AdminAccount | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Electronics');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formDiscountPrice, setFormDiscountPrice] = useState<number | ''>('');
  const [formStock, setFormStock] = useState<number>(0);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const handleClose = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setUsernameInput('');
    setPasswordInput('');
    setAuthError('');
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedAccount = adminAccounts.find(
      (acc) => acc.username.trim() === usernameInput.trim() && acc.password === passwordInput
    );
    if (matchedAccount) {
      setLoggedInUser(matchedAccount);
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied: Invalid User ID or Password.');
    }
  };

  if (!isOpen) return null;

  // Render Lock Screen if not authenticated - Inline Customer-like styling
  if (!isAuthenticated) {
    return (
      <div id="admin-panel-lockscreen" className="bg-white rounded-3xl w-full max-w-md mx-auto my-8 overflow-hidden shadow-sm flex flex-col border border-gray-100 animate-scaleUp">
        {/* Padlock Icon & Secure Header */}
        <div className="px-6 py-8 bg-slate-900 text-white text-center flex flex-col items-center border-b border-slate-800 shrink-0 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-all cursor-pointer"
              title="Return to Shop"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-3">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight font-sans">Admin Authentication</h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed font-sans">
            This is a private administration system. Authorized credentials are required to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
          {authError && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs font-bold flex items-start gap-2.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block font-sans">User ID / Username</label>
            <input
              type="text"
              placeholder="Enter User ID"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-bold font-sans"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block font-sans">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-bold font-sans"
              required
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer text-center uppercase tracking-wider font-sans"
            >
              Authenticate Portal
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center font-sans"
            >
              Cancel and Exit
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Stats calculators
  const totalSales = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingSales = orders
    .filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const lowStockCount = lowStockProducts.length;

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDiscountPrice(product.discountPrice || '');
    setFormStock(product.stock);
    setFormImage(product.image);
    setFormDescription(product.description);
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Electronics');
    setFormPrice(100);
    setFormDiscountPrice('');
    setFormStock(10);
    setFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600');
    setFormDescription('');
    setIsAddingNew(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = {
      id: editingProduct?.id || `prod-custom-${Date.now()}`,
      name: formName,
      category: formCategory,
      description: formDescription,
      price: Number(formPrice),
      discountPrice: formDiscountPrice !== '' ? Number(formDiscountPrice) : undefined,
      stock: Number(formStock),
      image: formImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 1,
      isFeatured: editingProduct?.isFeatured || false
    };

    if (isAddingNew) {
      onAddProduct(productData);
      setIsAddingNew(false);
    } else if (editingProduct) {
      onUpdateProduct(productData);
      setEditingProduct(null);
    }
  };

  // Quick stock updater
  const handleQuickStockUpdate = (productId: string, newStock: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      onUpdateProduct({
        ...product,
        stock: Math.max(0, newStock)
      });
    }
  };

  return (
    <div id="admin-panel-dashboard-view" className="bg-white rounded-3xl w-full border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-scaleUp">
      
      {/* Header section */}
      <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-indigo-100">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5 font-sans">
              BD Mart <span className="text-indigo-400">Live Admin Command Portal</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-sans">Seamless catalog, order logs, and stock replenishment console</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Selection */}
      <div className="flex border-b border-gray-100 bg-slate-900/5 shrink-0 px-4 overflow-x-auto">
        {([
          { id: 'dashboard', label: 'Dashboard Stats', icon: TrendingUp },
          { id: 'products', label: 'Catalog Control', icon: Package },
          { id: 'inventory', label: 'Inventory (Stock)', icon: AlertTriangle },
          { id: 'orders', label: 'Order Pipeline', icon: ShoppingCart },
          { id: 'invoices', label: 'Invoice List', icon: FileText },
          { id: 'settings', label: 'Office Settings', icon: Settings }
        ] as const).filter(tab => tab.id !== 'settings' || loggedInUser?.role === 'Admin').map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingProduct(null);
                setIsAddingNew(false);
              }}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer font-sans ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-extrabold bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'inventory' && lowStockCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {lowStockCount}
                </span>
              )}
              {tab.id === 'orders' && orders.filter(o => o.status === 'Pending').length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {orders.filter(o => o.status === 'Pending').length}
                </span>
              )}
              {tab.id === 'invoices' && orders.filter(o => o.status !== 'Pending').length > 0 && (
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {orders.filter(o => o.status !== 'Pending').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Total Paid Sales</span>
                    <h3 className="text-2xl font-black text-gray-950 mt-1">৳{totalSales.toLocaleString()}</h3>
                    <span className="text-[10px] text-indigo-600 mt-1 block">From delivered orders</span>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Pending Checkout Value</span>
                    <h3 className="text-2xl font-black text-gray-950 mt-1">৳{pendingSales.toLocaleString()}</h3>
                    <span className="text-[10px] text-indigo-500 mt-1 block">Awaiting confirmation/shipment</span>
                  </div>
                  <div className="p-3 bg-indigo-50/50 text-indigo-700 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Total Active Products</span>
                    <h3 className="text-2xl font-black text-gray-950 mt-1">{products.length}</h3>
                    <span className="text-[10px] text-indigo-600 mt-1 block">Across 5 departments</span>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Low Stock Alert</span>
                    <h3 className="text-2xl font-black text-gray-950 mt-1">{lowStockCount}</h3>
                    <span className="text-[10px] text-red-600 font-bold mt-1 block">Requires instant fill (&le; 5 units)</span>
                  </div>
                  <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Action row & developer helpers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seed data helper */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                    Reset & System Restoration
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Need to run automated testing or clear modified items? Clicking this will restore the catalog to its high-quality default Bangladeshi products and clear any fake sales history.
                  </p>
                  <button
                    id="reset-db-btn"
                    onClick={() => {
                      if (confirm('Are you sure you want to restore default BD Mart product data? This clears any changes.')) {
                        onResetData();
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Database Defaults</span>
                  </button>
                </div>

                {/* Operations quick advice */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    Quick Operator Tips
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    - To change inventory directly, head over to the <strong className="font-semibold text-gray-700">Inventory</strong> tab and use the click triggers.
                    - To update delivery progress, toggle statuses inside the <strong className="font-semibold text-gray-700">Order Pipeline</strong> tab.
                    - Items out of stock show a beautiful "Sold Out" badge client-side and disable additional checkout attempts to guarantee buyer safety.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT (Catalog Control) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Top controls */}
              {!isAddingNew && !editingProduct && (
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Catalog has <strong className="text-indigo-600">{products.length}</strong> active products listings</span>
                  <button
                    id="add-product-btn"
                    onClick={handleAddNewClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              )}

              {/* Form Overlay for Add / Edit */}
              {(isAddingNew || editingProduct) && (
                <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-md space-y-4">
                  <h3 className="font-black text-indigo-900 text-sm pb-2 border-b border-gray-100 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4" />
                    {isAddingNew ? 'Create New Catalog Item' : `Editing ID: ${editingProduct?.id}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Sylhet Fresh Green Tea"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Category Department *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800 bg-white"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Home & Living">Home & Living</option>
                        <option value="Cosmetics">Cosmetics</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Regular Price (৳) *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Price (৳, Optional)</label>
                      <input
                        type="number"
                        min={0}
                        value={formDiscountPrice}
                        onChange={(e) => setFormDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Leave empty if no discount"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Warehouse Stock *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Product Image Link URL</label>
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Write specifications, benefits, packaging dimensions, and origins of the item."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-600 text-gray-800"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddingNew(false);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {isAddingNew ? 'Create Product' : 'Save Modifications'}
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table List */}
              {!isAddingNew && !editingProduct && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="p-4">Product Info</th>
                          <th className="p-4">Department</th>
                          <th className="p-4 text-right">Standard Price</th>
                          <th className="p-4 text-right">Promo Price</th>
                          <th className="p-4 text-center">Stock</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-gray-900 block truncate max-w-[200px]" title={product.name}>
                                  {product.name}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">{product.id}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-4 text-right font-medium">৳{product.price.toLocaleString()}</td>
                            <td className="p-4 text-right font-bold text-red-600">
                              {product.discountPrice ? `৳${product.discountPrice.toLocaleString()}` : '—'}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                product.stock === 0
                                  ? 'bg-red-50 text-red-700'
                                  : product.stock <= 5
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-indigo-50 text-indigo-700'
                              }`}>
                                {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditClick(product)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit properties"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove "${product.name}" from BD Mart catalog permanently?`)) {
                                      onDeleteProduct(product.id);
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INVENTORY CONTROL (Stock Management) */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-white p-4.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Low Stock Alerts Dashboard</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Below alerts flag products with less than or equal to 5 remaining items.</p>
                </div>
                {lowStockCount > 0 ? (
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full animate-pulse">
                    ⚠️ {lowStockCount} items need attention
                  </span>
                ) : (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full">
                    ✓ All products well-stocked
                  </span>
                )}
              </div>

              {/* Grid of stock management */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Product Details</th>
                        <th className="p-4">Department</th>
                        <th className="p-4 text-center">Current Stock</th>
                        <th className="p-4 text-center">Quick Stock Increment / Decrement</th>
                        <th className="p-4 text-center">Status Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                              <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-gray-900">{product.name}</span>
                          </td>
                          <td className="p-4 text-gray-500">{product.category}</td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min={0}
                              value={product.stock}
                              onChange={(e) => handleQuickStockUpdate(product.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-600 text-gray-950 font-bold"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleQuickStockUpdate(product.id, product.stock - 1)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickStockUpdate(product.id, product.stock + 1)}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleQuickStockUpdate(product.id, product.stock + 10)}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                              >
                                Restock (+10)
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {product.stock === 0 ? (
                              <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                                Sold Out
                              </span>
                            ) : product.stock <= 5 ? (
                              <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                                Low Stock
                              </span>
                            ) : (
                              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                                Sufficient
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS PIPELINE */}
          {activeTab === 'orders' && (() => {
            const pendingOrders = orders.filter((o) => o.status === 'Pending');
            
            const handleAcceptOrder = (orderId: string) => {
              onUpdateOrderStatus(orderId, 'Confirmed', 'Unpaid');
            };

            const handleAcceptAll = () => {
              if (pendingOrders.length === 0) return;
              if (confirm(`Are you sure you want to accept all ${pendingOrders.length} pending orders?`)) {
                pendingOrders.forEach((o) => {
                  onUpdateOrderStatus(o.id, 'Confirmed', 'Unpaid');
                });
              }
            };

            return (
              <div className="space-y-6 animate-scaleUp">
                <div className="bg-white p-4.5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Customer Orders Pipeline</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Fulfill incoming order logs and register them into the invoice repository.</p>
                  </div>
                  {pendingOrders.length > 0 && (
                    <button
                      onClick={handleAcceptAll}
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Accept All Orders</span>
                    </button>
                  )}
                </div>

                {pendingOrders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">No pending orders found</h4>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                      All customer orders have been successfully accepted and routed to the Invoice List.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4">SL</th>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Mobile Number</th>
                            <th className="p-4 text-right">Total Amount</th>
                            <th className="p-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                          {pendingOrders.map((order, idx) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4 font-bold text-gray-400">{idx + 1}</td>
                              <td className="p-4">
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md font-mono">
                                  #{order.id}
                                </span>
                              </td>
                              <td className="p-4 font-extrabold text-gray-900">{order.customerName}</td>
                              <td className="p-4 font-bold text-gray-600 font-mono">{order.customerPhone}</td>
                              <td className="p-4 text-right font-extrabold text-indigo-600">৳{order.totalAmount.toLocaleString()}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleAcceptOrder(order.id)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                                >
                                  Accept Order
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 5: INVOICE LIST */}
          {activeTab === 'invoices' && (() => {
            const acceptedOrders = orders.filter((o) => o.status !== 'Pending');

            const handleDownloadInvoice = (order: Order) => {
              const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <title>BD Mart Invoice #${order.id}</title>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 40px; background-color: #f8fafc; }
                    .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; background-color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-size: 14px; line-height: 24px; border-radius: 16px; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 24px; margin-bottom: 24px; }
                    .brand { font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: -0.025em; }
                    .invoice-title { font-size: 24px; font-weight: 900; color: #0f172a; text-align: right; }
                    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                    .section-title { font-weight: 800; text-transform: uppercase; font-size: 12px; color: #4f46e5; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; letter-spacing: 0.05em; }
                    .info-p { margin: 6px 0; font-size: 13.5px; color: #334155; }
                    table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 32px; }
                    th { background: #f1f5f9; color: #475569; font-weight: 800; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                    td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; color: #334155; }
                    .text-right { text-align: right; }
                    .summary-table { width: 300px; margin-left: auto; margin-right: 0; margin-bottom: 24px; border-top: 2px solid #f1f5f9; }
                    .summary-table td { padding: 8px 12px; border: none; font-size: 13.5px; }
                    .total-row { font-weight: 900; font-size: 18px; color: #4f46e5; border-top: 2px solid #6366f1 !important; }
                    .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
                    @media print {
                      body { padding: 0; background: none; }
                      .invoice-box { border: none; box-shadow: none; padding: 0; }
                    }
                  </style>
                </head>
                <body>
                  <div class="invoice-box">
                    <div class="header">
                      <div>
                        <div class="brand">BD Mart</div>
                        <div style="font-size: 12px; color: #475569; font-weight: bold; margin-top: 4px;">Premium Retail & Warehouse Command Desk</div>
                      </div>
                      <div>
                        <div class="invoice-title">INVOICE RECEIPT</div>
                        <div style="font-size: 14px; font-weight: 800; color: #4f46e5; margin-top: 4px; text-align: right;">Order ID: #${order.id}</div>
                        <div style="font-size: 12px; color: #64748b; text-align: right;">Placed At: ${new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div class="details-grid">
                      <div class="customer-info">
                        <div class="section-title">Customer Shipping Destination</div>
                        <div class="info-p"><strong>Customer Name:</strong> ${order.customerName}</div>
                        <div class="info-p"><strong>Mobile Number:</strong> ${order.customerPhone}</div>
                        <div class="info-p"><strong>Email Address:</strong> ${order.customerEmail || 'Not Provided'}</div>
                        <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;"><strong>Address:</strong> ${order.shippingAddress}</div>
                      </div>
                      <div class="office-info">
                        <div class="section-title">BD Mart Support Desk</div>
                        <div class="info-p"><strong>Office Location:</strong> ${officeAddress}</div>
                        <div class="info-p"><strong>Fulfillment Hotline:</strong> ${officePhone}</div>
                        <div class="info-p"><strong>Support Email:</strong> ${officeEmail}</div>
                        <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;">
                          <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
                          <strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}<br/>
                          ${order.courierName ? `<strong>Courier Partner:</strong> ${order.courierName}` : ''}
                        </div>
                      </div>
                    </div>
                    
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 40px;">SL</th>
                          <th>Item Specifications</th>
                          <th class="text-right" style="width: 120px;">Unit Price</th>
                          <th class="text-right" style="width: 60px;">Qty</th>
                          <th class="text-right" style="width: 140px;">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${order.items.map((item, idx) => `
                          <tr>
                            <td>${idx + 1}</td>
                            <td><strong>${item.productName}</strong></td>
                            <td class="text-right">৳${item.price.toLocaleString()}</td>
                            <td class="text-right">x${item.quantity}</td>
                            <td class="text-right">৳${(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                    
                    <table class="summary-table">
                      <tr>
                        <td>Subtotal Price:</td>
                        <td class="text-right">৳${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Delivery Logistics Fee:</td>
                        <td class="text-right">৳${(order.totalAmount > 5000 ? 0 : 120).toLocaleString()}</td>
                      </tr>
                      ${order.totalAmount < order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) ? `
                      <tr>
                        <td style="color: #dc2626;">Applied Promo Discount:</td>
                        <td class="text-right" style="color: #dc2626;">-৳${(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (order.totalAmount > 5000 ? 0 : 120) - order.totalAmount).toLocaleString()}</td>
                      </tr>` : ''}
                      <tr class="total-row">
                        <td>Grand Total:</td>
                        <td class="text-right">৳${order.totalAmount.toLocaleString()}</td>
                      </tr>
                    </table>
                    
                    <div class="footer">
                      <p>Thank you for shopping with BD Mart! We appreciate your trust in us.</p>
                      <p style="font-weight: bold; margin-top: 10px; color: #475569;">This is a computer-generated official store document and does not require a hand-drawn signature.</p>
                    </div>
                  </div>
                </body>
                </html>
              `;
              const blob = new Blob([htmlContent], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `BDMart_Invoice_${order.id}.html`;
              link.click();
              URL.revokeObjectURL(url);
            };

            const handlePrintInvoice = (order: Order) => {
              const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <title>BD Mart Invoice #${order.id}</title>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 40px; background-color: #f8fafc; }
                    .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; background-color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-size: 14px; line-height: 24px; border-radius: 16px; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 24px; margin-bottom: 24px; }
                    .brand { font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: -0.025em; }
                    .invoice-title { font-size: 24px; font-weight: 900; color: #0f172a; text-align: right; }
                    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                    .section-title { font-weight: 800; text-transform: uppercase; font-size: 12px; color: #4f46e5; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; letter-spacing: 0.05em; }
                    .info-p { margin: 6px 0; font-size: 13.5px; color: #334155; }
                    table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 32px; }
                    th { background: #f1f5f9; color: #475569; font-weight: 800; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                    td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; color: #334155; }
                    .text-right { text-align: right; }
                    .summary-table { width: 300px; margin-left: auto; margin-right: 0; margin-bottom: 24px; border-top: 2px solid #f1f5f9; }
                    .summary-table td { padding: 8px 12px; border: none; font-size: 13.5px; }
                    .total-row { font-weight: 900; font-size: 18px; color: #4f46e5; border-top: 2px solid #6366f1 !important; }
                    .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
                    @media print {
                      body { padding: 0; background: none; }
                      .invoice-box { border: none; box-shadow: none; padding: 0; }
                    }
                  </style>
                </head>
                <body>
                  <div class="invoice-box">
                    <div class="header">
                      <div>
                        <div class="brand">BD Mart</div>
                        <div style="font-size: 12px; color: #475569; font-weight: bold; margin-top: 4px;">Premium Retail & Warehouse Command Desk</div>
                      </div>
                      <div>
                        <div class="invoice-title">INVOICE RECEIPT</div>
                        <div style="font-size: 14px; font-weight: 800; color: #4f46e5; margin-top: 4px; text-align: right;">Order ID: #${order.id}</div>
                        <div style="font-size: 12px; color: #64748b; text-align: right;">Placed At: ${new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div class="details-grid">
                      <div class="customer-info">
                        <div class="section-title">Customer Shipping Destination</div>
                        <div class="info-p"><strong>Customer Name:</strong> ${order.customerName}</div>
                        <div class="info-p"><strong>Mobile Number:</strong> ${order.customerPhone}</div>
                        <div class="info-p"><strong>Email Address:</strong> ${order.customerEmail || 'Not Provided'}</div>
                        <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;"><strong>Address:</strong> ${order.shippingAddress}</div>
                      </div>
                      <div class="office-info">
                        <div class="section-title">BD Mart Support Desk</div>
                        <div class="info-p"><strong>Office Location:</strong> ${officeAddress}</div>
                        <div class="info-p"><strong>Fulfillment Hotline:</strong> ${officePhone}</div>
                        <div class="info-p"><strong>Support Email:</strong> ${officeEmail}</div>
                        <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;">
                          <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
                          <strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}<br/>
                          ${order.courierName ? `<strong>Courier Partner:</strong> ${order.courierName}` : ''}
                        </div>
                      </div>
                    </div>
                    
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 40px;">SL</th>
                          <th>Item Specifications</th>
                          <th class="text-right" style="width: 120px;">Unit Price</th>
                          <th class="text-right" style="width: 60px;">Qty</th>
                          <th class="text-right" style="width: 140px;">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${order.items.map((item, idx) => `
                          <tr>
                            <td>${idx + 1}</td>
                            <td><strong>${item.productName}</strong></td>
                            <td class="text-right">৳${item.price.toLocaleString()}</td>
                            <td class="text-right">x${item.quantity}</td>
                            <td class="text-right">৳${(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                    
                    <table class="summary-table">
                      <tr>
                        <td>Subtotal Price:</td>
                        <td class="text-right">৳${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Delivery Logistics Fee:</td>
                        <td class="text-right">৳${(order.totalAmount > 5000 ? 0 : 120).toLocaleString()}</td>
                      </tr>
                      ${order.totalAmount < order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) ? `
                      <tr>
                        <td style="color: #dc2626;">Applied Promo Discount:</td>
                        <td class="text-right" style="color: #dc2626;">-৳${(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (order.totalAmount > 5000 ? 0 : 120) - order.totalAmount).toLocaleString()}</td>
                      </tr>` : ''}
                      <tr class="total-row">
                        <td>Grand Total:</td>
                        <td class="text-right">৳${order.totalAmount.toLocaleString()}</td>
                      </tr>
                    </table>
                    
                    <div class="footer">
                      <p>Thank you for shopping with BD Mart! We appreciate your trust in us.</p>
                      <p style="font-weight: bold; margin-top: 10px; color: #475569;">This is a computer-generated official store document and does not require a hand-drawn signature.</p>
                    </div>
                  </div>
                </body>
                </html>
              `;
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                  printWindow.print();
                }, 500);
              }
            };

            return (
              <div className="space-y-6 animate-scaleUp">
                <div className="bg-white p-4.5 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">Official Invoice Repository</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">View details, download local receipts, or trigger physical print commands for accepted store invoices.</p>
                </div>

                {acceptedOrders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                    <div className="p-4 bg-gray-50 rounded-full text-gray-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Inbox className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">Invoice database is empty</h4>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                      Once you accept incoming orders from the Order Pipeline, their invoices will be archived and manageable here.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <th className="p-4">SL</th>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Mobile Number</th>
                            <th className="p-4 text-right">Total Amount</th>
                            <th className="p-4 text-center">Order Status</th>
                            <th className="p-4 text-center">Payment Status</th>
                            <th className="p-4 text-center">Courier Partner</th>
                            <th className="p-4 text-center">Action Buttons</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                          {acceptedOrders.map((order, idx) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4 font-bold text-gray-400">{idx + 1}</td>
                              <td className="p-4">
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md font-mono">
                                  #{order.id}
                                </span>
                              </td>
                              <td className="p-4 font-extrabold text-gray-900">{order.customerName}</td>
                              <td className="p-4 font-bold text-gray-600 font-mono">{order.customerPhone}</td>
                              <td className="p-4 text-right font-extrabold text-indigo-600">৳{order.totalAmount.toLocaleString()}</td>
                              <td className="p-4 text-center">
                                <select
                                  value={order.status}
                                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'], order.paymentStatus, order.courierName)}
                                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-hidden bg-white cursor-pointer ${
                                    order.status === 'Delivered'
                                      ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                                      : order.status === 'Cancelled'
                                      ? 'border-red-200 text-red-800 bg-red-50'
                                      : order.status === 'Shipped'
                                      ? 'border-blue-200 text-blue-800 bg-blue-50'
                                      : order.status === 'Confirmed'
                                      ? 'border-indigo-200 text-indigo-800 bg-indigo-50'
                                      : 'border-amber-200 text-amber-800 bg-amber-50'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 text-center">
                                <select
                                  value={order.paymentStatus}
                                  onChange={(e) => onUpdateOrderStatus(order.id, order.status, e.target.value as Order['paymentStatus'], order.courierName)}
                                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-hidden bg-white cursor-pointer ${
                                    order.paymentStatus === 'Paid'
                                      ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                                      : order.paymentStatus === 'Waiting'
                                      ? 'border-amber-200 text-amber-800 bg-amber-50'
                                      : 'border-red-200 text-red-800 bg-red-50'
                                  }`}
                                >
                                  <option value="Unpaid">Unpaid</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Waiting">Waiting</option>
                                </select>
                              </td>
                              <td className="p-4 text-center">
                                <select
                                  value={order.courierName || ''}
                                  onChange={(e) => onUpdateOrderStatus(order.id, order.status, order.paymentStatus, e.target.value || undefined)}
                                  className="text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-hidden bg-white cursor-pointer text-gray-800"
                                >
                                  <option value="">Select Courier</option>
                                  {couriers.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedInvoice(order)}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                    title="View Invoice Details"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View Invoice</span>
                                  </button>
                                  <button
                                    onClick={() => handleDownloadInvoice(order)}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                    title="Download HTML Receipt"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </button>
                                  <button
                                    onClick={() => handlePrintInvoice(order)}
                                    className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                    title="Print Physical Document"
                                  >
                                    <Printer className="w-3 h-3" />
                                    <span>Print</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 5: OFFICE CONFIGURATION */}
          {activeTab === 'settings' && loggedInUser?.role === 'Admin' && (
            <div className="space-y-6 animate-scaleUp">
              {/* SECURITY COMMAND CENTRE / DEPLOYMENT GUIDE */}
              <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md max-w-2xl border border-indigo-500/30">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                      GitHub & Vercel Production Security
                    </h3>
                    <p className="text-[10.5px] text-indigo-200/90 leading-relaxed font-sans">
                      This application runs inside a secure client-side sandbox environment. When deployed on static host platforms like <strong>Vercel</strong> or <strong>GitHub Pages</strong>, all modifications, user accounts, and pipeline logs are stored isolated inside each user's own browser <code>localStorage</code>.
                    </p>
                    <div className="pt-2.5 border-t border-indigo-800/50 mt-2 space-y-2">
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">How to Secure Your GitHub Source Code:</p>
                      <ul className="text-[10px] text-gray-300 list-disc pl-4 space-y-1">
                        <li><strong>Never hardcode default credentials:</strong> Customize them securely in your server settings or configuration.</li>
                        <li><strong>Vite Environment overrides active:</strong> Configure <code>VITE_ADMIN_USERNAME</code> and <code>VITE_ADMIN_PASSWORD</code> in your Vercel Dashboard to change defaults securely without exposing them in GitHub.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs">
                <h3 className="font-bold text-gray-900 text-sm">Dhaka Office & Helpdesk Configuration</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Customize the company information shown to customers in the main application footer.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const address = formData.get('address') as string;
                    const phone = formData.get('phone') as string;
                    const email = formData.get('email') as string;
                    onUpdateOfficeContact(address, phone, email);
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block font-sans">Dhaka Office Address</label>
                    <textarea
                      name="address"
                      defaultValue={officeAddress}
                      placeholder="Level 4, Banani Super Market, Banani, Dhaka-1213"
                      className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-semibold font-sans"
                      rows={3}
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">Physical office or warehouse address listed under customer support.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block font-sans">Hotline Number</label>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={officePhone}
                        placeholder="+880 1700 998877"
                        className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-bold font-sans"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block font-sans">Support Email</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={officeEmail}
                        placeholder="support@bdmart.com"
                        className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-semibold font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 uppercase tracking-wider font-sans"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Save Contact Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* PROMOTIONAL BANNER CONFIGURATION */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-2xl space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    Header Announcement Banner Message
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans font-medium">
                    Configure the custom promotional banner message shown at the top of the store homepage.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const message = (formData.get('promoMessage') as string).trim();
                    if (message) {
                      onUpdatePromoMessage(message);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block font-sans">Announcement Message</label>
                    <textarea
                      name="promoMessage"
                      defaultValue={promoMessage}
                      placeholder="🌟 Eid Special Discount! Flat 10% off on local heritage items. Use Code: EID10"
                      className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-semibold font-sans"
                      rows={2}
                      required
                    />
                    <p className="text-[10px] text-gray-400">Keep it short, clear and engaging (e.g., special events, discount codes, or shipping policies).</p>
                  </div>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 uppercase tracking-wider font-sans"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Save Banner Message</span>
                  </button>
                </form>
              </div>

              {/* PAYMENT CONFIGURATION */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-2xl">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-pink-600 animate-pulse" />
                  Mobile Payment Gateway Numbers
                </h3>
                <p className="text-[10px] text-gray-400 mb-4 font-sans">Set the custom mobile wallet numbers where clients should send money during the bKash and Nagad payment steps during checkout.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const bkash = formData.get('bkash') as string;
                    const nagad = formData.get('nagad') as string;
                    onUpdatePaymentNumbers(bkash, nagad);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block font-sans">bKash Number</label>
                      <input
                        type="text"
                        name="bkash"
                        defaultValue={bkashNumber}
                        placeholder="+880 1700 998877"
                        className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-bold font-sans"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block font-sans">Nagad Number</label>
                      <input
                        type="text"
                        name="nagad"
                        defaultValue={nagadNumber}
                        placeholder="+880 1700 998877"
                        className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-850 font-bold font-sans"
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 uppercase tracking-wider font-sans"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Update Numbers</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* COURIER PARTNERS CONFIGURATION */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-2xl space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    Courier Shipping Partners
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans">Configure custom courier service options available for assignment during order processing.</p>
                </div>

                {/* Existing couriers list */}
                <div className="flex flex-wrap gap-2">
                  {couriers.map((courier, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-gray-50 border border-gray-150 px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-800">
                      <span>{courier}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = couriers.filter((_, i) => i !== index);
                          onUpdateCouriers(updated);
                        }}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md p-0.5 transition-all cursor-pointer"
                        title="Remove Courier"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {couriers.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No couriers configured yet.</p>
                  )}
                </div>

                {/* Add Courier form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = (formData.get('courierName') as string).trim();
                    if (name) {
                      if (couriers.some(c => c.toLowerCase() === name.toLowerCase())) {
                        alert('This courier is already added!');
                        return;
                      }
                      onUpdateCouriers([...couriers, name]);
                      e.currentTarget.reset();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    name="courierName"
                    placeholder="New courier name (e.g. RedX)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-gray-850 font-bold"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 uppercase tracking-wider font-sans"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Partner</span>
                  </button>
                </form>
              </div>

              {/* ADMIN ACCOUNT AND USER CREDENTIALS MANAGEMENT */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-2xl space-y-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Administrative Accounts & Credentials
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans">Manage login credentials and system operators. Operators cannot view or modify system configuration, payment gateway settings, or admin accounts database.</p>
                </div>

                {/* Existing accounts list */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-750 block font-sans">Active User Accounts</label>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                    {adminAccounts.map((acc, index) => (
                      <div key={index} className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-950 font-sans">{acc.username}</p>
                            <div className="flex items-center gap-2 mt-0.5 font-sans">
                              <span className="font-mono text-[10px] text-gray-400">Password: {acc.password}</span>
                              <span className="text-gray-300">•</span>
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                                acc.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                              }`}>{acc.role}</span>
                            </div>
                          </div>
                        </div>
                        {/* Delete option if not own account and not only Admin */}
                        <div className="flex items-center gap-1.5">
                          {((acc.username !== loggedInUser?.username) || (adminAccounts.filter(a => a.role === 'Admin').length > 1)) && adminAccounts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete user account "${acc.username}"?`)) {
                                  const updated = adminAccounts.filter((_, i) => i !== index);
                                  onUpdateAdminAccounts(updated);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create / Edit Account Form */}
                <div className="bg-gray-50/50 p-4.5 rounded-xl border border-gray-150/60">
                  <h4 className="text-xs font-black text-gray-900 mb-3 flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                    Create or Edit Account
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const username = (formData.get('username') as string).trim();
                      const password = (formData.get('password') as string);
                      const role = formData.get('role') as 'Admin' | 'Operator';

                      if (!username || !password) return;

                      // Check if exists
                      const existingIndex = adminAccounts.findIndex(acc => acc.username.toLowerCase() === username.toLowerCase());
                      let updated = [...adminAccounts];
                      if (existingIndex > -1) {
                        // Update password & role
                        updated[existingIndex] = { username, password, role };
                        onUpdateAdminAccounts(updated);
                      } else {
                        // Create new
                        updated.push({ username, password, role });
                        onUpdateAdminAccounts(updated);
                      }
                      e.currentTarget.reset();
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Username / ID</label>
                        <input
                          type="text"
                          name="username"
                          placeholder="e.g. operator1"
                          className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-gray-850 font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Password</label>
                        <input
                          type="text"
                          name="password"
                          placeholder="Enter password"
                          className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-gray-850 font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Role Permission</label>
                        <select
                          name="role"
                          className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-gray-800 font-bold cursor-pointer"
                          required
                        >
                          <option value="Operator">Operator (Restricted Settings)</option>
                          <option value="Admin">Admin (Full Access)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-400">Tip: Submitting an existing username will update its password and role.</p>
                    <div className="pt-1 text-right">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2 px-5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 uppercase tracking-wider font-sans"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save Account</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* INVOICE DETAILS MODAL */}
        {selectedInvoice && currentInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100 animate-scaleUp">
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-extrabold text-sm tracking-tight">Invoice Receipt: #{currentInvoice.id}</span>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable/Viewable Invoice Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="text-xl font-black text-indigo-600">BD Mart</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Premium Retail & Support Services</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-500">Order ID: #{currentInvoice.id}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(currentInvoice.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-900 uppercase tracking-wider text-[9px] text-indigo-600 mb-1">Customer Destination</p>
                    <p><strong className="text-gray-400">Name:</strong> <span className="text-gray-950 font-bold">{currentInvoice.customerName}</span></p>
                    <p><strong className="text-gray-400">Phone:</strong> <span className="text-gray-950 font-bold font-mono">{currentInvoice.customerPhone}</span></p>
                    <p><strong className="text-gray-400">Email:</strong> <span className="text-gray-600">{currentInvoice.customerEmail || 'Not Provided'}</span></p>
                    <p><strong className="text-gray-400">Address:</strong> <span className="text-gray-700 font-medium">{currentInvoice.shippingAddress}</span></p>
                  </div>

                  <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-gray-900 uppercase tracking-wider text-[9px] text-indigo-600 mb-1">BD Mart Desk</p>
                      <p><strong className="text-gray-400">Office:</strong> <span className="text-gray-700 font-semibold">{officeAddress}</span></p>
                      <p><strong className="text-gray-400">Hotline:</strong> <span className="text-gray-700 font-bold">{officePhone}</span></p>
                      <p><strong className="text-gray-400">Email:</strong> <span className="text-gray-700 font-semibold">{officeEmail}</span></p>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 mt-1.5 flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Order Status</span>
                        <select
                          value={currentInvoice.status}
                          onChange={(e) => onUpdateOrderStatus(currentInvoice.id, e.target.value as Order['status'], currentInvoice.paymentStatus, currentInvoice.courierName)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border focus:outline-hidden bg-white cursor-pointer ${
                            currentInvoice.status === 'Delivered'
                              ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                              : currentInvoice.status === 'Cancelled'
                              ? 'border-red-200 text-red-800 bg-red-50'
                              : currentInvoice.status === 'Shipped'
                              ? 'border-blue-200 text-blue-800 bg-blue-50'
                              : currentInvoice.status === 'Confirmed'
                              ? 'border-indigo-200 text-indigo-800 bg-indigo-50'
                              : 'border-amber-200 text-amber-800 bg-amber-50'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Payment Status</span>
                        <select
                          value={currentInvoice.paymentStatus}
                          onChange={(e) => onUpdateOrderStatus(currentInvoice.id, currentInvoice.status, e.target.value as Order['paymentStatus'], currentInvoice.courierName)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border focus:outline-hidden bg-white cursor-pointer ${
                            currentInvoice.paymentStatus === 'Paid'
                              ? 'border-emerald-200 text-emerald-800 bg-emerald-50'
                              : currentInvoice.paymentStatus === 'Waiting'
                              ? 'border-amber-200 text-amber-800 bg-amber-50'
                              : 'border-red-200 text-red-800 bg-red-50'
                          }`}
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                          <option value="Waiting">Waiting</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Courier Partner</span>
                        <select
                          value={currentInvoice.courierName || ''}
                          onChange={(e) => onUpdateOrderStatus(currentInvoice.id, currentInvoice.status, currentInvoice.paymentStatus, e.target.value || undefined)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-200 focus:outline-hidden bg-white cursor-pointer text-gray-800 font-sans"
                        >
                          <option value="">Select Courier</option>
                          {couriers.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-3">SL</th>
                        <th className="p-3">Item Description</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {currentInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-3 font-bold text-gray-900">{item.productName}</td>
                          <td className="p-3 text-right">৳{item.price.toLocaleString()}</td>
                          <td className="p-3 text-center font-bold">x{item.quantity}</td>
                          <td className="p-3 text-right font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Calculations */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-xs border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal:</span>
                      <span>৳{currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Charge:</span>
                      <span>৳{(currentInvoice.totalAmount > 5000 ? 0 : 120).toLocaleString()}</span>
                    </div>
                    {currentInvoice.totalAmount < currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) && (
                      <div className="flex justify-between text-red-600 font-semibold">
                        <span>Promo Discount:</span>
                        <span>-৳{(currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (currentInvoice.totalAmount > 5000 ? 0 : 120) - currentInvoice.totalAmount).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-gray-900 text-sm border-t border-gray-100 pt-2">
                      <span>Grand Total:</span>
                      <span className="text-indigo-600">৳{currentInvoice.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-gray-50 px-6 py-4.5 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => {
                    const htmlContent = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="utf-8">
                        <title>BD Mart Invoice #${currentInvoice.id}</title>
                        <style>
                          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 40px; background-color: #f8fafc; }
                          .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; background-color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-size: 14px; line-height: 24px; border-radius: 16px; }
                          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 24px; margin-bottom: 24px; }
                          .brand { font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: -0.025em; }
                          .invoice-title { font-size: 24px; font-weight: 900; color: #0f172a; text-align: right; }
                          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                          .section-title { font-weight: 800; text-transform: uppercase; font-size: 12px; color: #4f46e5; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; letter-spacing: 0.05em; }
                          .info-p { margin: 6px 0; font-size: 13.5px; color: #334155; }
                          table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 32px; }
                          th { background: #f1f5f9; color: #475569; font-weight: 800; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                          td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; color: #334155; }
                          .text-right { text-align: right; }
                          .summary-table { width: 300px; margin-left: auto; margin-right: 0; margin-bottom: 24px; border-top: 2px solid #f1f5f9; }
                          .summary-table td { padding: 8px 12px; border: none; font-size: 13.5px; }
                          .total-row { font-weight: 900; font-size: 18px; color: #4f46e5; border-top: 2px solid #6366f1 !important; }
                          .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
                          @media print {
                            body { padding: 0; background: none; }
                            .invoice-box { border: none; box-shadow: none; padding: 0; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="invoice-box">
                          <div class="header">
                            <div>
                              <div class="brand">BD Mart</div>
                              <div style="font-size: 12px; color: #475569; font-weight: bold; margin-top: 4px;">Premium Retail & Warehouse Command Desk</div>
                            </div>
                            <div>
                              <div class="invoice-title">INVOICE RECEIPT</div>
                              <div style="font-size: 14px; font-weight: 800; color: #4f46e5; margin-top: 4px; text-align: right;">Order ID: #${currentInvoice.id}</div>
                              <div style="font-size: 12px; color: #64748b; text-align: right;">Placed At: ${new Date(currentInvoice.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div class="details-grid">
                            <div class="customer-info">
                              <div class="section-title">Customer Shipping Destination</div>
                              <div class="info-p"><strong>Customer Name:</strong> ${currentInvoice.customerName}</div>
                              <div class="info-p"><strong>Mobile Number:</strong> ${currentInvoice.customerPhone}</div>
                              <div class="info-p"><strong>Email Address:</strong> ${currentInvoice.customerEmail || 'Not Provided'}</div>
                              <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;"><strong>Address:</strong> ${currentInvoice.shippingAddress}</div>
                            </div>
                            <div class="office-info">
                              <div class="section-title">BD Mart Support Desk</div>
                              <div class="info-p"><strong>Office Location:</strong> ${officeAddress}</div>
                              <div class="info-p"><strong>Fulfillment Hotline:</strong> ${officePhone}</div>
                              <div class="info-p"><strong>Support Email:</strong> ${officeEmail}</div>
                              <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;">
                                <strong>Payment Method:</strong> ${currentInvoice.paymentMethod}<br/>
                                <strong>Payment Status:</strong> ${currentInvoice.paymentStatus.toUpperCase()}<br/>
                                ${currentInvoice.courierName ? `<strong>Courier Partner:</strong> ${currentInvoice.courierName}<br/>` : ''}
                                <strong>Logistics Status:</strong> ${currentInvoice.status.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          
                          <table>
                            <thead>
                              <tr>
                                <th style="width: 40px;">SL</th>
                                <th>Item Specifications</th>
                                <th class="text-right" style="width: 120px;">Unit Price</th>
                                <th class="text-right" style="width: 60px;">Qty</th>
                                <th class="text-right" style="width: 140px;">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${currentInvoice.items.map((item, idx) => `
                                <tr>
                                  <td>${idx + 1}</td>
                                  <td><strong>${item.productName}</strong></td>
                                  <td class="text-right">৳${item.price.toLocaleString()}</td>
                                  <td class="text-right">x${item.quantity}</td>
                                  <td class="text-right">৳${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                          
                          <table class="summary-table">
                            <tr>
                              <td>Subtotal Price:</td>
                              <td class="text-right">৳${currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td>Delivery Logistics Fee:</td>
                              <td class="text-right">৳${(currentInvoice.totalAmount > 5000 ? 0 : 120).toLocaleString()}</td>
                            </tr>
                            ${currentInvoice.totalAmount < currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) ? `
                            <tr>
                              <td style="color: #dc2626;">Applied Promo Discount:</td>
                              <td class="text-right" style="color: #dc2626;">-৳${(currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (currentInvoice.totalAmount > 5000 ? 0 : 120) - currentInvoice.totalAmount).toLocaleString()}</td>
                            </tr>` : ''}
                            <tr class="total-row">
                              <td>Grand Total:</td>
                              <td class="text-right">৳${currentInvoice.totalAmount.toLocaleString()}</td>
                            </tr>
                          </table>
                          
                          <div class="footer">
                            <p>Thank you for shopping with BD Mart! We appreciate your trust in us.</p>
                            <p style="font-weight: bold; margin-top: 10px; color: #475569;">This is a computer-generated official store document and does not require a hand-drawn signature.</p>
                          </div>
                        </div>
                      </body>
                      </html>
                    `;
                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `BDMart_Invoice_${currentInvoice.id}.html`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={() => {
                    const htmlContent = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="utf-8">
                        <title>BD Mart Invoice #${currentInvoice.id}</title>
                        <style>
                          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 40px; background-color: #f8fafc; }
                          .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; background-color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); font-size: 14px; line-height: 24px; border-radius: 16px; }
                          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 24px; margin-bottom: 24px; }
                          .brand { font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: -0.025em; }
                          .invoice-title { font-size: 24px; font-weight: 900; color: #0f172a; text-align: right; }
                          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                          .section-title { font-weight: 800; text-transform: uppercase; font-size: 12px; color: #4f46e5; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; letter-spacing: 0.05em; }
                          .info-p { margin: 6px 0; font-size: 13.5px; color: #334155; }
                          table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 32px; }
                          th { background: #f1f5f9; color: #475569; font-weight: 800; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                          td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; color: #334155; }
                          .text-right { text-align: right; }
                          .summary-table { width: 300px; margin-left: auto; margin-right: 0; margin-bottom: 24px; border-top: 2px solid #f1f5f9; }
                          .summary-table td { padding: 8px 12px; border: none; font-size: 13.5px; }
                          .total-row { font-weight: 900; font-size: 18px; color: #4f46e5; border-top: 2px solid #6366f1 !important; }
                          .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
                          @media print {
                            body { padding: 0; background: none; }
                            .invoice-box { border: none; box-shadow: none; padding: 0; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="invoice-box">
                          <div class="header">
                            <div>
                              <div class="brand">BD Mart</div>
                              <div style="font-size: 12px; color: #475569; font-weight: bold; margin-top: 4px;">Premium Retail & Warehouse Command Desk</div>
                            </div>
                            <div>
                              <div class="invoice-title">INVOICE RECEIPT</div>
                              <div style="font-size: 14px; font-weight: 800; color: #4f46e5; margin-top: 4px; text-align: right;">Order ID: #${currentInvoice.id}</div>
                              <div style="font-size: 12px; color: #64748b; text-align: right;">Placed At: ${new Date(currentInvoice.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div class="details-grid">
                            <div class="customer-info">
                              <div class="section-title">Customer Shipping Destination</div>
                              <div class="info-p"><strong>Customer Name:</strong> ${currentInvoice.customerName}</div>
                              <div class="info-p"><strong>Mobile Number:</strong> ${currentInvoice.customerPhone}</div>
                              <div class="info-p"><strong>Email Address:</strong> ${currentInvoice.customerEmail || 'Not Provided'}</div>
                              <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;"><strong>Address:</strong> ${currentInvoice.shippingAddress}</div>
                            </div>
                            <div class="office-info">
                              <div class="section-title">BD Mart Support Desk</div>
                              <div class="info-p"><strong>Office Location:</strong> ${officeAddress}</div>
                              <div class="info-p"><strong>Fulfillment Hotline:</strong> ${officePhone}</div>
                              <div class="info-p"><strong>Support Email:</strong> ${officeEmail}</div>
                              <div class="info-p" style="margin-top: 10px; background-color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #f1f5f9;">
                                <strong>Payment Method:</strong> ${currentInvoice.paymentMethod}<br/>
                                <strong>Payment Status:</strong> ${currentInvoice.paymentStatus.toUpperCase()}<br/>
                                ${currentInvoice.courierName ? `<strong>Courier Partner:</strong> ${currentInvoice.courierName}<br/>` : ''}
                                <strong>Logistics Status:</strong> ${currentInvoice.status.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          
                          <table>
                            <thead>
                              <tr>
                                <th style="width: 40px;">SL</th>
                                <th>Item Specifications</th>
                                <th class="text-right" style="width: 120px;">Unit Price</th>
                                <th class="text-right" style="width: 60px;">Qty</th>
                                <th class="text-right" style="width: 140px;">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${currentInvoice.items.map((item, idx) => `
                                <tr>
                                  <td>${idx + 1}</td>
                                  <td><strong>${item.productName}</strong></td>
                                  <td class="text-right">৳${item.price.toLocaleString()}</td>
                                  <td class="text-right">x${item.quantity}</td>
                                  <td class="text-right">৳${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                          
                          <table class="summary-table">
                            <tr>
                              <td>Subtotal Price:</td>
                              <td class="text-right">৳${currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td>Delivery Logistics Fee:</td>
                              <td class="text-right">৳${(currentInvoice.totalAmount > 5000 ? 0 : 120).toLocaleString()}</td>
                            </tr>
                            ${currentInvoice.totalAmount < currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) ? `
                            <tr>
                              <td style="color: #dc2626;">Applied Promo Discount:</td>
                              <td class="text-right" style="color: #dc2626;">-৳${(currentInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (currentInvoice.totalAmount > 5000 ? 0 : 120) - currentInvoice.totalAmount).toLocaleString()}</td>
                            </tr>` : ''}
                            <tr class="total-row">
                              <td>Grand Total:</td>
                              <td class="text-right">৳${currentInvoice.totalAmount.toLocaleString()}</td>
                            </tr>
                          </table>
                          
                          <div class="footer">
                            <p>Thank you for shopping with BD Mart! We appreciate your trust in us.</p>
                            <p style="font-weight: bold; margin-top: 10px; color: #475569;">This is a computer-generated official store document and does not require a hand-drawn signature.</p>
                          </div>
                        </div>
                      </body>
                      </html>
                    `;
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(htmlContent);
                      printWindow.document.close();
                      printWindow.focus();
                      setTimeout(() => {
                        printWindow.print();
                      }, 500);
                    }
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
