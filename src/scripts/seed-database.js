import { MongoClient } from 'mongodb';

// Define MongoDB connection parameters directly in this file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon';
const MONGODB_DB = process.env.MONGODB_DB || 'hackathon';

// Connect to database function
async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  return { client, db };
}

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    const { db, client } = await connectToDatabase();
    
    // Create collection if it doesn't exist
    const collections = await db.listCollections({ name: 'quiz_results' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('quiz_results');
      console.log('Created quiz_results collection');
    }
    
    // Create index on email field for faster lookups and to ensure uniqueness
    await db.collection('quiz_results').createIndex({ email: 1 }, { unique: true });
    console.log('Created unique index on email field');
    
    // Sample dummy records
    const dummyRecords = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        teamName: 'Code Ninjas',
        quizAttempted: true,
        score: 80,
        answers: ['Central Processing Unit', 'Stack', 'O(log n)', 'I\'m a teapot', 'Functional Programming'],
        completedAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        teamName: 'Byte Busters',
        quizAttempted: true,
        score: 100,
        answers: ['Central Processing Unit', 'Stack', 'O(log n)', 'I\'m a teapot', 'Functional Programming'],
        completedAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        teamName: 'Pixel Pirates',
        quizAttempted: true,
        score: 60,
        answers: ['Central Processing Unit', 'Queue', 'O(n)', 'I\'m a teapot', 'Functional Programming'],
        completedAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert dummy records
    for (const record of dummyRecords) {
      try {
        await db.collection('quiz_results').updateOne(
          { email: record.email },
          { $set: record },
          { upsert: true }
        );
        console.log(`Inserted/updated record for ${record.email}`);
      } catch (error) {
        console.error(`Error inserting record for ${record.email}:`, error);
      }
    }
    
    console.log('Dummy records inserted successfully');
    
    // Close the connection
    await client.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();
