import mongoose from 'mongoose';

const acousticSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  url: { type: String, required: true },
  name: { type: String, required: true },
  solanaWallet: { type: String, required: false }, // Optional Solana Wallet field
});

const Acoustic = mongoose.model('Acoustic', acousticSchema);
export default Acoustic;
