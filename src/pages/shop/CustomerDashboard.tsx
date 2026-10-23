import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function CustomerDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">My Account</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-stone-900">{user?.name}</h2>
            <p className="text-stone-500 mt-1">{user?.email}</p>
            {user?.phone && <p className="text-stone-500">{user?.phone}</p>}
            <button 
              onClick={logout}
              className="mt-6 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-stone-900 mt-10 mb-4">Recent Orders</h3>
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center text-stone-500">
          No orders found yet. <a href="/shop" className="text-amber-600 hover:underline">Start shopping</a>
        </div>
      </div>
    </div>
  );
}
