import Topbar from '../components/topbar';


export default async function LogoutPage() {


  return (
    <main className=" flex flex-col  text-blue-700">
      <Topbar />

      <div className=" flex flex-col gap-10 items-center content-center justify-center ">
        {/* logout */}
        Logged Out!
      </div>
    </main>
  );
}
