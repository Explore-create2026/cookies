import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, Database } from 'lucide-react';
import { getProducts, saveProduct, deleteProduct } from '../../lib/productService';
import { Product, Category } from '../../types';

const DEMO_DATA: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Premium Brownie Box',
    category: 'Gift Hampers',
    description: 'A rich and fudgy premium brownie collection, perfect for gifting.',
    images: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80'],
    basePrice: 1499,
    variants: [],
    sku: 'GFT-BRW-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Luxury Cake Hamper',
    category: 'Gift Hampers',
    description: 'An assorted luxury cake hamper including dry fruit cakes, chocolates, and cookies.',
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80'],
    basePrice: 1499,
    variants: [],
    sku: 'GFT-CAK-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false
  },
  {
    name: 'Walnut Delight Chocolate',
    category: 'Chocolates',
    description: 'Rich dark chocolate perfectly blended with toasted walnuts for a delightful crunch.',
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&q=80'],
    basePrice: 50,
    variants: [],
    sku: 'CHO-WAL-001',
    stockQuantity: 100,
    lowStockThreshold: 20,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Nutty Delight Chocolate',
    category: 'Chocolates',
    description: 'A mix of premium nuts enrobed in smooth milk chocolate.',
    images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80'],
    basePrice: 50,
    variants: [],
    sku: 'CHO-NUT-001',
    stockQuantity: 100,
    lowStockThreshold: 20,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false
  },
  {
    name: 'Milky Delight Chocolate',
    category: 'Chocolates',
    description: 'Classic, creamy milk chocolate that melts in your mouth.',
    images: ['https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=500&q=80'],
    basePrice: 50,
    variants: [],
    sku: 'CHO-MLK-001',
    stockQuantity: 100,
    lowStockThreshold: 20,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: true
  },
  {
    name: 'Hazelnut Delight Chocolate',
    category: 'Chocolates',
    description: 'A whole roasted hazelnut surrounded by creamy praline and milk chocolate.',
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80'],
    basePrice: 55,
    variants: [],
    sku: 'CHO-HAZ-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: true
  },
  {
    name: 'Red Wine Ball Chocolate',
    category: 'Chocolates',
    description: 'Decadent dark chocolate truffle infused with premium red wine.',
    images: ['https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=500&q=80'],
    basePrice: 70,
    variants: [],
    sku: 'CHO-RWB-001',
    stockQuantity: 30,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false
  },
  {
    name: 'Butter Cookies (250g)',
    category: 'Cookies',
    description: 'Classic melt-in-the-mouth butter cookies topped with a dollop of sweet fruit jam.',
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80'],
    basePrice: 250,
    variants: [{name: '250g', price: 250, weight: '250g'}, {name: '500g', price: 480, weight: '500g'}],
    sku: 'COK-BTR-001',
    stockQuantity: 40,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Dark Chocolate Chip Cookies (250g)',
    category: 'Cookies',
    description: 'Rich dark chocolate cookies loaded with premium chocolate chips.',
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80'],
    basePrice: 350,
    variants: [{name: '250g', price: 350, weight: '250g'}, {name: '500g', price: 680, weight: '500g'}],
    sku: 'COK-DC-001',
    stockQuantity: 25,
    lowStockThreshold: 5,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: true
  },
  {
    name: 'Chocolate Truffle Cake',
    category: 'Chocolate Cakes',
    description: 'Rich chocolate sponge layered with smooth chocolate truffle ganache.',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'],
    basePrice: 850,
    variants: [{name: '500g', price: 850, weight: '500g'}, {name: '1kg', price: 1600, weight: '1kg'}],
    sku: 'CHK-TRF-001',
    stockQuantity: 10,
    lowStockThreshold: 3,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Red Velvet Cake',
    category: 'Birthday Cakes',
    description: 'Classic red velvet sponge with signature cream cheese frosting.',
    images: ['https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500&q=80'],
    basePrice: 950,
    variants: [{name: '500g', price: 950, weight: '500g'}, {name: '1kg', price: 1800, weight: '1kg'}],
    sku: 'CAK-RED-001',
    stockQuantity: 8,
    lowStockThreshold: 2,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Assorted Chocolate Gift Box',
    category: 'Gift Hampers',
    description: 'A premium box of 12 handcrafted assorted chocolates.',
    images: ['https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=500&q=80'],
    basePrice: 1200,
    variants: [],
    sku: 'GFT-CHO-012',
    stockQuantity: 5,
    lowStockThreshold: 2,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false
  }
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemoData = async () => {
    if (window.confirm("Seed demo products? This will add sample cakes and cookies to the database.")) {
      setSeeding(true);
      try {
        for (const p of DEMO_DATA) {
          await saveProduct(p as Product);
        }
        await loadProducts();
      } catch (error) {
        console.error("Error seeding data:", error);
      } finally {
        setSeeding(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct({...currentProduct, images: [reader.result as string]});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    
    const productToSave = { ...currentProduct } as Product;
    
    // Auto-generate SKU if empty
    if (!productToSave.sku) {
      const randomPart = Math.floor(100000 + Math.random() * 900000);
      productToSave.sku = `GC-${productToSave.category.substring(0, 3).toUpperCase()}-${randomPart}`;
    }
    
    // Auto-generate image if empty
    if (!productToSave.images || productToSave.images.length === 0 || !productToSave.images[0]) {
      const prompt = encodeURIComponent(`${productToSave.name} premium bakery photography beautiful high quality`);
      productToSave.images = [`https://image.pollinations.ai/prompt/${prompt}`];
    }
    
    try {
      await saveProduct(productToSave);
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const openNewModal = () => {
    setCurrentProduct({
      name: '',
      category: 'Birthday Cakes',
      description: '',
      images: [''],
      basePrice: 0,
      variants: [],
      sku: '',
      stockQuantity: 10,
      lowStockThreshold: 2,
      isAvailable: true,
      isFeatured: false,
      isBestSeller: false,
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories: Category[] = [
    'Birthday Cakes', 'Wedding Cakes', 'Anniversary Cakes', 
    'Chocolate Cakes', 'Pastries', 'Brownies', 'Chocolates', 
    'Gift Hampers', 'Cookies', 'Custom Cakes'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-stone-900">Products</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSeedDemoData}
            disabled={seeding}
            className="flex items-center px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors disabled:opacity-50"
          >
            <Database size={20} className="mr-2" /> {seeding ? 'Seeding...' : 'Seed Demo Data'}
          </button>
          <button 
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus size={20} className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
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
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-stone-500">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-stone-200 mr-3 flex-shrink-0 overflow-hidden">
                          {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-medium text-stone-900">{product.name}</div>
                          <div className="text-xs text-stone-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{product.category}</td>
                    <td className="px-6 py-4 font-medium">₹{product.basePrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.stockQuantity <= product.lowStockThreshold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isAvailable ? 
                        <span className="flex items-center text-green-600 text-sm"><CheckCircle size={16} className="mr-1" /> Active</span> : 
                        <span className="flex items-center text-stone-400 text-sm"><XCircle size={16} className="mr-1" /> Inactive</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }}
                        className="p-1 text-stone-400 hover:text-amber-600 transition-colors mr-2"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-stone-900">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600"><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Product Name *</label>
                  <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Category *</label>
                  <select required value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value as Category})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-stone-700">Description</label>
                  <textarea rows={3} value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Base Price (₹) *</label>
                  <input required type="number" min="0" value={currentProduct.basePrice} onChange={e => setCurrentProduct({...currentProduct, basePrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">SKU</label>
                  <input type="text" value={currentProduct.sku} onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Stock Quantity</label>
                  <input type="number" min="0" value={currentProduct.stockQuantity} onChange={e => setCurrentProduct({...currentProduct, stockQuantity: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Low Stock Threshold</label>
                  <input type="number" min="0" value={currentProduct.lowStockThreshold} onChange={e => setCurrentProduct({...currentProduct, lowStockThreshold: Number(e.target.value)})} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-stone-700">Image</label>
                  <div className="flex items-center gap-4">
                    {currentProduct.images?.[0] && (
                      <div className="w-16 h-16 shrink-0 rounded border border-stone-200 overflow-hidden">
                        <img src={currentProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" 
                      />
                      <div className="text-xs text-stone-500 text-center">OR</div>
                      <input type="url" value={currentProduct.images?.[0] || ''} onChange={e => setCurrentProduct({...currentProduct, images: [e.target.value]})} placeholder="Image URL (Leave blank to auto-generate based on product name)" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 sm:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={currentProduct.isAvailable} onChange={e => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm font-medium text-stone-700">Available for Sale</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={currentProduct.isFeatured} onChange={e => setCurrentProduct({...currentProduct, isFeatured: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm font-medium text-stone-700">Featured on Homepage</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={currentProduct.isBestSeller} onChange={e => setCurrentProduct({...currentProduct, isBestSeller: e.target.checked})} className="rounded text-amber-600 focus:ring-amber-500" />
                    <span className="text-sm font-medium text-stone-700">Mark as Best Seller</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-stone-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
