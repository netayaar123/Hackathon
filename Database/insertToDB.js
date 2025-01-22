const mongoose = require('mongoose');
const { connectToDatabase, InsertContactInfo } = require('../database');
const ContactInfo = require('./models/contactInfo');

// Function to insert categories into the database
async function insertCategories() {
  try {
    await connectToDatabase(); // Connect to the database
    console.log('Connected to database.');

    // Define an array of categories to insert
    const categories = [
      {
        category: 'False Nutrition Claims',
        URL: 'https://pan-il.org/blog/knowledge-bytes/evidence-based-guidance/',
        description: 'PAN Israel - Provides guidance on identifying reliable, evidence-based nutrition and health information from trustworthy sources.',
      },
      // Other categories here...
    ];

    // Loop through each category and insert it into the database
    for (const category of categories) {
      const result = await InsertContactInfo(data)(category); // Insert category into the database
      console.log(result.message); // Log the result of the insertion
    }

    console.log('All categories were processed.'); // Log when all categories have been processed
  } catch (err) {
    console.error('Error processing categories:', err.message); // Log any unexpected errors
  } finally {
    await mongoose.disconnect(); // Disconnect from the database
    console.log('Disconnected from database.');
  }
}

// Call the function to insert categories
insertCategories();
