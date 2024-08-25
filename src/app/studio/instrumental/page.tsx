//src/app/studio/instrumental/page.tsx



'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import s3 from '../../../../awsconfig';
import AddInstrumentalForm from '../components/AddInstrumentalForm';
import { useRouter } from 'next/navigation';

const InstrumentalUploadPage = () => {
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
      Key: `${userId}/${file.name}`,
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

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 pt-10">
      <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
        Upload Instrumental
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md mb-6">
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {url && (
          <div className="mt-4">
            <p className="text-center text-green-500">File uploaded to: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{url}</a></p>
            <audio controls className="w-full mt-4">
              <source src={url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
      {url && <AddInstrumentalForm userId={userId} url={url} />}
    </div>
  );
};

export default InstrumentalUploadPage;
