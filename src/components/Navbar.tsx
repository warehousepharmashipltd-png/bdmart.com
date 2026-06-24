/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Key, ShoppingBag, Info, Sun, Moon } from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartToggle: () => void;
  onCategoryChange: (category: Category | 'All') => void;
  selectedCategory: Category | 'All';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdminToggle: () => void;
  onOrdersToggle: () => void;
  ordersCount: number;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  promoMessage: string;
}

export default function Navbar({
  cartCount,
  onCartToggle,
  onCategoryChange,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onAdminToggle,
  onOrdersToggle,
  ordersCount,
  isDarkMode,
  onThemeToggle,
  promoMessage
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categories: (Category | 'All')[] = ['All', 'Electronics', 'Apparel', 'Groceries', 'Home & Living', 'Cosmetics'];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Promotion bar */}
      <div id="promo-banner" className="bg-slate-900 text-white text-xs px-4 py-1.5 text-center font-sans">
        <div className="font-medium animate-pulse-subtle">
          {promoMessage}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="/" className="flex items-center gap-1.5 group select-none">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center">
                BD <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform duration-300 ml-1">Mart</span>
              </span>
              <span className="hidden xs:inline-block bg-indigo-55 text-indigo-600 border border-indigo-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                .com
              </span>
            </a>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-gray-400" />
            </div>
            <input
              id="search-input-desktop"
              type="text"
              placeholder="Search products by name, brand, or details..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Quick Mobile Search toggler / Simple instructions info trigger */}
            <div className="group relative hidden lg:block">
              <button className="p-2 text-gray-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <Info className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-150 p-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Welcome to BD Mart</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your premium destination for authentic Bangladeshi goods and global essentials. Enjoy country-wide cash on delivery, secure bKash or Nagad payments, and reliable buyer protection.
                </p>
              </div>
            </div>

            {/* Dark/Light mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onThemeToggle}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
              <span className="hidden sm:inline-block text-xs font-medium text-gray-600 hover:text-indigo-600">
                {isDarkMode ? "Light" : "Dark"}
              </span>
            </button>

            {/* Orders Tracking button */}
            <button
              id="orders-toggle-btn"
              onClick={onOrdersToggle}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all flex items-center gap-1 relative"
              title="Order History"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {ordersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {ordersCount}
                </span>
              )}
              <span className="hidden sm:inline-block text-xs font-medium text-gray-600 hover:text-indigo-600">Orders</span>
            </button>

            {/* Shopping Cart button */}
            <button
              id="cart-toggle-btn"
              onClick={onCartToggle}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all flex items-center gap-1 relative"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
              <span className="hidden sm:inline-block text-xs font-medium text-gray-600 hover:text-indigo-600">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search - Visible on small screens only */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Category Pills Slider */}
        <div id="category-pills" className="hidden md:flex items-center gap-1.5 py-3 border-t border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((category) => (
            <button
              key={category}
              id={`cat-pill-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onCategoryChange(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Slide */}
      {mobileMenuOpen && (
        <div id="mobile-categories-drawer" className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-fadeIn">
          <div className="px-4 py-3 space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shop Categories</p>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
