'use client';
import { useMsal } from '@azure/msal-react';

export default function GetIdToken() {
  const { instance, accounts } = useMsal();

  // get access token silently
  instance
    .acquireTokenSilent({
      scopes: ['User.Read'],
      account: accounts[0],
    })
    .then((response) => {
      const idToken = response.idToken;
      return idToken;
    })
    .catch((error) => {
      console.log('currentUser useEffect error: ', error);
      // get access token interactively
      instance.acquireTokenRedirect({
        scopes: ['User.Read'],
        account: accounts[0],
      });
    });
}
