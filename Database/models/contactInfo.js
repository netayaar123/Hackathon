const mongoose = require('mongoose'); 

// Define the schema for the ContactInfo collection
const contactInfoSchema = new mongoose.Schema({
  category: {
    type: String, 
    required: true, 
    unique: true, 
  },
  URL: {
    type: String, 
    required: true, 
  },
  description: {
    type: String, 
    required: true, 
  },
}, 
{ 
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields to the schema
});

// Create a model for the ContactInfo schema
const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema); 
// The model represents the "ContactInfo" collection in MongoDB, based on the schema

module.exports = ContactInfo; 
