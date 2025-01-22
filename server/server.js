import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/classificationRoutes.js'; // Import the routes
import { connectToDatabase } from '../Database/database.js'; // Import the database connection function

// Use import.meta.url instead of __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

app.use(cors({
  origin: process.env.CLIENT_URL
}));

// Base route to test if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Use the routes file for /ducks routes
app.use('/api', rubberDuckRoutes);

// Function to start the server after connecting to the database
async function startServer() {
  try {
    await connectToDatabase(); // Connect to the database
    console.log('Connected to the database successfully.');

    const PORT = process.env.PORT || 5012;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
}

// Start the server
startServer();