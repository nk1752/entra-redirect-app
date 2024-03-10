'use server';

import { cookies, headers } from 'next/headers'

export async function setAccessToken(accessToken: string) {
  // add access token to cookies
  cookies().set({
    name:'accessToken',
    value: accessToken,
    maxAge: 60 * 60 * 24 * 7,
    //httpOnly: true,
    path: '/',
  });
}