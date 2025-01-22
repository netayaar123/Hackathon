const mongoose = require('mongoose');
const {
  connectToDatabase,
  InsertContactInfo,
  getContactInfoByCategory,
  deleteContactInfoById,
} = require('./database');

// Function to test database operations (create, retrieve, delete)
async function testDatabase() {
  console.log('Starting database test...');

  await connectToDatabase(); // Connect to the database
  console.log('Connected to database.');

  // Define a new contact object
  const newContact = {
    category: 'Michal',
    URL: '0523634381',
    description: 'This site provides services for anorexia victims',
  };

  const createdContact = await InsertContactInfo(newContact); // Insert the new contact
  console.log('Created contact:', createdContact);

  const contacts = await getContactInfoByCategory('Michal'); // Retrieve contacts by category
  console.log('Contacts found:', contacts);

  if (contacts && contacts.length > 0) {
    const contactToDelete = contacts[0]._id; // Take the first contact's ID for deletion
    const deletedContact = await deleteContactInfoById(contactToDelete); // Delete the contact by ID
    console.log('Deleted contact:', deletedContact);
  }

  await mongoose.disconnect(); // Disconnect from the database
  console.log('Disconnected from database.');
}

// Call the testDatabase function
testDatabase();