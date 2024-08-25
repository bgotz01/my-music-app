//src/app/studio/sound/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SoundList from '../components/SoundList';
import { useTheme } from '@/context/ThemeContext';
import AudioPlayer from '@/components/AudioPlayer';

interface Sound {
  _id: string;
  userId: string;
  username: string;
  url: string;
  name: string;
  genre: string;
  key: string;
  bpm: number;
  createdAt: string;
}

const StudioSoundPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios
        .get('http://localhost:4000/api/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { userId } = response.data;
          setUserId(userId);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          router.push('/login');
        });
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:4000/api/sounds?userId=${userId}`)
        .then((response) => {
          setSounds(response.data);
        })
        .catch((error) => {
          console.error('Error fetching sounds:', error);
        });
    }
  }, [userId]);

  const handlePlay = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlayerVisible(true);
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 pt-10 ${
        theme === 'light' ? 'bg-light text-light' : 'bg-dark text-dark'
      }`}
    >
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
        Studio
      </h1>
      <div className="space-y-6 mb-10 flex flex-col items-center">
        <Link href="/studio/sound/upload">
          <button className="bg-buttonBackground text-white text-xl font-bold py-4 px-8 rounded shadow-md hover:bg-hover-buttonBackground">
            Drop a Sound
          </button>
        </Link>
        <Link href="/studio/layer">
          <button className="bg-buttonBackground text-white text-xl font-bold py-4 px-8 rounded shadow-md hover:bg-hover-buttonBackground">
            Add Layers
          </button>
        </Link>
      </div>
      <div className="w-full px-6 max-w-2xl mx-auto mb-24">
        <SoundList sounds={sounds} onPlay={handlePlay} />
      </div>
      {isPlayerVisible && (
        <AudioPlayer
          tracks={sounds}
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
        />
      )}
    </div>
  );
};

export default StudioSoundPage;
