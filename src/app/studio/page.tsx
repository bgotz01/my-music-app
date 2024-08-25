// src/app/studio/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MySounds from './components/MySounds';
import MyLayers from './components/MyLayers';
import { useTheme } from '@/context/ThemeContext';
import AudioPlayer from '@/components/AudioPlayer'; // Import AudioPlayer

const StudioPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sounds, setSounds] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0); // Ensure this is always a number
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const router = useRouter();
  const { theme } = useTheme(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios.get('http://localhost:4000/api/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const { userId } = response.data;
          setUserId(userId);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
          router.push('/login');
        });
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:4000/api/sounds/${userId}`)
        .then(response => {
          const soundsWithLayerCounts = response.data.map(async (sound: any) => {
            const layerResponse = await axios.get(`http://localhost:4000/api/layers?soundId=${sound._id}`);
            return {
              ...sound,
              layerCount: layerResponse.data.length, // Adding layer count
            };
          });
  
          // Resolve all promises to get the actual data
          Promise.all(soundsWithLayerCounts).then((data) => {
            setSounds(data);
          });
        })
        .catch(error => {
          console.error('Error fetching sounds:', error);
        });
    }
  }, [userId]);

  const handlePlay = (index: number) => {
    if (currentTrackIndex === index) {
      setIsPlaying(!isPlaying); // Toggle play/pause
    } else {
      setCurrentTrackIndex(index); // Set the index of the sound to be played
      setIsPlaying(true); // Play the new sound
    }
    setIsPlayerVisible(true); // Show the audio player
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-10 ${theme === 'light' ? 'bg-gray-100 text-black' : 'bg-dark text-white'}`}>
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
        Studio
      </h1>
      <div className="space-y-6 mb-10 flex flex-col items-center">
        <Link href="/studio/sound/upload">
          <button className="bg-buttonBackground text-buttonText text-xl font-bold py-4 px-8 rounded shadow-md hover:bg-buttonHover">
            Drop a Beat
          </button>
        </Link>
      </div>
      <div className="w-full px-6 max-w-2xl mx-auto mb-32"> {/* Add bottom margin to ensure no overlap */}
        <MySounds userId={userId} onPlay={handlePlay} isPlaying={isPlaying} currentTrackIndex={currentTrackIndex} /> {/* Pass onPlay to MySounds */}
        <hr className="my-8 border-t-2 border-gray-300 dark:border-gray-700" />
        <MyLayers userId={userId} />
      </div>
      {isPlayerVisible && (
        <div className="w-full fixed bottom-0">
          <AudioPlayer
            tracks={sounds}
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying} // Pass isPlaying and setIsPlaying
          />
        </div>
      )}
    </div>
  );
};

export default StudioPage;
