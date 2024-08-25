//src/components/AudioPlayer.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Image from 'next/image';  // Import the Next.js Image component

interface Track {
  _id: string;
  userId: string;
  username: string;
  url: string;
  name: string;
  genre: string;
  key: string;
  bpm: number;
  createdAt: string;
  imageUrl?: string;  // Add imageUrl to the Track interface
}

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  currentTrackIndex,
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying,
}) => {
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Initialize audioRef with a default value if tracks are empty or index is out of range
  const audioRef = useRef<HTMLAudioElement>(
    tracks.length > 0 && tracks[currentTrackIndex] ? new Audio(tracks[currentTrackIndex].url) : new Audio()
  );
  const intervalRef = useRef<NodeJS.Timeout>();
  const isReady = useRef<boolean>(false);

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const { duration } = audioRef.current;

  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;
  const formattedDuration = formatTime(duration);
  const formattedProgress = formatTime(trackProgress);

  useEffect(() => {
    if (tracks.length > 0 && tracks[currentTrackIndex]) {
      audioRef.current.pause();

      audioRef.current = new Audio(tracks[currentTrackIndex].url);
      audioRef.current.volume = volume;
      setTrackProgress(audioRef.current.currentTime);

      if (isReady.current) {
        if (isPlaying) {
          audioRef.current.play();
          startTimer();
        }
      } else {
        isReady.current = true;
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(tracks.length - 1);
    }
  };

  const handleProgressChange = (value: number) => {
    audioRef.current.currentTime = value;
    setTrackProgress(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    audioRef.current.volume = isMuted ? volume : 0;
  };

  // Debugging: Log the current track's imageUrl to the console
  console.log('Current Track Image URL:', tracks[currentTrackIndex]?.imageUrl);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-3 shadow-lg flex items-center justify-between z-50">
      {/* Track Info on the Left with Image */}
      <div className="flex items-center space-x-4 w-1/3">
        {/* Sound Image */}
        {tracks[currentTrackIndex]?.imageUrl ? (
          <Image
            src={tracks[currentTrackIndex].imageUrl}
            alt="Sound image"
            width={50}
            height={50}
            className="rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
            <span className="text-xs text-white">No Image</span>
          </div>
        )}

        {/* Track Info */}
        <div className="flex flex-col truncate">
          <span className="text-sm font-bold truncate">
            {tracks[currentTrackIndex]?.name || 'No Track'}
          </span>
          <span className="text-sm text-gray-300 truncate">
            @{tracks[currentTrackIndex]?.username || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Playback Controls in the Middle */}
      <div className="flex flex-col items-center space-y-2 w-1/3">
        <div className="flex items-center space-x-4">
          <button onClick={handlePrev} className="text-lg text-white hover:text-gray-400">
            <FaBackward />
          </button>
          <button onClick={handlePlayPause} className="text-lg text-white hover:text-gray-400">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleNext} className="text-lg text-white hover:text-gray-400">
            <FaForward />
          </button>
        </div>
        {/* Progress Bar Below Controls */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs">{formattedProgress}</span>
          <input
            type="range"
            min="0"
            max={duration ? duration : 0}
            value={trackProgress}
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer"
          />
          <span className="text-xs">{formattedDuration}</span>
        </div>
      </div>

      {/* Volume Control on the Right */}
      <div className="flex items-center space-x-2 w-1/3 justify-end">
        <button onClick={toggleMute} className="text-lg text-white hover:text-gray-400">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-24 h-1 bg-gray-600 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
