import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Topbar from '../components/topbar';
import { User } from '../interfaces/User';

let firstName: string;
let lastName: string;
let id: string;

let user: User = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  status: 0,
};

export default async function graphPage() {
  async function getUserProfileByEmail(formData: FormData) {
    'use server';
    const input = formData.get('email') as string;
    //console.log('email >>>> ', input);

    const url =
      'https://graph.microsoft.com/v1.0/users/' + input + '@pocvivahealth.com';
    //const url = 'https://graph.microsoft.com/v1.0/users/';

    const accessTokenCookie = cookies().get('accessToken');
    const accessToken = accessTokenCookie?.value;

    //console.log('accessToken cookie >>>> ', accessToken);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ConsistencyLevel: 'eventual',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      user = {
        firstName: data.givenName,
        lastName: data.surname,
        email: data.userPrincipalName,
        id: data.id,
        status: data.status,
      };
      console.log('user >>>> ', user);
    }

    revalidatePath('/userGraph');
  }

  return (
    <main className=" flex flex-col  text-blue-700">
      <Topbar />

      <div className=" flex flex-col gap-10 items-center content-center justify-center ">
        {/* email */}
        <form
          action={getUserProfileByEmail}
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
