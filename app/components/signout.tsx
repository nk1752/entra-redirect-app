'use client';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

export default function Signout() {
  const { instance, accounts } = useMsal();
  const [status, setStatus] = useState('Sign Out');

  
  
    return (
      <div>
        <button
          onClick={() => {
            instance.logoutRedirect();
          }}
        >
          {status}
        </button>
      </div>
    );
  
}
