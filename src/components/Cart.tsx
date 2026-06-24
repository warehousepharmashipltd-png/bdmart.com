/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Trash2, Plus, Minus, Ticket, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (appliedDiscountCode: string, discountValue: number) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartProps) {
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const discountAmount = activeDiscount ? Math.round(subtotal * (activeDiscount.percent / 100)) : 0;
  const deliveryFee = subtotal > 5000 || subtotal === 0 ? 0 : 120; // Free delivery above 5000 BDT
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = () => {
    setPromoError('');
    const normalized = promoCode.trim().toUpperCase();
    if (normalized === 'EID10') {
      setActiveDiscount({ code: 'EID10', percent: 10 });
      setPromoCode('');
    } else if (normalized === 'FREE7') {
      setActiveDiscount({ code: 'FREE7', percent: 7 });
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try "EID10" for 10% off!');
    }
  };

  const handleRemovePromo = () => {
    setActiveDiscount(null);
  };

  return (
    <div id="cart-drawer-container" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity" />

      {/* Drawer panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full animate-slideLeft">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-gray-950">Shopping Cart</h2>
            <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable product items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-3/4 text-center">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 mb-4 animate-bounce">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Your cart is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                Looks like you haven't added anything to your cart yet. Explore our fresh collection and find local heritage items!
              </p>
              <button
                onClick={onClose}
                className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const productPrice = item.product.discountPrice || item.product.price;
              return (
                <div
                  key={item.product.id}
                  id={`cart-item-${item.product.id}`}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-xs transition-all relative group"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-slate-200">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs line-clamp-1 pr-4" title={item.product.name}>
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 capitalize">{item.product.category}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      {/* Price display */}
                      <span className="text-xs font-black text-gray-950">
                        ৳{productPrice.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">x {item.quantity}</span>
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5 scale-90 origin-right">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-md transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-md transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trash button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer - Totals & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/50 space-y-4">
            {/* Promo Code Input */}
            <div>
              {activeDiscount ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100/50 animate-pulse" />
                    Promo Applied: <strong className="font-bold">{activeDiscount.code}</strong> (-{activeDiscount.percent}%)
                  </span>
                  <button
                    onClick={handleRemovePromo}
                    className="text-[10px] text-red-600 hover:text-red-800 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ticket className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Coupon Code (e.g., EID10)"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError('');
                        }}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[10px] text-red-600 font-medium pl-1">{promoError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
              </div>
              {activeDiscount && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({activeDiscount.percent}%)</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-indigo-600 font-bold">FREE</strong> : `৳${deliveryFee}`}</span>
              </div>
              <div className="border-t border-gray-200/60 my-2 pt-2 flex justify-between text-sm">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="font-black text-slate-900 text-base">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              id="checkout-trigger-btn"
              onClick={() => onCheckout(activeDiscount?.code || '', discountAmount)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
