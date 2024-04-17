# install helm
brew install helm
choco install kubernetes-helm

# add 3rd party chart
helm repo add <name> <url> <flags>

# creates helm chart file structure
helm create <chart-name>

# install helm chart
helm install <chart-release-name> <chart-name> -n <namespace>

# upgrade
helm upgrade <chart-release-name> <chart-name> -n <namespace> --values claims-chart/values.yaml 

# rollback
helm rollback <chart-release-name> <chart-name> -n <namespace>

# delete
helm delete <chart-release-name> <chart-name> -n <namespace>

# preview
helm upgrade claims-release claims-chart -n helm-ns --values claims-chart/values.yaml --dry-run --debug
