
import Topbar from './components/topbar';
import getCurrentUserProfile from './lib/getCurrentUserProfile';
import { User } from './interfaces/User';

export default async function Home() {

  const user: User = await getCurrentUserProfile();
  
  if (user.status === 200) {
    console.log('user >>>> ', user);

  }

  return (
    <main className="flex flex-col">
      <Topbar />
      <div className=" flex flex-col gap-10 items-center content-center justify-center ">
        
        <div className="flex flex-col bg-gray-700 max-h-96 p-4 border-4 text-amber-500 gap-4">
          <h1 className="text-2xl">Current User Profile</h1><br />
          First Name: {user?.firstName}<br />
          Last Name: {user?.lastName}<br />
          Email: {user?.email}<br />
          ID: {user?.id}<br />
          
        </div>
        Deployed by Helm!
      </div>
    
    
    </main>

  );
}
