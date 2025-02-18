// Import necessary modules
import express from 'express';
import { MongoClient } from 'mongodb';
import { getEmbedding } from './get-embeddings.js';
import { run as generateEmbeddings } from './create-embeddings.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
let collection;

async function connectMongoDB() {
    try {
        const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
        await client.connect();
        const database = client.db('v4_hotels');
        collection = database.collection('hotels');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the application if the connection fails
    }
}

// Define the search endpoint
app.post('/search', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        console.log('Generating embedding for query:', query);
        const queryEmbedding = await getEmbedding(query);
        console.log('Query embedding generated successfully.');

        // Define the vector search pipeline
        const pipeline = [
            {
                $vectorSearch: {
                    index: 'vector_index', // Replace with your index name
                    queryVector: queryEmbedding,
                    path: 'hotel_embedding',
                    exact: true,
                    limit: 10,
                },
            },
            {
                $match: {
                    $or: [
                        { country: query },
                        { hotel_name: { $regex: query, $options: 'i' } },
                        { district: query },
                        { address: { $regex: query, $options: 'i' } },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    hotel_name: 1,
                    price: 1,
                    address: 1,
                    rooms: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ];

        console.log('Running vector search query...');
        const results = collection.aggregate(pipeline);
        const response = [];

        for await (const doc of results) {
            response.push(doc);
        }

        console.log('Search results:', response);
        res.json(response);
    } catch (err) {
        console.error('Error during vector search query:', err);
        res.status(500).json({ error: err.message });
    }
});

// Define the create endpoint
app.post('/create', async (req, res) => {
    try {
        const hotelData = req.body;

        if (!hotelData) {
            return res.status(400).json({ error: 'Invalid hotel data.' });
        }

        // Insert the document into the collection
        const result = await collection.insertOne(hotelData);
        console.log(`Inserted document with _id: ${result.insertedId}`);

        // Generate embeddings after the document is inserted
        await generateEmbeddings();

        res.status(201).json({
            message: 'Hotel created, embeddings generated, and index updated.',
            id: result.insertedId,
        });
    } catch (err) {
        console.error('Error during hotel creation:', err.stack);
        res.status(500).json({ error: 'Failed to create hotel.' });
    }
});

// Start the server after MongoDB connection is established
async function startServer() {
    await connectMongoDB(); // Ensure MongoDB is connected before starting the server
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${port}`);
    });
}

// Start the application
startServer();
