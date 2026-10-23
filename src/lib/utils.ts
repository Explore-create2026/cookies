import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const randomStr = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORD-${year}-${randomStr}`;
}
