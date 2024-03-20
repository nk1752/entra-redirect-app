'use server';
export default async function getBeTime(accessToken: string) {
  const url = 'http://localhost:8080/api/health';

  const response = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'plain/text',

      cache: 'no-cache',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if ((await response).ok) {
    const time = (await response).text();
    return time;
  } else {
    return 'error';
  }
}
