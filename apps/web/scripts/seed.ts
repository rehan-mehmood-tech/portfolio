import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { certifications, experiences, profile, projects, recommendations, services } from "../lib/content";

const projectId=process.env.FIREBASE_PROJECT_ID;const clientEmail=process.env.FIREBASE_CLIENT_EMAIL;const privateKey=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n");
if(!projectId||!clientEmail||!privateKey)throw new Error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.");
const app=getApps()[0]??initializeApp({credential:cert({projectId,clientEmail,privateKey})});const db=getFirestore(app);
async function seed(){const batch=db.batch();batch.set(db.doc("site/profile"),profile,{merge:true});for(const [name,items] of Object.entries({projects,services,certifications,experiences,recommendations}))for(const item of items)batch.set(db.collection(name).doc(item.id),item,{merge:true});await batch.commit();console.log("Seeded profile and published portfolio content.")}
seed().catch(error=>{console.error(error);process.exit(1)});
