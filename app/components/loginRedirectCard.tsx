'use client';

import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '@/utils/authConfig';

export default function LoginRedirectCard() {
  const { instance, accounts, inProgress } = useMsal();

  // handle login
  function handleLogin() {
    instance
    .loginRedirect(loginRequest)
    .then((response) => {
      console.log('loginRedirect response: ', response);
    })
  }

  return (
    <main className=" flex flex-row text-stone-100 content-center items-center justify-center">
      <div className=" bg-gray-700 text-amber-500 w-50 min-h-[10%] p-8 rounded-lg shadow-xl">
        <h1 className="text-lg font-bold">Viva Health</h1>
        <p className="text-sm font-bold">Redirect...</p>
        <br />
        <br />
        <button
          className=" border border-blue-500 w-24 h-7 bg-gray-700 hover:bg-gray-800 text-stone-100 rounded-md"
          type="submit"
          onClick={() => handleLogin()}
        >
          Login
        </button>
      </div>
    </main>
  );
}
