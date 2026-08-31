import mongoose from 'mongoose';

export async function connectDb(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set — check server/.env');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[api] mongo connected → ${mongoose.connection.name}`);
}
