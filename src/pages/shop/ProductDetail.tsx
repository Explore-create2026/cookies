import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../lib/productService';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart, Heart, ShieldCheck, Truck, Clock, Info, Wheat } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

const BUSINESS_PHONE = "919831097533"; // Ensure this matches layout

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [price, setPrice] = useState(0);

  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setLoading(true);
    try {
      const data = await getProduct(productId);
      if (data) {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].name);
          setPrice(data.variants[0].price);
        } else {
          setPrice(data.basePrice);
        }
      }
    } catch (error) {
      console.error("Failed to load product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantName: string, variantPrice: number) => {
    setSelectedVariant(variantName);
    setPrice(variantPrice);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      variant: selectedVariant || 'Standard',
      price: price,
      quantity: quantity,
      image: product.images?.[0]
    });
    
    // Optional: show a success toast here
    // For now, redirect to cart directly for simple flow
    navigate('/cart');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><h2 className="text-2xl font-serif text-stone-600">Product not found.</h2></div>;
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-brown-dark opacity-60 mb-8 font-medium">
          <span className="hover:opacity-100 hover:text-brown-accent cursor-pointer transition-opacity" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="hover:opacity-100 hover:text-brown-accent cursor-pointer transition-opacity" onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-brown-primary font-semibold opacity-100">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-beige-light rounded-[40px] overflow-hidden border border-beige-mid/30 shadow-sm">
              {product.images?.[0] ? (
                <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brown-dark opacity-40">No Image Available</div>
              )}
            </div>
            {/* Thumbnail Gallery would go here if multiple images existed */}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brown-dark mb-2">{product.name}</h1>
              <div className="text-sm font-bold text-brown-accent uppercase tracking-wider mb-4">{product.category}</div>
              <div className="text-2xl font-bold text-brown-dark">{formatCurrency(price)}</div>
            </div>

            <p className="text-brown-dark opacity-80 leading-relaxed mb-8">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-brown-dark uppercase tracking-wider mb-3">Select Size / Variant</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVariantChange(v.name, v.price)}
                      className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                        selectedVariant === v.name 
                          ? 'border-brown-accent bg-beige-light text-brown-primary shadow-sm' 
                          : 'border-beige-mid text-brown-dark opacity-80 hover:opacity-100 hover:border-brown-primary bg-white'
                      }`}
                    >
                      {v.name} - {formatCurrency(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-beige-mid/50">
              <div className="flex items-center border border-beige-mid rounded-xl bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-brown-dark opacity-60 hover:opacity-100 hover:text-brown-primary transition-colors"
                >-</button>
                <span className="w-10 text-center font-bold text-brown-dark">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-brown-dark opacity-60 hover:opacity-100 hover:text-brown-primary transition-colors"
                  disabled={quantity >= product.stockQuantity}
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className={`flex-1 flex justify-center items-center py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                  product.stockQuantity === 0 
                    ? 'bg-beige-light text-brown-dark opacity-40 cursor-not-allowed shadow-none hover:shadow-none'
                    : 'bg-brown-primary text-white hover:bg-brown-dark'
                }`}
              >
                <ShoppingCart size={20} className="mr-2" />
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button 
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className="p-4 border border-beige-mid rounded-xl text-brown-dark opacity-100 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors bg-white shadow-sm"
              >
                <Heart size={20} className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>
            
            <a 
              href={`https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(`Hello Granny's Cookies, I would like to place an order.\n\nProduct: ${product.name}\nVariant: ${selectedVariant || 'Standard'}\nQuantity: ${quantity}\nPrice: ${formatCurrency(price)}\n\nPlease confirm availability.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mb-8 py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
            >
              Order on WhatsApp
            </a>

            {/* Highlights */}
            <div className="space-y-4 text-sm text-brown-dark opacity-80 mb-8 border-b border-beige-mid/50 pb-8">
              <div className="flex items-start">
                <ShieldCheck size={20} className="text-brown-accent mr-3 flex-shrink-0" />
                <span>100% Quality Assurance. Baked fresh daily with premium ingredients.</span>
              </div>
              <div className="flex items-start">
                <Truck size={20} className="text-brown-accent mr-3 flex-shrink-0" />
                <span>Secure delivery available. Free delivery on orders above ₹1,000.</span>
              </div>
              {product.preparationTime && (
                <div className="flex items-start">
                  <Clock size={20} className="text-brown-accent mr-3 flex-shrink-0" />
                  <span>Preparation time: {product.preparationTime}</span>
                </div>
              )}
            </div>

            {/* Additional Details Accordion / Sections */}
            <div className="space-y-6">
               <div>
                  <h4 className="flex items-center text-brown-dark font-bold mb-2">
                    <Wheat size={18} className="mr-2 opacity-60" /> Ingredients
                  </h4>
                  <p className="text-sm text-brown-dark opacity-70">
                    Premium Flour, Butter, Sugar, Free-range Eggs, Baking Powder, Natural Extracts. (Specific ingredients depend on flavor chosen).
                  </p>
               </div>
               
               <div>
                  <h4 className="flex items-center text-brown-dark font-bold mb-2">
                    <Info size={18} className="mr-2 opacity-60" /> Allergen Information
                  </h4>
                  <p className="text-sm text-brown-dark opacity-70">
                    Contains Wheat, Dairy, and Eggs. May contain traces of nuts and soy. Please inform us of any severe allergies before ordering.
                  </p>
               </div>

               <div>
                  <h4 className="flex items-center text-brown-dark font-bold mb-2">
                    <Clock size={18} className="mr-2 opacity-60" /> Storage Information
                  </h4>
                  <p className="text-sm text-brown-dark opacity-70">
                    Store in a cool, dry place. For cakes with fresh cream, keep refrigerated and consume within 2-3 days.
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
