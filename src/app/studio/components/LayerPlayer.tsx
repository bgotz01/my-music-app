// src/app/studio/components/LayerPlayer.tsx

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaStop, FaHeart, FaRegHeart, FaCommentDots, FaVolumeUp, FaVolumeMute, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface LayerPlayerProps {
  url: string;
  name: string;
  userId: string;
  username: string;
  mainPlayerRef: React.RefObject<WaveSurfer>;
  layerId: string; 
}

const LayerPlayer: React.FC<LayerPlayerProps> = ({ url, name, userId, username, mainPlayerRef, layerId }) => {
  const playerRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingWithMain, setIsPlayingWithMain] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<{ _id: string; userId: string; username: string; comment: string; }[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    // Fetch initial likes and comments
    const fetchLikesAndComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/layers/${layerId}/likes-comments`);
        setLikes(response.data.likes);
        setComments(response.data.comments);
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error('Error fetching likes and comments:', error);
      }
    };

    fetchLikesAndComments();
  }, [layerId]);

  const handleLike = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/like', {
        userId,
        username,
        layerId,
      });
      setLikes(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('Error liking layer:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      const response = await axios.post('http://localhost:4000/api/comment', {
        userId,
        username,
        comment: newComment,
        layerId,
      });
      setComments(response.data.comments);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/comment/${commentId}`, {
        data: { userId }, // Pass userId in the body
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Remove the comment from the UI
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    // Clear the container before initializing WaveSurfer
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear previous waveform
    }

    // Create a new WaveSurfer instance
    playerRef.current = WaveSurfer.create({
      container: containerRef.current as HTMLElement,
      waveColor: '#e2e8f0',
      progressColor: 'red',
      cursorColor: 'navy',
      height: 50,
    });

    // Load the audio file
    playerRef.current.load(url);

    // Set duration when ready
    playerRef.current.on('ready', () => {
      setDuration(playerRef.current?.getDuration() || null);
      if (playerRef.current) {
        playerRef.current.setVolume(volume);
      }
    });

    // Update current time during playback
    playerRef.current.on('audioprocess', () => {
      setCurrentTime(playerRef.current?.getCurrentTime() || 0);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.stop(); // Stop playback
        playerRef.current.destroy(); // Destroy the WaveSurfer instance
        playerRef.current = null; // Clear the reference
      }
    };
  }, [url]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.isPlaying()) {
        playerRef.current.pause();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handlePlayPauseWithMain = () => {
    if (mainPlayerRef.current && playerRef.current) {
      if (mainPlayerRef.current.isPlaying() && playerRef.current.isPlaying()) {
        mainPlayerRef.current.pause();
        playerRef.current.pause();
        setIsPlayingWithMain(false);
      } else {
        mainPlayerRef.current.play();
        playerRef.current.play();
        setIsPlayingWithMain(true);
      }
    }
  };

  const handleStopAll = () => {
    if (mainPlayerRef.current && playerRef.current) {
      mainPlayerRef.current.stop();
      playerRef.current.stop();
      setIsPlaying(false);
      setIsPlayingWithMain(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      const newVolume = isMuted ? volume : 0;
      setIsMuted((prev) => !prev);
      playerRef.current.setVolume(newVolume);
    }
  };

  const handleMintNFT = () => {
    // Implement the logic to mint the NFT
    alert(`Minting NFT for layer: ${name}`);
  };

  return (
    <div className="bg-light-container dark:bg-dark-container p-4 rounded shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">by @{username}</p>
      </div>

      <div ref={containerRef} className="mb-4"></div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
        <span>{Math.floor((duration || 0) / 60)}:{Math.floor((duration || 0) % 60).toString().padStart(2, '0')}</span>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handlePlayPause}
          className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mr-2 flex items-center justify-center"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={handleStop}
          className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <FaStop />
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handlePlayPauseWithMain}
          className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mt-2"
        >
          {isPlayingWithMain ? <FaPause /> : <FaPlay />} with Main
        </button>
        <button
          onClick={handleStopAll}
          className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mt-2 ml-2"
        >
          Stop All
        </button>
      </div>

      <div className="flex justify-center items-center space-x-4 mb-4">
        <button onClick={toggleMute} className="text-xl hover:text-indigo-500">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={handleLike} className="flex items-center">
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span className="ml-2">{likes}</span>
        </button>
        <button className="flex items-center">
          <FaCommentDots />
          <span className="ml-2">{comments.length}</span>
        </button>
      </div>

      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
          placeholder="Add a comment..."
        ></textarea>
        <button
          onClick={handleAddComment}
          className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mt-2"
        >
          Comment
        </button>
      </div>

      <div className="mt-4">
        {comments.map((comment, index) => (
          <div key={index} className="border-b border-gray-300 dark:border-gray-700 py-2 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">{comment.username}</p>
              <p className="text-sm">{comment.comment}</p>
            </div>
            {comment.userId === userId && (
              <button onClick={() => handleDeleteComment(comment._id)}>
                <FaTrash className="text-red-600 hover:text-red-800" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPlayer;
