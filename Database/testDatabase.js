const mongoose = require('mongoose');
const {
  connectToDatabase,
  InsertContactInfo,
  getContactInfoByCategory,
  deleteContactInfoById,
} = require('./database');

async function testDatabase() {
  console.log('Starting database test...');

  await connectToDatabase();
  console.log('Connected to database.');

  const newContact = {
    category: 'Michal',
    URL: '0523634381',
    description: 'This site provides services for anorexia victims',
  };
  const createdContact = await InsertContactInfo(newContact);
  console.log('Created contact:', createdContact);

  const contacts = await getContactInfoByCategory('Michal');
  console.log('Contacts found:', contacts);

  if (contacts && contacts.length > 0) {
    const contactToDelete = contacts[0]._id; // Take the first contact's ID
    const deletedContact = await deleteContactInfoById(contactToDelete);
    console.log('Deleted contact:', deletedContact);
  }

  await mongoose.disconnect();
  console.log('Disconnected from database.');
}

testDatabase();
