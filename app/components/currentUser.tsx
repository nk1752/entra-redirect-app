'use client';
import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { cookieAccessToken } from '../lib/cookieAccessToken';

export default function CurrentUser() {
  const { instance, accounts, inProgress } = useMsal();
  const [currentUser, setCurrentUser] = useState('no user signed in');

  // get current user
  useEffect(() => {
    // USe Graph to get me

    if (accounts.length > 0) {
      const currentAccount = accounts[0];
      const name = currentAccount.name;
      if (name) {
        setCurrentUser(name);
        console.log('from useEffect currentUser: ', name);

        // get access token
        const accessToken = instance
          .acquireTokenSilent({
            scopes: ['User.Read'],
            account: currentAccount,
          })
          .then((response) => {
            const accessToken = response.accessToken;
            //const idToken = response.idToken;
            // add access token to cookies
            cookieAccessToken(accessToken);
          })
          .catch((error) => {
            console.log('currentUser useEffect error: ', error);
            // get token interactively
            instance.acquireTokenRedirect({
              scopes: ['User.Read'],
              account: currentAccount,
            });
          });
      }
    } else {
      setCurrentUser('no user signed in');
    }
  }, [accounts, inProgress, instance]);

  return <div>{currentUser}</div>;
}
