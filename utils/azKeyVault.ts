import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

export async function getSecret(secretName: string) {

    const client_id = process.env.UMI_CLIENT_ID;  // Managed Identity Client ID
    
    // environment variables
    const credential = new DefaultAzureCredential({
        managedIdentityClientId: client_id,
    });

    // system-assigned managed identity
    //const credential = new ManagedIdentityCredential();

    // user-assigned managed identity
    //const credential = new ManagedIdentityCredential(client_id);

    const vaultName = process.env.SECRET_VAULT_NAME;
    const vaultUrl = `https://${vaultName}.vault.azure.net`;

    const client = new SecretClient(vaultUrl, credential, {
        serviceVersion: "7.1",
    });

    console.log("Getting secret...");


    const secret = await client.getSecret(secretName);
    return secret.value;
}