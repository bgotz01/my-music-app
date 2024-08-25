//src/app/upload/page.tsx


'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import s3 from '../../../awsconfig';
import AddSoundForm from '@/components/AddSoundForm';

const UploadAudioPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios.get('http://localhost:4000/api/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        const { userId } = response.data;
        setUserId(userId);
      }).catch(error => {
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
      Key: `${userId}/${file.name}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      const data = await s3.upload(params).promise();
      setUrl(data.Location);
      setUploading(false);
      alert('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file. Please try again.');
      setUploading(false);
    }
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4 pt-10">
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
        Upload Audio
      </h1>
      <div className="bg-white dark:bg-customGrey p-8 rounded shadow-md w-full max-w-md mb-6">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {url && <AddSoundForm userId={userId} url={url} />}
    </div>
  );
};

export default UploadAudioPage;
