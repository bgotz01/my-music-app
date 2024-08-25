'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import AWS from 'aws-sdk';
import { useRouter } from 'next/navigation';

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const AudioList: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

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
        fetchAudioFiles(userId);
      }).catch(error => {
        console.error('Error fetching user info:', error);
        router.push('/login');
      });
    }
  }, [router]);

  const fetchAudioFiles = async (userId: string) => {
    setLoading(true);
    setError(null);

    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

    if (!bucketName) {
      setError('Bucket name is not defined.');
      setLoading(false);
      return;
    }

    const params = {
      Bucket: bucketName,
      Prefix: `${userId}/`,
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      const audioFiles = (data.Contents?.map(item => item.Key).filter(key => key !== undefined)) as string[];
      setAudioFiles(audioFiles);
    } catch (err) {
      console.error('Error fetching audio files:', err);
      setError('Error fetching audio files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Audio Files</h2>
      {loading && <p>Loading audio files...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {audioFiles.map((file) => (
          <li key={file}>
            <a href={`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${file}`} target="_blank" rel="noopener noreferrer">
              {file.split('/').pop()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioList;
