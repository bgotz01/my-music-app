// src/components/WaveformPlayer.tsx

import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformPlayerProps {
  url: string;
  id: string;
}

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({ url, id }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        cursorColor: 'navy',
        height: 100,
      });

      waveSurferRef.current.load(url);

      return () => {
        waveSurferRef.current?.destroy();
      };
    }
  }, [url]);

  const handlePlayPause = () => {
    waveSurferRef.current?.playPause();
  };

  const handleStop = () => {
    waveSurferRef.current?.stop();
  };

  return (
    <div>
      <div id={id} ref={waveformRef} className="waveform" />
      <div className="controls mt-2">
        <button onClick={handlePlayPause} className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded mr-2">
          Play/Pause
        </button>
        <button onClick={handleStop} className="bg-buttonBackground hover:bg-buttonHover text-white font-bold py-2 px-4 rounded">
          Stop
        </button>
      </div>
    </div>
  );
};

export default WaveformPlayer;
