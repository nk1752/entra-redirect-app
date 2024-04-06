import {
  DefaultAzureCredential,
  ManagedIdentityCredential,
} from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export async function getSecret(secretName: string) {
  const client_id = process.env.UMI_CLIENT_ID; // Managed Identity Client ID
  const tenant_id = process.env.UMI_TENANT_ID; // Managed Identity Tenant ID

  // get credentials using Managed Identity
  const credential = new DefaultAzureCredential();

  const vaultName = process.env.SECRET_VAULT_NAME;
  const vaultUrl = `https://${vaultName}.vault.azure.net`;

  console.log('creds:', credential, vaultUrl, secretName);

  const client = new SecretClient(vaultUrl, credential, {
    serviceVersion: '7.1',
  });

  const secret = await client.getSecret(secretName);
  console.log('Secret value:', secret.value);

  return secret.value;
}
