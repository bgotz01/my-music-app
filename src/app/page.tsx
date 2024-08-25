// src/app/page.tsx

"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

// Dynamically import the WalletMultiButton from @solana/wallet-adapter-react-ui
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen bg-light dark:bg-dark text-light dark:text-dark">
      {/* Display Welcome Text */}
      <h1 className="text-4xl font-bold mb-8 text-center">DEFY App</h1>

      {/* Display Image */}
      <div className="mb-8">
        <Image
          src="/images/ape_guitar_2.png"
          alt="Ape playing guitar"
          width={300}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Wallet Button */}
      <WalletMultiButtonDynamic />

      {/* Login and Register Buttons */}
      <div className="flex space-x-4 mt-8">
        <Link href="/login">
          <button className="bg-buttonBackground text-buttonText py-2 px-4 rounded hover:bg-buttonHover transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-buttonBackground text-buttonText py-2 px-4 rounded hover:bg-buttonHover transition">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
