// src/app/studio/components/MyLayers.tsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface MyLayersProps {
  userId: string;
}

const MyLayers: React.FC<MyLayersProps> = ({ userId }) => {
  const [layers, setLayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLayers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/layers/user/${userId}`);
      setLayers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching layers:', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLayers();
  }, [fetchLayers]);

  const deleteLayer = async (layerId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this layer?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/layers/${layerId}`);
        fetchLayers(); // Refresh the layers list
      } catch (error) {
        console.error('Error deleting layer:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading layers...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Layers</h2>
      {layers.length === 0 ? (
        <p>No layers found.</p>
      ) : (
        <ul>
          {layers.map(layer => (
            <li key={layer._id} className="mb-4">
              <p className="text-lg font-semibold">{layer.name}</p>
              <p>Sound Name: {layer.soundId?.name}</p> {/* Display the Sound name */}
              <p>Uploaded on: {new Date(layer.createdAt).toLocaleDateString()}</p>
              <audio controls className="w-full mt-2">
                <source src={layer.url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
              <button
                onClick={() => deleteLayer(layer._id)}
                className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded mt-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyLayers;
