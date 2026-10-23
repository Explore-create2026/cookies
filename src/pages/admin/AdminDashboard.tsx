import { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { getOrders } from '../../lib/orderService';
import { getProducts } from '../../lib/productService';
import { Order, Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts()
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const today = new Date();
  
  const todayOrders = orders.filter(o => isSameDay(new Date(o.createdAt), today));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => ['Order Placed', 'Confirmed', 'Preparing'].includes(o.status)).length;
  const lowStockCount = products.filter(p => p.stockQuantity <= p.lowStockThreshold).length;

  // Generate last 7 days chart data
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const dayOrders = orders.filter(o => isSameDay(new Date(o.createdAt), d));
    return {
      name: format(d, 'EEE'),
      revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: dayOrders.length
    };
  });

  if (loading) {
    return <div className="p-8 text-center text-stone-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">Dashboard Overview</h1>
        <select className="bg-white border border-stone-200 rounded-lg px-4 py-2 text-sm font-medium text-stone-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Today's Revenue</p>
            <p className="text-2xl font-bold text-stone-900">{formatCurrency(todayRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Today's Orders</p>
            <p className="text-2xl font-bold text-stone-900">{todayOrders.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Pending Orders</p>
            <p className="text-2xl font-bold text-stone-900">{pendingOrders}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-stone-900">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={3} dot={{ r: 4, fill: '#D97706', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 mb-6">Orders (Last 7 Days)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="orders" fill="#0284C7" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-y border-stone-200 text-stone-500 text-sm">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-amber-700">{order.id}</td>
                  <td className="px-6 py-4 text-stone-900">{order.customerName}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-stone-100 text-stone-700">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-500">No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
