'use server';

import { cookies, headers } from 'next/headers'

export async function cookieIdToken(IdToken: string) {
  // add access token to cookies
  cookies().set({
    name:'IdToken',
    value: IdToken,
    maxAge: 60 * 60 * 1 * 1, // 1 hour
    httpOnly: true,
    path: '/',
  });
}