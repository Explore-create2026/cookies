import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || "(default)");
async function run() {
  const snap = await getDocs(collection(db, "products"));
  console.log("Products count:", snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data().name));
  process.exit(0);
}
run();
