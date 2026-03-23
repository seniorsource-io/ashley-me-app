'use server';

import clientPromise from "@/lib/mongodb";
import type { Community } from "@/lib/definitions";

export async function searchAddresses(query: string): Promise<Community[]> {
    if (query.length < 1) return [];

    const client = await clientPromise;
    const collection = client.db("senior_living_db").collection("communities");

    const results = await collection.aggregate([
        {
            $search: {
                index: "address",
                compound: {
                  // 'should' adds to the score; it doesn't strictly filter
                  should: [
                    {
                      autocomplete: {
                        query: query,
                        path: "address"
                        //fuzzy: { maxEdits: 1 }
                      }
                    },
                    {
                      phrase: {
                        query: query,
                        path: "address",
                        // Multiply the score of exact phrase matches by 5
                        score: { boost: { value: 5 } } 
                      }
                    }
                  ]
                }
              }
        },
        { $limit: 5 },
        { $project: { _id: 1, address: 1, city: 1, state: 1, zip: 1, phone: 1, email: 1, license_number: 1, firstname: 1, lastname: 1, gender_restriction: 1, has_medicaid_contract: 1, medicaid_spend_down: 1, monthly_base_price: 1, monthly_high_price: 1, care_services: 1, community_rating: 1, community_rating_reason: 1, community_narrative: 1, title: 1, website: 1, description: 1, images: 1, videos: 1, documents: 1, links: 1, tags: 1, created_at: 1, updated_at: 1 } }

    ]).toArray();

    return JSON.parse(JSON.stringify(results)) as Community[];
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