RESOURCE_GROUP='aks-rg'
LOCATION='eastus'
AKS_NAME='aks'

# bring your own deployment
AG4C_RG='ag4c-rg'
AG4C_NAME='alb-nk'
IDENTITY_RESOURCE_NAME='azure-alb-identity'

az group create --name $RESOURCE_GROUP --location $LOCATION

az aks create \
  -g $RESOURCE_GROUP \
  -n $AKS_NAME \
  --network-plugin azure \
  --node-count 2 \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --generate-ssh-key


# Attach using acr-name
az aks update -n $AKS_NAME -g $RESOURCE_GROUP --attach-acr vhacr

# all resource provider are @ subscription level
az provider show --namespace Microsoft.ServiceNetworking --query registrationState -o table

