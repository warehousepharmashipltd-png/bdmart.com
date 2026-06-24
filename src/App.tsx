/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/initialProducts';
import { Product, CartItem, Order, Category, AdminAccount } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import OrdersTracking from './components/OrdersTracking';
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Flame,
  Key
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export default function App() {
  // --- Persistent States ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bd_mart_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bd_mart_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bd_mart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('bd_mart_theme') === 'dark';
  });

  useEffect(() => {
    const root = document.getElementById('bd-mart-root');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      root?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      root?.classList.remove('dark');
    }
    localStorage.setItem('bd_mart_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- Filtering & Sorting States ---
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  // --- UI Layout & Drawer States ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  // --- Checkout Metadata Transfer ---
  const [appliedPromo, setAppliedPromo] = useState('');
  const [appliedDiscountValue, setAppliedDiscountValue] = useState(0);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Office Settings States ---
  const [promoMessage, setPromoMessage] = useState<string>(() => {
    return localStorage.getItem('bdmart_promo_message') || '🌟 Eid Special Discount! Flat 10% off on local heritage items. Use Code: EID10';
  });
  const [officeAddress, setOfficeAddress] = useState(() => {
    return localStorage.getItem('bdmart_office_address') || 'Level 4, Banani Super Market, Banani, Dhaka-1213';
  });
  const [officePhone, setOfficePhone] = useState(() => {
    return localStorage.getItem('bdmart_office_phone') || '+880 1700 998877';
  });
  const [officeEmail, setOfficeEmail] = useState(() => {
    return localStorage.getItem('bdmart_office_email') || 'warehouse.pharmashipltd@gmail.com';
  });
  const [bkashNumber, setBkashNumber] = useState(() => {
    return localStorage.getItem('bdmart_bkash_number') || '+880 1700 998877';
  });
  const [nagadNumber, setNagadNumber] = useState(() => {
    return localStorage.getItem('bdmart_nagad_number') || '+880 1700 998877';
  });
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('bdmart_admin_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const metaEnv = (import.meta as any).env || {};
    const defaultUser = metaEnv.VITE_ADMIN_USERNAME || 'admin';
    const defaultPass = metaEnv.VITE_ADMIN_PASSWORD || 'adminpassword123';
    return [
      { username: defaultUser, password: defaultPass, role: 'Admin' }
    ];
  });
  const [couriers, setCouriers] = useState<string[]>(() => {
    const saved = localStorage.getItem('bdmart_couriers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return ['Pathao', 'Steadfast', 'Paperfly', 'SA Paribahan', 'Sundarban Courier'];
  });

  const handleUpdateCouriers = (newCouriers: string[]) => {
    setCouriers(newCouriers);
    localStorage.setItem('bdmart_couriers', JSON.stringify(newCouriers));
    addToast('🚚 Courier partners database updated!', 'success');
  };

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('bd_mart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bd_mart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bd_mart_cart', JSON.stringify(cart));
  }, [cart]);

  // Keyboard shortcut listener: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
        addToast('🔑 Admin authorization required!', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Toast Trigger Helper ---
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Store Operations ---

  const handleAddToCart = (product: Product, qty: number = 1) => {
    // Check stock limit
    const existing = cart.find((item) => item.product.id === product.id);
    const totalRequested = (existing?.quantity || 0) + qty;

    if (totalRequested > product.stock) {
      addToast(`⚠️ Cannot add more. Only ${product.stock} items in stock!`, 'warning');
      return;
    }

    setCart((prevCart) => {
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });

    addToast(`🛒 Added ${qty}x "${product.name}" to cart!`, 'success');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      addToast(`⚠️ Cannot exceed stock limit of ${product.stock} units.`, 'warning');
      return;
    }

    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('🗑️ Item removed from shopping cart.');
  };

  const handleCheckoutInit = (promoCode: string, discountVal: number) => {
    setAppliedPromo(promoCode);
    setAppliedDiscountValue(discountVal);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = (orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
    transactionId?: string;
  }) => {
    // Calculators
    const subtotal = cart.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price;
      return acc + price * item.quantity;
    }, 0);

    const deliveryFee = subtotal > 5000 ? 0 : 120;
    const totalAmount = subtotal - appliedDiscountValue + deliveryFee;

    // Sequential ID generation starting from 1
    const numericalIds = orders.map((o) => {
      const num = parseInt(o.id, 10);
      return isNaN(num) ? 0 : num;
    });
    const nextId = (Math.max(0, ...numericalIds) + 1).toString();

    const newOrder: Order = {
      id: nextId,
      customerName: orderData.name,
      customerEmail: orderData.email,
      customerPhone: orderData.phone,
      shippingAddress: orderData.address,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity
      })),
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Unpaid',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Deduct stock levels in warehouse catalog
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartMatch = cart.find((item) => item.product.id === p.id);
        if (cartMatch) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartMatch.quantity)
          };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    // Clear cart
    setCart([]);
    setCheckoutOpen(false);

    addToast(`🎉 Order Placed Successfully! Your tracking ID is: ${newOrder.id}`, 'success');
    setOrdersOpen(true); // Open tracking screen so they can see order state!
  };

  // --- Admin Console Operations ---

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`📦 Successfully added "${newProduct.name}" to BD Mart listings!`, 'success');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    // Also sync product metadata inside cart if present
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updatedProduct.id ? { ...item, product: updatedProduct } : item
      )
    );
    addToast(`✏️ Updated "${updatedProduct.name}" properties.`, 'success');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast(`🗑️ Removed item from catalog listing.`);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: Order['status'],
    paymentStatus?: Order['paymentStatus'],
    courierName?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            paymentStatus: paymentStatus || o.paymentStatus,
            courierName: courierName !== undefined ? courierName : o.courierName
          };
        }
        return o;
      })
    );
    addToast(`⚙️ Order #${orderId} state transitioned to "${status}"`, 'info');
  };

  const handleResetData = () => {
    setProducts(initialProducts);
    setOrders([]);
    setCart([]);
    addToast('🔄 BD Mart catalog successfully restored to defaults!', 'success');
  };

  // --- Search & Filter Logic ---

  const filteredProducts = products
    .filter((product) => {
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(cleanSearch) ||
        product.category.toLowerCase().includes(cleanSearch) ||
        product.description.toLowerCase().includes(cleanSearch);
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'priceAsc') return priceA - priceB;
      if (sortBy === 'priceDesc') return priceB - priceA;
      return b.rating - a.rating; // default sort by rating
    });

  // Calculations for static totals
  const subtotalCart = cart.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const checkoutTotal = subtotalCart - appliedDiscountValue + (subtotalCart > 5000 || subtotalCart === 0 ? 0 : 120);

  return (
    <div id="bd-mart-root" className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased selection:bg-indigo-100 selection:text-indigo-950">
      
      {/* Toast Overlay */}
      <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl shadow-xl border flex items-center justify-between pointer-events-auto animate-scaleUp text-xs font-bold leading-relaxed ${
              t.type === 'success'
                ? 'bg-indigo-900 border-indigo-800 text-white'
                : t.type === 'warning'
                ? 'bg-amber-500 border-amber-400 text-white'
                : 'bg-gray-900 border-gray-800 text-white'
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="ml-3 text-white/60 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Main Navbar */}
      {!adminOpen && (
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartToggle={() => setCartOpen(!cartOpen)}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setAdminOpen(false); // Close admin when changing category
          }}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setAdminOpen(false); // Close admin when searching
          }}
          onAdminToggle={() => {}}
          onOrdersToggle={() => setOrdersOpen(true)}
          ordersCount={orders.length}
          isDarkMode={isDarkMode}
          onThemeToggle={() => {
            setIsDarkMode(!isDarkMode);
            addToast(`🌓 Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`, 'info');
          }}
          promoMessage={promoMessage}
        />
      )}

      {adminOpen ? (
        <main id="admin-main-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <AdminPanel
            isOpen={adminOpen}
            onClose={() => setAdminOpen(false)}
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onResetData={handleResetData}
            officeAddress={officeAddress}
            officePhone={officePhone}
            officeEmail={officeEmail}
            bkashNumber={bkashNumber}
            nagadNumber={nagadNumber}
            adminAccounts={adminAccounts}
            couriers={couriers}
            promoMessage={promoMessage}
            onUpdateOfficeContact={(addr, ph, em) => {
              setOfficeAddress(addr);
              setOfficePhone(ph);
              setOfficeEmail(em);
              localStorage.setItem('bdmart_office_address', addr);
              localStorage.setItem('bdmart_office_phone', ph);
              localStorage.setItem('bdmart_office_email', em);
              addToast('🏢 Dhaka Office settings updated successfully!', 'success');
            }}
            onUpdatePaymentNumbers={(bkash, nagad) => {
              setBkashNumber(bkash);
              setNagadNumber(nagad);
              localStorage.setItem('bdmart_bkash_number', bkash);
              localStorage.setItem('bdmart_nagad_number', nagad);
              addToast('📱 Mobile payment numbers updated!', 'success');
            }}
            onUpdateAdminAccounts={(accounts) => {
              setAdminAccounts(accounts);
              localStorage.setItem('bdmart_admin_accounts', JSON.stringify(accounts));
              addToast('👤 Admin credentials & user accounts database synchronized!', 'success');
            }}
            onUpdateCouriers={handleUpdateCouriers}
            onUpdatePromoMessage={(msg) => {
              setPromoMessage(msg);
              localStorage.setItem('bdmart_promo_message', msg);
              addToast('📢 Announcement banner message updated!', 'success');
            }}
          />
        </main>
      ) : (
        <>
          {/* Hero Welcome banner */}
          <section id="hero-banner" className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white py-12 md:py-16 px-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_40%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-7 space-y-4 md:space-y-5 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-indigo-600/80 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
                  Empowering Digital Bangladesh
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                  Genuine Products, <br />
                  Delivered <span className="text-amber-400 underline decoration-amber-400/50 decoration-wavy">Everywhere</span>.
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100/90 max-w-xl leading-relaxed">
                  Explore BD Mart's exquisite collection of heritage Jamdani sarees, traditional silk Panjabis, raw organic honey from Sunderbans, fresh garden teas, electronics, and daily essentials.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <button
                    onClick={() => setSelectedCategory('Groceries')}
                    className="bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Flame className="w-4.5 h-4.5 fill-indigo-950" />
                    <span>Shop Fresh Food</span>
                  </button>
                  <button
                    onClick={() => {
                      const target = document.getElementById('products-grid-section');
                      target?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/10 hover:bg-white/25 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all border border-white/20 cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              </div>

              {/* Quick Stats Panel visual widget */}
              <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/10 text-indigo-100 text-xs space-y-4 shadow-xl">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4.5 h-4.5 text-amber-400" />
                  BD Mart Customer Assurance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/25 p-3 rounded-2xl border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-amber-400 mb-1.5" />
                    <span className="font-bold text-white block">100% Genuine</span>
                    <span className="text-[10px] text-indigo-200">Ethically sourced local goods</span>
                  </div>
                  <div className="bg-slate-950/25 p-3 rounded-2xl border border-white/5">
                    <Truck className="w-5 h-5 text-amber-400 mb-1.5" />
                    <span className="font-bold text-white block">Fast COD</span>
                    <span className="text-[10px] text-indigo-200">Across 64 Bangladesh districts</span>
                  </div>
                </div>
                <div className="text-[10px] text-indigo-200/80 leading-relaxed border-t border-white/10 pt-3 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    <strong>Easy Tracking & Support:</strong> Track your orders in real-time by clicking the "Orders" button above or reach our dedicated Dhaka helpdesk anytime.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Storefront Area */}
          <main id="storefront-main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
            
            {/* Search header status / Sorting selector */}
            <div id="products-grid-section" className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-2">
                  <span>{selectedCategory === 'All' ? 'All Department Goods' : `${selectedCategory} Collection`}</span>
                  {searchQuery && <span className="text-xs text-gray-400 font-normal">for "{searchQuery}"</span>}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Showing {filteredProducts.length} authentic listings</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 font-medium focus:ring-1 focus:ring-indigo-600 w-full sm:w-auto"
                >
                  <option value="rating">Top Rated & Popular</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Empty Catalog State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-xs max-w-md mx-auto">
                <div className="p-4 bg-gray-50 rounded-full text-gray-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">No matches found</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  We couldn't find any products matching category and filter tags. Check spelling, remove search queries, or clear category pills!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* Footer segment */}
      <footer id="main-footer" className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900 shrink-0 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight">
              BD<span className="text-amber-400">Mart</span><span className="text-xs font-bold text-gray-500 uppercase">.com</span>
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Premium destination for handloomed Jamdanis, boutique Panjabis, tea estate selections, organic honey, and daily gadgets. Built by local artisans, shipped to your doorstep.
            </p>
            <p className="text-[10px] text-gray-600">
              &copy; {new Date().getFullYear()} BD Mart.com Ltd. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Shopping Information</h4>
            <ul className="text-xs space-y-2">
              <li><button onClick={() => setSelectedCategory('All')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Browse All Collections</button></li>
              <li><button onClick={() => setSelectedCategory('Electronics')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Electronics</button></li>
              <li><button onClick={() => setSelectedCategory('Apparel')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Handwoven Apparel</button></li>
              <li><button onClick={() => setSelectedCategory('Groceries')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Sunderban Organic Groceries</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Dhaka Office</h4>
            <ul className="text-xs space-y-2 text-gray-500">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{officeAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Hotline: {officePhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Support: {officeEmail}</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* --- Overlay Modals & Drawers --- */}

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutInit}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        subtotal={subtotalCart}
        discountAmount={appliedDiscountValue}
        deliveryFee={subtotalCart > 5000 || subtotalCart === 0 ? 0 : 120}
        total={checkoutTotal}
        onPlaceOrder={handlePlaceOrder}
        bkashNumber={bkashNumber}
        nagadNumber={nagadNumber}
      />

      {/* Orders Tracking Screen */}
      <OrdersTracking
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        orders={orders}
      />

    </div>
  );
}
