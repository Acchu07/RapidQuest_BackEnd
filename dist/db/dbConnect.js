import { MongoClient } from "mongodb";
const uri = process.env.MONGO_URI ?? 'Connection String is Null';
const dbName = process.env.DB_NAME ?? 'csTechMk';
const client = new MongoClient(uri);
let db;
async function connectDB() {
    await client.connect();
    db = client.db(dbName);
    console.log('MongoDB connected');
}
function accessDB() {
    if (!db)
        throw new Error('DB not connected');
    return db;
}
export { connectDB, accessDB };
