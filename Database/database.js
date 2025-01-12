const mongoose = require('mongoose'); 
const ContactInfo = require('./models/contactInfo'); 

// Function to connect to MongoDB
async function connectToDatabase() {
  const dbURI = 'mongodb+srv://michal:m1234@cluster0.0ttrt.mongodb.net/BESafeProject?retryWrites=true&w=majority'; 
  try {
    await mongoose.connect(dbURI); // Establish connection to MongoDB
    console.log('Connected to MongoDB'); 
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message); 
    process.exit(1); // Exit the process if the connection fails
  }
}

// Function to insert a new ContactInfo document in the database
async function InsertContactInfo(data) {
    try {
      const contactInfo = new ContactInfo(data); // Create a new instance of the ContactInfo model with the provided data
      const savedContact = await contactInfo.save(); // Save the document to the database
      console.log(`Contact saved: ${savedContact.category}`); // Log the saved document
      return savedContact; // Return the saved document
    } catch (err) {
      if (err.code === 11000) {
        // Handle duplicate category error (error code 11000)
        console.log(`Category "${data.category}" already exists. Skipping...`);
        return { status: 'skipped', message: `Category "${data.category}" already exists.` }; 
      } else {
        console.error(`Error saving contact info for category "${data.category}":`, err.message); 
        return { status: 'error', message: err.message }; 
      }
    }
  }
  

// Function to fetch ContactInfo documents by category
async function getContactInfoByCategory(category) {
  try {
    const results = await ContactInfo.find({ category }); // Query the database for documents matching the given category
    if (results.length === 0) {
      console.log(`No contact info found for category: ${category}`); 
      return null; // Return null if no matches are found
    }
    return results; // Return the found documents
  } catch (err) {
    console.error('Error fetching contact info:', err.message); 
    throw err; 
  }
}

// Function to delete a ContactInfo document by its ID
async function deleteContactInfoById(id) {
  try {
    const deletedContact = await ContactInfo.findByIdAndDelete(id); // Find a document by its ID and delete it
    if (!deletedContact) {
      console.log(`No contact found with ID: ${id}`); 
      return null; 
    }
    console.log('Deleted contact:', deletedContact); 
    return deletedContact; // Return the deleted document
  } catch (err) {
    console.error('Error deleting contact info:', err.message); 
    throw err; 
  }
}

// Exporting the functions for use in other parts of the application
module.exports = {
  connectToDatabase, 
  InsertContactInfo, 
  getContactInfoByCategory, 
  deleteContactInfoById, 
};
