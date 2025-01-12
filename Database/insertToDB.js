const mongoose = require('mongoose');
const { connectToDatabase, InsertContactInfo } = require('../database'); 
const ContactInfo = require('./models/contactInfo'); 

async function insertCategories() {
  try {
    // Step 1: Connect to the MongoDB database
    await connectToDatabase();
    console.log('Connected to database.');

    // Step 2: Define the list of categories with their URLs and descriptions
    const categories = [
      {
        category: 'False Nutrition Claims',
        URL: 'https://pan-il.org/blog/knowledge-bytes/evidence-based-guidance/',
        description: 'PAN Israel - Provides guidance on identifying reliable, evidence-based nutrition and health information from trustworthy sources.',
      },
      {
        category: 'Unverified Medical Claims',
        URL: 'https://pan-il.org/blog/knowledge-bytes/evidence-based-guidance/',
        description: 'PAN Israel - Provides guidance on identifying reliable, evidence-based nutrition and health information from trustworthy sources.',
      },
      {
        category: 'Eating Disorders Encouragement',
        URL: 'https://www.iaed.org.il/',
        description: 'The Israeli Association for Eating Disorders (IAED) - Provides resources, support, treatment standards, and promotes research and policy for the prevention and treatment of eating disorders in Israel.',
      },
      {
        category: 'Harmful Diet Practices',
        URL: 'https://www.iaed.org.il/',
        description: 'The Israeli Association for Eating Disorders (IAED) - Provides resources, support, treatment standards, and promotes research and policy for the prevention and treatment of eating disorders in Israel.',
      },
      {
        category: 'Body Image Issues',
        URL: 'https://www.wtb.org.il/journey-of-body-image-and-the-net/',
        description: 'Women and Their Bodies (WTB) - Promotes positive body image and provides resources for women and girls.',
      },
      {
        category: 'Fat Shaming and Discrimination',
        URL: 'https://www.wtb.org.il/journey-of-body-image-and-the-net/',
        description: 'Women and Their Bodies (WTB) - Promotes positive body image and provides resources for women and girls.',
      },
      {
        category: 'Nutritional Supplements',
        URL: 'https://www.infomed.co.il/articles/5710/',
        description: 'Infomed - Provides guidance on recommended and potentially harmful dietary supplements.',
      },
      {
        category: 'Gender Inequality or Challenges',
        URL: 'https://wizo.org.il/#section12',
        description: 'WIZO (Womens International Zionist Organization) - Provides support, resources, and programs for women, children, and youth, promoting gender equality and womens empowerment.',
      },
      {
        category: 'Emotional Abuse in Relationships',
        URL: 'https://wizo.org.il/#section12',
        description: 'WIZO (Womens International Zionist Organization) - Provides support, resources, and programs for women, children, and youth, promoting gender equality and womens empowerment.',
      },
      {
        category: 'Women and Girls in Crisis Situations',
        URL: 'https://wizo.org.il/#section12',
        description: 'WIZO (Womens International Zionist Organization) - Provides support, resources, and programs for women, children, and youth, promoting gender equality and womens empowerment.',
      },
      {
        category: 'Self-Harm Encouragement',
        URL: 'https://www.eran.org.il/',
        description: 'ERAN (Emotional First Aid) - Provides anonymous and immediate mental health support via phone and online, 24/7, for anyone in need in Israel.',
      },
      {
        category: 'Emotional Distress',
        URL: 'https://www.eran.org.il/',
        description: 'ERAN (Emotional First Aid) - Provides anonymous and immediate mental health support via phone and online, 24/7, for anyone in need in Israel.',
      },
      {
        category: 'Stress and Depression Triggers',
        URL: 'https://www.eran.org.il/',
        description: 'Immediate support for women and girls experiencing stress or depression.',
      },
      {
        category: 'Unplanned Pregnancy',
        URL: 'https://www.opendoor.org.il/',
        description: 'Open Door - Provides counseling and support for unplanned pregnancy, offering guidance and resources for young women.',
      },
      {
        category: 'Relationship Challenges',
        URL: 'https://www.opendoor.org.il/',
        description: 'Open Door - Provides advice and counseling on relationship challenges, offering support for young women navigating interpersonal dynamics.',
      },
      {
        category: 'Exploring Sexual Identity or Orientation',
        URL: 'https://www.opendoor.org.il/',
        description: 'Open Door - Offers counseling and support for topics related to sexual identity and orientation, helping young women explore these issues.',
      },
      {
        category: 'Sexual Health and Education',
        URL: 'https://www.opendoor.org.il/',
        description: 'Open Door - Offers accurate and evidence-based counseling on sexual health and education, addressing common questions and myths.',
      },
      {
        category: 'Offensive or Inciteful Content Online',
        URL: 'https://www.isoc.org.il/netica/report',
        description: 'Israel Internet Association - Internet Safety Hotline provides support and guidance for addressing and reporting offensive, violent, or inciteful content online.',
      },
      {
        category: 'Cyberbullying and Online Harassment',
        URL: 'https://www.isoc.org.il/netica/report',
        description: 'Israel Internet Association - Internet Safety Hotline offers assistance and recommendations for dealing with cyberbullying and online harassment.',
      },
      {
        category: 'Misinformation or Fake News',
        URL: 'https://www.isoc.org.il/netica/report',
        description: 'Israel Internet Association - Internet Safety Hotline provides guidelines for identifying and reporting misleading or fake news content.',
      },
      {
        category: 'Emotional or Physical Abuse in Relationships',
        URL: 'https://www.1202.org.il/',
        description: 'Support for women who have experienced emotional or physical abuse.',
      },
      {
        category: 'Trauma or Recovery',
        URL: 'https://thewomenproject.org.il/',
        description: 'The Women Project - Empowers women affected by trauma through trauma-focused therapeutic programs, including strength training, yoga, and somatic movement, in a safe and supportive environment.',
      },
    ];

  // Step 3: Loop through each category in the list and insert it into the database
  for (const category of categories) {
    const result = await InsertContactInfo(data)(category); 
    console.log(result.message); // Log the result of the insertion
  }

  console.log('All categories were processed.'); // Log when all categories have been processed
} catch (err) {
  console.error('Error processing categories:', err.message); // Log any unexpected errors
} finally {
  // Step 4: Disconnect from the database
  await mongoose.disconnect();
  console.log('Disconnected from database.');
}
}

// Execute the function to insert categories into the database
insertCategories();