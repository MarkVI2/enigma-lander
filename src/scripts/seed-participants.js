import { MongoClient } from 'mongodb';

// Define MongoDB connection parameters
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon';
const MONGODB_DB = process.env.MONGODB_DB || 'hackathon';

// Connect to database function
async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  return { client, db };
}

async function seedParticipants() {
  try {
    console.log('Connecting to database...');
    const { db, client } = await connectToDatabase();
    
    // Create collection if it doesn't exist
    const collections = await db.listCollections({ name: 'participants' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('participants');
      console.log('Created participants collection');
    }
    
    // Create index on email field for faster lookups and to ensure uniqueness
    await db.collection('participants').createIndex({ email: 1 }, { unique: true });
    console.log('Created unique index on email field');
    
    // Sample participant records
    const participantRecords = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        teamName: 'Code Ninjas',
        quizAttempted: false,
        registeredAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        teamName: 'Byte Busters',
        quizAttempted: true,
        registeredAt: new Date()
      },
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        teamName: 'Pixel Pirates',
        quizAttempted: false,
        registeredAt: new Date()
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        teamName: 'Byte Busters',
        quizAttempted: true,
        registeredAt: new Date()
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        teamName: 'Code Ninjas',
        quizAttempted: false,
        registeredAt: new Date()
      }
    ];
    
    // Insert participant records
    for (const record of participantRecords) {
      try {
        await db.collection('participants').updateOne(
          { email: record.email },
          { $set: record },
          { upsert: true }
        );
        console.log(`Inserted/updated participant: ${record.name} (${record.email})`);
      } catch (error) {
        console.error(`Error inserting participant ${record.email}:`, error);
      }
    }
    
    console.log('Participant records inserted successfully');
    
    // Close the connection
    await client.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding participants database:', error);
  }
}

// Run the seed function
seedParticipants(); 