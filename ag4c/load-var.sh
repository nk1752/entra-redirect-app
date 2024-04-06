#!/bin/bash
#Set environment variables

RESOURCE_GROUP='aks-rg'
LOCATION='eastus'
AKS_NAME='aks'

# bring your own deployment
AG4C_RG='ag4c-rg'
AG4C_NAME='alb-nk'
IDENTITY_RESOURCE_NAME='azure-alb-identity'
FRONT_NAME='fe-nk'
ASSOCIATION_NAME='association-nk'
CLUSTER_SUBNET_ID='/subscriptions/df2f960a-8e92-40ec-a2b8-0a2923d3c074/resourceGroups/MC_aks-rg_aks_eastus/providers/Microsoft.Network/virtualNetworks/aks-vnet-40759062/subnets/aks-subnet'
ALB_SUBNET_ID='/subscriptions/df2f960a-8e92-40ec-a2b8-0a2923d3c074/resourceGroups/MC_aks-rg_aks_eastus/providers/Microsoft.Network/virtualNetworks/aks-vnet-40759062/subnets/alb-subnet'

ECHO "AG4C_RG: " $AG4C_RG
ECHO "AG4C_NAME: " $AG4C_NAME
ECHO "IDENTITY_RESOURCE_NAME: " $IDENTITY_RESOURCE_NAME
ECHO "FRONT_NAME: " $FRONT_NAME
ECHO "ASSOCIATION_NAME: " $ASSOCIATION_NAME
ECHO "RESOURCE_GROUP: " $RESOURCE_GROUP
ECHO "LOCATION: " $LOCATION
ECHO "AKS_NAME: " $AKS_NAME

