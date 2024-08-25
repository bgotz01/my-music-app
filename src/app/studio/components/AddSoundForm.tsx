// src/app/studio/components/AddSoundForm.tsx


import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';

interface AddSoundFormProps {
  userId: string;
  url: string;
  onSoundAdded: (soundId: string) => void; // Add this prop
}

const genres = ['hiphop', 'pop', 'trap', 'reggaeton', 'funk', 'phonk', 'rnb', 'edm', 'other'];
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm', 'Not Sure'];

const AddSoundForm: React.FC<AddSoundFormProps> = ({ userId, url, onSoundAdded }) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('hiphop');
  const [customGenre, setCustomGenre] = useState('');
  const [key, setKey] = useState('Not Sure');
  const [bpm, setBpm] = useState<number | ''>('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const handleAddSound = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedGenre = genre === 'other' ? customGenre : genre;

    try {
      const response = await axios.post('http://localhost:4000/api/sounds', {
        userId,
        url: url.trim(),
        name,
        genre: selectedGenre,
        key,
        bpm,
      });

      if (response.status === 201) {
        alert('Sound added successfully!');
        setName('');
        setGenre('hiphop');
        setCustomGenre('');
        setKey('Not Sure');
        setBpm('');
        onSoundAdded(response.data._id); // Pass the sound ID to the parent component
      }
    } catch (err) {
      setError('Error adding sound to DB');
    }
  };

  return (
    <div className={`p-8 rounded shadow-md w-full max-w-md mb-6 ${theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'}`}>
      <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>Add Sound Info</h2>
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleAddSound}>
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
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
            className={`w-full p-2 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-black' : 'border-gray-700 bg-gray-800 text-white'} rounded`}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {genre === 'other' && (
            <input
              type="text"
              placeholder="Enter custom genre"
              className={`w-full mt-2 p-2 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-black' : 'border-gray-700 bg-gray-800 text-white'} rounded`}
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              required
            />
          )}
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} htmlFor="key">
            Key
          </label>
          <select
            id="key"
            className={`w-full p-2 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-black' : 'border-gray-700 bg-gray-800 text-white'} rounded`}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          >
            {keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} htmlFor="bpm">
            BPM
          </label>
          <input
            type="number"
            id="bpm"
            className={`w-full p-2 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-black' : 'border-gray-700 bg-gray-800 text-white'} rounded`}
            value={bpm}
            onChange={(e) => setBpm(e.target.value ? Number(e.target.value) : '')}
            required
          />
        </div>
        <button type="submit" className="w-full bg-buttonBackground text-white p-2 rounded hover:bg-gray-700">
          Add Sound
        </button>
      </form>
    </div>
  );
  
};

export default AddSoundForm;
