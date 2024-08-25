// src/app/layout.tsx


import './globals.css';
import { WalletProvider } from '../context/WalletProvider';
import { UserProvider } from '../context/UserContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UserProvider>  
            <WalletProvider>
              <Navbar />
              {children}
            </WalletProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
