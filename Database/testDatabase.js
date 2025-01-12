const mongoose = require('mongoose');
const {
  connectToDatabase,
  InsertContactInfo,
  getContactInfoByCategory,
  deleteContactInfoById, // Import the delete function
} = require('../database');

async function testDatabase() {
  console.log('Starting database test...');

  // Connect to the database
  await connectToDatabase();
  console.log('Connected to database.');

  // Create a new contact
  const newContact = {
    category: 'Michal',
    URL: '0523634381',
    description: 'This site provides services for anorexia victims',
  };
  const createdContact = await InsertContactInfo(newContact);
  console.log('Created contact:', createdContact);

  // Fetch data by category
  const contacts = await getContactInfoByCategory('Michal');
  console.log('Contacts found:', contacts);

  // Delete a contact by ID
  if (contacts && contacts.length > 0) {
    const contactToDelete = contacts[0]._id; // Take the first contact's ID
    const deletedContact = await deleteContactInfoById(contactToDelete);
    console.log('Deleted contact:', deletedContact);
  }

  // Disconnect from the database
  await mongoose.disconnect();
  console.log('Disconnected from database.');
}

testDatabase();
