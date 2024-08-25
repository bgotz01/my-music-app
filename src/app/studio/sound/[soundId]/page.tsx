// src/app/studio/sound/[soundId]/page.tsx

'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LayerList from '../../components/LayerList';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import dynamic from 'next/dynamic';

interface Sound {
  name: string;
  url: string;
  _id: string;
  userId: string;
  bpm: number;
  key: string;
  genre: string;
  username: string;
  imageUrl?: string;
}

const SoundDetailPage: React.FC = () => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { soundId } = useParams<{ soundId: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const { theme } = useTheme();
  const [isMainPlaying, setIsMainPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const mainPlayerRef = useRef<WaveSurfer | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

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
    const fetchSound = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sounds');
        const soundData = response.data.find((s: Sound) => s._id === soundId);
        if (!soundData) {
          setError('Sound not found');
        } else {
          setSound(soundData);
        }
      } catch (error) {
        setError('Failed to fetch sound');
        console.error('Error fetching sound:', error);
      }
    };

    fetchSound();
  }, [soundId]);

  useEffect(() => {
    if (sound) {
      if (mainPlayerRef.current) {
        mainPlayerRef.current.destroy();
      }

      const abortController = new AbortController();

      const waveSurferOptions: WaveSurferOptions = {
        container: '#mainPlayer',
        waveColor: 'violet',
        progressColor: 'purple',
        cursorColor: 'navy',
        height: 50,
        backend: 'MediaElement',
      };

      mainPlayerRef.current = WaveSurfer.create(waveSurferOptions);

      mainPlayerRef.current.load(sound.url);

      mainPlayerRef.current.on('ready', () => {
        audioElementRef.current = mainPlayerRef.current?.getMediaElement() as HTMLAudioElement | null;

        setDuration(mainPlayerRef.current?.getDuration() || null);
        setIsMainPlaying(false);
        if (audioElementRef.current) {
          audioElementRef.current.volume = volume;
        }
        setIsLoading(false);
      });

      mainPlayerRef.current.on('audioprocess', () => {
        setCurrentTime(mainPlayerRef.current?.getCurrentTime() || 0);
      });

      mainPlayerRef.current.on('error', (error) => {
        console.error('WaveSurfer error:', error);
      });

      return () => {
        if (mainPlayerRef.current) {
          mainPlayerRef.current.stop();
          mainPlayerRef.current.destroy();
        }
        abortController.abort();
      };
    }
  }, [sound]);

  const handlePlayPause = () => {
    if (isLoading) return;

    if (mainPlayerRef.current) {
      if (mainPlayerRef.current.isPlaying()) {
        mainPlayerRef.current.pause();
        setIsMainPlaying(false);
      } else {
        mainPlayerRef.current.play();
        setIsMainPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (isLoading) return;

    if (mainPlayerRef.current) {
      mainPlayerRef.current.stop();
      setIsMainPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioElementRef.current) {
      setIsMuted((prev) => !prev);
      const newVolume = isMuted ? volume : 0;
      setVolume(newVolume);
      audioElementRef.current.volume = newVolume;
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!sound) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-10 ${theme === 'light' ? 'bg-light text-light' : 'bg-dark text-dark'}`}>
      <div className="w-full px-6 max-w-2xl mx-auto relative">
        <Link href="/studio/colab">
          <button className="absolute top-0 left-0 bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded text-sm">
            Back to Colab
          </button>
        </Link>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8 mt-12">
          {sound.name}
        </h1>

        <div className="flex mb-8">
          <div id="mainPlayer" className="flex-grow"></div>
        </div>

        <div className="flex mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {sound.imageUrl && (
            <div className="flex-shrink-0 mr-4">
              <Image
                src={sound.imageUrl}
                alt="Sound Thumbnail"
                width={150}
                height={150}
                className="rounded"
              />
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
            <p><strong>Username:</strong> {sound.username}</p>
            <p><strong>BPM:</strong> {sound.bpm}</p>
            <p><strong>Key:</strong> {sound.key}</p>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor((duration || 0) / 60)}:{Math.floor((duration || 0) % 60).toString().padStart(2, '0')}</span>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={handlePlayPause}
            className={`bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mr-2 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isMainPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={handleStop}
            className={`bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaStop />
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

        <div className="mt-6">
          <Link href={`/studio/sound/${soundId}/layer`}>
            <button className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mb-4 text-sm">
              Add Layer
            </button>
          </Link>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Layers</h2>
          <LayerList soundId={soundId} mainSoundUrl={sound.url} mainPlayerRef={mainPlayerRef} />
        </div>
      </div>
    </div>
  );
};

export default SoundDetailPage;
