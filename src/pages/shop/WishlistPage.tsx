import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(state => state.addItem);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Heart size={64} className="text-beige-mid mb-6" />
        <h2 className="text-2xl font-serif font-bold text-brown-dark mb-2">Your Wishlist is Empty</h2>
        <p className="text-brown-dark opacity-60 mb-8">Save your favorite cakes and treats for later!</p>
        <Link to="/shop" className="px-8 py-3 bg-brown-primary text-white rounded-full font-semibold hover:bg-brown-dark transition-colors">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-brown-dark mb-8">My Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product.id} className="bg-white rounded-[24px] overflow-hidden border border-beige-mid/50 flex flex-col">
            <div className="aspect-square relative">
              <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeItem(product.id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-accent mb-1">{product.category}</span>
              <h3 className="font-bold text-brown-dark text-lg line-clamp-1 mb-2">{product.name}</h3>
              <p className="font-semibold text-brown-dark mt-auto mb-4">₹{product.basePrice}</p>
              
              <button 
                onClick={() => addToCart(product, [], 1)}
                className="w-full py-3 bg-brown-primary text-white rounded-xl font-semibold flex items-center justify-center hover:bg-brown-dark transition-colors"
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
