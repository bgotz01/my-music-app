// src/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  soundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sound' },
  layerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Layer' },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
