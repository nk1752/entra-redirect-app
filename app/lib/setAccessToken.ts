import { cookies } from "next/headers";

export async function getAccessToken(accessToken: string) {
     
  // add access token to cookies
  cookies().set({
    name: "accessToken",
    value: accessToken,
    maxAge: 60 * 60 * 24 * 1, // 1 day
    httpOnly: true,
    path: "/",
    });

}