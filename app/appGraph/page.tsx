'use server';

import { revalidatePath } from 'next/cache';
import Topbar from '../components/topbar';
import { User } from '../interfaces/User';
import { ConfidentialClientApplication } from '@azure/msal-node';

let userProfile: User = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  status: 0,
};

export default async function AppGraphPage() {
  

  const authConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_POC_CLIENT_ID || '',
      authority: process.env.NEXT_PUBLIC_POC_AUTHORITY || '',
      clientSecret: process.env.POC_CLIENT_SECRET || '',
    },
  };

  async function searchUserProfileByEmail(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;

    const cca = new ConfidentialClientApplication(authConfig);
    const result = await cca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    console.log(result);

    const url = `https://graph.microsoft.com/v1.0/users/${email}@pocvivahealth.com`;

    if (!result || !result.accessToken) {
      console.log('No token');
      return;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${result.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        (userProfile.firstName = data.givenName),
          (userProfile.lastName = data.surname),
          (userProfile.email = data.userPrincipalName),
          (userProfile.id = data.id),
          (userProfile.status = 200)

      })
      .catch((err) => {
        console.log(err);
      });

      console.log('userProfile >>>> ', userProfile);

      revalidatePath('/appGraph');
  }

  return (
    <main className=" flex flex-col  text-blue-700">
      <Topbar />

      <div className=" flex flex-col gap-10 items-center content-center justify-center ">
        {/* email */}
        <form
          action={searchUserProfileByEmail}
          className="flex flex-col bg-gray-700 max-h-96 p-4 border-4 text-stone-100 gap-4"
        >
          <h3 className="text-2xl font-bold">Get User By Email</h3>

          <label className=" block">
          <span className="block text-sm font-medium text-stone-100">
              First Name
            </span>
            <input
              className=" bg-slate-400 text-black"
              type="text"
              name="firstName"
              defaultValue={userProfile?.firstName}
              style={{ width: '100%' }}
            />
          </label>

          <label className=" block">
            <span className="block text-sm font-medium text-stone-100">
              Last Name
            </span>
            <input
              className=" bg-slate-400 text-black"
              type="text"
              name="lastName"
              defaultValue={userProfile?.lastName}
              style={{ width: '100%' }}
            />
          </label>

          <label className=" block">
            <span className="block text-sm font-medium text-stone-100">
              AD Username
            </span>
            <input
              className=" bg-slate-200 hover:bg-slate-100 active:bg-white text-black focus:ring focus:ring-blue-500"
              type="text"
              name="email"
              placeholder="1st part of email"
              style={{ width: '100%' }}
            />
          </label>
          <button
            className=" border border-blue-500 w-24 h-7 bg-gray-700 hover:bg-gray-800 text-stone-100 rounded-md"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </main>
  );
}
