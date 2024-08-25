// src/app/studio/sound/[soundId]/image-upload/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import s3 from '@/lib/awsconfig';
import { useRouter } from 'next/navigation';

const ImageUploadPage: React.FC = () => {
  const { soundId } = useParams<{ soundId: string }>();
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
    if (!bucketName) {
      setError('S3 bucket name is not defined.');
      return;
    }

    setUploading(true);
    setError(null);

    const params = {
      Bucket: bucketName, // Now we are sure this is a string
      Key: `images/${soundId}/${image.name}`, // Save the image in a folder specific to this sound
      Body: image,
      ContentType: image.type,
      ACL: 'public-read', // Make the file publicly accessible
    };

    try {
      const { Location } = await s3.upload(params).promise();
      setImageUrl(Location);

      // Send the image URL to the server to update the Sound document
      await axios.post(`/api/upload-image/${soundId}`, { imageUrl: Location });

      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    router.push(`/studio/sound/${soundId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-10">
      <h1 className="text-center text-3xl font-bold mb-4">Upload Image for Sound</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-buttonBackground text-white font-bold py-2 px-4 rounded mb-4"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {imageUrl && (
        <div className="mt-4">
          <p className="text-center text-green-500 mb-4">Image uploaded successfully!</p>
          <img src={imageUrl} alt="Uploaded" className="w-64 h-64 object-cover rounded-lg" />
        </div>
      )}
      <button
        onClick={handleBack}
        className="bg-buttonBackground text-white font-bold py-2 px-4 rounded mt-4"
      >
        Back to Sound
      </button>
    </div>
  );
};

export default ImageUploadPage;
