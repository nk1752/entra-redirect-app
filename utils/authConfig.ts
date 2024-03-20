// Objective: Configuration for authentication using MSAL
import { Configuration } from '@azure/msal-browser';

const tenant_id = process.env.NEXT_PUBLIC_UAB_VIVA_TENANT_ID|| '';
//const client_id = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const client_id = process.env.NEXT_PUBLIC_UAB_VIVA_CLIENT_ID || '';




// MSAL configuration for ENTRA_AUTH_APP App 
export const msalConfig: Configuration = {
    auth: {
      clientId: client_id, // client ID of claims-workflow-poc
      //authority: 'https://login.microsoftonline.com/'+tenant_id, 
      authority: 'https://login.microsoftonline.com/'+tenant_id+'/oauth2/v2.0/token',
      redirectUri: '/', // redirect URI of claims-workflow-poc
      postLogoutRedirectUri: '/',
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
    
  };

export const backendRequest = {
  scopes: ['api://8116934e-f75b-4fb8-a438-ef0da5009b32/.default']
};

export const loginRequest = {
  scopes: ['User.Read', 'Directory.Read.All']
};