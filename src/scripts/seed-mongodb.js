// MongoDB shell script
db = db.getSiblingDB('hackathon');

// Create collection if it doesn't exist
if (!db.getCollectionNames().includes('quiz_results')) {
  db.createCollection('quiz_results');
  print('Created quiz_results collection');
}

// Create index on email field
db.quiz_results.createIndex({ email: 1 }, { unique: true });
print('Created unique index on email field');

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
dummyRecords.forEach(record => {
  db.quiz_results.updateOne(
    { email: record.email },
    { $set: record },
    { upsert: true }
  );
  print(`Inserted/updated record for ${record.email}`);
});

print('Dummy records inserted successfully'); 