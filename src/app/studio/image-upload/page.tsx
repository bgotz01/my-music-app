//src/app/studio/image-upload/page.tsx

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import s3 from '@/lib/awsconfig';

const ImageUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

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
      Key: `images/${file.name}`, // Update this to the correct path
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
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Upload Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {url && (
        <div className="mt-4">
          <p className="text-green-500">Image uploaded to:</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {url.length > 50 ? `${url.slice(0, 50)}...` : url}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
