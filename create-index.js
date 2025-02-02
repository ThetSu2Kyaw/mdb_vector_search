
export async function run(client, collection) {
    try {
        // define your Atlas Search index
        const index = {
            name: "vector_index",
            type: "vectorSearch",
            definition: {
                fields: [
                    {
                        type: "vector",
                        path: "hotel_embedding", // Update to the correct field name
                        similarity: "dotProduct", // Choose similarity measure (cosine or dotProduct)
                        numDimensions: 768, // Ensure this matches the vector dimensions
                    },
                ],
            },
        };


        const result = await collection.createSearchIndex(index);
    } finally {
        await client.close();
    }
}
