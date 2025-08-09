import { accessDB } from "./dbConnect.js";
export async function retrieveData() {
    const DB_COLLECTION = process.env.DB_COLLECTION;
    if (!DB_COLLECTION) {
        throw new Error("DB_COLLECTION is not defined");
    }
    const db = accessDB();
    const data = await db.collection(DB_COLLECTION).find().toArray();
    return data;
}
export async function insertData(data) {
    const DB_COLLECTION = process.env.DB_COLLECTION; // refactor this you just need one instance
    if (!DB_COLLECTION) {
        throw new Error("DB_COLLECTION is not defined");
    }
    const db = accessDB();
    const result = await db.collection(DB_COLLECTION).insertOne(data);
    return result;
}
