import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
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

export default async function graphPage() {
  async function searchUserProfileByEmail(formData: FormData) {
    'use server';
    const input = formData.get('email') as string;
    user = await getUserProfileByEmail(input);

    revalidatePath('/userGraph');
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
              defaultValue={user.firstName}
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
              defaultValue={user.lastName}
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
