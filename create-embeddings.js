import { MongoClient } from 'mongodb';
import { getEmbedding } from './get-embeddings.js'; // Assuming this function generates embeddings
import dotenv from 'dotenv';
dotenv.config();

// Connect to your Atlas cluster
const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

export async function run() {
    try {
        await client.connect();
        const db = client.db("v4_hotels");
        const collection = db.collection("hotels");

        // Filter to exclude documents with null or empty relevant fields
        const filter = {
            "address": { "$nin": [null, ""] },
            "country": { "$nin": [null, ""] },
            "district": { "$nin": [null, ""] },
            "hotel_name": { "$nin": [null, ""] }
        };

        // Get a subset of documents from the collection
        const documents = await collection.find(filter).limit(50).toArray();
        console.log('***', documents);
        // Create embeddings from the relevant fields for each document
        let updatedDocCount = 0;
        console.log("Generating embeddings for hotel documents...");

        await Promise.all(documents.map(async doc => {
            // Collect the relevant fields to embed
            const fieldsToEmbed = [
                doc.address,
                doc.country,
                doc.district,
                doc.hotel_name
            ];

            // Create the text to pass to the embedding model
            const textToEmbed = fieldsToEmbed.filter(Boolean).join(", ");

            // Generate the embedding using the getEmbedding function
            const embedding = await getEmbedding(textToEmbed);

            // Update the document with a new hotel_embedding field
            await collection.updateOne(
                { "_id": doc._id },
                { "$set": { "hotel_embedding": embedding } }
            );

            updatedDocCount += 1;
        }));

        console.log(`Count of documents updated with hotel embeddings: ${updatedDocCount}`);
    } catch (err) {
        console.error("Error during embedding generation:", err.stack);
    } finally {
        await client.close();
    }
}
