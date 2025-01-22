const mongoose = require('mongoose'); 
const ContactInfo = require('./models/contactInfo'); 

async function connectToDatabase() {
  const dbURI = 'mongodb+srv://michal:m1234@cluster0.0ttrt.mongodb.net/BESafeProject?retryWrites=true&w=majority'; 
  try {
    await mongoose.connect(dbURI); 
    console.log('Connected to MongoDB'); 
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message); 
    process.exit(1); 
  }
}

async function InsertContactInfo(data) {
    try {
      const contactInfo = new ContactInfo(data); 
      const savedContact = await contactInfo.save(); 
      console.log(`Contact saved: ${savedContact.category}`); 
      return savedContact; 
    } catch (err) {
      if (err.code === 11000) {
        console.log(`Category "${data.category}" already exists. Skipping...`);
        return { status: 'skipped', message: `Category "${data.category}" already exists.` }; 
      } else {
        console.error(`Error saving contact info for category "${data.category}":`, err.message); 
        return { status: 'error', message: err.message }; 
      }
    }
  }

async function getContactInfoByCategory(category) {
  try {
    const results = await ContactInfo.find({ category }); 
    if (results.length === 0) {
      console.log(`No contact info found for category: ${category}`); 
      return null; 
    }
    return results;
  } catch (err) {
    console.error('Error fetching contact info:', err.message); 
    throw err; 
  }
}

async function deleteContactInfoById(id) {
  try {
    const deletedContact = await ContactInfo.findByIdAndDelete(id); // Find a document by its ID and delete it
    if (!deletedContact) {
      console.log(`No contact found with ID: ${id}`); 
      return null; 
    }
    console.log('Deleted contact:', deletedContact); 
    return deletedContact; 
  } catch (err) {
    console.error('Error deleting contact info:', err.message); 
    throw err; 
  }
}

module.exports = {
  connectToDatabase, 
  InsertContactInfo, 
  getContactInfoByCategory, 
  deleteContactInfoById, 
};
