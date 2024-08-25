//src/app/education/page.tsx

import Image from 'next/image';
import React from 'react';

const EducationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* New Vision Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4 text-center">Vision</h2>
        <ul className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside">
          <li className="mb-2">
            <strong>An Open Source Music Studio</strong> - upload beats or layers to beats and mint songs as NFTs
          </li>
          <li className="mb-2">
            <strong>Transparent and Fair Contracts</strong> - all royalty shares public on blockchain
          </li>
          <li className="mb-2">
            <strong>Global Talent Pool</strong> - access from anywhere
          </li>
        </ul>
      </div>

      {/* Existing Content */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">$30 Beat Turned Into Smash Hit</h1>
        
        <div className="mb-8">
          <Image
            src="/images/oldtownroad.jpg"
            alt="Old Town Road"
            width={800}
            height={450}
            layout="responsive"
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="mb-4">
            In 2018, Producer YoungKio decided to upload a beat online from his room in a village outside Amsterdam.
          </p>
          <p className="mb-4">
            Later that year Lil Nas X, in Atlanta, bought &apos;Old Town Road&apos; beat for $30, with limited distribution rights.
          </p>
          <p className="mb-4">
            Lil Nas X&apos;s <em>&quot;Old Town Road,&quot;</em> featuring Billy Ray Cyrus, has shattered records, becoming the first song to top the Billboard Hot 100 chart for 17 consecutive weeks. The highest count ever.
          </p>
          <p>
            The contract states that the producer has 50% publishing rights and the artist has 50%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
