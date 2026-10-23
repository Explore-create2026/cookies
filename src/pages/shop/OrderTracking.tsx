import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../lib/orderService';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Package, Clock, Utensils, CheckCircle2, Truck, Home } from 'lucide-react';
import { format } from 'date-fns';

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
      // Optional: Set up real-time polling or listener
      const interval = setInterval(() => loadOrder(orderId), 15000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><h2 className="text-2xl font-serif text-stone-600">Order not found.</h2></div>;
  }

  const statuses: { label: OrderStatus; icon: any; description: string }[] = [
    { label: 'Order Placed', icon: Package, description: 'We have received your order.' },
    { label: 'Confirmed', icon: CheckCircle2, description: 'Order confirmed and sent to kitchen.' },
    { label: 'Preparing', icon: Utensils, description: 'Your treats are being prepared.' },
    { label: 'Ready', icon: Clock, description: order.orderType === 'Delivery' ? 'Ready for delivery.' : 'Ready for pickup!' },
    { label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way.' },
    { label: 'Delivered', icon: Home, description: 'Enjoy your treats!' },
  ];

  if (order.orderType === 'Store Pickup') {
    // Remove Out for Delivery step for Store Pickup
    statuses.splice(4, 1);
  }

  const currentStatusIndex = statuses.findIndex(s => s.label === order.status);
  const isCancelled = order.status === 'Cancelled' || order.status === 'Rejected';

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden mb-8">
          <div className="bg-stone-900 p-8 text-center text-white">
            <h1 className="text-3xl font-serif font-bold mb-2">Track Your Order</h1>
            <p className="text-stone-300 mb-6">Order ID: {order.id}</p>
            <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 font-bold text-sm tracking-widest uppercase">
              Status: {order.status}
            </div>
          </div>

          <div className="p-8">
            {isCancelled ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">Order {order.status}</h3>
                <p className="text-stone-500">Unfortunately, this order has been {order.status.toLowerCase()}. Please contact us for support.</p>
              </div>
            ) : (
              <div className="relative max-w-xl mx-auto py-8">
                {/* Timeline Line */}
                <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-stone-200 md:left-1/2 md:-ml-px"></div>
                
                <div className="space-y-12">
                  {statuses.map((s, idx) => {
                    const isCompleted = currentStatusIndex >= idx;
                    const isCurrent = currentStatusIndex === idx;
                    const Icon = s.icon;
                    
                    return (
                      <div key={s.label} className="relative flex items-center md:justify-between w-full">
                        {/* Mobile left line logic handled by absolute line above */}
                        
                        <div className={`w-1/2 hidden md:block text-right pr-12 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                          {idx % 2 === 0 ? (
                            <div>
                              <h4 className="font-bold text-stone-900 text-lg">{s.label}</h4>
                              <p className="text-sm text-stone-500 mt-1">{s.description}</p>
                            </div>
                          ) : null}
                        </div>
                        
                        <div className={`absolute left-0 md:left-1/2 -ml-3 sm:-ml-4 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${
                          isCurrent ? 'bg-amber-600 text-white scale-125' : 
                          isCompleted ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-400'
                        }`}>
                          <Icon size={isCurrent ? 18 : 16} />
                        </div>
                        
                        <div className={`pl-12 md:pl-0 md:w-1/2 ${idx % 2 !== 0 ? 'md:pl-12' : ''} ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                          <div className={idx % 2 === 0 ? "md:hidden" : ""}>
                            <h4 className="font-bold text-stone-900 text-lg">{s.label}</h4>
                            <p className="text-sm text-stone-500 mt-1">{s.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <h3 className="font-bold text-stone-900 mb-4 border-b border-stone-100 pb-3">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Date</span>
                <span className="font-medium text-stone-900">{format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Customer</span>
                <span className="font-medium text-stone-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Payment</span>
                <span className="font-medium text-stone-900">{order.paymentMethod} ({order.paymentStatus})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Method</span>
                <span className="font-medium text-stone-900">{order.orderType}</span>
              </div>
              {order.orderType === 'Delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Address</span>
                  <span className="font-medium text-stone-900 text-right max-w-[200px]">{order.deliveryAddress}, {order.city} - {order.pincode}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col">
            <h3 className="font-bold text-stone-900 mb-4 border-b border-stone-100 pb-3">Items</h3>
            <div className="flex-1 space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-stone-700">
                    <span className="font-bold text-stone-900 mr-2">{item.quantity}x</span> 
                    {item.name}
                    {item.variant !== 'Standard' && <span className="text-stone-400 block text-xs ml-6">{item.variant}</span>}
                  </span>
                  <span className="font-medium text-stone-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t border-stone-100 space-y-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery & Tax</span>
                <span>{formatCurrency(order.deliveryCharge + order.tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-stone-900">Total</span>
                <span className="text-xl font-bold text-amber-700">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
