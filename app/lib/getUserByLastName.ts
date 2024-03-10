import { cookies } from 'next/headers';

export default async function getUserByLastName(input: string) {
  const query = `"surname:${input}"`;
  const url =
    'https://graph.microsoft.com/v1.0/users?$count=true&$search=' + `${query}`;

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
