// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectMongo from './src/lib/db.js';
import User from './src/models/User.js';
import jwt from 'jsonwebtoken';
import Sound from './src/models/Sound.js'; 
import Layer from './src/models/Layer.js';
import multer from 'multer';
import Like from './src/models/Like.js';
import Comment from './src/models/Comment.js';


const server = express();
server.use(cors());
server.use(express.json());

// Setup Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

connectMongo();

// User registration route
server.post('/api/register', async (req, res) => {
  const { username, password, email, solanaWallet } = req.body;
  try {
    const user = new User({ username, password, email, solanaWallet });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login route
server.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret');
    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        solanaWallet: user.solanaWallet,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User info route
server.get('/api/userinfo', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: user.username,
      email: user.email,
      solanaWallet: user.solanaWallet,
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Update user info route
server.put('/api/userinfo', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const { email, solanaWallet } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { email, solanaWallet },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email,
      solanaWallet: updatedUser.solanaWallet,
      userId: updatedUser._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Route to fetch producers who have uploaded sounds
server.get('/api/usernames', async (req, res) => {
  try {
    const sounds = await Sound.find({}, 'userId').populate('userId', 'username');
    const producers = [];

    sounds.forEach(sound => {
      if (sound.userId && sound.userId.username) {
        producers.push({ username: sound.userId.username, userId: sound.userId._id });
      }
    });

    // Remove duplicates based on userId
    const uniqueProducers = Array.from(new Set(producers.map(p => p.userId)))
                                 .map(id => producers.find(p => p.userId === id));

    res.status(200).json(uniqueProducers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Add other routes here


// SOUNDS


// Sound routes
server.post('/api/sounds', async (req, res) => {
  const { userId, url, name, solanaWallet, genre, key, bpm } = req.body;
  if (!userId || !url || !name || !genre || !key || !bpm) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const soundData = {
      userId,
      username: user.username, // Fetching username from user
      url,
      name,
      genre,
      key,
      bpm,
      solanaWallet,
      createdAt: new Date(),
    };

    const sound = new Sound(soundData);
    await sound.save();
    res.status(201).json(sound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to update sound details
server.put('/api/sounds/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bpm, key, genre, imageUrl } = req.body;

  try {
    const sound = await Sound.findByIdAndUpdate(id, { name, bpm, key, genre, imageUrl }, { new: true });
    if (!sound) {
      return res.status(404).json({ message: 'Sound not found' });
    }
    res.status(200).json(sound);
  } catch (error) {
    console.error('Error updating sound:', error);
    res.status(500).json({ message: 'Error updating sound' });
  }
});



// Image upload route
server.post('/api/upload-image/:soundId', upload.single('file'), async (req, res) => {
  const { soundId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: `images/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(params).promise();

    // Update the Sound document with the new imageUrl
    const sound = await Sound.findByIdAndUpdate(
      soundId,
      { imageUrl: uploadResult.Location },
      { new: true }
    );

    if (!sound) {
      return res.status(404).json({ message: 'Sound not found' });
    }

    res.status(200).json({ imageUrl: uploadResult.Location });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});



// Route to get all sounds or filter by username
server.get('/api/sounds', async (req, res) => {
  try {
    const { username } = req.query;
    let filter = {};
    if (username) {
      filter.username = username;
    }

    // Find sounds with optional filtering by username and populate the comments
    const sounds = await Sound.find(filter).populate('comments');

    // Fetch the layer count for each sound and add it to the sound objects
    const soundsWithLayerCount = await Promise.all(sounds.map(async sound => {
      const layerCount = await Layer.countDocuments({ soundId: sound._id });
      return { ...sound.toObject(), layerCount };
    }));

    res.status(200).json(soundsWithLayerCount);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    res.status(500).json({ message: error.message });
  }
});

// Correct route to get all sounds by username
server.get('/api/sounds/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const sounds = await Sound.find({ username }).populate('comments');

    if (sounds.length === 0) {
      return res.status(404).json({ message: 'No sounds found for this producer' });
    }

    // Fetch the layer count for each sound and add it to the sound objects
    const soundsWithLayerCount = await Promise.all(
      sounds.map(async (sound) => {
        const layerCount = await Layer.countDocuments({ soundId: sound._id });
        return { ...sound.toObject(), layerCount };
      })
    );

    res.status(200).json(soundsWithLayerCount);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    res.status(500).json({ message: error.message });
  }
});




// Route to get all sounds for a specific user
server.get('/api/sounds/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const sounds = await Sound.find({ userId });
    res.status(200).json(sounds);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    res.status(500).json({ message: error.message });
  }
});

server.get('/api/sounds/:id', async (req, res) => {
  try {
    const sound = await Sound.findById(req.params.id);
    if (!sound) {
      return res.status(404).json({ message: 'Sound not found' });
    }
    res.status(200).json(sound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a specific sound by ID
server.delete('/api/sounds/:id', async (req, res) => {
  try {
    const sound = await Sound.findByIdAndDelete(req.params.id);
    if (!sound) {
      return res.status(404).json({ message: 'Sound not found' });
    }
    res.status(200).json({ message: 'Sound deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// LAYERS

// Add a new layer
server.post('/api/layer', async (req, res) => {
  const { userId, name, url, soundId, type } = req.body;

  if (!userId || !url || !name || !soundId || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const layerData = {
      userId,
      username: user.username,
      url,
      name,
      soundId,
      type,
      createdAt: new Date(),
    };

    const layer = new Layer(layerData);
    await layer.save();
    res.status(201).json(layer);
  } catch (error) {
    console.error('Error adding layer:', error);
    res.status(500).json({ message: error.message });
  }
});

//get all layers
server.get('/api/layers', async (req, res) => {
  const { soundId } = req.query;
  try {
    const layers = await Layer.find({ soundId });
    res.status(200).json(layers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get layers by sound ID
server.get('/api/layers/sound/:soundId', async (req, res) => {
  try {
    const layers = await Layer.find({ soundId: req.params.soundId });
    res.status(200).json(layers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all layers for a specific user
server.get('/api/layers/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Find layers and populate the 'soundId' field with the 'name' from the Sound model
    const layers = await Layer.find({ userId })
      .populate('soundId', 'name');  // Populate soundId with only the 'name' field

    res.status(200).json(layers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to delete a specific layer by ID
server.delete('/api/layers/:id', async (req, res) => {
  try {
    const layer = await Layer.findByIdAndDelete(req.params.id);
    if (!layer) {
      return res.status(404).json({ message: 'Layer not found' });
    }
    res.status(200).json({ message: 'Layer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to get likes and comments for a layer
server.get('/api/layers/:layerId/likes-comments', async (req, res) => {
  const { layerId } = req.params;

  try {
    const layer = await Layer.findById(layerId).populate('likes').populate('comments');

    if (!layer) {
      return res.status(404).json({ message: 'Layer not found' });
    }

    const isLiked = layer.likes.some(like => like.userId.toString() === req.query.userId);
    res.status(200).json({
      likes: layer.likes.length,
      comments: layer.comments.map(comment => ({
        username: comment.username,
        comment: comment.comment,
      })),
      isLiked,
    });
  } catch (error) {
    console.error('Error fetching likes and comments:', error);
    res.status(500).json({ message: error.message });
  }
});



// LIKES AND COMMENTS

server.post('/api/like', async (req, res) => {
  const { userId, username, soundId, layerId } = req.body;

  try {
    let item;

    if (soundId) {
      item = await Sound.findById(soundId).populate('likes').populate('comments');
    } else if (layerId) {
      item = await Layer.findById(layerId).populate('likes').populate('comments');
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const existingLike = await Like.findOne({ userId, soundId, layerId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      item.likes.pull(existingLike._id);
    } else {
      const like = new Like({ userId, username, soundId, layerId });
      await like.save();
      item.likes.push(like._id);
    }

    await item.save();

    // Refetch the updated item with populated likes and comments
    if (soundId) {
      item = await Sound.findById(soundId).populate('likes').populate('comments');
    } else if (layerId) {
      item = await Layer.findById(layerId).populate('likes').populate('comments');
    }

    // Return the updated item, whether it's a Sound or a Layer
    res.status(200).json(item);
  } catch (error) {
    console.error('Error liking item:', error);
    res.status(500).json({ message: error.message });
  }
});





// Route to comment on a sound or layer
server.post('/api/comment', async (req, res) => {
  const { userId, username, comment, soundId, layerId } = req.body;

  try {
    let item;

    if (soundId) {
      item = await Sound.findById(soundId).populate('comments');
    } else if (layerId) {
      item = await Layer.findById(layerId).populate('comments');
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const newComment = new Comment({ userId, username, comment, soundId, layerId });
    await newComment.save();

    item.comments.push(newComment._id);
    await item.save();

    // Refetch the updated item with populated comments
    if (soundId) {
      item = await Sound.findById(soundId).populate('likes').populate('comments');
    } else if (layerId) {
      item = await Layer.findById(layerId).populate('likes').populate('comments');
    }

    // Return the updated item
    res.status(200).json(item);
  } catch (error) {
    console.error('Error commenting on item:', error);
    res.status(500).json({ message: error.message });
  }
});



// Route to delete a comment
server.delete('/api/comment/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    let item;
    if (comment.soundId) {
      item = await Sound.findById(comment.soundId).populate('comments').populate('likes');
      item.comments.pull(commentId);
      await item.save();
      console.log('Sound after deleting comment:', item); // Log the updated sound
    } else if (comment.layerId) {
      item = await Layer.findById(comment.layerId).populate('comments').populate('likes');
      item.comments.pull(commentId);
      await item.save();
      console.log('Layer after deleting comment:', item); // Log the updated layer
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: error.message });
  }
});





server.all('*', (req, res) => {
  res.status(404).send('Not found');
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`> API server ready on http://localhost:${PORT}`);
});
