const mongoose = require('mongoose');
const ContactInfo = require('./models/contactInfo');

// Function to connect to MongoDB
async function connectToDatabase() {
  const dbURI = 'mongodb+srv://michal:m1234@cluster0.0ttrt.mongodb.net/BESafeProject?retryWrites=true&w=majority';
  try {
    await mongoose.connect(dbURI); // Connect to MongoDB
    console.log('Connected to MongoDB'); // Log success
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message); // Log error on failure
    process.exit(1); // Exit if connection fails
  }
}

// Function to insert contact info into the database
async function InsertContactInfo(data) {
  try {
    const contactInfo = new ContactInfo(data); // Create new contact
    const savedContact = await contactInfo.save(); // Save contact info
    console.log(`Contact saved: ${savedContact.category}`); // Log saved contact
    return savedContact; // Return saved contact
  } catch (err) {
    if (err.code === 11000) { // Handle duplicate category
      console.log(`Category "${data.category}" already exists. Skipping...`);
      return { status: 'skipped', message: `Category "${data.category}" already exists.` };
    } else {
      console.error(`Error saving contact info for category "${data.category}":`, err.message);
      return { status: 'error', message: err.message }; // Return error message
    }
  }
}

// Function to get contact info by category
async function getContactInfoByCategory(category) {
  try {
    const results = await ContactInfo.find({ category }); // Find contact by category
    if (results.length === 0) {
      console.log(`No contact info found for category: ${category}`); // No data found
      return null;
    }
    return results; // Return found contact info
  } catch (err) {
    console.error('Error fetching contact info:', err.message); // Log error
    throw err; // Throw error for caller to handle
  }
}

// Function to delete contact info by ID
async function deleteContactInfoById(id) {
  try {
    const deletedContact = await ContactInfo.findByIdAndDelete(id); // Delete contact by ID
    if (!deletedContact) {
      console.log(`No contact found with ID: ${id}`); // No contact found
      return null;
    }
    console.log('Deleted contact:', deletedContact); // Log deleted contact
    return deletedContact; // Return deleted contact info
  } catch (err) {
    console.error('Error deleting contact info:', err.message); // Log error
    throw err; // Throw error for caller to handle
  }
}

module.exports = {
  connectToDatabase,
  InsertContactInfo,
  getContactInfoByCategory,
  deleteContactInfoById,
};
