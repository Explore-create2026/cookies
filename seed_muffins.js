import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const DEMO_DATA = [
  {
    name: 'Butter Muffins',
    category: 'Desserts',
    description: 'Classic, soft and fluffy butter muffins.',
    images: ['https://images.unsplash.com/photo-1557925923-33b251d592cd?w=500&q=80'],
    basePrice: 30,
    variants: [
      { name: '1 Piece', price: 30 },
      { name: '2 Pieces', price: 60 }
    ],
    sku: 'MUF-BUT-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Banana Chocochip Muffins',
    category: 'Desserts',
    description: 'Fresh bananas blended with sweet chocolate chips in a soft muffin.',
    images: ['https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=500&q=80'],
    basePrice: 45,
    variants: [
      { name: '1 Piece', price: 45 },
      { name: '2 Pieces', price: 90 }
    ],
    sku: 'MUF-BAN-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Chocolate Chocochip Muffins',
    category: 'Desserts',
    description: 'Double chocolate goodness for the ultimate chocolate lover.',
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80'],
    basePrice: 45,
    variants: [
      { name: '1 Piece', price: 45 },
      { name: '2 Pieces', price: 90 }
    ],
    sku: 'MUF-DCH-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Chocochip Muffins',
    category: 'Desserts',
    description: 'Classic vanilla muffins studded with chocolate chips.',
    images: ['https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=500&q=80'],
    basePrice: 35,
    variants: [
      { name: '1 Piece', price: 35 },
      { name: '2 Pieces', price: 70 }
    ],
    sku: 'MUF-CHO-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Coffee Muffins',
    category: 'Desserts',
    description: 'Rich coffee flavored muffins perfect for your morning start.',
    images: ['https://images.unsplash.com/photo-1557925923-33b251d592cd?w=500&q=80'],
    basePrice: 40,
    variants: [
      { name: '1 Piece', price: 40 },
      { name: '2 Pieces', price: 80 }
    ],
    sku: 'MUF-COF-001',
    stockQuantity: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Dry Fruit Cake',
    category: 'Cakes',
    description: 'A rich, traditional cake loaded with premium dry fruits.',
    images: ['https://images.unsplash.com/photo-1557925923-33b251d592cd?w=500&q=80'],
    basePrice: 359,
    variants: [
      { name: '300g', price: 359 },
      { name: '650g', price: 849 }
    ],
    sku: 'CAK-DRY-001',
    stockQuantity: 20,
    lowStockThreshold: 5,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Black Raisin & Chocochips Chocolate Cake',
    category: 'Cakes',
    description: 'Decadent chocolate cake loaded with sweet black raisins and chocochips.',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'],
    basePrice: 329,
    variants: [
      { name: '300g', price: 329 }
    ],
    sku: 'CAK-BLR-001',
    stockQuantity: 20,
    lowStockThreshold: 5,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false
  },
  {
    name: 'Pure Chocolate Cake',
    category: 'Cakes',
    description: 'The ultimate pure chocolate cake for every celebration.',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'],
    basePrice: 259,
    variants: [
      { name: '300g', price: 259 },
      { name: '650g', price: 389 }
    ],
    sku: 'CAK-PUR-001',
    stockQuantity: 20,
    lowStockThreshold: 5,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Nolen Gurer Cake',
    category: 'Cakes',
    description: 'A traditional Bengali delicacy infused with Nolen Gur (date palm jaggery).',
    images: ['https://images.unsplash.com/photo-1557925923-33b251d592cd?w=500&q=80'],
    basePrice: 399,
    variants: [
      { name: '300g', price: 399 }
    ],
    sku: 'CAK-NOL-001',
    stockQuantity: 20,
    lowStockThreshold: 5,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  }
];

async function seed() {
  for (const item of DEMO_DATA) {
    const newDoc = doc(collection(db, 'products'));
    await setDoc(newDoc, {
      ...item,
      id: newDoc.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    console.log('Seeded:', item.name);
  }
  process.exit(0);
}

seed();
