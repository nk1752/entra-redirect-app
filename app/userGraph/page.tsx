'use client';

import { useState, } from 'react';
import Topbar from '../components/topbar';
import { User } from '../interfaces/User';
import getUserProfileByEmail from '../lib/getUserProfileByEmail';

let user: User = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  status: 0,
};

export default function GraphPage() {
  const [emailInput, setEmailInput] = useState('');
  const [userProfile, setUserProfile] = useState<User | null>(null);

  async function searchUserProfileByEmail() {

    // get user profile by email
    getUserProfileByEmail(emailInput)
      .then((res) => {
        setUserProfile(res);
        console.log('userProfile >>>> ', res);
        
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
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
              id="firstName"
              type="text"
              name="firstName"
              defaultValue={userProfile?.firstName}
              style={{ width: '100%' }}
              // get first name from user object
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
              Email
            </span>
            <input
              className=" bg-slate-200 hover:bg-slate-100 active:bg-white text-black focus:ring focus:ring-blue-500"
              type="text"
              name="email"
              placeholder="1st part of email"
              style={{ width: '100%' }}
              onChange={(e) => {
                setEmailInput(e.target.value);
              }}
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
