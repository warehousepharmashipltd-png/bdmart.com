/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Search, ShoppingBag, Clock, CheckCircle, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrdersTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function OrdersTracking({ isOpen, onClose, orders }: OrdersTrackingProps) {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  // Filter orders by phone if specified, otherwise show all session orders
  const filteredOrders = phoneSearch.trim()
    ? orders.filter(o => o.customerPhone.includes(phoneSearch.trim()))
    : orders;

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0; // Cancelled
    }
  };

  return (
    <div id="orders-tracking-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity" />

      {/* Main Panel */}
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl relative z-10 animate-scaleUp flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-gray-950">Track Your Orders</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center shrink-0">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="tel"
              placeholder="Search by your checkout Phone Number..."
              value={phoneSearch}
              onChange={(e) => {
                setPhoneSearch(e.target.value);
                setSearched(true);
              }}
              className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-600 text-gray-800 font-mono"
            />
          </div>
          {phoneSearch && (
            <button
              onClick={() => {
                setPhoneSearch('');
                setSearched(false);
              }}
              className="text-xs text-gray-500 hover:text-indigo-600 font-semibold cursor-pointer whitespace-nowrap"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Orders list - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 bg-gray-100 rounded-full text-gray-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-900 text-sm">No orders found</p>
              <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                {searched
                  ? `We couldn't find any orders matching phone number "${phoneSearch}". Please check the digits and try again.`
                  : "You haven't placed any orders in this session yet. Build your cart and check out!"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const activeStep = getStatusStep(order.status);
              return (
                <div
                  key={order.id}
                  id={`tracking-card-${order.id}`}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4 relative"
                >
                  {/* Order metadata banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                    <div>
                      <span className="font-mono font-bold text-gray-950">ID: {order.id}</span>
                      <span className="text-gray-400 text-[11px] ml-2">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-indigo-100 text-indigo-800'
                        : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-850'
                        : 'bg-amber-100 text-amber-850 animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Visual Status Tracker steps (Hide if Cancelled) */}
                  {order.status !== 'Cancelled' ? (
                    <div className="py-2">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting bar */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 transition-all duration-500 z-0"
                          style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                        />

                        {/* Step items */}
                        {([
                          { step: 1, label: 'Pending', icon: Clock },
                          { step: 2, label: 'Confirmed', icon: CheckCircle },
                          { step: 3, label: 'Shipped', icon: Truck },
                          { step: 4, label: 'Delivered', icon: PackageCheck }
                        ] as const).map((s) => {
                          const StepIcon = s.icon;
                          const isCompleted = activeStep >= s.step;
                          const isActive = activeStep === s.step;
                          return (
                            <div key={s.step} className="flex flex-col items-center z-10">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                                  : 'bg-gray-100 text-gray-400 border border-gray-200'
                              } ${isActive ? 'scale-110 animate-pulse' : ''}`}>
                                <StepIcon className="w-3.5 h-3.5" />
                              </div>
                              <span className={`text-[10px] mt-1.5 font-bold tracking-tight ${
                                isCompleted ? 'text-indigo-950 font-black' : 'text-gray-400'
                              }`}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 border border-red-100">
                      <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                      <div>
                        <strong className="font-semibold block">Order Cancelled</strong>
                        <p className="text-[10px] text-red-600 mt-0.5">This order was cancelled by the administrator. Contact support for help.</p>
                      </div>
                    </div>
                  )}

                  {/* Summary math & Delivery Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100">
                    <div className="text-gray-600 space-y-1">
                      <p className="font-bold text-gray-900 uppercase tracking-wider text-[9px]">Purchased</p>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="truncate">
                          {item.productName} <strong className="text-gray-900">x{item.quantity}</strong>
                        </p>
                      ))}
                      <p className="pt-1.5 font-black text-indigo-600 border-t border-gray-100">
                        Total Payable: ৳{order.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-gray-500 space-y-1">
                      <p className="font-bold text-gray-900 uppercase tracking-wider text-[9px]">Destination Address</p>
                      <p className="text-gray-700 font-medium leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100 text-[11px]">
                        {order.shippingAddress}
                      </p>
                      <p className="text-[10px]">
                        <strong className="text-gray-400">Payment Gate:</strong> {order.paymentMethod} ({order.paymentStatus === 'Paid' ? 'Paid ✓' : 'Unpaid'})
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
