// src/app/studio/sound/upload/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import s3 from '../../../../../awsconfig';
import AddSoundForm from '../../components/AddSoundForm';
import ImageUpload from '../../components/ImageUpload'; 
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

const SoundUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [soundId, setSoundId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); 
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios.get('http://localhost:4000/api/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const { userId } = response.data;
          setUserId(userId);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
          router.push('/login');
        });
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
      setError('Bucket name is not defined.');
      return;
    }

    setUploading(true);
    setError('');

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `${userId}/sounds/${file.name}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      const { Location } = await s3.upload(params).promise();
      setUrl(Location);
      setUploading(false);
      alert('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file. Please try again.');
      setUploading(false);
    }
  };

  const handleSoundAdded = (newSoundId: string) => {
    setSoundId(newSoundId);
    console.log('Sound added with ID:', newSoundId);
  };

  const handleImageUploadComplete = (uploadedImageUrl: string) => {
    setImageUrl(uploadedImageUrl);
    console.log(`Image uploaded with URL: ${uploadedImageUrl}`);
  };

  const handleSave = async () => {
    if (!soundId || !imageUrl) {
      setError('Sound ID or Image URL is missing. Please ensure both are available.');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/sounds/${soundId}`, {
        imageUrl,
      });
      alert('Sound updated successfully with the image!');
      router.push(`/studio/sound/${soundId}`);
    } catch (err) {
      console.error('Error saving image URL to sound:', err);
      setError('Failed to save image to sound. Please try again.');
    }
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-10 ${theme === 'light' ? 'bg-light text-light' : 'bg-dark text-dark'}`}>
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
        Upload Sound
      </h1>
      
      {/* Step 1: Upload Sound File */}
      <div className={`p-8 rounded shadow-md w-full max-w-md mb-6 ${theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'}`}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            className="bg-buttonBackground hover:bg-buttonHover text-buttonText font-bold py-2 px-4 rounded"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {url && (
          <div className="mt-4">
            <p className="text-center text-green-500">
              File uploaded to:{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {url.length > 30 ? `${url.slice(0, 30)}...` : url}
              </a>
            </p>
            <audio controls className="w-full mt-4">
              <source src={url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Step 2: Save Sound Information */}
      <div className={`p-8 rounded shadow-md w-full max-w-md mb-6 ${theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'}`}>
        <AddSoundForm userId={userId} url={url.trim()} onSoundAdded={handleSoundAdded} />
      </div>

      {/* Step 3: Upload Image for the Sound */}
      {soundId && !imageUrl && (
        <div className={`p-8 rounded shadow-md w-full max-w-md mb-6 ${theme === 'light' ? 'bg-soundContainerLight' : 'bg-soundContainerDark'}`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>Upload Image</h2>
          <ImageUpload onUploadComplete={handleImageUploadComplete} />
        </div>
      )}

      {/* Step 4: Save Image URL to the Sound */}
      {imageUrl && (
        <div className="w-full max-w-md mt-4 flex flex-col items-center">
          <div className="w-full h-64 relative rounded-lg overflow-hidden mb-4">
            <Image
              src={imageUrl}
              alt="Uploaded"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-buttonBackground text-buttonText py-2 px-4 rounded hover:bg-buttonHover"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default SoundUploadPage;
