import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  console.log(`Found ${querySnapshot.size} products.`);
  querySnapshot.forEach((doc) => {
    console.log(doc.data().name, '-', doc.data().category);
  });
  process.exit(0);
}
check();
