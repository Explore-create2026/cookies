import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const products = [
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
    isBestSeller: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
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
    isBestSeller: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

async function seed() {
  const productsRef = collection(db, 'products');
  for (const product of products) {
    const newDocRef = doc(productsRef);
    await setDoc(newDocRef, { id: newDocRef.id, ...product });
    console.log(`Seeded: ${product.name}`);
  }
  process.exit(0);
}
seed();
