import { cookies } from 'next/headers';
import { User } from '../interfaces/User';

export default async function getUserProfile() {
  const url = 'https://graph.microsoft.com/v1.0/me/';
  let user: User;
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
    const data = await response.json();
    user = {
      firstName: data.givenName,
      lastName: data.surname,
      email: data.userPrincipalName,
      id: data.id,
      status: 200,
    };
  } else {
    user = {
      firstName: '',
      lastName: '',
      email: '',
      id: '',
      status: response.status,
    };
  }

  return user;
}
