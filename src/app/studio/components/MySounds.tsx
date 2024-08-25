// src/app/studio/components/MySounds.tsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaPause, FaUpload } from 'react-icons/fa'; // Removed FaTrash and FaEdit

interface MySoundsProps {
  userId: string;
  onPlay: (index: number) => void;
  isPlaying: boolean;
  currentTrackIndex: number | null;
}

const MySounds: React.FC<MySoundsProps> = ({ userId, onPlay, isPlaying, currentTrackIndex }) => {
  const [sounds, setSounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSounds = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/sounds/${userId}`);
      const soundsWithLayerCounts = await Promise.all(
        response.data.map(async (sound: any) => {
          const layerResponse = await axios.get(`http://localhost:4000/api/layers?soundId=${sound._id}`);
          return { ...sound, layerCount: layerResponse.data.length };
        })
      );

      setSounds(soundsWithLayerCounts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sounds:', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSounds();
  }, [fetchSounds]);

  const deleteSound = async (soundId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this sound?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/sounds/${soundId}`);
        fetchSounds(); // Refresh the sounds list
      } catch (error) {
        console.error('Error deleting sound:', error);
      }
    }
  };

  const uploadThumbnail = async (soundId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:4000/api/upload-image/${soundId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchSounds(); // Refresh the sounds list after uploading the thumbnail
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
    }
  };

  if (loading) {
    return <div>Loading sounds...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Sounds</h2>
      {sounds.length === 0 ? (
        <p>No sounds found.</p>
      ) : (
        <ul>
          {sounds.map((sound, index) => (
            <li
              key={sound._id}
              className={`mb-4 flex items-center p-4 rounded-md transition-all duration-300 relative ${
                currentTrackIndex === index && isPlaying
                  ? 'bg-indigo-100 dark:bg-indigo-800 scale-105'
                  : 'bg-productContainerLight dark:bg-productContainerDark'
              }`}
            >
              {/* Thumbnail Section */}
              <div className="w-24 h-24 border border-gray-400 flex items-center justify-center rounded-md overflow-hidden mr-4">
                {sound.imageUrl ? (
                  <Image
                    src={sound.imageUrl}
                    alt={`${sound.name} thumbnail`}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <label className="text-xs text-gray-500 cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          uploadThumbnail(sound._id, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <FaUpload /> Upload Thumbnail
                  </label>
                )}
              </div>

              {/* Sound Info and Edit Button */}
              <div className="flex-grow flex flex-col justify-center text-light dark:text-dark">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <Link href={`/studio/sound/${sound._id}`} passHref>
                      <p className="text-lg font-semibold cursor-pointer hover:underline">{sound.name}</p>
                    </Link>
                    <p className="text-sm">Genre: {sound.genre}</p>
                    <p className="text-sm">Key: {sound.key}</p>
                    <p className="text-sm">BPM: {sound.bpm}</p>
                    <p className="text-sm">Uploaded on: {new Date(sound.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-bold text-gray-600">Layers: {sound.layerCount}</p> {/* Display layer count */}
                  </div>
                  <div className="flex space-x-2">
                    {/* Edit Button */}
                    <Link href={`/studio/sound/${sound._id}/edit`}>
                      <button
                        className="bg-gray-500 text-white font-bold py-1 px-2 rounded hover:bg-gray-600"
                        aria-label="Edit"
                      >
                        Edit
                      </button>
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteSound(sound._id)}
                      className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-600"
                      aria-label="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Play Button in the Middle */}
              <button
                onClick={() => onPlay(index)}
                className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 bg-transparent"
                aria-label="Play/Pause"
              >
                {currentTrackIndex === index && isPlaying ? (
                  <FaPause size={30} className="text-black" />
                ) : (
                  <FaPlay size={30} className="text-black" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySounds;
