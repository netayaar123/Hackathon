import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/rubberDucks.js'; // Import the routes
import { connectToDatabase } from '../Database/database.js'; // Import the database connection function

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images

app.use(cors({
  origin: process.env.CLIENT_URL
}));

// Base route to test if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Add a route to test the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await connectToDatabase(); // Attempt to connect to the database
    res.status(200).json({ message: 'Successfully connected to the database.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to connect to the database.', error: error.message });
  }
});

// Use the routes file for `/ducks` routes
app.use('/api', rubberDuckRoutes);

// Start server
const PORT = process.env.PORT || 5012;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
