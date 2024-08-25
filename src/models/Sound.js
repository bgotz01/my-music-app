// src/models/Sound.js
import mongoose from 'mongoose';

const soundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  bpm: { type: Number, required: false },
  key: { type: String, required: false },
  genre: { type: String, required: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  layers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Layer' }],
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Sound = mongoose.model('Sound', soundSchema);

export default Sound;
