"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import Image from 'next/image'; // Import the Image component
import { FiSun, FiMoon } from 'react-icons/fi'; // Import sun and moon icons from react-icons

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Use the useTheme hook

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with link to the home page */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Three_Trumpets_Clean.png"
            alt="Logo"
            width={150} // Adjust the width as needed
            height={150} // Adjust the height as needed
            className="mr-2"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="hover:underline">
            Profile
          </Link>
          <Link href="/education" className="hover:underline">
            Vision
          </Link>
          <Link href="/studio" className="hover:underline">
            Studio
          </Link>
          <Link href="/studio/colab" className="hover:underline">
            Colab
          </Link>
          <WalletMultiButtonDynamic />
          <button onClick={toggleTheme} className="ml-4">
            {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
