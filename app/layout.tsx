'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { PublicClientApplication, Configuration } from '@azure/msal-browser';
import LoginRedirectCard from './components/loginRedirectCard';
import Topbar from './components/topbar';
import { msalConfig } from '@/utils/authConfig';

const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const msalInstance = new PublicClientApplication(msalConfig);

// must be inside a function component
//const { instance, accounts, inProgress } = useMsal();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-gray-900 to-gray-700 text-stone-100">
        <MsalProvider instance={msalInstance}>
          <AuthenticatedTemplate>
            {children}
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            
              <div className="flex flex-col items-center justify-center h-screen">
                <h1>Unauthorized</h1>
                <LoginRedirectCard />
              </div>
            
          </UnauthenticatedTemplate>
        </MsalProvider>
      </body>
    </html>
  );
}
