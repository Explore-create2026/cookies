import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 50; // Free delivery over 1000
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + deliveryCharge + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-cream">
        <div className="w-24 h-24 bg-beige-mid rounded-full flex items-center justify-center mb-6 text-brown-dark opacity-60">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-brown-dark mb-2">Your cart is empty</h2>
        <p className="text-brown-dark opacity-60 mb-8 text-center max-w-md">Looks like you haven't added any sweet treats to your cart yet.</p>
        <Link to="/shop" className="px-8 py-3 bg-brown-primary text-white rounded-xl font-bold hover:bg-brown-dark transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-brown-dark mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-[32px] shadow-sm border border-beige-mid/30 overflow-hidden">
              <div className="p-6 border-b border-beige-mid/30 flex justify-between items-center hidden sm:flex">
                <span className="text-sm font-bold text-brown-accent uppercase tracking-wider">Product</span>
                <div className="flex space-x-20 text-sm font-bold text-brown-accent uppercase tracking-wider">
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
              </div>

              <ul className="divide-y divide-beige-mid/30">
                {items.map((item) => (
                  <li key={item.cartItemId} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-beige-light overflow-hidden border border-beige-mid/30">
                        {item.image ? (
                          <img src={item.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-brown-dark opacity-40"><ShoppingBag size={24}/></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link to={`/product/${item.productId}`} className="font-bold text-brown-dark hover:text-brown-accent transition-colors">{item.name}</Link>
                        <p className="text-sm text-brown-dark opacity-60 mt-1">{item.variant}</p>
                        <p className="text-sm font-bold text-brown-dark mt-1 sm:hidden">{formatCurrency(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:space-x-12">
                      <div className="flex items-center border border-beige-mid rounded-xl">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-3 py-1.5 text-brown-dark opacity-60 hover:opacity-100 hover:text-brown-primary"
                        >-</button>
                        <span className="w-8 text-center font-bold text-brown-dark text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-3 py-1.5 text-brown-dark opacity-60 hover:opacity-100 hover:text-brown-primary"
                        >+</button>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <span className="font-bold text-brown-dark hidden sm:block">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-brown-dark opacity-40 hover:opacity-100 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-beige-light/50 border-t border-beige-mid/30 flex justify-between items-center">
                <Link to="/shop" className="text-brown-accent text-sm font-bold hover:underline flex items-center">
                  Continue Shopping
                </Link>
                <button onClick={clearCart} className="text-brown-dark opacity-60 text-sm font-medium hover:text-red-600 hover:opacity-100">
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[32px] shadow-sm border border-beige-mid/30 p-6 sticky top-28">
              <h2 className="text-xl font-bold text-brown-dark mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-brown-dark opacity-80 text-sm mb-6 pb-6 border-b border-beige-mid/30">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-brown-dark opacity-100">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-medium text-brown-dark opacity-100">{deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-brown-dark opacity-100">{formatCurrency(tax)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold text-brown-dark">Total</span>
                <span className="text-2xl font-bold text-brown-primary">{formatCurrency(total)}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-brown-primary text-white rounded-2xl font-bold hover:bg-brown-dark transition-colors shadow-sm flex items-center justify-center"
              >
                Proceed to Checkout <ArrowRight size={20} className="ml-2" />
              </button>
              
              <div className="mt-4 text-center text-xs text-brown-dark opacity-40">
                Secure checkout powered by Granny's Cookies
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
