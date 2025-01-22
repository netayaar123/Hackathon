const mongoose = require('mongoose');
const { connectToDatabase, deleteContactInfoById } = require('./database');

// Function to delete contacts manually based on provided IDs
async function deleteContactsManually() {
  console.log('Starting manual deletion process...');

  await connectToDatabase(); // Connect to the database
  console.log('Connected to database.');

  // List of contact IDs to be deleted
  const idsToDelete = [
    '677e47d35e6856e0daf4e5e2',
    '677e4e8e51d902675a212923',
    '677e48f3a2852d1db5db0799',
    '677e4a44f1ae8f6c4adc9fcf',
    '677e4de5ae4291f12154aa34',
    '677e4eae589d97954907c706',
  ];

  // Loop through each ID to delete the corresponding contact
  for (const id of idsToDelete) {
    try {
      const deletedContact = await deleteContactInfoById(id); // Delete contact by ID
      if (deletedContact) {
        console.log(`Successfully deleted contact with ID: ${id}`); // Log success message
      } else {
        console.log(`No contact found with ID: ${id}`); // Log if no contact was found for the ID
      }
    } catch (err) {
      console.error(`Error deleting contact with ID: ${id}`, err.message); // Log any error that occurs during deletion
    }
  }

  await mongoose.disconnect(); // Disconnect from the database
  console.log('Disconnected from database.');
}

// Run the function to delete contacts manually
deleteContactsManually();
