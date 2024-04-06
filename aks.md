https://phoenixnap.com/kb/kubectl-commands-cheat-sheet
kubectl get namespaces
kubectl get pods
kubectl get pod -A
kubectl get pods -o wide
kubectl get pods --show-labels
kubectl get pods --field-selector=spec.nodeName=[server-name]
kubectl get daemonset

kubectl get sa -n azure-alb-system
kubectl get gatewayclass
kubectl get gateway
kubectl get ingressclass
kubectl get crd
kubectl get services

kubectl describe services -A