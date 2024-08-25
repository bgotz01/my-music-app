//src/app/studio/producer/[producerId]/page.tsx)

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import SoundContainer from '@/app/studio/components/SoundContainer';
import AudioPlayer from '@/components/AudioPlayer';
import SoundFilter from '@/app/studio/components/SoundFilter';

interface Comment {
  userId: string;
  username: string;
  comment: string;
  createdAt: string;
  _id: string;
}

interface Sound {
  _id: string;
  name: string;
  url: string;
  username: string;
  bpm: number;
  key: string;
  genre: string;
  likes: string[];
  comments: Comment[];
  layerCount: number;
  imageUrl?: string;
  createdAt?: string;
}

const ProducerPage = ({ params }: { params: { producerId: string } }) => {
  const { producerId } = params;
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [filteredSounds, setFilteredSounds] = useState<Sound[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Audio Player States
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/sounds/username/${producerId}`);
        if (response.status === 200) {
          setSounds(response.data);
          setFilteredSounds(response.data); // Initialize filteredSounds with the fetched sounds
        }
      } catch (error) {
        console.error('Error fetching sounds:', error);
        setError('Failed to fetch sounds.');
      }
    };

    fetchSounds();
  }, [producerId]);

  const handleFilterChange = (filters: any) => {
    let filtered = [...sounds];

    // Apply genre, key, BPM, and producer filters (existing logic)
    if (filters.genre) {
      filtered = filtered.filter(sound => sound.genre === filters.genre);
    }

    if (filters.key) {
      filtered = filtered.filter(sound => sound.key === filters.key);
    }

    if (filters.minBpm) {
      filtered = filtered.filter(sound => sound.bpm >= filters.minBpm);
    }

    if (filters.maxBpm) {
      filtered = filtered.filter(sound => sound.bpm <= filters.maxBpm);
    }

    // Apply sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'newest') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0); // Fallback to a default date
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      } else if (filters.sortBy === 'oldest') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
      }
    }

    setFilteredSounds(filtered);
  };

  const handleLike = async (soundId: string) => {
    try {
      const response = await axios.post('http://localhost:4000/api/like', {
        soundId,
      });
      setSounds((prevSounds) =>
        prevSounds.map((sound) =>
          sound._id === soundId ? { ...sound, ...response.data } : sound
        )
      );
      setFilteredSounds((prevSounds) =>
        prevSounds.map((sound) =>
          sound._id === soundId ? { ...sound, ...response.data } : sound
        )
      );
    } catch (error) {
      console.error('Error liking sound:', error);
    }
  };

  const handleComment = async (soundId: string, comment: string) => {
    try {
      const response = await axios.post('http://localhost:4000/api/comment', {
        soundId,
        comment,
      });
      setSounds((prevSounds) =>
        prevSounds.map((sound) =>
          sound._id === soundId ? { ...sound, ...response.data } : sound
        )
      );
      setFilteredSounds((prevSounds) =>
        prevSounds.map((sound) =>
          sound._id === soundId ? { ...sound, ...response.data } : sound
        )
      );
    } catch (error) {
      console.error('Error commenting on sound:', error);
    }
  };

  const handleDeleteComment = async (soundId: string, commentId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/comment/${commentId}`);
      setSounds((prevSounds) =>
        prevSounds.map((sound) =>
          sound._id === soundId
            ? { ...sound, comments: sound.comments.filter(c => c._id !== commentId) }
            : sound
        )
      );
      setFilteredSounds((prevSounds) =>
        prevSounds.map((sound) =>
          sound._id === soundId
            ? { ...sound, comments: sound.comments.filter(c => c._id !== commentId) }
            : sound
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handlePlaySound = (soundIndex: number) => {
    setCurrentTrackIndex(soundIndex);
    setIsPlaying(true);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 pt-10 ${theme === 'light' ? 'bg-light text-light' : 'bg-dark text-dark'}`}>
      <h1 className="text-4xl font-bold text-center mb-8">{producerId} Beats</h1>

      {/* Sound Filter Component without Producer Filter */}
      <SoundFilter onFilterChange={handleFilterChange} initialFilters={{}} showProducerFilter={false} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {filteredSounds.map((sound, index) => (
          <SoundContainer
            key={sound._id}
            sound={sound}
            onLike={handleLike}
            onComment={handleComment}
            onDeleteComment={handleDeleteComment}
            onPlay={() => handlePlaySound(index)}
            isCurrent={index === currentTrackIndex && isPlaying} // Pass isCurrent prop
          />
        ))}
      </div>

      {/* Audio Player Container */}
      <div className="fixed bottom-0 left-0 right-0">
        {filteredSounds.length > 0 && (
          <AudioPlayer
            tracks={filteredSounds.map(sound => ({
              _id: sound._id,
              userId: sound.username, // Assuming username is equivalent to userId here, adjust if necessary
              username: sound.username,
              url: sound.url,
              name: sound.name,
              genre: sound.genre,
              key: sound.key,
              bpm: sound.bpm,
              createdAt: sound.createdAt || '', // Provide a fallback if createdAt is undefined
              imageUrl: sound.imageUrl || '', // Add imageUrl to pass it to the AudioPlayer
            }))}
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        )}
      </div>
    </div>
  );
};

export default ProducerPage;
