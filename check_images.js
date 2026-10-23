import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

async function check() {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  let broken = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.images || data.images.length === 0 || !data.images[0]) {
      console.log(`Product missing image: ${data.name}`);
      broken++;
    }
  });
  console.log(`Found ${broken} products with missing images.`);
  process.exit(0);
}
check();
