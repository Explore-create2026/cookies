import { useState, useEffect } from 'react';
import { getProducts } from '../../lib/productService';
import { Product } from '../../types';
import { Search, AlertTriangle, TrendingDown } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Inventory Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Total Items</p>
            <p className="text-2xl font-bold text-stone-900">{products.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-stone-900">
              {products.filter(p => p.stockQuantity <= p.lowStockThreshold).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="px-6 py-4 font-medium">Product / SKU</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-stone-500">Loading...</td></tr>
              ) : filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-stone-900">{p.name}</div>
                    <div className="text-xs text-stone-500">SKU: {p.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-stone-900">{p.stockQuantity}</td>
                  <td className="px-6 py-4">
                    {p.stockQuantity === 0 ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">Out of Stock</span>
                    ) : p.stockQuantity <= p.lowStockThreshold ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">Low Stock</span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
