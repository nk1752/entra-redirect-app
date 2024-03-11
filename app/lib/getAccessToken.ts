'use client';
import { useMsal } from '@azure/msal-react';

export default function GetAccessToken() {
  const { instance, accounts, inProgress } = useMsal();

  // get access token silently
  const accessToken = instance
    .acquireTokenSilent({
      scopes: ['User.Read'],
      account: accounts[0],
    })
    .then((response) => {
      const accessToken = response.accessToken;
      const idToken = response.idToken;
      //return accessToken;
    })
    .catch((error) => {
      console.log('currentUser useEffect error: ', error);
      // get access token interactively
      instance.acquireTokenRedirect({
        scopes: ['User.Read'],
        account: accounts[0],
      });
    });

  return accessToken;
}