Install-Module Microsoft.Graph

Connect-MgGraph -Scopes  "Policy.ReadWrite.ApplicationConfiguration","Policy.Read.All","Application.ReadWrite.All"

# Create a token lifetime policy
$params = @{
	Definition = @('{"TokenLifetimePolicy":{"Version":1,"AccessTokenLifetime":"00:10:00"}}') 
    DisplayName = "WebPolicyScenario"
	IsOrganizationDefault = $false
}
$tokenLifetimePolicyId=(New-MgPolicyTokenLifetimePolicy -BodyParameter $params).Id

# Display the policy
Get-MgPolicyTokenLifetimePolicy -TokenLifetimePolicyId $tokenLifetimePolicyId

# Assign the token lifetime policy to an app
$params = @{
	"@odata.id" = "https://graph.microsoft.com/v1.0/policies/tokenLifetimePolicies/$tokenLifetimePolicyId"
}

# Application Object ID
$applicationObjectId="a5ab6d72-5eff-4b97-89dd-a740cd226085"

New-MgApplicationTokenLifetimePolicyByRef -ApplicationId $applicationObjectId -BodyParameter $params

# List the token lifetime policy on the app
Get-MgApplicationTokenLifetimePolicy -ApplicationId $applicationObjectId

# Remove the policy from the app
# Remove-MgApplicationTokenLifetimePolicyByRef -ApplicationId $applicationObjectId -TokenLifetimePolicyId $tokenLifetimePolicyId

# Delete the policy
# Remove-MgPolicyTokenLifetimePolicy -TokenLifetimePolicyId $tokenLifetimePolicyId