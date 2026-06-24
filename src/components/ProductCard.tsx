/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShoppingCart, AlertCircle, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewDetails: (product: Product) => void;
  key?: any;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-0.5 animate-pulse">
            -{discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Featured
          </span>
        )}
      </div>

      {/* Product Image */}
      <div
        onClick={() => onViewDetails(product)}
        className="aspect-square w-full overflow-hidden bg-gray-50 relative cursor-pointer group"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback if Unsplash fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
          }}
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center p-3">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Ratings */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onViewDetails(product)}
          className="font-bold text-gray-900 text-sm hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer mt-1"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Stock Alert */}
        <div className="mt-2 h-4.5">
          {isLowStock && (
            <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" /> Only {product.stock} items left!
            </span>
          )}
          {product.stock > 5 && (
            <span className="text-[10px] text-gray-400 font-medium">In Stock</span>
          )}
        </div>

        {/* Footer Area with Price & Button */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-xs line-through text-gray-400 leading-none">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-base font-black text-gray-950">
                  ৳{product.discountPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-base font-black text-gray-950">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md cursor-pointer active:scale-95'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
