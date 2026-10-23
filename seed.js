import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import fs from "fs";
const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || "(default)");

const DEMO_DATA = [
  { name: 'Premium Brownie Box', category: 'Gift Hampers', description: 'A rich and fudgy premium brownie collection, perfect for gifting.', images: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80'], basePrice: 1499, variants: [], sku: 'GFT-BRW-001', stockQuantity: 50, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: true, createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Luxury Cake Hamper', category: 'Gift Hampers', description: 'An assorted luxury cake hamper including dry fruit cakes, chocolates, and cookies.', images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80'], basePrice: 1499, variants: [], sku: 'GFT-CAK-001', stockQuantity: 50, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: false, createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Walnut Delight Chocolate', category: 'Chocolates', description: 'Rich dark chocolate perfectly blended with toasted walnuts for a delightful crunch.', images: ['https://images.unsplash.com/photo-1548873099-281b315264b9?w=500&q=80'], basePrice: 50, variants: [], sku: 'CHO-WAL-001', stockQuantity: 100, lowStockThreshold: 20, isAvailable: true, isFeatured: true, isBestSeller: true, createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Butter Cookies (250g)', category: 'Cookies', description: 'Classic melt-in-the-mouth butter cookies topped with a dollop of sweet fruit jam.', images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80'], basePrice: 250, variants: [{name: '250g', price: 250, weight: '250g'}, {name: '500g', price: 480, weight: '500g'}], sku: 'COK-BTR-001', stockQuantity: 40, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: true, createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Dark Chocolate Chip Cookies', category: 'Cookies', description: 'Decadent cookies loaded with real dark chocolate chunks.', images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=80'], basePrice: 280, variants: [], sku: 'COK-CHO-001', stockQuantity: 40, lowStockThreshold: 10, isAvailable: true, isFeatured: true, isBestSeller: false, createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Classic Black Forest Cake', category: 'Birthday Cakes', description: 'Traditional black forest cake with layers of cherry and fresh cream.', images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'], basePrice: 550, variants: [], sku: 'CAK-BLF-001', stockQuantity: 20, lowStockThreshold: 5, isAvailable: true, isFeatured: true, isBestSeller: true, createdAt: Date.now(), updatedAt: Date.now() }
];

async function seed() {
  let count = 0;
  for (const item of DEMO_DATA) {
    const newRef = doc(collection(db, "products"));
    await setDoc(newRef, { id: newRef.id, ...item });
    count++;
  }
  console.log(`Successfully seeded ${count} products.`);
  process.exit(0);
}
seed();
