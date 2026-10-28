import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  console.log('Database dropped');
  process.exit(0);
}
run();
