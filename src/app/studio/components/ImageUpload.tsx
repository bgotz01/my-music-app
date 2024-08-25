//src/app/studio/components/ImageUpload.tsx


// src/app/studio/components/ImageUpload.tsx

import React, { useState, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import axios from 'axios';
import s3 from '@/lib/awsconfig';
import Image from 'next/image';

interface ImageUploadProps {
  folder?: string;
  onUploadComplete: (url: string) => void;
  soundId?: string; // Add soundId as an optional prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ folder = 'images', onUploadComplete, soundId }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
        setError('Bucket name is not defined.');
        return;
      }

      setUploading(true);
      setError('');

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: `${folder}/${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      try {
        const { Location } = await s3.upload(params).promise();
        setUrl(Location);
        onUploadComplete(Location); // Call the callback with the uploaded URL
        setUploading(false);
      } catch (err) {
        console.error('Error uploading file:', err);
        setError('Error uploading file. Please try again.');
        setUploading(false);
      }
    },
    [folder, onUploadComplete]
  );

  const accept: Accept = {
    'image/*': [],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });

  return (
    <div
      {...getRootProps()}
      className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
        isDragActive ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p>Uploading...</p>
      ) : url ? (
        <div className="relative w-full h-64">
          <Image
            src={url}
            alt="Uploaded"
            layout="responsive"
            width={500}
            height={500}
            objectFit="contain"
            className="rounded-lg"
          />
          <p className="text-green-500 mt-2">Image uploaded successfully!</p>
        </div>
      ) : (
        <p className="text-gray-500">Drag & drop an image here, or click to select one</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
