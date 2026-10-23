import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderStatus } from '../types';

const COLLECTION_NAME = 'orders';

export async function getOrders(): Promise<Order[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  const q = query(collection(db, COLLECTION_NAME), where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrder(id: string): Promise<Order | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Order;
  }
  return null;
}

export async function saveOrder(order: Order): Promise<void> {
  if (!order.id) {
    // Generate ORD-... ID if not present
    const year = new Date().getFullYear();
    const randomStr = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    order.id = `ORD-${year}-${randomStr}`;
    order.createdAt = Date.now();
  }
  order.updatedAt = Date.now();
  
  await setDoc(doc(db, COLLECTION_NAME, order.id), order);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { 
    status,
    updatedAt: Date.now() 
  });
}
