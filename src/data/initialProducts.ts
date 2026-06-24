/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const initialProducts: Product[] = [
  // Electronics
  {
    id: 'prod-elec-1',
    name: 'BD-Phonex Smart Pro (128GB)',
    category: 'Electronics',
    description: 'A powerful smartphone crafted with an AMOLED display, 50MP triple camera, and ultra-long battery life. Optimized for local networks.',
    price: 24999,
    discountPrice: 22999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 128,
    isFeatured: true
  },
  {
    id: 'prod-elec-2',
    name: 'Wave Bass Wireless Earbuds',
    category: 'Electronics',
    description: 'Ergonomic noise-cancelling earbuds with heavy bass tuning, Bluetooth 5.3, and up to 40 hours of combined play time.',
    price: 3200,
    discountPrice: 2800,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
    rating: 4.4,
    reviewsCount: 84
  },
  {
    id: 'prod-elec-3',
    name: 'FitTrack Activ Lite Smartwatch',
    category: 'Electronics',
    description: 'Keep track of your health with heart rate monitoring, SpO2 sensor, multiple sports modes, and a gorgeous square dial.',
    price: 4500,
    stock: 3, // Low stock indicator testing!
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600',
    rating: 4.2,
    reviewsCount: 47
  },

  // Apparel
  {
    id: 'prod-app-1',
    name: 'Royal Heritage Silk Panjabi',
    category: 'Apparel',
    description: 'Handcrafted premium silk Panjabi featuring elegant embroidery on the collar and placket. Perfect for festivals and celebrations.',
    price: 5500,
    discountPrice: 4999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 64,
    isFeatured: true
  },
  {
    id: 'prod-app-2',
    name: 'Dhakai Jamdani Saree (Handloom)',
    category: 'Apparel',
    description: 'An authentic, hand-woven Jamdani Saree with intricate geometric motifs. Made by traditional weavers in Narayanganj.',
    price: 12500,
    discountPrice: 11500,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 32,
    isFeatured: true
  },
  {
    id: 'prod-app-3',
    name: 'Genuine Leather Bi-fold Wallet',
    category: 'Apparel',
    description: 'Top-grain local cowhide leather wallet with 6 card slots, a clear ID window, and dual currency compartments.',
    price: 1800,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    reviewsCount: 96
  },

  // Groceries
  {
    id: 'prod-groc-1',
    name: 'Sunderbans Organic Honey (500g)',
    category: 'Groceries',
    description: '100% raw, unfiltered honey ethically sourced from the deep forests of the Sunderbans. Packed with natural antioxidants.',
    price: 850,
    discountPrice: 750,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 150,
    isFeatured: true
  },
  {
    id: 'prod-groc-2',
    name: 'Sylhet Orthodox Black Tea (Leaf)',
    category: 'Groceries',
    description: 'Premium single-estate black tea leaves harvested from the rolling hills of Sreemangal, Sylhet. Rich flavor and deep aroma.',
    price: 380,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    reviewsCount: 78
  },
  {
    id: 'prod-groc-3',
    name: 'Rajshahi Khirshapati Mangoes (5kg)',
    category: 'Groceries',
    description: 'Freshly plucked naturally grown Khirshapati (Himsagar) mangoes straight from Rajshahi orchards. Sweet, fiberless, and juicy.',
    price: 1200,
    discountPrice: 999,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 210,
    isFeatured: true
  },

  // Home & Living
  {
    id: 'prod-home-1',
    name: 'Handcrafted Jute Rug (Diameter 4ft)',
    category: 'Home & Living',
    description: 'Eco-friendly circular rug braided from high-quality natural jute fibers. Add a rustic, earthy touch to your living room.',
    price: 2400,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 39
  },
  {
    id: 'prod-home-2',
    name: 'Teak Wood Salad Bowl Set',
    category: 'Home & Living',
    description: 'Gorgeous hand-turned bowl carved from single-piece premium teak wood. Includes two servers.',
    price: 1950,
    discountPrice: 1750,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
    rating: 4.3,
    reviewsCount: 22
  },

  // Cosmetics
  {
    id: 'prod-cosm-1',
    name: 'Cold-Pressed Coconut Hair Oil',
    category: 'Cosmetics',
    description: 'Pure, extra virgin cold-pressed coconut oil. Nourishes scalp, promotes thick hair growth, and acts as an organic moisturizer.',
    price: 450,
    stock: 4, // Low stock indicator testing!
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    reviewsCount: 52
  },
  {
    id: 'prod-cosm-2',
    name: 'Organic Aloe Vera Gel (99% Pure)',
    category: 'Cosmetics',
    description: 'Soothes sunburn, hydrates dry skin, and calms redness. Free from alcohol, artificial color, and paraben.',
    price: 350,
    discountPrice: 299,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    rating: 4.4,
    reviewsCount: 110
  }
];
