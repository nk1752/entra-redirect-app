# load variables

az group create --name $RESOURCE_GROUP --location $LOCATION
az group create --name $AG4C_RG --location $LOCATION

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

# ** deploy alb controller - byo **

# Create a user managed identity for ALB controller
# and federate the identity as Workload Identity to use in the AKS cluster
mcResourceGroup=$(az aks show --resource-group $RESOURCE_GROUP --name $AKS_NAME --query "nodeResourceGroup" -o tsv)
mcResourceGroupId=$(az group show --name $mcResourceGroup --query id -otsv)

# "Creating identity 'azure-alb-identity' in resource group aks-rg"
# and get object/principal id of 'azure-alb-identity'
az identity create --resource-group $RESOURCE_GROUP --name $IDENTITY_RESOURCE_NAME
principalId="$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)"

# must wait at least 60 sec
# "Apply Reader role ("acdd72a7-3385-48ef-bd42-f606fba81ae7") to the AKS managed cluster resource group for the newly provisioned identity 'azure-alb-identity' "
# ************** does not work from bash terminal ********
az role assignment create \
  --assignee-object-id $principalId \
  --assignee-principal-type ServicePrincipal \
  --scope $mcResourceGroupId \
  --role "acdd72a7-3385-48ef-bd42-f606fba81ae7"

# "Set up federation with AKS OIDC issuer"
AKS_OIDC_ISSUER="$(az aks show -n "$AKS_NAME" -g "$RESOURCE_GROUP" --query "oidcIssuerProfile.issuerUrl" -o tsv)"
# AKS_OIDC_ISSUER --> https://eastus.oic.prod-aks.azure.com/7cb752a7-6dfd-429e-adc9-129f0ea3fcec/8d1f8a28-8ca7-404a-9a16-c953cc68b7f8/

az identity federated-credential create \
    --name "azure-alb-identity" \
    --identity-name "$IDENTITY_RESOURCE_NAME" \
    --resource-group $RESOURCE_GROUP \
    --issuer "$AKS_OIDC_ISSUER" \
    --subject "system:serviceaccount:azure-alb-system:alb-controller-sa"

# Get the cluster credentials
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME

# Install the ALB Controller; please check https://learn.microsoft.com/en-us/azure/application-gateway/for-containers/alb-controller-release-notes and replace <version> with the latest release
helm install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
     --version 1.0.0 \
     --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)

kubectl get sa -n azure-alb-system
kubectl get gatewayclass
kubectl get gateway
kubectl get ingressclass
kubectl get crd

# ** create Application Gateway for Containers **
https://learn.microsoft.com/en-us/azure/application-gateway/for-containers/quickstart-create-application-gateway-for-containers-byo-deployment?tabs=existing-vnet-subnet

# Create the Application Gateway for Containers
az network alb create -g $RESOURCE_GROUP -n $AG4C_NAME

# Create a Frontend
az network alb frontend create -g $RESOURCE_GROUP -n $FRONTEND_NAME --alb-name $AG4C_NAME
az network alb frontend create -g aks-rg -n fe-nk --alb-name alb-nk

# Create a subnet for the Application Gateway for Containers within the AKS VNET
MC_RG=$(az aks show --name $AKS_NAME --resource-group $RESOURCE_GROUP --query "nodeResourceGroup" -o tsv)

CLUSTER_SUBNET_ID=$(az vmss list --resource-group $MC_RG --query '[0].virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].subnet.id' -o tsv)

read -d '' VNET_NAME VNET_RESOURCE_GROUP VNET_ID <<< $(az network vnet show --ids $CLUSTER_SUBNET_ID --query '[name, resourceGroup, id]' -o tsv)

SUBNET_ADDRESS_PREFIX='10.225.0.0/24'
# The subnet name can be any non-reserved subnet name (i.e. GatewaySubnet, AzureFirewallSubnet, AzureBastionSubnet would all be invalid)
ALB_SUBNET_NAME='subnet-alb' 

az network vnet subnet create \
  --resource-group $VNET_RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name $ALB_SUBNET_NAME \
  --address-prefixes $SUBNET_ADDRESS_PREFIX \
  --delegations 'Microsoft.ServiceNetworking/trafficControllers'

ALB_SUBNET_ID=$(az network vnet subnet show \
  --name alb-subnet \
  --resource-group MC_aks-rg_aks_eastus \
  --vnet-name aks-vnet-40759062 \
  --query '[id]' \
  --output tsv)

ResourceGroupId=$(az group show --name $RESOURCE_GROUP --query id -otsv)
principalId=$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)

# Delegate AppGw for Containers Configuration Manager role to AKS/Application Gateway for Containers RG
# "AppGw for Containers Configuration Manager"
az role assignment create \
  --assignee-object-id $principalId \
  --assignee-principal-type ServicePrincipal 
  --scope $ResourceGroupId --role "fbc52c3f-28ad-4303-a892-8a056630b8f1"

# Delegate Network Contributor permission for join to association subnet
# "Network Contributor"
az role assignment create \
  --assignee-object-id $principalId \
  --assignee-principal-type ServicePrincipal \
  --scope $ALB_SUBNET_ID \
  --role "4d97b98b-1d4f-4787-a291-c67834d212e7"
az role assignment create \
  --assignee-object-id d062d6a4-87b0-46b7-be13-bc98d55e19ff \
  --assignee-principal-type ServicePrincipal \
  --scope /subscriptions/df2f960a-8e92-40ec-a2b8-0a2923d3c074/resourceGroups/MC_aks-rg_aks_eastus/providers/Microsoft.Network/virtualNetworks/aks-vnet-40759062/subnets/alb-subnet \
  --role "4d97b98b-1d4f-4787-a291-c67834d212e7"

# Create the Association
az network alb association create -g $RESOURCE_GROUP -n $ASSOCIATION_NAME --alb-name $AGFC_NAME --subnet $ALB_SUBNET_ID

RESOURCE_ID=$(az network alb show --resource-group aks-rg --name alb-nk --query id -o tsv)