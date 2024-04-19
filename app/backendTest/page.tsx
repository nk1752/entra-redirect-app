'use server';

import { revalidatePath } from 'next/cache';
import Topbar from '../components/topbar';
import { User } from '../interfaces/User';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { getSecret } from '@/utils/azKeyVault';
import { setLogLevel } from '@azure/logger';
import { logger } from '@azure/identity';

setLogLevel('info');

let time: string = '???';

export default async function BackendPage() {
  const secretNmae = process.env.SECRET_NAME || '';
  console.log('secretName', secretNmae);

  const clientSecret = await getSecret(secretNmae);

  const authConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_POC_CLIENT_ID || '',
      authority: process.env.NEXT_PUBLIC_POC_AUTHORITY || '',
      clientSecret: clientSecret,
    },
  };

  async function getBackendToken(formData: FormData) {
    'use server';

    const svcUrl = formData.get('svcUrl') as string;

    const cca = new ConfidentialClientApplication(authConfig);
    const result = await cca.acquireTokenByClientCredential({
      scopes: ['api://26c696ca-aa6a-4802-955b-aff06d3fe111/.default'],
    });

    logger.info(result);

    if (!result || !result.accessToken) {
      console.log('No token');
      return;
    }

    // service-name.namespace.svc.cluster.local or service-name.namespace.svc or service-name.namespace
    const url = 'http://claims-service.claims-ns:8080' + '/api/health';

    logger.info('getBeTime url >>>> ', url);

    const response = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'plain/text',

        cache: 'no-cache',
        Authorization: `Bearer ${result.accessToken}`,
      },
    });

    if ((await response).ok) {
      const msg = (await response).text();
      time = (await msg).toString();
      revalidatePath('/backendTest');
    } else {
      time = 'error';
      revalidatePath('/backendTest');
    }

    revalidatePath('/backendTest');

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

          <label className=" block">
            <span className="block text-sm font-medium text-stone-100">
              time from backend service
            </span>
            
          </label>

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
