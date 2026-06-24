/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Electronics' | 'Apparel' | 'Groceries' | 'Home & Living' | 'Cosmetics';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  paymentStatus: 'Pending' | 'Paid';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface AdminAccount {
  username: string;
  password: string;
  role: 'Admin' | 'Operator';
}
