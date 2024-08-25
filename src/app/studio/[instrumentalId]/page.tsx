//src/app/studio/[instrumentalId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';

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

interface Instrumental {
  name: string;
  url: string;
  _id: string;
  likes: string[];
  comments: Comment[];
  layers: Layer[];
}

const InstrumentalDetailPage: React.FC = () => {
  const [instrumental, setInstrumental] = useState<Instrumental | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { instrumentalId } = useParams();

  useEffect(() => {
    const fetchInstrumental = async () => {
      if (!instrumentalId) {
        setError('Instrumental ID not found');
        return;
      }

      try {
        console.log('Fetching instrumental with ID:', instrumentalId);
        const response = await axios.get(`http://localhost:4000/api/instrumentals/${instrumentalId}`);
        console.log('Fetched Instrumental:', response.data);
        setInstrumental(response.data);
      } catch (error) {
        console.error('Error fetching instrumental:', error);
        setError('Failed to fetch instrumental');
      }
    };

    fetchInstrumental();
  }, [instrumentalId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 pt-10">
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-8">
        Instrumental Details
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {instrumental ? (
        <div className="w-full px-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow-md mb-4">
          <h2 className="text-xl font-bold mb-2">{instrumental.name}</h2>
          <AudioPlayer src={instrumental.url} />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Instrumental ID: {instrumental._id}
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Instrumental URL: {instrumental.url}
          </p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default InstrumentalDetailPage;
