'use client';
import { useMsal } from '@azure/msal-react';
import { useState } from 'react';

export default function Signout() {
  const { instance, accounts } = useMsal();
  const [status, setStatus] = useState('Sign Out');

  function handleSignout() {
    // silently logout current user
    if (accounts.length > 0) {
      instance.logoutRedirect({
        account: accounts[0],
      });
      setStatus('Sign Out');
    }
  }

  return (
    <div>
      <button onClick={handleSignout}>{status}</button>
    </div>
  );
}
