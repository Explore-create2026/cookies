import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut, Phone, MessageCircle, Heart, Search } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';

const BUSINESS_PHONE = "919831097533"; // Country code + number

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { isAuthenticated, logout, user, isStaff } = useAuthStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-brown-dark">
      {/* Top Announcement Bar */}
      <div className="bg-brown-primary text-cream py-2 text-center text-sm font-medium tracking-wide px-4">
        Freshly Baked Goodness • Customized Cakes • Delivery Available
      </div>
      
      {/* Main Header */}
      <header className="bg-white border-b border-beige-mid sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 py-1">
              <div className="flex flex-col">
                <span className="font-serif text-2xl md:text-3xl font-bold italic tracking-tight text-brown-primary leading-none">Granny's Cookies</span>
                <span className="text-[10px] md:text-xs font-semibold text-brown-accent tracking-widest uppercase mt-1">গ্র্যানী'স কুকিজ্</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <input
                type="text"
                placeholder="Search cakes, cookies, brownies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cream border border-beige-mid rounded-full focus:outline-none focus:border-brown-accent text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-brown-dark opacity-50" size={18} />
            </form>

            {/* Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center space-x-4">
                  <Link to="/dashboard" className="text-brown-dark opacity-70 hover:opacity-100 flex items-center space-x-1">
                    <UserIcon size={22} />
                    <span className="text-sm font-medium truncate max-w-[100px] hidden xl:block">{user?.name}</span>
                  </Link>
                  {isStaff && (
                    <Link to="/admin" className="text-brown-accent hover:text-brown-primary font-bold transition-colors text-sm">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="text-brown-dark opacity-60 hover:text-red-600" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="hidden lg:flex flex-col items-center text-brown-dark opacity-70 hover:opacity-100">
                  <UserIcon size={22} />
                  <span className="text-[10px] font-medium mt-1">Account</span>
                </Link>
              )}

              <Link to="/wishlist" className="hidden md:flex flex-col items-center relative text-brown-dark opacity-70 hover:opacity-100 transition-colors">
                <Heart size={22} />
                <span className="text-[10px] font-medium mt-1">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-brown-accent text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative flex flex-col items-center text-brown-dark opacity-70 hover:opacity-100 transition-colors">
                <ShoppingBag size={22} />
                <span className="text-[10px] font-medium mt-1 hidden md:block">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 md:right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu & Search Button */}
              <div className="flex items-center space-x-3 md:hidden">
                <button onClick={() => {
                  const searchInput = prompt("Search cakes, cookies, brownies...");
                  if (searchInput) {
                    navigate(`/shop?search=${encodeURIComponent(searchInput)}`);
                  }
                }} className="text-brown-dark opacity-70">
                  <Search size={22} />
                </button>
                <button 
                  className="text-brown-dark opacity-70 hover:opacity-100"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden md:flex justify-center space-x-8 text-sm border-t border-beige-mid/50 py-3 bg-cream/30">
          <Link to="/shop?category=Cakes" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Cakes</Link>
          <Link to="/custom-cake" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Custom Cakes</Link>
          <Link to="/shop?category=Cookies" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Cookies</Link>
          <Link to="/shop?category=Brownies" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Brownies</Link>
          <Link to="/shop?category=Chocolates" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Chocolates</Link>
          <Link to="/shop?category=Desserts" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Desserts</Link>
          <Link to="/shop?category=Gift Boxes" className="text-brown-dark opacity-70 hover:opacity-100 hover:text-brown-primary font-medium uppercase tracking-wide text-xs transition-colors">Gift Boxes</Link>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-cream border-t border-beige-mid absolute w-full shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
              <div className="py-2 mb-2 border-b border-beige-mid/50">
                <p className="text-xs font-bold text-brown-accent tracking-widest uppercase px-3 mb-2">Shop Categories</p>
                <Link to="/shop" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Shop All</Link>
                <Link to="/shop?category=Cakes" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Cakes</Link>
                <Link to="/custom-cake" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Custom Cakes</Link>
                <Link to="/shop?category=Cookies" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Cookies</Link>
                <Link to="/shop?category=Brownies" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Brownies</Link>
                <Link to="/shop?category=Chocolates" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Chocolates</Link>
                <Link to="/shop?category=Gift Boxes" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Gift Boxes</Link>
              </div>

              <div className="py-2 border-b border-beige-mid/50">
                 <p className="text-xs font-bold text-brown-accent tracking-widest uppercase px-3 mb-2">Information</p>
                 <Link to="/about" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">About Us</Link>
                 <Link to="/gallery" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Gallery</Link>
              </div>

              <div className="pt-2">
                {isStaff && (
                  <Link to="/admin" className="block px-3 py-2 text-sm font-bold text-brown-accent hover:bg-beige-light rounded-md">Admin Panel</Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">My Account</Link>
                    <Link to="/wishlist" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">My Wishlist ({wishlistCount})</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/wishlist" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Wishlist ({wishlistCount})</Link>
                    <Link to="/auth" className="block px-3 py-2 text-sm font-medium text-brown-dark hover:bg-beige-light hover:text-brown-primary rounded-md">Login / Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Desktop Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${BUSINESS_PHONE}?text=Hello Granny's Cookies, I have an inquiry.`}
        target="_blank" 
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform z-50 items-center justify-center"
      >
        <MessageCircle size={28} />
      </a>

      {/* Mobile Floating Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-cream border-t border-beige-mid shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-16">
        <a href="tel:+919831097533" className="flex flex-col items-center justify-center flex-1 h-full text-brown-dark opacity-80 hover:opacity-100 hover:text-brown-primary transition-colors">
          <Phone size={20} />
          <span className="text-[10px] font-medium mt-1">Call</span>
        </a>
        <div className="w-px h-8 bg-beige-mid/50"></div>
        <a href={`https://wa.me/${BUSINESS_PHONE}?text=Hello Granny's Cookies, I have an inquiry.`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center flex-1 h-full text-[#25D366] hover:opacity-80 transition-colors">
          <MessageCircle size={20} />
          <span className="text-[10px] font-medium mt-1">WhatsApp</span>
        </a>
        <div className="w-px h-8 bg-beige-mid/50"></div>
        <Link to="/cart" className="flex flex-col items-center justify-center flex-1 h-full text-brown-dark opacity-80 hover:opacity-100 hover:text-brown-primary transition-colors relative">
          <ShoppingBag size={20} />
          <span className="text-[10px] font-medium mt-1">Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-2 right-1/4 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-brown-primary text-cream py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-serif italic text-2xl font-bold text-white mb-4">Granny's Cookies</h3>
              <p className="max-w-xs opacity-60 mb-6">
                Always fresh, soft, and full of flavor. Baked in the most hygienic way to ensure excellent taste and purity for every event in your life.
              </p>
              <p className="opacity-80 font-medium">104/3/1, Satyen Roy Rd, Behala Gardens, Kolkata</p>
              <p className="opacity-80 font-medium mt-1">Call us: 098310 97533</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase text-sm">Shop</h4>
              <ul className="space-y-3">
                <li><Link to="/shop" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/shop?category=Birthday Cakes" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">Birthday Cakes</Link></li>
                <li><Link to="/shop?category=Custom Cakes" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">Custom Cakes</Link></li>
                <li><Link to="/shop?category=Chocolates" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">Chocolates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase text-sm">Information</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="opacity-60 hover:opacity-100 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/admin" className="opacity-60 hover:opacity-100 hover:text-white transition-colors font-medium">Admin Panel</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
            <p>&copy; {new Date().getFullYear()} Granny's Cookies. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Identifies as women-owned • LGBTQ+ friendly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
