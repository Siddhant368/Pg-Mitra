const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://siddhantsingh56773_db_user:zxEqAADmIpBMmSQ3@cluster0.h0dr3gy.mongodb.net/?appName=Cluster0');
  const db = mongoose.connection.db;
  
  const deleted = await db.collection('tenants').deleteMany({});
  console.log('Deleted tenants:', deleted.deletedCount);
  
  const updated = await db.collection('beds').updateMany({}, { $set: { status: 'VACANT' } });
  console.log('Reset beds:', updated.modifiedCount);
  
  console.log('Done');
  process.exit(0);
}

run();
