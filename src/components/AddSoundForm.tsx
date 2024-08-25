//src/components/AddSoundForm.tsx

'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface AddSoundFormProps {
  userId: string;
  url: string;
}

const AddSoundForm: React.FC<AddSoundFormProps> = ({ userId, url }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Instrumental');
  const [solanaWallet, setSolanaWallet] = useState('');
  const [error, setError] = useState('');

  const handleAddSound = async (e: React.FormEvent) => {
    e.preventDefault();

    const soundData = {
      name,
      type,
      url,
      userId,
      solanaWallet,
    };

    try {
      await axios.post('http://localhost:4000/api/sounds', soundData);
      alert('Sound added successfully!');
    } catch (err) {
      console.error('Error adding sound to DB:', err);
      setError('Error adding sound. Please try again.');
    }
  };

  return (
    <form onSubmit={handleAddSound} className="space-y-4">
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        >
          <option value="Instrumental">Instrumental</option>
          <option value="Acoustic">Acoustic</option>
        </select>
      </div>
      <div>
        <label htmlFor="solanaWallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solana Wallet (optional)</label>
        <input
          id="solanaWallet"
          type="text"
          value={solanaWallet}
          onChange={(e) => setSolanaWallet(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Sound
        </button>
      </div>
    </form>
  );
};

export default AddSoundForm;
