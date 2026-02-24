import mongoose from 'mongoose'

export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI
  if (!mongoUri) throw new Error('MONGODB_URI is not set')

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
  console.log('✅ Connected to MongoDB')
}
