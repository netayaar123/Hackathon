import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/classificationRoutes.js';
import { connectToDatabase } from '../Database/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Serve static images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enable CORS with the allowed client URL from environment variables
app.use(cors({
  origin: process.env.CLIENT_URL
}));

// Route for checking if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes for classification and harmful sentence detection
app.use('/api', rubberDuckRoutes);

async function startServer() {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to the database successfully.');

    // Start the server on the specified port
    const PORT = process.env.PORT || 5012;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // Handle database connection failure
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

// Initialize the server
startServer();
