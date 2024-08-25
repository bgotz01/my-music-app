// src/app/discover/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface Sound {
  name: string;
  url: string;
  _id: string;
}

const DiscoverPage: React.FC = () => {
  const { theme } = useTheme();
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Sound | null>(null);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sounds');
        setSounds(response.data);
      } catch (error) {
        console.error('Error fetching sounds:', error);
      }
    };

    fetchSounds();
  }, []);

  const handlePlay = (sound: Sound) => {
    console.log('Playing sound:', sound);
    setCurrentTrack(sound);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-10 ${theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
        Discover New Tracks
      </h1>
      <div className="w-full px-6 max-w-2xl mx-auto">
        {sounds.length > 0 ? (
          <ul className="space-y-4">
            {sounds.map((sound) => (
              <li key={sound._id} className={`p-4 rounded shadow-md ${theme === 'light' ? 'bg-silver' : 'bg-very-dark-grey'}`}>
                <h3 className="text-lg font-bold">{sound.name}</h3>
                <button
                  onClick={() => handlePlay(sound)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Play
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tracks found.</p>
        )}
      </div>
      {currentTrack && (
        <div className="fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg p-4">
          <audio controls className="w-full" autoPlay>
            <source src={currentTrack.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-center text-lg font-bold">{currentTrack.name}</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
