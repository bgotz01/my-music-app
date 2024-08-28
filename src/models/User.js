// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  solanaWallet: { type: String },
  sounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sound' }], // Reference to the Sound schema
  layers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Layer' }], // Reference to the Layer schema
  profilePic: { type: String } 
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
