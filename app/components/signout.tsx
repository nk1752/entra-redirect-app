'use client';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

export default function Signout() {
  const { instance, } = useMsal();
  const [status, setStatus] = useState('Sign Out');

  function handleSignout() {

    instance.logoutRedirect();

  }

  
  
    return (
      <div>
        <button
          onClick={handleSignout}
        >
          {status}
        </button>
      </div>
    );
  
}
