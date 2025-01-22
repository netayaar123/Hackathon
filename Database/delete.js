const mongoose = require('mongoose');
const { connectToDatabase, deleteContactInfoById } = require('./database');

async function deleteContactsManually() {
  console.log('Starting manual deletion process...');

  await connectToDatabase();
  console.log('Connected to database.');

  const idsToDelete = [
    '677e47d35e6856e0daf4e5e2',
    '677e4e8e51d902675a212923',
    '677e48f3a2852d1db5db0799',
    '677e4a44f1ae8f6c4adc9fcf',
    '677e4de5ae4291f12154aa34',
    '677e4eae589d97954907c706',
  ];

  for (const id of idsToDelete) {
    try {
      const deletedContact = await deleteContactInfoById(id);
      if (deletedContact) {
        console.log(`Successfully deleted contact with ID: ${id}`);
      } else {
        console.log(`No contact found with ID: ${id}`);
      }
    } catch (err) {
      console.error(`Error deleting contact with ID: ${id}`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log('Disconnected from database.');
}

deleteContactsManually();
