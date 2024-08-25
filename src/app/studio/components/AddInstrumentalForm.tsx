//src/app/studio/instrumental/components/AddInstrumentalForm.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface AddInstrumentalFormProps {
  userId: string;
  url: string;
}

const AddInstrumentalForm: React.FC<AddInstrumentalFormProps> = ({ userId, url }) => {
  const [name, setName] = useState('');
  const [solanaWallet, setSolanaWallet] = useState('');
  const [error, setError] = useState('');

  const handleAddSound = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/instrumentals', {
        userId,
        url,
        name,
        solanaWallet,
      });

      if (response.status === 201) {
        alert('Instrumental added successfully!');
      }
    } catch (err) {
      setError('Error adding instrumental to DB');
    }
  };

  return (
    <div className="bg-white dark:bg-customGrey p-8 rounded shadow-md w-full max-w-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Instrumental Info</h2>
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleAddSound}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-2 text-black dark:text-white"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-white text-black dark:text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-2 text-black dark:text-white"
            htmlFor="solanaWallet"
          >
            Solana Wallet (optional)
          </label>
          <input
            type="text"
            id="solanaWallet"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-white text-black dark:text-black"
            value={solanaWallet}
            onChange={(e) => setSolanaWallet(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Instrumental
        </button>
      </form>
    </div>
  );
};

export default AddInstrumentalForm;
