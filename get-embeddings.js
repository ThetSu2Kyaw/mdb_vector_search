import { pipeline } from '@xenova/transformers';

export async function getEmbedding(data) {
    try {
        // Load the embedding pipeline
        const embedder = await pipeline(
            'feature-extraction',
            'Xenova/nomic-embed-text-v1' //embedding model
        );

        // Generate the embedding
        const results = await embedder(data, { pooling: 'mean', normalize: true });

        console.log("Embedding generated successfully.", results);
        return Array.from(results.data);
    } catch (error) {
        console.error("Error generating embedding:", error);
    }
}
