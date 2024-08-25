//src/app/studio/components/SoundList.tsx

import React from 'react';
import Link from 'next/link';
import ImageUpload from './ImageUpload'; 

interface Sound {
  _id: string;
  userId: string;
  username: string;
  url: string;
  name: string;
  genre: string;
  key: string;
  bpm: number;
  createdAt: string;
  imageUrl?: string;  // Add imageUrl field to Sound type
}

interface SoundListProps {
  sounds: Sound[];
  onPlay: (index: number) => void;
}

const SoundList: React.FC<SoundListProps> = ({ sounds, onPlay }) => {
  if (!sounds.length) {
    return <div>No sounds uploaded yet.</div>;
  }

  const handleImageUpload = (imageUrl: string, soundId: string) => {
    // Handle the image URL update for the specific sound in your application state
    // This could involve making an API call to update the sound record in the database
  };

  return (
    <ul className="space-y-4">
      {sounds.map((sound, index) => (
        <li
          key={sound._id}
          className="bg-soundContainerLight dark:bg-soundContainerDark p-4 rounded shadow-md text-light dark:text-dark flex justify-between items-center"
        >
          <div className="flex flex-col w-2/3">
            <h3 className="text-lg font-bold">{sound.name}</h3>
            <p>Genre: {sound.genre}</p>
            <p>Key: {sound.key}</p>
            <p>BPM: {sound.bpm}</p>
          </div>
          <div className="flex items-center space-x-4 w-1/3">
            {sound.imageUrl ? (
              <img src={sound.imageUrl} alt={sound.name} className="w-20 h-20 object-cover rounded" />
            ) : (
              <div className="w-20 h-20 border-2 border-dashed flex items-center justify-center rounded">
                <ImageUpload soundId={sound._id} onUploadComplete={handleImageUpload} />
              </div>
            )}
            <button
              onClick={() => onPlay(index)}
              className="text-buttonText bg-buttonBackground py-2 px-4 rounded-md hover:bg-buttonHover"
            >
              Play
            </button>
            <Link href={`/studio/sound/${sound._id}`}>
              <button className="text-buttonText bg-buttonBackground py-2 px-4 rounded-md hover:bg-buttonHover">
                Colab
              </button>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SoundList;
