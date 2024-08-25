// src/app/studio/components/LayerList.tsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LayerPlayer from './LayerPlayer';
import WaveSurfer from 'wavesurfer.js';

interface Layer {
  _id: string;
  userId: string;
  url: string;
  name: string;
  createdAt: string;
  username: string;
}

interface LayerListProps {
  soundId: string;
  mainSoundUrl: string;
  mainPlayerRef: React.RefObject<WaveSurfer>;
}

const LayerList: React.FC<LayerListProps> = ({ soundId, mainSoundUrl, mainPlayerRef }) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/layers?soundId=${soundId}`);
        setLayers(response.data);
      } catch (error) {
        setError('Failed to fetch layers');
      }
    };

    fetchLayers();
  }, [soundId]);

  return (
    <>
      {error && <div>{error}</div>}
      {!layers.length ? (
        <div>No layers added yet.</div>
      ) : (
        <ul className="space-y-4">
          {layers.map((layer) => (
            <li key={layer._id}>
              <LayerPlayer
                url={layer.url}
                name={layer.name}
                userId={layer.userId}
                username={layer.username}
                mainPlayerRef={mainPlayerRef}
                layerId={layer._id} // Pass layerId to LayerPlayer
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default LayerList;
