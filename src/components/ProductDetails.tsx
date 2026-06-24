/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Star, ShoppingCart, Plus, Minus, AlertCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetails({ product, onClose, onAddToCart }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div id="product-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200/80 rounded-full transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Pane */}
          <div className="bg-gray-50/50 p-6 md:p-8 flex items-center justify-center relative">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider z-10 shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-xs border border-gray-100 bg-white">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>
          </div>

          {/* Info Details Pane */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-gray-950 mt-3 tracking-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                </div>
                <span className="text-sm font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 font-medium">
                  {product.reviewsCount} verified reviews
                </span>
              </div>

              {/* Prices */}
              <div className="mt-4 flex items-baseline gap-3">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-black text-indigo-600">
                      ৳{product.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      ৳{product.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-gray-950">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mt-4 border-t border-gray-100 pt-4">
                {product.description}
              </p>

              {/* Stock Warning */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <div className="bg-red-50 text-red-700 text-xs px-3 py-2.5 rounded-xl border border-red-100 flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                    Currently sold out. Check back soon!
                  </div>
                ) : isLowStock ? (
                  <div className="bg-amber-50 text-amber-800 text-xs px-3 py-2.5 rounded-xl border border-amber-100 flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    Hurry! Only {product.stock} items remaining in our Dhaka warehouse.
                  </div>
                ) : (
                  <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
                    ✓ Available: In Stock ({product.stock} units)
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              {!isOutOfStock && (
                <div className="flex flex-col gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Select Quantity</span>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-850">{quantity}</span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart — ৳{(currentPrice * quantity).toLocaleString()}</span>
                  </button>
                </div>
              )}

              {/* Shipping/Assurance flags */}
              <div className="grid grid-cols-3 gap-3 mt-5 text-[10px] text-gray-500 text-center">
                <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-gray-700">100% Authentic</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-gray-700">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-gray-700">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
