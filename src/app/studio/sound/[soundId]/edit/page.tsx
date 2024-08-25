// src/app/studio/sound/[soundId]/edit/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ImageUpload from '@/app/studio/components/ImageUpload';

const genres = ['hiphop', 'pop', 'trap', 'reggaeton', 'funk', 'phonk', 'rnb', 'edm', 'other'];
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm', 'Not Sure'];

const SoundEditPage: React.FC = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const [sound, setSound] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('hiphop');
  const [key, setKey] = useState('Not Sure');
  const [bpm, setBpm] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChangingThumbnail, setIsChangingThumbnail] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSound = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sounds');
        const soundData = response.data.find((s: any) => s._id === soundId);
        if (!soundData) {
          setError('Sound not found');
        } else {
          setSound(soundData);
          setName(soundData.name);
          setGenre(soundData.genre);
          setKey(soundData.key);
          setBpm(soundData.bpm);
          setImageUrl(soundData.imageUrl || null);
        }
      } catch (error) {
        setError('Failed to fetch sound');
      }
    };
    fetchSound();
  }, [soundId]);

  const handleImageUploadComplete = (url: string) => {
    setImageUrl(url);
    setIsChangingThumbnail(false);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/api/sounds/${soundId}`, {
        name,
        genre,
        key,
        bpm,
        imageUrl,
      });
      alert('Sound updated successfully!');
      router.push(`/studio/sound/${soundId}`);
    } catch (err) {
      setError('Failed to update sound');
    }
  };

  const handleBackClick = () => {
    router.push('/studio'); // Update the navigation to go back to the studio page
  };

  const handleChangeThumbnailClick = () => {
    setIsChangingThumbnail(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Back Button Below Navbar */}
      <div className="w-full max-w-2xl mt-4 mb-6">
        <button
          onClick={handleBackClick}
          className="bg-buttonBackground text-buttonText p-2 rounded text-sm hover:bg-buttonHover"
        >
          Back
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Edit Sound</h1>
      {imageUrl && !isChangingThumbnail ? (
        <div className="relative w-full max-w-xs h-48 mb-6" style={{ aspectRatio: '1 / 1' }}>
          <Image
            src={imageUrl}
            alt="Sound Thumbnail"
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
          <button
            onClick={handleChangeThumbnailClick}
            className="absolute bottom-2 right-2 bg-buttonBackground text-buttonText p-2 rounded text-sm hover:bg-buttonHover"
          >
            Change Thumbnail
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xs border-2 border-dashed border-gray-300 rounded flex items-center justify-center h-48 mb-6" style={{ aspectRatio: '1 / 1' }}>
          <ImageUpload onUploadComplete={handleImageUploadComplete} />
        </div>
      )}
      <div className="w-full max-w-xs">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="key">
            Key
          </label>
          <select
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            {keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="bpm">
            BPM
          </label>
          <input
            type="number"
            id="bpm"
            value={bpm}
            onChange={(e) => setBpm(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-buttonBackground text-buttonText p-2 rounded mt-4 text-sm hover:bg-buttonHover"
        >
          Save
        </button>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SoundEditPage;
