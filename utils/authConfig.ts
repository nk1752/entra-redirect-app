// Objective: Configuration for authentication using MSAL
import { Configuration } from '@azure/msal-browser';

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const tenant_id = process.env.NEXT_PUBLIC_TENANT_ID || '';

// MSAL configuration for ENTRA_AUTH_APP App 
export const msalConfig: Configuration = {
    auth: {
      clientId: client_id, // client ID of claims-workflow-poc
      authority: 'https://login.microsoftonline.com/'+tenant_id, // tenant ID of claims-workflow-poc
      redirectUri: '/', // redirect URI of claims-workflow-poc
      postLogoutRedirectUri: '/',
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
    
  };