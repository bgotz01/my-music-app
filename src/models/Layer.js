// src/models/Layer.js
import mongoose from 'mongoose';

const layerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  soundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sound', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
});

const Layer = mongoose.model('Layer', layerSchema);

export default Layer;
