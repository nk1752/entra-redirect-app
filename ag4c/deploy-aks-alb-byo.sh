#Set environment variables
AKS_NAME='aks-agfc-byo'
RESOURCE_GROUP='aks-agfc-byo-rg'
LOCATION='eastus'
IDENTITY_RESOURCE_NAME='azure-alb-identity'

#Create resource group and AKS cluster
az group create --name $RESOURCE_GROUP --location $LOCATION
az aks create \
    --resource-group $RESOURCE_GROUP \
    --name $AKS_NAME \
    --node-count 2 \
    --network-plugin azure \
    --enable-oidc-issuer \
    --enable-workload-identity

#Create a user managed identity for ALB controller and federate the identity as Workload Identity to use in the AKS cluster
mcResourceGroup=$(az aks show --resource-group $RESOURCE_GROUP --name $AKS_NAME --query "nodeResourceGroup" -o tsv)
mcResourceGroupId=$(az group show --name $mcResourceGroup --query id -otsv)

echo "Creating identity $IDENTITY_RESOURCE_NAME in resource group $RESOURCE_GROUP"
az identity create --resource-group $RESOURCE_GROUP --name $IDENTITY_RESOURCE_NAME
principalId="$(az identity show -g $RESOURCE_GROUP -n $IDENTITY_RESOURCE_NAME --query principalId -otsv)"

echo "Waiting 60 seconds to allow for replication of the identity..."
sleep 60

echo "Apply Reader role to the AKS managed cluster resource group for the newly provisioned identity"
az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --scope $mcResourceGroupId --role "Reader"

echo "Set up federation with AKS OIDC issuer"
AKS_OIDC_ISSUER="$(az aks show -n "$AKS_NAME" -g "$RESOURCE_GROUP" --query "oidcIssuerProfile.issuerUrl" -o tsv)"
az identity federated-credential create --name "azure-alb-identity" \
    --identity-name "$IDENTITY_RESOURCE_NAME" \
    --resource-group $RESOURCE_GROUP \
    --issuer "$AKS_OIDC_ISSUER" \
    --subject "system:serviceaccount:azure-alb-system:alb-controller-sa"

#Get the cluster credentials
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME

#Install the ALB Controller; please check https://learn.microsoft.com/en-us/azure/application-gateway/for-containers/alb-controller-release-notes and replace <version> with the latest release
helm install alb-controller oci://mcr.microsoft.com/application-lb/charts/alb-controller \
     --version <version> \
     --set albController.podIdentity.clientID=$(az identity show -g $RESOURCE_GROUP -n azure-alb-identity --query clientId -o tsv)

kubectl get sa -n azure-alb-system
kubectl get gatewayclass
kubectl get gateway
kubectl get ingressclass
kubectl get crd

# ** create Application Gateway foor Containers **


