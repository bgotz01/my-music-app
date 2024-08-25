// src/app/studio/components/AddLayerForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';

interface AddLayerFormProps {
  userId: string;
  url: string;
  soundId: string;
}

const layerTypes = ['vocal', 'instrument', 'drums', 'fx'];

const AddLayerForm: React.FC<AddLayerFormProps> = ({ userId, url, soundId }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('vocal');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const handleAddLayer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type) {
      setError('Please provide all required fields.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/layer', {
        userId,
        url,
        name,
        soundId,
        type,
      });
      alert('Layer added successfully!');
      setName('');
      setType('vocal');
    } catch (error) {
      console.error('Error adding layer:', error);
      setError('Error adding layer. Please try again.');
    }
  };

  return (
    <div className={`p-8 rounded shadow-md w-full max-w-md mb-6 ${theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'}`}>
      <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>Add Layer Info</h2>
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleAddLayer}>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className={`w-full p-2 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-black' : 'border-gray-700 bg-gray-800 text-white'} rounded`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} htmlFor="type">
            Type
          </label>
          <select
            id="type"
            className={`w-full p-2 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-black' : 'border-gray-700 bg-gray-800 text-white'} rounded`}
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            {layerTypes.map((layerType) => (
              <option key={layerType} value={layerType}>
                {layerType}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-buttonBackground text-white p-2 rounded hover:bg-gray-700">
          Add Layer
        </button>
      </form>
    </div>
  );
};

export default AddLayerForm;
