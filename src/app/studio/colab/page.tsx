// src/app/studio/colab/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import SoundFilter from '@/app/studio/components/SoundFilter';
import AudioPlayer from '@/components/AudioPlayer';

interface Comment {
  userId: string;
  username: string;
  comment: string;
  createdAt: string;
  _id: string;
}

interface Sound {
  name: string;
  url: string;
  _id: string;
  genre: string;
  key: string;
  bpm: number;
  likes: string[];
  comments: Comment[];
  layerCount: number;
  username: string;
  createdAt: string;
  imageUrl?: string;
}

const ColabPage: React.FC = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [filteredSounds, setFilteredSounds] = useState<Sound[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<any>({ sortBy: 'newest' }); // Default sort by newest
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { theme } = useTheme();

  // Audio Player States
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sounds');

        // Sort sounds by newest first after fetching
        const sortedSounds = response.data.sort(
          (a: Sound, b: Sound) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setSounds(sortedSounds);
        setFilteredSounds(sortedSounds); // Initially, all sounds are shown in sorted order
      } catch (error) {
        console.error('Error fetching sounds:', error);
        setError('Failed to fetch sounds');
      }
    };

    fetchSounds();
  }, []);

  const updateSoundInState = (updatedSound: Sound) => {
    setSounds((prevSounds) => {
      const updatedSounds = prevSounds.map((sound) =>
        sound._id === updatedSound._id ? updatedSound : sound
      );
      return [...updatedSounds];
    });

    setFilteredSounds((prevSounds) => {
      const updatedSounds = prevSounds.map((sound) =>
        sound._id === updatedSound._id ? updatedSound : sound
      );
      return [...updatedSounds];
    });
  };

  const handleFilterChange = (filters: any) => {
    setSelectedFilters(filters); // Save the selected filters

    let filtered = sounds;

    if (filters.genre) {
      filtered = filtered.filter((sound) => sound.genre === filters.genre);
    }

    if (filters.key) {
      filtered = filtered.filter((sound) => sound.key === filters.key);
    }

    if (filters.minBpm !== undefined) {
      filtered = filtered.filter((sound) => sound.bpm >= filters.minBpm);
    }

    if (filters.maxBpm !== undefined) {
      filtered = filtered.filter((sound) => sound.bpm <= filters.maxBpm);
    }

    if (filters.username) {
      filtered = filtered.filter((sound) => sound.username === filters.username);
    }

    // Sorting logic
    if (filters.sortBy) {
      if (filters.sortBy === 'mostPopular') {
        filtered = filtered.sort((a, b) => b.likes.length - a.likes.length);
      } else if (filters.sortBy === 'newest') {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (filters.sortBy === 'oldest') {
        filtered = filtered.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    }

    setFilteredSounds(filtered);
  };

  const handleLike = async (itemId: string, itemType: 'sound' | 'layer') => {
    if (!user) {
      setError('You need to be logged in to like.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/like', {
        userId: user._id,
        username: user.username,
        soundId: itemType === 'sound' ? itemId : undefined,
        layerId: itemType === 'layer' ? itemId : undefined,
      });

      updateSoundInState(response.data);
    } catch (error) {
      console.error('Error liking item:', error);
    }
  };

  const handleComment = async (itemId: string, comment: string, itemType: 'sound' | 'layer') => {
    if (!user) {
      setError('You need to be logged in to comment.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/comment', {
        userId: user._id,
        username: user.username,
        comment,
        soundId: itemType === 'sound' ? itemId : undefined,
        layerId: itemType === 'layer' ? itemId : undefined,
      });

      updateSoundInState(response.data);
    } catch (error) {
      console.error('Error commenting on item:', error);
    }
  };

  const handleDeleteComment = async (soundId: string, commentId: string) => {
    if (!user) {
      setError('You need to be logged in to delete a comment.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/comment/${commentId}`, {
        data: { userId: user._id }
      });

      updateSoundInState(response.data);

    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handlePlaySound = (soundIndex: number) => {
    setCurrentTrackIndex(soundIndex);
    setIsPlaying(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 pt-10 ${
        theme === 'light' ? 'bg-light text-light' : 'bg-dark text-dark'
      }`}
    >
      <h1 className="text-center md:text-left text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 mb-8 leading-tight tracking-tight md:pl-12">
  Layer Up
</h1>

      <div className="w-full px-6 max-w-2xl mx-auto">
        <SoundFilter
          onFilterChange={handleFilterChange}
          initialFilters={selectedFilters}
          showProducerFilter={true} 
        />
        <p className="text-center mb-4">{filteredSounds.length} sounds available</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {filteredSounds.map((sound, index) => (
          <div
            key={sound._id}
            className={`p-6 rounded shadow-md mb-4 ${
              theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'
            }`}
          >
            <div className="flex items-start">
              <div className="w-24 h-24 border border-gray-400 rounded-md overflow-hidden mr-4">
                {sound.imageUrl ? (
                  <Image
                    src={sound.imageUrl}
                    alt={`${sound.name} thumbnail`}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold mb-2">
                  {sound.name}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    by{' '}
                    <Link href={`/studio/producer/${sound.username}`} legacyBehavior>
                      <a className="underline hover:text-blue-500">@{sound.username}</a>
                    </Link>
                  </span>
                </h2>
                {/* Remove the native audio element since we are using our custom AudioPlayer */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleLike(sound._id, 'sound')}
                      className="flex items-center text-buttonText bg-buttonBackground border border-black rounded-full py-2 px-4 hover:bg-buttonHover mr-2"
                    >
                      <FaHeart />
                    </button>
                    <span>{sound.likes?.length ?? 0}</span>
                  </div>
                  <Link href={`/studio/sound/${sound._id}`}>
                    <button className="bg-buttonBackground hover:bg-buttonHover text-buttonText font-bold py-2 px-4 rounded">
                      Layers ({sound.layerCount})
                    </button>
                  </Link>
                  <div className="flex items-center">
                    <FaComment className="mr-2" />
                    <span>{sound.comments?.length ?? 0}</span>
                  </div>
                  {/* Play button to control the AudioPlayer */}
                  <button
                    onClick={() => handlePlaySound(index)}
                    className="text-buttonText bg-buttonBackground border border-black rounded-full py-2 px-4 hover:bg-buttonHover"
                  >
                    {index === currentTrackIndex && isPlaying ? 'Playing' : 'Play'}
                  </button>
                </div>
                <div className="mt-4">
                  <details>
                    <summary className="font-bold">Comments</summary>
                    {sound.comments?.map((comment) => (
                      <div
                        key={comment._id}
                        className="border-b border-gray-300 py-2 flex justify-between items-center"
                      >
                        <p className="text-sm">
                          <strong>@{comment.username}:</strong> {comment.comment}
                        </p>
                        {user && user._id === comment.userId && (
                          <button
                            onClick={() => handleDeleteComment(sound._id, comment._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const comment = (
                          e.currentTarget.elements.namedItem('comment') as HTMLInputElement
                        ).value;
                        handleComment(sound._id, comment, 'sound');
                        e.currentTarget.reset();
                      }}
                      className="flex flex-col w-full"
                    >
                      <input
                        type="text"
                        name="comment"
                        placeholder="Add a comment..."
                        className="border border-gray-300 rounded px-4 py-2 mb-2"
                      />
                      <button
                        type="submit"
                        className="bg-buttonBackground text-buttonText font-bold py-2 px-4 rounded hover:bg-buttonHover"
                      >
                        Comment
                      </button>
                    </form>
                  </details>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audio Player Container */}
      <div className="fixed bottom-0 left-0 right-0">
        {filteredSounds.length > 0 && (
          <AudioPlayer
            tracks={filteredSounds.map(sound => ({
              _id: sound._id,
              userId: sound.username, 
              username: sound.username,
              url: sound.url,
              name: sound.name,
              genre: sound.genre,
              key: sound.key,
              bpm: sound.bpm,
              createdAt: sound.createdAt || '', 
              imageUrl: sound.imageUrl || '', 
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

export default ColabPage;
