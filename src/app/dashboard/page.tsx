// src/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [solanaWallet, setSolanaWallet] = useState('');
  const [userId, setUserId] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSolanaWallet, setEditSolanaWallet] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editTiktok, setEditTiktok] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios
        .get('http://localhost:4000/api/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { username, email, solanaWallet, userId, instagram, tiktok } =
            response.data;
          setUsername(username);
          setEmail(email);
          setSolanaWallet(solanaWallet);
          setUserId(userId);
          setInstagram(instagram);
          setTiktok(tiktok);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
          router.push('/login');
        });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        'http://localhost:4000/api/userinfo',
        {
          email: editEmail || email,
          solanaWallet: editSolanaWallet || solanaWallet,
          instagram: editInstagram || instagram,
          tiktok: editTiktok || tiktok,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { email, solanaWallet, instagram, tiktok } = response.data;
        setEmail(email);
        setSolanaWallet(solanaWallet);
        setInstagram(instagram);
        setTiktok(tiktok);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-black'
      }`}
    >
      <div
        className={`p-8 rounded shadow-md w-full max-w-2xl ${
          theme === 'dark'
            ? 'bg-productContainerDark text-white'
            : 'bg-productContainerLight text-black'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome, {username}</h2>
        {!editMode ? (
          <div className="space-y-4">
            <div>
              <p>
                <strong>Username:</strong> {username}
              </p>
            </div>
            <div>
              <p>
                <strong>Email:</strong> {email}
              </p>
            </div>
            <div>
              <p>
                <strong>Solana Wallet:</strong> <span className="break-all">{solanaWallet}</span>
              </p>
            </div>
            <div>
              <p>
                <strong>User ID:</strong> <span className="break-all">{userId}</span>
              </p>
            </div>
            <div>
              <p>
                <strong>Instagram:</strong> {instagram}
              </p>
            </div>
            <div>
              <p>
                <strong>TikTok:</strong> {tiktok}
              </p>
            </div>
            <button
              className="w-full bg-buttonBackground text-buttonText p-2 rounded hover:bg-buttonHover transition"
              onClick={() => setEditMode(true)}
            >
              Edit Info
            </button>
            <button
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'border-very-dark-grey bg-productContainerDark text-white'
                    : 'border-gray-300 bg-silver text-black'
                }`}
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder={email}
              />
            </div>
            <div>
              <label
                htmlFor="solanaWallet"
                className="block text-sm font-medium"
              >
                Solana Wallet
              </label>
              <input
                id="solanaWallet"
                type="text"
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'border-very-dark-grey bg-productContainerDark text-white'
                    : 'border-gray-300 bg-silver text-black'
                }`}
                value={editSolanaWallet}
                onChange={(e) => setEditSolanaWallet(e.target.value)}
                placeholder={solanaWallet}
              />
            </div>
            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium"
              >
                Instagram
              </label>
              <input
                id="instagram"
                type="text"
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'border-very-dark-grey bg-productContainerDark text-white'
                    : 'border-gray-300 bg-silver text-black'
                }`}
                value={editInstagram}
                onChange={(e) => setEditInstagram(e.target.value)}
                placeholder={instagram}
              />
            </div>
            <div>
              <label
                htmlFor="tiktok"
                className="block text-sm font-medium"
              >
                TikTok
              </label>
              <input
                id="tiktok"
                type="text"
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'border-very-dark-grey bg-productContainerDark text-white'
                    : 'border-gray-300 bg-silver text-black'
                }`}
                value={editTiktok}
                onChange={(e) => setEditTiktok(e.target.value)}
                placeholder={tiktok}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-buttonBackground text-buttonText p-2 rounded hover:bg-buttonHover transition"
            >
              Save
            </button>
            <button
              type="button"
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
