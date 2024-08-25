// src/app/studio/colab/components/FeaturedInstrumentals.tsx



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Instrumental {
  name: string;
  url: string;
  _id: string;
}

const FeaturedInstrumentals: React.FC = () => {
  const [instrumental, setInstrumental] = useState<Instrumental | null>(null);
  const [error, setError] = useState<string | null>(null);

  const featuredId = '6698b7c60f8f7e918cda9a1b'; // Hardcoded Object ID

  useEffect(() => {
    const fetchInstrumental = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/instrumentals/${featuredId}`);
        console.log('Fetched Instrumental:', response.data); // Add console log here
        setInstrumental(response.data);
      } catch (error) {
        console.error('Error fetching instrumental:', error);
        setError('Failed to fetch instrumental');
      }
    };

    fetchInstrumental();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Featured Instrumental</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {instrumental ? (
        <div className="flex flex-col items-center mb-6">
          <span className="mb-2">{instrumental.name}</span>
          <a href={instrumental.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {instrumental.url}
          </a>
          <Link href={`/studio/add-layer/${instrumental._id}`}>
            <button className="bg-black text-white text-xl font-bold py-2 px-4 rounded shadow-md hover:bg-gray-800 mt-2">
              Add Layer
            </button>
          </Link>
        </div>
      ) : (
        <p className="text-center">No featured instrumental found.</p>
      )}
    </div>
  );
};

export default FeaturedInstrumentals;
