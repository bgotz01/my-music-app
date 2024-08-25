import mongoose from 'mongoose';

const connectMongo = async () => {
  const uri = 'mongodb+srv://bgotzev:0w5haQDRDjGfPvlQ@cluster0.uqp6e5p.mongodb.net/producers?retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(uri, {

      dbName: 'producers',
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectMongo;
