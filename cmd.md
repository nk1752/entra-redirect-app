az aks get-credentials -n MyManagedCluster -g MyResourceGroup

alias k=kubectl
alias kg='kubectl get'
alias kgpo='kubectl get pod'

kubectl apply -f ./my-manifest.yaml            # create resource(s)
kubectl apply -f ./dir                         # create resource(s) in all manifest files in dir

kubectl config view # Show Merged kubeconfig settings.


https://phoenixnap.com/kb/kubectl-commands-cheat-sheet
kubectl get namespaces
kubectl get pods
kubectl get pod -A
kubectl get pods -o wide
kubectl get pods --show-labels
kubectl get pods --field-selector=spec.nodeName=[server-name]
kubectl get daemonset

kubectl exec -it <pod_name> -c <container_name> — /bin/bash

kubectl describe svc myService
kubectl get service -A

docker build . -t aad-app -f ./dockerfiles/Dockerfile.prisma --no-cache
docker run -p 3000:3000 aad-app

az account list
az account clear //logout all users


helm upgrade -i helm-delegate --namespace harness-delegate-ng --create-namespace \
  harness-delegate/harness-delegate-ng \
  --set delegateName=helm-delegate \
  --set accountId=xovDi0YBTkiRL1u4XbuGdg \
  --set delegateToken=NjhkZmU2ZTA0YjMxNTJjZjZhZTg1MGZlNmRkZjdlYTE= \
  --set managerEndpoint=https://app.harness.io \
  --set delegateDockerImage=harness/delegate:23.08.80308 \
  --set replicas=1 --set upgrader.enabled=false

  helm upgrade -i helm-delegate --namespace harness-delegate-ng --create-namespace harness-delegate/harness-delegate-ng


  ************************************

  az network alb show -g appgw-rg --name alb-poc --query id -o tsv




  az role assignment list --scope /subscriptions/df2f960a-8e92-40ec-a2b8-0a2923d3c074/resourceGroups/alb-cluster-rg/providers/Microsoft.ContainerRegistry/registries/vhacr1 -o table

SP_ID=$(az aks show --resource-group alb-cluster-rg --name alb-cluster --query servicePrincipalProfile.clientId -o tsv)

az ad sp credential list --id "$SP_ID" --query "[].endDate" -o tsv

az aks show --resource-group alb-cluster-rg \
    --name alb-cluster \
    --query servicePrincipalProfile.clientId \
    --output tsv

az role assignment list --scope /subscriptions/<subscriptionID>/resourceGroups/<resourcegroupname>/providers/Microsoft.ContainerRegistry/registries/<acrname> -o table

<service-name>.<namespace>.svc.cluster.local:<service-port>
<service-name>.<namespace>:<service-port>
k exec -it pod-name -n pod-namespace sh