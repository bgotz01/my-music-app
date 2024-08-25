// src/app/studio/components/InstrumentalList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InstrumentalList = ({ userId }: { userId: string }) => {
  const [instrumentals, setInstrumentals] = useState([]);

  useEffect(() => {
    const fetchInstrumentals = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/instrumentals/${userId}`);
        setInstrumentals(response.data);
      } catch (error) {
        console.error('Error fetching instrumentals:', error);
      }
    };

    fetchInstrumentals();
  }, [userId]);

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Your Instrumentals</h2>
      {instrumentals.length > 0 ? (
        <ul className="space-y-4">
          {instrumentals.map((instrumental: any) => (
            <li key={instrumental._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
              <h3 className="text-lg font-bold">{instrumental.name}</h3>
              <audio controls className="w-full mt-2">
                <source src={instrumental.url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </li>
          ))}
        </ul>
      ) : (
        <p>No instrumentals uploaded yet.</p>
      )}
    </div>
  );
};

export default InstrumentalList;
