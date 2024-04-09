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

k logs -f alb-controller-7d9f9d9565-5lk9f -n azure-alb-system



k delete gateway <gateway name> -n <namespace>

k logs -f ca182f18-edea-48fd-b592-cba17f432ad3 

k explain gateway.spec.listeners.tls
