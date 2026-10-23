import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, generateOrderId } from '../../lib/utils';
import { saveOrder } from '../../lib/orderService';
import { Order, PaymentMethod } from '../../types';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [orderType, setOrderType] = useState<'Delivery' | 'Store Pickup'>('Delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  // Prevent checkout with empty cart
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/cart');
    }
  }, [items, navigate, success]);

  const subtotal = getSubtotal();
  const deliveryCharge = orderType === 'Store Pickup' ? 0 : (subtotal > 1000 ? 0 : 50);
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharge + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newOrderId = generateOrderId();
      
      const orderData: Order = {
        id: newOrderId,
        customerId: user?.id, // undefined if guest
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        orderType,
        deliveryAddress: orderType === 'Delivery' ? address : undefined,
        city: orderType === 'Delivery' ? city : undefined,
        pincode: orderType === 'Delivery' ? pincode : undefined,
        landmark: orderType === 'Delivery' ? landmark : undefined,
        deliveryDate,
        preferredTime,
        cakeMessage,
        specialInstructions,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          variant: i.variant,
          quantity: i.quantity,
          price: i.price,
          image: i.image
        })),
        subtotal,
        deliveryCharge,
        tax,
        discount: 0,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'Pending', // Simplified: real app might handle online payment status here
        status: 'Order Placed',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await saveOrder(orderData);
      
      clearCart();
      setOrderId(newOrderId);
      setSuccess(true);
      window.scrollTo(0,0);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    if (success) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full bg-white p-10 rounded-[40px] shadow-sm border border-beige-mid/30 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-brown-dark mb-2">Order Confirmed!</h2>
            <p className="text-brown-dark opacity-60 mb-8">Thank you for your purchase. We've received your order and will begin processing it shortly.</p>
            
            <div className="bg-beige-light/50 rounded-[24px] p-4 mb-8">
              <p className="text-sm text-brown-dark opacity-60 uppercase tracking-wider font-bold mb-1">Order Number</p>
              <p className="text-2xl font-bold text-brown-primary">{orderId}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(`/track/${orderId}`)}
                className="px-6 py-3 bg-brown-primary text-white rounded-xl font-bold hover:bg-brown-dark transition-colors"
              >
                Track Order
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-beige-mid text-brown-dark rounded-xl font-bold hover:bg-beige-light/50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-brown-dark mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 space-y-8">
            
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-beige-mid/30">
              <h2 className="text-xl font-bold text-brown-dark mb-6 border-b border-beige-mid/30 pb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Full Name *</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Mobile Number *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Email Address (Optional)</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-beige-mid/30">
              <h2 className="text-xl font-bold text-brown-dark mb-6 border-b border-beige-mid/30 pb-4">Delivery Method</h2>
              
              <div className="flex space-x-4 mb-6">
                <label className={`flex-1 flex items-center justify-center p-4 border rounded-2xl cursor-pointer transition-colors ${orderType === 'Delivery' ? 'border-brown-accent bg-beige-light text-brown-primary' : 'border-beige-mid/50 bg-white text-brown-dark opacity-60 hover:opacity-100 hover:bg-beige-light/30'}`}>
                  <input type="radio" name="orderType" value="Delivery" checked={orderType === 'Delivery'} onChange={() => setOrderType('Delivery')} className="sr-only" />
                  <span className="font-bold">Home Delivery</span>
                </label>
                <label className={`flex-1 flex items-center justify-center p-4 border rounded-2xl cursor-pointer transition-colors ${orderType === 'Store Pickup' ? 'border-brown-accent bg-beige-light text-brown-primary' : 'border-beige-mid/50 bg-white text-brown-dark opacity-60 hover:opacity-100 hover:bg-beige-light/30'}`}>
                  <input type="radio" name="orderType" value="Store Pickup" checked={orderType === 'Store Pickup'} onChange={() => setOrderType('Store Pickup')} className="sr-only" />
                  <span className="font-bold">Store Pickup</span>
                </label>
              </div>

              {orderType === 'Delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-brown-dark opacity-80">Full Address *</label>
                    <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brown-dark opacity-80">City *</label>
                    <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brown-dark opacity-80">PIN Code *</label>
                    <input required type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-brown-dark opacity-80">Landmark (Optional)</label>
                    <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Date *</label>
                  <input required type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Preferred Time (Optional)</label>
                  <input type="time" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-beige-mid/30">
              <h2 className="text-xl font-bold text-brown-dark mb-6 border-b border-beige-mid/30 pb-4">Special Requests</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Message on Cake (Optional)</label>
                  <input type="text" value={cakeMessage} onChange={e => setCakeMessage(e.target.value)} placeholder="Happy Birthday..." className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brown-dark opacity-80">Special Instructions for Kitchen (Optional)</label>
                  <textarea rows={2} value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} placeholder="E.g., Less sugar, eggless if possible..." className="w-full px-3 py-2 border border-beige-mid rounded-xl focus:ring-brown-accent focus:border-brown-accent bg-cream/50" />
                </div>
              </div>
            </div>

          </div>

          <div className="lg:w-1/3 space-y-8">
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-beige-mid/30">
              <h2 className="text-xl font-bold text-brown-dark mb-6 border-b border-beige-mid/30 pb-4">Payment Method</h2>
              <div className="space-y-3">
                {['Cash on Delivery', 'UPI', 'Online Payment'].map(method => (
                  <label key={method} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method ? 'border-brown-accent bg-beige-light' : 'border-beige-mid/50 bg-white hover:bg-beige-light/30'}`}>
                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method as PaymentMethod)} className="h-4 w-4 text-brown-primary border-beige-mid focus:ring-brown-accent" />
                    <span className="ml-3 font-medium text-brown-dark">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-[32px] shadow-sm border border-beige-mid/30 p-6 sticky top-28">
              <h2 className="text-xl font-bold text-brown-dark mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 border-b border-beige-mid/30 pb-6 max-h-48 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex justify-between text-sm">
                    <span className="text-brown-dark opacity-80 truncate mr-4">{item.quantity}x {item.name}</span>
                    <span className="font-medium text-brown-dark flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-brown-dark opacity-80 text-sm mb-6 pb-6 border-b border-beige-mid/30">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-brown-dark">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-brown-dark">{deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-brown-dark">{formatCurrency(tax)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold text-brown-dark">Total</span>
                <span className="text-2xl font-bold text-brown-primary">{formatCurrency(total)}</span>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brown-primary text-white rounded-2xl font-bold hover:bg-brown-dark transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
