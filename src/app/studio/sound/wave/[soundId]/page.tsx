// src/app/studio/sound/wave/[soundId]/page.tsx

'use client';

import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

interface Comment {
  userId: string;
  comment: string;
  createdAt: string;
}

interface Layer {
  userId: string;
  url: string;
  name: string;
  createdAt: string;
}

interface Sound {
  name: string;
  url: string;
  _id: string;
  likes: string[];
  comments: Comment[];
  layers: Layer[];
}

const WaveDetailPage: React.FC = () => {
  const mainPlayerRef = useRef<WaveSurfer | null>(null);
  const layerPlayerRef = useRef<WaveSurfer | null>(null);
  const { theme } = useTheme();
  const { soundId } = useParams<{ soundId: string }>();

  const [isMainPlaying, setIsMainPlaying] = useState(false);
  const [isLayerPlaying, setIsLayerPlaying] = useState(false);
  const [isPlayingWithMain, setIsPlayingWithMain] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSoundAndLayers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sounds');
        const soundData = response.data.find((s: Sound) => s._id === soundId);
        if (!soundData) {
          setError('Sound not found');
        } else {
          setSound(soundData);
          const layersResponse = await axios.get(`http://localhost:4000/api/layers?soundId=${soundId}`);
          setLayers(layersResponse.data);
        }
      } catch (error) {
        setError('Failed to fetch sound and layers');
      }
    };

    fetchSoundAndLayers();
  }, [soundId]);

  useEffect(() => {
    if (sound) {
      mainPlayerRef.current = WaveSurfer.create({
        container: '#mainPlayer',
        waveColor: 'violet',
        progressColor: 'purple',
        cursorColor: 'navy',
        height: 50,
      });

      mainPlayerRef.current.load(sound.url);
    }

    return () => {
      mainPlayerRef.current?.destroy();
    };
  }, [sound]);

  useEffect(() => {
    if (layers.length > 0) {
      layerPlayerRef.current = WaveSurfer.create({
        container: '#layerPlayer',
        waveColor: 'orange',
        progressColor: 'red',
        cursorColor: 'navy',
        height: 50,
      });

      layerPlayerRef.current.load(layers[0].url);
    }

    return () => {
      layerPlayerRef.current?.destroy();
    };
  }, [layers]);

  const handlePlayPause = (player: WaveSurfer | null, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (player) {
      if (player.isPlaying()) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    }
  };

  const handleStop = (player: WaveSurfer | null, setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (player) {
      player.stop();
      setIsPlaying(false);
    }
  };

  const handlePlayPauseWithMain = () => {
    if (mainPlayerRef.current && layerPlayerRef.current) {
      if (mainPlayerRef.current.isPlaying() && layerPlayerRef.current.isPlaying()) {
        mainPlayerRef.current.pause();
        layerPlayerRef.current.pause();
        setIsPlayingWithMain(false);
      } else {
        mainPlayerRef.current.play();
        layerPlayerRef.current.play();
        setIsPlayingWithMain(true);
      }
    }
  };

  const handleStopAll = () => {
    if (mainPlayerRef.current && layerPlayerRef.current) {
      mainPlayerRef.current.stop();
      layerPlayerRef.current.stop();
      setIsMainPlaying(false);
      setIsLayerPlaying(false);
      setIsPlayingWithMain(false);
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
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
        Wave Detail
      </h1>
      <div className="w-full px-6 max-w-2xl mx-auto">
        <div id="mainPlayer" className="mb-4"></div>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => handlePlayPause(mainPlayerRef.current, setIsMainPlaying)}
            className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mr-2 flex items-center justify-center"
          >
            {isMainPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={() => handleStop(mainPlayerRef.current, setIsMainPlaying)}
            className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <FaStop />
          </button>
        </div>
        <p className="text-center text-xl mb-4">Main Sound</p>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Layer</h2>
          <div className="bg-light-container dark:bg-dark-container p-4 rounded shadow-md">
            <div id="layerPlayer" className="mb-4"></div>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handlePlayPause(layerPlayerRef.current, setIsLayerPlaying)}
                className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mr-2 flex items-center justify-center"
              >
                {isLayerPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={() => handleStop(layerPlayerRef.current, setIsLayerPlaying)}
                className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                <FaStop />
              </button>
            </div>
            <div className="flex justify-center">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveDetailPage;
