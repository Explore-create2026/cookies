export type Role = 'Super Admin' | 'Admin' | 'Manager' | 'Kitchen Staff' | 'Sales Staff' | 'Delivery Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role | 'Customer';
  createdAt: number;
}

export interface Customer extends User {
  address?: string;
  city?: string;
  pincode?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: number;
  notes?: string;
}

export interface Staff extends User {
  joiningDate: number;
  salary: number;
  isActive: boolean;
}

export type Category = 'Birthday Cakes' | 'Wedding Cakes' | 'Anniversary Cakes' | 'Chocolate Cakes' | 'Pastries' | 'Brownies' | 'Chocolates' | 'Gift Hampers' | 'Cookies' | 'Custom Cakes';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  images: string[];
  basePrice: number;
  variants: { name: string; price: number; weight: string }[];
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  discount?: number;
  ingredients?: string[];
  preparationTime?: string; // e.g., '2 hours', '1 day'
  createdAt: number;
  updatedAt: number;
}

export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Rejected';
export type PaymentMethod = 'Cash on Delivery' | 'UPI' | 'Card' | 'Online Payment' | 'Store Payment';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string; // e.g., ORD-2026-00001
  customerId?: string; // Optional for guest checkout, though we prefer logged-in
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  city?: string;
  pincode?: string;
  landmark?: string;
  deliveryDate: string; // ISO or YYYY-MM-DD
  preferredTime?: string;
  specialInstructions?: string;
  cakeMessage?: string;
  orderType: 'Delivery' | 'Store Pickup';
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  assignedStaffId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Expense {
  id: string;
  date: number;
  category: 'Raw Materials' | 'Packaging' | 'Electricity' | 'Rent' | 'Salary' | 'Delivery' | 'Marketing' | 'Maintenance' | 'Equipment' | 'Miscellaneous';
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  vendor?: string;
  staffId?: string; // Person who recorded
  notes?: string;
  createdAt: number;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Short Duty' | 'Completed' | 'Absent';

export interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  loginTime: number;
  logoutTime?: number;
  totalWorkingHours?: number;
  status: AttendanceStatus;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  description: string;
  timestamp: number;
  recordId?: string;
}

export interface CartItem extends OrderItem {
  cartItemId: string; // unique for the cart line item
}
