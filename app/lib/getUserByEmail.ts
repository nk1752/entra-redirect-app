import { cookies } from 'next/headers';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

export default async function getUserByLastName(input: string) {
  const url = 'https://graph.microsoft.com/v1.0/users/' + input;
  const user: User[] = [];
  const accessTokenCookie = cookies().get('accessToken');
  const accessToken = accessTokenCookie?.value;

  console.log('url >>>> ', url);
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
    console.log(await response.json());
  } else {
    console.log('error >>>> ', response.status);
  }
}
