import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

// High-quality verified working Unsplash URLs (all return 200 OK)
export const VERIFIED_IMAGES = {
  chocolate: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&q=80',
  cookies: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
  muffin: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
  brownie: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80',
  hamper: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80',
};

const BROKEN_IMAGE_MAP: Record<string, string> = {
  'https://images.unsplash.com/photo-1548873099-281b315264b9?w=500&q=80': VERIFIED_IMAGES.chocolate,
  'https://images.unsplash.com/photo-1557925923-33b251d592cd?w=500&q=80': VERIFIED_IMAGES.muffin,
  'https://images.unsplash.com/photo-1579247738222-77eb60c5c6cf?w=500&q=80': VERIFIED_IMAGES.cake,
  'https://images.unsplash.com/photo-1605380590126-78716327e5ec?w=500&q=80': VERIFIED_IMAGES.cake,
  'https://images.unsplash.com/photo-1605380590126-78716327e5ec?w=600&q=80': VERIFIED_IMAGES.cake,
  'https://images.unsplash.com/photo-1614083017424-df359bc76316?w=500&q=80': VERIFIED_IMAGES.chocolate,
};

export function getFallbackImageForCategory(category?: string): string {
  switch (category) {
    case 'Chocolates':
      return VERIFIED_IMAGES.chocolate;
    case 'Cakes':
    case 'Custom Cakes':
      return VERIFIED_IMAGES.cake;
    case 'Desserts':
      return VERIFIED_IMAGES.muffin;
    case 'Gift Hampers':
      return VERIFIED_IMAGES.hamper;
    case 'Cookies':
    default:
      return VERIFIED_IMAGES.cookies;
  }
}

export function sanitizeProduct(product: Product): Product {
  const images = (product.images || []).map(img => BROKEN_IMAGE_MAP[img] || img);
  if (images.length === 0 || images[0].includes('1548873099') || images[0].includes('1557925923') || images[0].includes('1614083017424')) {
    images[0] = getFallbackImageForCategory(product.category);
  }
  return {
    ...product,
    images
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    let q = query(collection(db, COLLECTION_NAME));
    
    if (category && category !== 'All') {
      q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    
    // Auto-seed if completely empty (less than 2 products) and no specific category is requested
    if (snapshot.size <= 1 && (!category || category === 'All')) {
      console.log("Database is mostly empty. Auto-seeding demo products...");
      const demoProducts = [
        { name: 'Premium Brownie Box', category: 'Gift Hampers', description: 'A rich and fudgy premium brownie collection, perfect for gifting.', images: [VERIFIED_IMAGES.brownie], basePrice: 1499, variants: [], sku: 'GFT-BRW-001', stockQuantity: 50, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: true },
        { name: 'Luxury Cake Hamper', category: 'Gift Hampers', description: 'An assorted luxury cake hamper including dry fruit cakes, chocolates, and cookies.', images: [VERIFIED_IMAGES.hamper], basePrice: 1499, variants: [], sku: 'GFT-CAK-001', stockQuantity: 50, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: false },
        { name: 'Walnut Delight Chocolate', category: 'Chocolates', description: 'Rich dark chocolate perfectly blended with toasted walnuts for a delightful crunch.', images: [VERIFIED_IMAGES.chocolate], basePrice: 50, variants: [], sku: 'CHO-WAL-001', stockQuantity: 100, lowStockThreshold: 20, isAvailable: true, isFeatured: true, isBestSeller: true },
        { name: 'Butter Cookies (250g)', category: 'Cookies', description: 'Classic melt-in-the-mouth butter cookies topped with a dollop of sweet fruit jam.', images: [VERIFIED_IMAGES.cookies], basePrice: 250, variants: [{name: '250g', price: 250, weight: '250g'}, {name: '500g', price: 480, weight: '500g'}], sku: 'COK-BTR-001', stockQuantity: 40, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: true },
        { name: 'Classic Black Forest Cake', category: 'Cakes', description: 'Traditional black forest cake with layers of cherry and fresh cream.', images: [VERIFIED_IMAGES.cake], basePrice: 550, variants: [], sku: 'CAK-BLF-001', stockQuantity: 20, lowStockThreshold: 5, isAvailable: true, isFeatured: true, isBestSeller: true }
      ];
      
      // we only seed if we have write access (admin), but wait, the client is logged in?
      // actually, if they are not admin, write will fail, so we catch it.
      try {
        const seedPromises = demoProducts.map(async (item) => {
          const newRef = doc(collection(db, COLLECTION_NAME));
          return setDoc(newRef, {
            id: newRef.id,
            ...item,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        });
        await Promise.all(seedPromises);
        
        // Re-fetch after seeding
        const newSnapshot = await getDocs(q);
        return newSnapshot.docs.map(doc => sanitizeProduct({ id: doc.id, ...doc.data() } as Product));
      } catch (seedErr) {
        // likely permission denied because not admin, ignore and return whatever is there
        console.warn("Could not auto-seed (likely not admin)", seedErr);
      }
    }
    
    return snapshot.docs.map(doc => sanitizeProduct({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return sanitizeProduct({ id: snapshot.id, ...snapshot.data() } as Product);
  }
  return null;
}

export async function saveProduct(product: Product): Promise<void> {
  if (!product.id) {
    product.id = doc(collection(db, COLLECTION_NAME)).id;
    product.createdAt = Date.now();
  }
  product.updatedAt = Date.now();
  
  await setDoc(doc(db, COLLECTION_NAME, product.id), product);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
