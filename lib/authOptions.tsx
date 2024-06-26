import { NextAuthOptions } from 'next-auth';
import { jwtDecode } from 'jwt-decode';
import KeycloakProvider from 'next-auth/providers/keycloak';
import {encrypt} from '@/utils/encryption';

async function refreshAccessToken(token: any) {
    console.log("Refreshing token..."+token.refresh_token);
    
    const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
        client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string, 
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      }),
      method: "POST",
    });
    const refreshToken = await resp.json();
    if (!resp.ok) throw refreshToken;
  
    return {
      ...token,
      access_token: refreshToken.access_token,
      decoded: jwtDecode(refreshToken.access_token),
      id_token: refreshToken.id_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
      refresh_token: refreshToken.refresh_token,
    };
  }

const authOptions : NextAuthOptions  = {
    providers: [
        KeycloakProvider({
        clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
        clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET as string,
        issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER as string,
        }),
    ],
    callbacks: {
        async jwt({ token, account }: { token: any, account: any }) {
          const nowTimeStamp = Math.floor(Date.now() / 1000);
    
          if (account) {
            // account is only available the first time this callback is called on a new session (after the user signs in)
            token.decoded = jwtDecode(account.access_token);
            token.access_token = account.access_token;
            token.id_token = account.id_token;
            token.expires_at = account.expires_at;
            token.refresh_token = account.refresh_token;
            console.log("Token is created. "+Date.now());
            
            return token;
          } else if (nowTimeStamp < token.expires_at) {
            // token has not expired yet, return it
            return token;
          } else {
            // token is expired, try to refresh it
            console.log("Token has expired. Will refresh..."+Date.now());
            try {
              const refreshedToken = await refreshAccessToken(token);
              console.log("Token is refreshed.")
              return refreshedToken;
            } catch (error) {
              console.error("Error refreshing access token", error);
              return { ...token, error: "RefreshAccessTokenError" };
            }
          }
        },
        async session({ session, token }:{session: any , token: any}) {
          // Send properties to the client
          //console.log("Refreshing token..."+token.refresh_token);
          session.access_token = encrypt(token.access_token); // see utils/sessionTokenAccessor.js
          session.id_token = encrypt(token.id_token);  // see utils/sessionTokenAccessor.js
          session.roles = token.decoded.realm_access.roles;
          session.expires_at = token.expires_at;
          session.groups= token.decoded.groups;
          session.error = token.error;      
          return session;
        },
      },
};

export {authOptions};