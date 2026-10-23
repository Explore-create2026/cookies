import { Link } from 'react-router-dom';
import { ArrowRight, Star, Cake, ShoppingBag, Gift, Heart, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '../../lib/productService';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      variant: product.variants?.[0]?.name || 'Standard',
      quantity: 1,
      price: product.variants?.[0]?.price || product.basePrice,
      image: product.images?.[0]
    });
  };

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const chocolates = products.filter(p => p.category === 'Chocolates').slice(0, 8);
  const cookies = products.filter(p => p.category === 'Cookies').slice(0, 4);
  const cakes = products.filter(p => p.category === 'Cakes').slice(0, 4);
  const desserts = products.filter(p => p.category === 'Desserts').slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative mx-4 md:mx-8 my-6 bg-beige-mid text-brown-dark rounded-[40px] p-8 md:p-16 flex flex-col items-start overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-beige-mid z-10"></div>
          <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80" alt="Premium custom cake" className="w-full h-full object-cover rounded-l-[80px] shadow-2xl object-center" />
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center space-x-2 mb-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-beige-mid/30 shadow-sm">
            <Star className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="text-sm font-bold text-brown-dark">4.7/5 Google Rating</span>
            <span className="text-brown-dark opacity-40">|</span>
            <span className="text-sm font-medium text-brown-dark opacity-80">41+ Reviews</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brown-dark leading-tight mb-6">
            Made with Love.<br/> Baked for Your Moments.
          </h1>
          <p className="text-lg md:text-xl text-brown-primary opacity-80 mb-10">
            Freshly baked cakes, cookies, brownies and customized treats made especially for your celebrations in Behala, Kolkata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="px-8 py-4 bg-brown-primary hover:bg-brown-dark text-white rounded-full font-semibold shadow-lg transition-colors flex items-center justify-center">
              Shop Now <ShoppingBag className="ml-2" size={20} />
            </Link>
            <Link to="/custom-cake" className="px-8 py-4 bg-white/40 hover:bg-white/60 backdrop-blur-md text-brown-dark rounded-full font-semibold border border-white/20 transition-colors flex items-center justify-center">
              Customize Your Cake
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Our Favourites */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-brown-dark mb-8 text-center">Shop Our Favourites</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { name: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80' },
              { name: 'Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&q=80' },
              { name: 'Brownies', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80' },
              { name: 'Chocolates', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300&q=80' },
              { name: 'Gift Boxes', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80' },
              { name: 'Celebration Cakes', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&q=80' },
            ].map((cat) => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`} className="group flex flex-col items-center bg-white p-4 rounded-[24px] hover:shadow-md transition-all border border-beige-mid/30">
                <div className="w-full aspect-square rounded-[16px] mb-4 overflow-hidden bg-beige-light">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-brown-dark text-center text-sm md:text-base mb-2">{cat.name}</h3>
                <span className="text-xs font-semibold text-brown-accent uppercase tracking-wider group-hover:opacity-100 opacity-0 transition-opacity">Explore</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Best Sellers */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-brown-dark">Fresh From Oven</h2>
            <Link to="/shop" className="text-brown-accent text-sm font-semibold hover:opacity-80 flex items-center">
              View All <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#FDFBF7] rounded-[32px] p-4 border border-beige-mid/20 flex flex-col group">
                  <div className="w-full aspect-square bg-beige-mid/30 rounded-2xl flex items-center justify-center text-brown-dark/20 mb-4 animate-pulse">
                    <Cake size={48} />
                  </div>
                  <div className="h-4 bg-beige-mid/50 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-beige-mid/50 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="h-5 bg-beige-mid/50 rounded w-1/4 animate-pulse"></div>
                    <div className="w-8 h-8 rounded-full bg-brown-primary/20 flex items-center justify-center animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              bestSellers.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-[32px] shadow-sm border border-beige-mid/30 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative aspect-square bg-beige-light overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brown-dark opacity-40">No Image</div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-brown-dark opacity-60 hover:text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-1">{product.category}</div>
                    <h3 className="font-serif font-bold text-lg text-brown-dark mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div className="text-lg font-bold text-brown-dark">{formatCurrency(product.basePrice)}</div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-10 h-10 rounded-full bg-brown-primary text-white hover:bg-brown-dark transition-colors flex items-center justify-center"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Chocolates Menu Section */}
      <section className="py-16 bg-beige-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-primary uppercase tracking-wider mb-2">Chocolates Menu</h2>
            <div className="h-1 w-24 bg-brown-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-brown-dark opacity-80 max-w-2xl mx-auto">Explore our exquisite collection of handcrafted chocolate delights.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto bg-cream p-8 md:p-12 rounded-[40px] shadow-sm border border-beige-mid/50">
            {loading ? (
              <p className="col-span-full text-center text-brown-dark opacity-60 py-8">Loading menu...</p>
            ) : chocolates.length > 0 ? (
              chocolates.map(product => (
                <div key={product.id} className="flex justify-between items-end border-b border-beige-mid/50 pb-2 group">
                  <div className="flex-1">
                    <Link to={`/product/${product.id}`} className="font-bold text-lg text-brown-dark group-hover:text-brown-accent transition-colors">
                      {product.name.replace(' Chocolate', '')}
                    </Link>
                  </div>
                  <div className="text-brown-primary font-bold pl-4">
                    {formatCurrency(product.basePrice)}<span className="text-sm font-normal opacity-60">/pc</span>
                  </div>
                </div>
              ))
            ) : (
              [
                { id: 'c1', name: 'Dark Truffle', basePrice: 450 },
                { id: 'c2', name: 'Hazelnut Praline', basePrice: 500 },
                { id: 'c3', name: 'Orange Zest', basePrice: 400 },
                { id: 'c4', name: 'Milk Caramel', basePrice: 450 },
              ].map(product => (
                <div key={product.id} className="flex justify-between items-end border-b border-beige-mid/50 pb-2 group">
                  <div className="flex-1">
                    <span className="font-bold text-lg text-brown-dark group-hover:text-brown-accent transition-colors cursor-pointer">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-brown-primary font-bold pl-4">
                    {formatCurrency(product.basePrice)}<span className="text-sm font-normal opacity-60">/pc</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 text-center">
             <Link to="/shop?category=Chocolates" className="inline-flex items-center text-brown-accent font-bold hover:opacity-80">
               View All Chocolates <ArrowRight size={16} className="ml-2" />
             </Link>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-24 relative overflow-hidden bg-[#FDFBF7]">
        {/* Parallax Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-5 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1600&q=80')" }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-dark mb-4">Sweeten Every Celebration</h2>
            <div className="h-1 w-24 bg-brown-accent mx-auto rounded-full"></div>
            <p className="mt-4 text-brown-dark opacity-80 max-w-2xl mx-auto">From intimate birthdays to grand weddings, we have the perfect treat for every milestone.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "Birthdays", image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=500&q=80", link: "/shop?category=Birthday Cakes" },
              { title: "Anniversaries", image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80", link: "/shop?category=Wedding Cakes" },
              { title: "Weddings", image: "https://images.unsplash.com/photo-1519869491916-8ca6f615d6bd?w=500&q=80", link: "/shop?category=Wedding Cakes" },
              { title: "Gifting", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80", link: "/shop?category=Gift Hampers" }
            ].map((occasion, idx) => (
              <Link key={idx} to={occasion.link} className="group relative rounded-[32px] overflow-hidden aspect-[4/5] block">
                <img src={occasion.image} alt={occasion.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-brown-dark/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-serif font-bold text-xl md:text-2xl mb-1">{occasion.title}</h3>
                  <div className="text-cream text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center">
                    Explore <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cakes Section */}
      <section className="py-16 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brown-accent mb-2 block">For Every Celebration</span>
              <h2 className="text-3xl font-serif font-bold text-brown-dark">Signature Cakes</h2>
            </div>
            <Link to="/shop?category=Cakes" className="text-brown-primary font-semibold hover:opacity-80 flex items-center border border-brown-primary rounded-full px-6 py-2">
              Shop Cakes <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
               <div className="col-span-full text-center text-brown-dark opacity-60 py-8">Loading cakes...</div>
            ) : cakes.length > 0 ? (
              cakes.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col sm:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm border border-beige-mid/30 hover:shadow-md transition-all">
                  <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-beige-light overflow-hidden">
                     {product.images?.[0] ? (
                        <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-dark opacity-40 bg-beige-mid/30"><Cake size={32} /></div>
                      )}
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-2">Artisanal</div>
                    <h3 className="font-serif font-bold text-2xl text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-sm text-brown-dark opacity-70 mb-6 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-bold text-brown-primary">{formatCurrency(product.basePrice)}</div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="px-6 py-2 rounded-full bg-brown-primary text-white font-medium hover:bg-brown-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              [
                { id: 'cake1', name: 'Dry Fruit Cake', description: 'A rich, traditional cake loaded with premium dry fruits.', basePrice: 359, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
                { id: 'cake2', name: 'Black Raisin & Chocochips Chocolate Cake', description: 'Decadent chocolate cake loaded with sweet black raisins and chocochips.', basePrice: 329, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
                { id: 'cake3', name: 'Pure Chocolate Cake', description: 'The ultimate pure chocolate cake for every celebration.', basePrice: 259, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
                { id: 'cake4', name: 'Nolen Gurer Cake', description: 'A traditional Bengali delicacy infused with Nolen Gur.', basePrice: 399, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&q=80' }
              ].map(product => (
                <div key={product.id} className="group flex flex-col sm:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm border border-beige-mid/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-beige-light overflow-hidden">
                    <img src={product.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-2">Artisanal</div>
                    <h3 className="font-serif font-bold text-2xl text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-sm text-brown-dark opacity-70 mb-6 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-bold text-brown-primary">{formatCurrency(product.basePrice)}</div>
                      <button 
                        className="px-6 py-2 rounded-full bg-brown-primary text-white font-medium hover:bg-brown-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brown-accent mb-2 block">Baked Fresh</span>
              <h2 className="text-3xl font-serif font-bold text-brown-dark">Signature Cookies</h2>
            </div>
            <Link to="/shop?category=Cookies" className="text-brown-primary font-semibold hover:opacity-80 flex items-center border border-brown-primary rounded-full px-6 py-2">
              Shop Cookies <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
               <div className="col-span-full text-center text-brown-dark opacity-60 py-8">Loading cookies...</div>
            ) : cookies.length > 0 ? (
              cookies.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col sm:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm border border-beige-mid/30 hover:shadow-md transition-all">
                  <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-beige-light overflow-hidden">
                     {product.images?.[0] ? (
                        <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-dark opacity-40 bg-beige-mid/30"><ShoppingBag size={32} /></div>
                      )}
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-2">Artisanal</div>
                    <h3 className="font-serif font-bold text-2xl text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-sm text-brown-dark opacity-70 mb-6 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-bold text-brown-primary">{formatCurrency(product.basePrice)}</div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="px-6 py-2 rounded-full bg-brown-primary text-white font-medium hover:bg-brown-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              [
                { id: 'ck1', name: 'Classic Choco Chip', description: 'Crispy edges, chewy centers packed with Belgian chocolate chunks for the perfect bite.', basePrice: 200, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500' },
                { id: 'ck2', name: 'Double Chocolate Fudge', description: 'Intensely rich cocoa cookies for true chocolate lovers. Melt in your mouth goodness.', basePrice: 250, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500' }
              ].map(product => (
                <div key={product.id} className="group flex flex-col sm:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm border border-beige-mid/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-beige-light overflow-hidden">
                    <img src={product.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-2">Artisanal</div>
                    <h3 className="font-serif font-bold text-2xl text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-sm text-brown-dark opacity-70 mb-6 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-bold text-brown-primary">{formatCurrency(product.basePrice)}</div>
                      <button 
                        className="px-6 py-2 rounded-full bg-brown-primary text-white font-medium hover:bg-brown-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Muffins Section */}
      <section className="py-16 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brown-accent mb-2 block">Freshly Baked</span>
              <h2 className="text-3xl font-serif font-bold text-brown-dark">Fresh Muffins</h2>
            </div>
            <Link to="/shop?category=Desserts" className="text-brown-primary font-semibold hover:opacity-80 flex items-center border border-brown-primary rounded-full px-6 py-2">
              Shop Muffins <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
               <div className="col-span-full text-center text-brown-dark opacity-60 py-8">Loading muffins...</div>
            ) : desserts.length > 0 ? (
              desserts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col sm:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm border border-beige-mid/30 hover:shadow-md transition-all">
                  <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-beige-light overflow-hidden">
                     {product.images?.[0] ? (
                        <img src={product.images[0]} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-dark opacity-40 bg-beige-mid/30"><Gift size={32} /></div>
                      )}
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-2">Fresh</div>
                    <h3 className="font-serif font-bold text-2xl text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-sm text-brown-dark opacity-70 mb-6 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-bold text-brown-primary">{formatCurrency(product.basePrice)}</div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="px-6 py-2 rounded-full bg-brown-primary text-white font-medium hover:bg-brown-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              [
                { id: 'muf1', name: 'Butter Muffins', description: 'Classic, soft and fluffy butter muffins.', basePrice: 30, image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=500&q=80' },
                { id: 'muf2', name: 'Banana Chocochip Muffins', description: 'Fresh bananas blended with sweet chocolate chips in a soft muffin.', basePrice: 45, image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&q=80' },
                { id: 'muf3', name: 'Chocolate Chocochip Muffins', description: 'Double chocolate goodness for the ultimate chocolate lover.', basePrice: 45, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80' },
                { id: 'muf4', name: 'Coffee Muffins', description: 'Rich coffee flavored muffins perfect for your morning start.', basePrice: 40, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80' }
              ].map(product => (
                <div key={product.id} className="group flex flex-col sm:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm border border-beige-mid/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto bg-beige-light overflow-hidden">
                    <img src={product.image} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=500&q=80"; }} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="text-xs text-brown-accent font-bold uppercase tracking-wider mb-2">Fresh</div>
                    <h3 className="font-serif font-bold text-2xl text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-sm text-brown-dark opacity-70 mb-6 line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-bold text-brown-primary">{formatCurrency(product.basePrice)}</div>
                      <button 
                        className="px-6 py-2 rounded-full bg-brown-primary text-white font-medium hover:bg-brown-dark transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Custom Cake CTA */}
      <section className="py-32 relative overflow-hidden bg-brown-primary">
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-fixed bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-brown-dark/40 z-0"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Have Something Special in Mind?</h2>
          <p className="text-lg md:text-xl text-cream opacity-90 mb-10 max-w-2xl mx-auto">
            Tell us your idea and let us create a cake made especially for your celebration. From themed kid's cakes to elegant wedding tiers.
          </p>
          <Link to="/custom-cake" className="inline-block px-10 py-5 bg-cream text-brown-primary rounded-full font-bold text-lg hover:bg-white transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
            Customize Your Cake
          </Link>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-brown-dark mb-4">Follow Granny's Cookies</h2>
          <p className="text-brown-dark opacity-80 mb-8">Follow our journey of baking love and sweetness daily.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
              "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
              "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
              "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80"
            ].map((img, i) => (
              <div key={i} className="aspect-square rounded-[24px] overflow-hidden group">
                <img src={img} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
          
          <a href="https://www.instagram.com/grannys.cookiess/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-3 bg-white text-brown-dark border border-brown-primary rounded-full font-semibold hover:bg-brown-primary hover:text-white transition-colors">
            Follow Us On Instagram
          </a>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-[#FDFBF7] border-t border-beige-mid/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brown-dark mb-6">Visit Granny's Cookies</h2>
              <div className="space-y-4 text-brown-dark opacity-80 mb-8">
                <p className="text-lg"><strong>Address:</strong><br/>104/3/1, Satyen Roy Rd,<br/>Behala Gardens, Indrajit Pally,<br/>Behala, Kolkata, West Bengal 700034</p>
                <p className="text-lg"><strong>Phone:</strong><br/>098310 97533</p>
                <p className="text-lg"><strong>Hours:</strong><br/>Open until approximately 3:00 AM</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+919831097533" className="px-6 py-3 bg-brown-primary text-white rounded-full font-semibold hover:bg-brown-dark transition-colors">Call Now</a>
                <a href="https://wa.me/919831097533" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#25D366] text-white rounded-full font-semibold hover:opacity-90 transition-opacity">WhatsApp</a>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=104%2F3%2F1%2C+Satyen+Roy+Rd%2C+Behala+Gardens%2C+Indrajit+Pally%2C+Behala%2C+Kolkata%2C+West+Bengal+700034" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-3 border border-brown-primary text-brown-primary rounded-full font-semibold hover:bg-brown-primary hover:text-white transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
            <div className="relative group rounded-[32px] overflow-hidden shadow-inner border border-beige-mid/50 aspect-video bg-beige-mid/20">
               <iframe 
                 src="https://maps.google.com/maps?q=104%2F3%2F1%2C%20Satyen%20Roy%20Rd%2C%20Behala%20Gardens%2C%20Indrajit%20Pally%2C%20Behala%2C%20Kolkata%2C%20West%20Bengal%20700034&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Granny's Cookies Map - Kolkata"
               ></iframe>
               <a 
                 href="https://www.google.com/maps/search/?api=1&query=104%2F3%2F1%2C+Satyen+Roy+Rd%2C+Behala+Gardens%2C+Indrajit+Pally%2C+Behala%2C+Kolkata%2C+West+Bengal+700034"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-brown-primary px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center space-x-1 border border-beige-mid transition-all hover:scale-105"
               >
                 <span>Open in Google Maps</span>
                 <span>↗</span>
               </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
