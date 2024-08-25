// src/models/Instrumental.js

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const instrumentalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  solanaWallet: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

const Instrumental = mongoose.model('Instrumental', instrumentalSchema);

export default Instrumental;
