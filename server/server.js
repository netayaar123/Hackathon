import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import rubberDuckRoutes from './routes/classificationRoutes.js';
import { connectToDatabase } from '../Database/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api', rubberDuckRoutes);

async function startServer() {
  try {
    await connectToDatabase();
    console.log('Connected to the database successfully.');

    const PORT = process.env.PORT || 5012;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

startServer();