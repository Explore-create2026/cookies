import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../../lib/productService';
import { Product, Category } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam !== null) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // In a real app, we might use algolia or firebase search for text, 
      // but here we fetch all active and filter client-side for simplicity if dataset is small
      const data = await getProducts();
      setProducts(data.filter(p => p.isAvailable));
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Cakes', 'Desserts', 'Chocolates', 'Cookies', 'Gift Hampers', 'Birthday Cakes', 'Wedding Cakes'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // prevent navigation to detail page
    if (product.variants && product.variants.length > 0) {
      // For products with variants, it's better to navigate to detail page to choose.
      // But for quick add, use first variant.
      addItem({
        productId: product.id,
        name: product.name,
        variant: product.variants[0].name,
        price: product.variants[0].price,
        quantity: 1,
        image: product.images?.[0]
      });
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        variant: 'Standard',
        price: product.basePrice,
        quantity: 1,
        image: product.images?.[0]
      });
    }
    // Could add a toast notification here
  };

  const toggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Shop Header */}
      <div className="bg-brown-primary py-16 text-center text-cream">
        <h1 className="text-4xl md:text-5xl font-serif font-bold italic mb-4">Shop</h1>
        <p className="opacity-80 max-w-xl mx-auto px-4">Browse our collection of handcrafted cakes, cookies, and chocolates.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-beige-mid/30 sticky top-28">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-dark opacity-40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-beige-mid rounded-xl text-sm focus:ring-brown-accent focus:border-brown-accent bg-cream"
                />
              </div>

              <h3 className="font-bold text-brown-dark mb-4 flex items-center"><Filter size={18} className="mr-2 opacity-60"/> Categories</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchParams(cat === 'All' ? {} : { category: cat });
                      }}
                      className={`text-left w-full text-sm py-1.5 transition-colors ${
                        selectedCategory === cat ? 'text-brown-accent font-bold' : 'text-brown-dark opacity-60 hover:opacity-100 hover:text-brown-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-[32px] p-4 animate-pulse border border-beige-mid/30">
                    <div className="aspect-square bg-beige-mid/30 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-beige-mid/30 w-2/3 mb-2 rounded"></div>
                    <div className="h-4 bg-beige-mid/30 w-1/2 mb-4 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-beige-mid/30 w-1/4 rounded"></div>
                      <div className="h-8 bg-beige-mid/30 w-1/4 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-beige-mid/30 shadow-sm">
                <p className="text-xl text-brown-dark opacity-60 mb-2">No products found.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSearchParams({})}}
                  className="text-brown-accent font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map(product => {
                  const inWishlist = isInWishlist(product.id);
                  return (
                  <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-[32px] shadow-sm border border-beige-mid/30 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="relative aspect-square bg-beige-light overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-dark opacity-40">No Image</div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isBestSeller && (
                          <span className="bg-brown-accent text-white text-xs font-bold px-2 py-1 rounded">Best Seller</span>
                        )}
                        {product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Only {product.stockQuantity} left</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => toggleWishlist(e, product)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-brown-dark opacity-100 hover:text-red-500 rounded-full transition-colors md:opacity-0 md:group-hover:opacity-100 shadow-sm"
                      >
                        <Heart size={18} className={inWishlist ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-1">{product.category}</div>
                      <h3 className="font-serif font-bold text-lg text-brown-dark mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-brown-dark opacity-60 mb-4 line-clamp-2 flex-1">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-lg font-bold text-brown-dark">
                          {formatCurrency(product.basePrice)}
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stockQuantity === 0}
                          className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center ${
                            product.stockQuantity === 0 
                              ? 'bg-beige-light text-brown-dark/40 cursor-not-allowed'
                              : 'bg-brown-primary text-white hover:bg-brown-dark'
                          }`}
                          title={product.stockQuantity === 0 ? 'Out of stock' : 'Add to cart'}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
