/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle, Truck, ShieldCheck, Landmark } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  onPlaceOrder: (orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
    transactionId?: string;
  }) => void;
  bkashNumber: string;
  nagadNumber: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discountAmount,
  deliveryFee,
  total,
  onPlaceOrder,
  bkashNumber,
  nagadNumber
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad'>('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your full name');
    if (!phone.trim()) return setError('Please enter a valid phone number');
    if (!address.trim()) return setError('Please provide a complete shipping address');

    if (paymentMethod !== 'Cash on Delivery' && !transactionId.trim()) {
      return setError(`Please enter the ${paymentMethod} payment Transaction ID (TrxID) for verification.`);
    }

    onPlaceOrder({
      name,
      email,
      phone,
      address,
      paymentMethod,
      transactionId: paymentMethod !== 'Cash on Delivery' ? transactionId : undefined
    });
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity" />

      {/* Main Container */}
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-scaleUp grid grid-cols-1 md:grid-cols-5">
        {/* Left pane: Checkout Form (3 cols) */}
        <form onSubmit={handleSubmit} className="md:col-span-3 p-6 sm:p-8 space-y-4 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-950">Shipping & Payment</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs px-3 py-2.5 rounded-xl border border-red-100 font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
              <input
                id="checkout-name"
                type="text"
                required
                placeholder="e.g. Abul Kalam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number *</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="e.g. 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="kalam@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Shipping Address *</label>
              <textarea
                id="checkout-address"
                required
                rows={2}
                placeholder="House #, Road #, Area, District (e.g., Banani, Dhaka)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-gray-800"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Payment Method *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Cash on Delivery', 'bKash', 'Nagad'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method);
                      setTransactionId('');
                    }}
                    className={`px-2 py-2.5 border rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === method
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {method === 'bKash' && <span className="text-pink-600 font-extrabold text-[10px]">bKash</span>}
                    {method === 'Nagad' && <span className="text-orange-600 font-extrabold text-[10px]">Nagad</span>}
                    {method === 'Cash on Delivery' && <span className="text-indigo-600 text-[10px]">C.O.D</span>}
                    <span className="text-[9px] text-gray-500 font-normal">{method === 'Cash on Delivery' ? 'Pay at Door' : 'Mobile Pay'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Banking Instructions */}
            {paymentMethod !== 'Cash on Delivery' && (
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-2">
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                  How to pay via {paymentMethod}:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Send money (Send Money / Cash In) of <strong className="text-indigo-600 font-bold">৳{total.toLocaleString()}</strong> to Merchant: <span className="font-mono bg-white px-1.5 py-0.5 border border-gray-200 text-indigo-900 font-bold">{paymentMethod === 'bKash' ? bkashNumber : nagadNumber}</span></li>
                  <li>Copy the Transaction ID (TrxID) from your confirmation SMS.</li>
                  <li>Input it below to verify your deposit.</li>
                </ol>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1 mt-2">Transaction ID (TrxID) *</label>
                  <input
                    id="checkout-transaction-id"
                    type="text"
                    required
                    placeholder="e.g. AX982FGH6Z"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-gray-800 bg-white uppercase"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            id="place-order-submit-btn"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm"
          >
            <CheckCircle className="w-4.5 h-4.5" />
            <span>Confirm Order — ৳{total.toLocaleString()}</span>
          </button>
        </form>

        {/* Right pane: Order Summary (2 cols) */}
        <div className="md:col-span-2 bg-gray-50/50 p-6 sm:p-8 flex flex-col justify-between rounded-r-3xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-4">
              <h3 className="font-black text-gray-900 text-sm">Order Summary</h3>
              <button
                type="button"
                onClick={onClose}
                className="hidden md:flex p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Items list */}
            <div className="space-y-3.5 max-h-[25vh] overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="flex gap-2.5 items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate" title={item.product.name}>
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800 shrink-0">
                      ৳{(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Math breakdown */}
            <div className="border-t border-gray-200/60 mt-4 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-950">৳{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Discount</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <span className="text-indigo-600 font-bold">FREE</span> : `৳${deliveryFee}`}</span>
              </div>
              <div className="border-t border-gray-200/80 pt-2 flex justify-between text-sm font-black text-gray-950">
                <span>Total</span>
                <span className="text-indigo-600 text-base">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Secure Assurances */}
          <div className="space-y-3 border-t border-gray-200/60 pt-4 mt-6">
            <div className="flex gap-2 text-[10px] text-gray-500">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <strong className="font-semibold text-gray-700">Reliable Logistics</strong>
                <p>Deliveries dispatched daily across 64 districts in Bangladesh.</p>
              </div>
            </div>
            <div className="flex gap-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <strong className="font-semibold text-gray-700">Buyer Protection</strong>
                <p>Enjoy money-back guarantee, replacements, and secure bKash refund protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
