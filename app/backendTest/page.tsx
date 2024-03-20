'use client';

import Topbar from '../components/topbar';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { backendRequest } from '@/utils/authConfig';
import getBeTime from '../lib/getBeTime';
import { useState } from 'react';

export default function Page() {
  const { instance, accounts, inProgress } = useMsal();
  const [time, setTime] = useState('***');

  async function getBackendToken() {
    console.log('getBackendToken >>>> ');
    instance
      .acquireTokenSilent({
        scopes: backendRequest.scopes,
        account: accounts[0],
      })
      .then((response) => {
        const accessToken = response.accessToken;
        const idToken = response.idToken;
        //console.log('accessToken for backend >>>> ', accessToken);
        const res = getBeTime(accessToken)
          .then((time) => {
            if (time) {
              console.log('time >>>> ', time);
              setTime(time);
            }
          })
          .catch((error) => {
            console.log('getBeTime error: ', error);
            setTime('Error: ' + error);
          });
        //console.log('time >>>> ', time);
      })
      .catch((error) => {
        console.log('getBackendToken error: ', error);
      });
  }

  return (
    <main className=" flex flex-col  text-blue-700">
      <Topbar />

      <div className=" flex flex-col gap-10 items-center content-center justify-center ">
        {/* email */}
        <form
          action={getBackendToken}
          className="flex flex-col bg-gray-700 max-h-96 p-4 border-4 text-stone-100 gap-4"
        >
          <h3 className="text-2xl font-bold">Backend Time</h3>
          <p className="text-xl">{time}</p>

          <button
            className=" border border-blue-500 w-24 h-7 bg-gray-700 hover:bg-gray-800 text-stone-100 rounded-md"
            type="submit"
          >
            get time
          </button>
        </form>
      </div>
      
      
    </main>
  );
}
