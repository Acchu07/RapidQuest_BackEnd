import { MongoClient } from "mongodb";
import type { WhatsAppMessage, WhatsAppMessageStatus } from "./whatsappTypes.ts";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const DB_COLLECTION = process.env.DB_COLLECTION;

if(!MONGO_URI || !DB || !DB_COLLECTION){
    throw new Error("MONGO_URI, DB or DB_COLLECTION is not defined");
}
const client = new MongoClient(MONGO_URI);
const db = client.db(DB);
const collection = db.collection<{_id:string}>(DB_COLLECTION);

async function createManyMessages(messages: WhatsAppMessage[]){
    try {
        await client.connect();
        await collection.insertMany(messages,{ordered:false});

        console.log("Messages inserted successfully");
    } catch (error) {
        console.error("Error inserting messages", error);
    } finally {
        await client.close();
    }
}

async function updateManyMessages(extractedStatues: WhatsAppMessageStatus[]){
    const bulkWriteOperation = extractedStatues.map((status)=>{
        return {
            updateOne: {
                filter: { _id: status.id },
                update: { $set: { status: status.status } },
            },
        };
    });
    try {
        await client.connect();
        await collection.bulkWrite(bulkWriteOperation);
        console.log("Messages updated successfully");
    } catch (error) {
        console.error("Error updating messages", error);
    } finally {
        await client.close();
    }
}

export {createManyMessages, updateManyMessages}
