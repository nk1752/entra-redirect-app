import Link from 'next/link';

import Signout from './signout';
import CurrentUser from './currentUser';

export default function Topbar() {
  return (
    <div className=" flex flex-row h-24 bg-gradient-to-r from-gray-900 to-gray-700 w-full text-stone-100 ">
      <div className="flex flex-row w-1/12 gap-10 place-items-center justify-center text-1xl">
        <CurrentUser />
      </div>
      <div
        className={
          'flex flex-row w-10/12 gap-8 place-items-center justify-center text-lg'
        }
      >
        <Link href="/">Home</Link>
        <Link href="../userGraph">User Data</Link>
        <Link href="../backendTest">Backend Test</Link>
      </div>
      <div className="flex flex-row w-1/12 gap-6 place-items-center justify-center text-1xl">
        <Signout />
      </div>
    </div>
  );
}
