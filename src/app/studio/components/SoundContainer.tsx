// src/app/studio/components/SoundContainer.tsx

import React from 'react';
import { FaHeart, FaComment, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';

interface Comment {
  userId: string;
  username: string;
  comment: string;
  createdAt: string;
  _id: string;
}

interface Sound {
  name: string;
  url: string;
  _id: string;
  genre: string;
  key: string;
  bpm: number;
  likes: string[];
  comments: Comment[];
  layerCount: number;
  username: string;
  createdAt?: string;
  imageUrl?: string;
}

interface SoundContainerProps {
  sound: Sound;
  onLike: (soundId: string, itemType: 'sound' | 'layer') => void;
  onComment: (soundId: string, comment: string, itemType: 'sound' | 'layer') => void;
  onDeleteComment: (soundId: string, commentId: string) => void;
  onPlay: () => void;
  isCurrent: boolean; // New prop to indicate if this is the current playing track
}

const SoundContainer: React.FC<SoundContainerProps> = ({
  sound,
  onLike,
  onComment,
  onDeleteComment,
  onPlay,
  isCurrent,
}) => {
  const { user } = useUser();

  return (
    <div
      className={`p-6 rounded shadow-md mb-4 transition-transform duration-300 ${
        isCurrent
          ? 'bg-indigo-100 dark:bg-indigo-800 transform scale-105' // Style for the currently playing track
          : 'bg-soundContainerLight dark:bg-soundContainerDark'
      }`}
    >
      <div className="flex items-start">
        <div className="w-24 h-24 border border-gray-400 dark:border-gray-600 rounded-md overflow-hidden mr-4">
          {sound.imageUrl ? (
            <Image
              src={sound.imageUrl}
              alt={`${sound.name} thumbnail`}
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-500 dark:text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {sound.name}{' '}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              by{' '}
              <Link href={`/studio/${sound.username}`} legacyBehavior>
                <a className="underline hover:text-blue-500 dark:hover:text-blue-300">@{sound.username}</a>
              </Link>
            </span>
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <button
                onClick={() => onLike(sound._id, 'sound')}
                className="flex items-center text-buttonText bg-buttonBackground dark:text-white dark:bg-gray-700 border border-black dark:border-gray-500 rounded-full py-2 px-4 hover:bg-buttonHover dark:hover:bg-gray-600 mr-2"
              >
                <FaHeart />
              </button>
              <span className="text-gray-700 dark:text-gray-300">{sound.likes?.length ?? 0}</span>
            </div>
            <Link href={`/studio/sound/${sound._id}`}>
              <button className="bg-buttonBackground hover:bg-buttonHover text-buttonText dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-2 px-4 rounded">
                Layers ({sound.layerCount})
              </button>
            </Link>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <FaComment className="mr-2" />
              <span>{sound.comments?.length ?? 0}</span>
            </div>
            <button
              onClick={onPlay}
              className={`text-buttonText bg-buttonBackground dark:text-white dark:bg-gray-700 border border-black dark:border-gray-500 rounded-full py-2 px-4 hover:bg-buttonHover dark:hover:bg-gray-600 ${
                isCurrent ? 'font-bold' : ''
              }`}
            >
              {isCurrent ? 'Playing' : 'Play'}
            </button>
          </div>
          <div className="mt-4">
            <details>
              <summary className="font-bold text-gray-900 dark:text-white">Comments</summary>
              {sound.comments?.map((comment) => (
                <div key={comment._id} className="border-b border-gray-300 dark:border-gray-600 py-2 flex justify-between items-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>@{comment.username}:</strong> {comment.comment}
                  </p>
                  {user && user._id === comment.userId && (
                    <button onClick={() => onDeleteComment(sound._id, comment._id)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600">
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const comment = (e.currentTarget.elements.namedItem('comment') as HTMLInputElement).value;
                  onComment(sound._id, comment, 'sound');
                  e.currentTarget.reset();
                }}
                className="flex flex-col w-full"
              >
                <input
                  type="text"
                  name="comment"
                  placeholder="Add a comment..."
                  className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 mb-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
                <button
                  type="submit"
                  className="bg-buttonBackground text-buttonText dark:bg-gray-700 dark:text-white font-bold py-2 px-4 rounded hover:bg-buttonHover dark:hover:bg-gray-600"
                >
                  Comment
                </button>
              </form>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundContainer;
