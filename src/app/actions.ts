'use server';

import clientPromise from "@/lib/mongodb";
import type { Address } from "@/types/address";

export async function searchAddresses(query: string): Promise<Address[]> {
    if (query.length < 2) return [];

    const client = await clientPromise;
    const collection = client.db("your_db").collection("addresses");

    const results = await collection.aggregate([
        {
            $search: {
                index: "address",
                autocomplete: {
                    query: query,
                    path: "address",
                    fuzzy: { maxEdits: 1 } // Allows for 1 typo
                }
            }
        },
        { $limit: 5 },
        { $project: { _id: 1, address: 1, city: 1, zip: 1 } }
    ]).toArray();

    return results as unknown as Address[];
}

export async function testMongoConnection() {
    try {
        const client = await clientPromise
        const db = client.db()
        // Ping the database to verify credentials
        await db.command({ ping: 1 })
        return { success: true, message: "Connected to MongoDB successfully!" }
    } catch (e: any) {
        return { success: false, message: `Connection failed: ${e.message}` }
    }
}