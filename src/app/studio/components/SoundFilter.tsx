// src/app/studio/components/SoundFilter.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';

interface SoundFilterProps {
  onFilterChange: (filters: any) => void;
  initialFilters: any;
  showProducerFilter?: boolean; // New prop to control the visibility of the producer filter
}

const genres = ['hiphop', 'pop', 'trap', 'reggaeton', 'funk', 'phonk', 'rnb', 'edm', 'other'];
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm', 'Not Sure'];

const SoundFilter: React.FC<SoundFilterProps> = ({ onFilterChange, initialFilters, showProducerFilter = true }) => {
  const { theme } = useTheme();
  const [genre, setGenre] = useState(initialFilters.genre || '');
  const [key, setKey] = useState(initialFilters.key || '');
  const [minBpm, setMinBpm] = useState<string>(initialFilters.minBpm ? String(initialFilters.minBpm) : '');
  const [maxBpm, setMaxBpm] = useState<string>(initialFilters.maxBpm ? String(initialFilters.maxBpm) : '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || '');
  const [username, setUsername] = useState(initialFilters.username || ''); // Keep this state for conditional rendering
  const [producers, setProducers] = useState<{ username: string, userId: string }[]>([]);

  useEffect(() => {
    if (showProducerFilter) {
      // Fetch producers only if the filter is to be shown
      const fetchProducers = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/usernames');
          setProducers(response.data);
          console.log('Fetched producers:', response.data);
        } catch (error) {
          console.error('Error fetching producers:', error);
        }
      };

      fetchProducers();
    }
  }, [showProducerFilter]);

  useEffect(() => {
    handleApplyFilters();
  }, [genre, key, minBpm, maxBpm, sortBy, username]);

  const handleApplyFilters = () => {
    const filters = {
      genre,
      key,
      minBpm: minBpm ? Number(minBpm) : undefined,
      maxBpm: maxBpm ? Number(maxBpm) : undefined,
      sortBy,
      ...(showProducerFilter && { username }), // Include username filter only if producer filter is shown
    };

    console.log('Applying filters:', filters);
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setGenre('');
    setKey('');
    setMinBpm('');
    setMaxBpm('');
    setSortBy('');
    setUsername('');
    onFilterChange({ genre: '', key: '', minBpm: undefined, maxBpm: undefined, sortBy: '', username: '' });
  };

  const selectClass = `p-2 border rounded ${
    theme === 'light' ? 'bg-white text-black border-gray-300' : 'bg-gray-700 text-white border-gray-500'
  }`;

  return (
    <div className={`mb-4 p-4 ${theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'} rounded`}>
      <h2 className="text-lg font-bold mb-2">Filter Sounds</h2>
      <div className="flex flex-wrap items-center space-x-4">
        <div className="mb-4">
          <label className="block mb-1">Genre:</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Key:</label>
          <select value={key} onChange={(e) => setKey(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Min BPM:</label>
          <input
            type="number"
            min="60"
            max="180"
            value={minBpm}
            onChange={(e) => setMinBpm(e.target.value)}
            className={selectClass}
            placeholder="Min BPM"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Max BPM:</label>
          <input
            type="number"
            min="60"
            max="180"
            value={maxBpm}
            onChange={(e) => setMaxBpm(e.target.value)}
            className={selectClass}
            placeholder="Max BPM"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
            <option value="">None</option>
            <option value="mostPopular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        {/* Conditionally render the producer filter */}
        {showProducerFilter && (
          <div className="mb-4">
            <label className="block mb-1">Producer:</label>
            <select value={username} onChange={(e) => setUsername(e.target.value)} className={selectClass}>
              <option value="">All</option>
              {producers.map((producer) => (
                <option key={producer.userId} value={producer.username}>
                  {producer.username}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleApplyFilters}
          className="bg-buttonBackground text-buttonText py-2 px-4 rounded-md hover:bg-buttonHover"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-buttonBackground text-buttonText py-2 px-4 rounded-md hover:bg-buttonHover"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SoundFilter;
