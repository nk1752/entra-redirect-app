'use server';

import { cookies, headers } from 'next/headers'

export async function cookieAccessToken(accessToken: string) {
  // add access token to cookies
  cookies().set({
    name:'accessToken',
    value: accessToken,
    maxAge: 60 * 60 * 1 * 1, // 1 hour
    httpOnly: true,
    path: '/',
  });
}