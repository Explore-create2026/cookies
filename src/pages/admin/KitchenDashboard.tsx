import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../lib/orderService';
import { Order } from '../../types';
import { Clock, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // In a real app, we might want to poll or use Firebase real-time listeners here.
    const interval = setInterval(loadOrders, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await getOrders();
      // Only keep active kitchen orders
      const kitchenOrders = allOrders.filter(o => 
        ['Confirmed', 'Preparing', 'Ready'].includes(o.status)
      );
      setOrders(kitchenOrders);
    } catch (error) {
      console.error("Failed to load kitchen orders", error);
    } finally {
      setLoading(false);
    }
  };

  const moveToNextStatus = async (order: Order) => {
    let newStatus: Order['status'] = 'Preparing';
    if (order.status === 'Confirmed') newStatus = 'Preparing';
    else if (order.status === 'Preparing') newStatus = 'Ready';
    
    if (newStatus !== order.status) {
      await updateOrderStatus(order.id, newStatus);
      loadOrders();
    }
  };

  const confirmedOrders = orders.filter(o => o.status === 'Confirmed');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  const readyOrders = orders.filter(o => o.status === 'Ready');

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
      <div className="flex justify-between items-start mb-3 border-b border-stone-100 pb-3">
        <div>
          <h3 className="font-bold text-lg text-amber-700">{order.id}</h3>
          <p className="text-sm text-stone-500 flex items-center mt-1">
            <Clock size={14} className="mr-1" /> {format(new Date(order.createdAt), 'HH:mm')}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${order.orderType === 'Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {order.orderType}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="font-medium text-stone-900">{item.quantity}x {item.name}</span>
            <span className="text-stone-500 text-xs">{item.variant}</span>
          </div>
        ))}
      </div>

      {order.cakeMessage && (
        <div className="bg-amber-50 p-2 rounded text-sm text-amber-800 mb-3 border border-amber-200">
          <span className="font-bold text-xs uppercase tracking-wider block mb-1">Message on cake:</span>
          "{order.cakeMessage}"
        </div>
      )}

      {order.specialInstructions && (
        <div className="bg-red-50 p-2 rounded text-sm text-red-800 mb-4 border border-red-200 flex items-start">
          <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
          <span>{order.specialInstructions}</span>
        </div>
      )}

      <button
        onClick={() => moveToNextStatus(order)}
        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors flex justify-center items-center ${
          order.status === 'Confirmed' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
          order.status === 'Preparing' ? 'bg-orange-500 text-white hover:bg-orange-600' :
          'bg-stone-100 text-stone-400 cursor-default'
        }`}
        disabled={order.status === 'Ready'}
      >
        {order.status === 'Confirmed' && <><ChefHat size={16} className="mr-2"/> Start Preparing</>}
        {order.status === 'Preparing' && <><CheckCircle2 size={16} className="mr-2"/> Mark Ready</>}
        {order.status === 'Ready' && 'Waiting for Pickup/Delivery'}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center">
          <ChefHat className="mr-2 text-amber-600" /> Kitchen Orders
        </h1>
        <button onClick={loadOrders} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
          Refresh
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* NEW Column */}
        <div className="flex flex-col bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden">
          <div className="bg-stone-200 p-4 border-b border-stone-300 flex justify-between items-center">
            <h2 className="font-bold text-stone-700">NEW</h2>
            <span className="bg-stone-300 text-stone-700 text-xs font-bold px-2 py-1 rounded-full">{confirmedOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {confirmedOrders.map(order => <OrderCard key={order.id} order={order} />)}
            {confirmedOrders.length === 0 && !loading && (
              <div className="text-center text-stone-400 py-8 text-sm font-medium">No new orders</div>
            )}
          </div>
        </div>

        {/* PREPARING Column */}
        <div className="flex flex-col bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden">
          <div className="bg-amber-100 p-4 border-b border-amber-200 flex justify-between items-center">
            <h2 className="font-bold text-amber-800">PREPARING</h2>
            <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">{preparingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {preparingOrders.map(order => <OrderCard key={order.id} order={order} />)}
            {preparingOrders.length === 0 && !loading && (
              <div className="text-center text-amber-400 py-8 text-sm font-medium">No active preparation</div>
            )}
          </div>
        </div>

        {/* READY Column */}
        <div className="flex flex-col bg-green-50 rounded-2xl border border-green-200 overflow-hidden">
          <div className="bg-green-100 p-4 border-b border-green-200 flex justify-between items-center">
            <h2 className="font-bold text-green-800">READY</h2>
            <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {readyOrders.map(order => <OrderCard key={order.id} order={order} />)}
            {readyOrders.length === 0 && !loading && (
              <div className="text-center text-green-400 py-8 text-sm font-medium">No orders waiting</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
