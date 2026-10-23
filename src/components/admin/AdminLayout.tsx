import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Package, 
  Users, 
  UserSquare2, 
  Receipt, 
  PieChart, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Kitchen', path: '/admin/kitchen', icon: UtensilsCrossed },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Inventory', path: '/admin/inventory', icon: Package },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Staff & Attendance', path: '/admin/staff', icon: UserSquare2 },
  { name: 'Expenses', path: '/admin/expenses', icon: Receipt },
  { name: 'Reports', path: '/admin/reports', icon: PieChart },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-stone-100 font-sans text-stone-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stone-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-stone-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-6 bg-stone-950 shrink-0">
          <Link to="/" className="text-xl font-serif font-bold text-white tracking-tight">Granny's Admin</Link>
          <button className="lg:hidden text-stone-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-6 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'hover:bg-stone-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-stone-400'} />
                <span className="ml-3 font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Logout Button */}
        <div className="p-4 bg-stone-950 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3 font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-stone-200 lg:hidden">
          <button 
            className="text-stone-600 hover:text-stone-900 p-2 -ml-2 rounded-lg hover:bg-stone-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="font-serif font-bold text-lg text-stone-900">Granny's Admin</span>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
