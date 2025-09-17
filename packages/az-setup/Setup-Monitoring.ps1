# Azure Monitoring Infrastructure Setup
# PowerShell version of the setup script

param(
    [string]$ResourceGroupName = "az_monitoring",
    [string]$RoleName = "Azure Monitoring Reader",
    [string]$Location = "East US"
)

function Write-StatusMessage {
    param([string]$Message, [string]$Status = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    switch ($Status) {
        "SUCCESS" { Write-Host "[$timestamp] ✅ $Message" -ForegroundColor Green }
        "ERROR" { Write-Host "[$timestamp] ❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "[$timestamp] ⚠️  $Message" -ForegroundColor Yellow }
        default { Write-Host "[$timestamp] 🔄 $Message" -ForegroundColor Cyan }
    }
}

function Test-AzureConnection {
    try {
        $context = Get-AzContext
        if ($null -eq $context) {
            throw "No Azure context found"
        }
        Write-StatusMessage "Connected to Azure subscription: $($context.Subscription.Name)" "SUCCESS"
        return $context.Subscription.Id
    }
    catch {
        Write-StatusMessage "Not connected to Azure. Please run Connect-AzAccount first." "ERROR"
        exit 1
    }
}

function New-CustomMonitoringRole {
    param([string]$SubscriptionId)
    
    Write-StatusMessage "Creating custom monitoring role: $RoleName"
    
    $roleDefinition = @{
        Name = $RoleName
        Description = "Custom role for Azure monitoring with read-only access to storage, cosmos db, function apps, and key vaults"
        Actions = @(
            # Storage Account permissions
            "Microsoft.Storage/storageAccounts/read",
            "Microsoft.Storage/storageAccounts/blobServices/containers/read", 
            "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
            "Microsoft.Storage/storageAccounts/queueServices/queues/read",
            "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read",
            
            # Cosmos DB permissions
            "Microsoft.DocumentDB/databaseAccounts/read",
            "Microsoft.DocumentDB/databaseAccounts/readonlyKeys/action",
            "Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/read",
            "Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/read",
            
            # Function App permissions
            "Microsoft.Web/sites/read",
            "Microsoft.Web/sites/config/read", 
            "Microsoft.Web/sites/functions/read",
            
            # Key Vault permissions
            "Microsoft.KeyVault/vaults/read",
            "Microsoft.KeyVault/vaults/certificates/read",
            "Microsoft.KeyVault/vaults/secrets/read"
        )
        NotActions = @()
        DataActions = @(
            # Blob read access
            "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
            
            # Queue message preview  
            "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read",
            
            # Key Vault data access
            "Microsoft.KeyVault/vaults/certificates/read",
            "Microsoft.KeyVault/vaults/secrets/getSecret/action"
        )
        NotDataActions = @()
        AssignableScopes = @("/subscriptions/$SubscriptionId")
    }
    
    try {
        $existingRole = Get-AzRoleDefinition -Name $RoleName -ErrorAction SilentlyContinue
        if ($existingRole) {
            Write-StatusMessage "Custom role '$RoleName' already exists" "WARNING"
            return $existingRole.Id
        }
        
        $role = New-AzRoleDefinition -Role (New-Object Microsoft.Azure.Commands.Resources.Models.Authorization.PSRoleDefinition -Property $roleDefinition)
        Write-StatusMessage "Created custom role: $RoleName" "SUCCESS"
        return $role.Id
    }
    catch {
        Write-StatusMessage "Failed to create custom role: $($_.Exception.Message)" "ERROR"
        throw
    }
}

function New-MonitoringResourceGroup {
    Write-StatusMessage "Creating/verifying resource group: $ResourceGroupName"
    
    try {
        $rg = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
        if ($rg) {
            Write-StatusMessage "Resource group '$ResourceGroupName' already exists" "WARNING"
        } else {
            $rg = New-AzResourceGroup -Name $ResourceGroupName -Location $Location
            Write-StatusMessage "Created resource group: $ResourceGroupName" "SUCCESS"
        }
        return $rg
    }
    catch {
        Write-StatusMessage "Failed to create resource group: $($_.Exception.Message)" "ERROR"
        throw
    }
}

function New-MonitoringADGroup {
    Write-StatusMessage "Creating/verifying Azure AD group: $ResourceGroupName"
    
    try {
        $group = Get-AzADGroup -DisplayName $ResourceGroupName -ErrorAction SilentlyContinue
        if ($group) {
            Write-StatusMessage "Azure AD group '$ResourceGroupName' already exists" "WARNING"
        } else {
            $group = New-AzADGroup -DisplayName $ResourceGroupName -MailNickname $ResourceGroupName
            Write-StatusMessage "Created Azure AD group: $ResourceGroupName" "SUCCESS"
        }
        return $group.Id
    }
    catch {
        Write-StatusMessage "Failed to create Azure AD group: $($_.Exception.Message)" "ERROR"
        throw
    }
}

function Set-MonitoringRoleAssignment {
    param(
        [string]$GroupId,
        [string]$RoleId,
        [string]$SubscriptionId
    )
    
    Write-StatusMessage "Assigning monitoring role to group"
    
    try {
        $scope = "/subscriptions/$SubscriptionId"
        $existingAssignment = Get-AzRoleAssignment -ObjectId $GroupId -RoleDefinitionId $RoleId -Scope $scope -ErrorAction SilentlyContinue
        
        if ($existingAssignment) {
            Write-StatusMessage "Role assignment already exists" "WARNING"
        } else {
            New-AzRoleAssignment -ObjectId $GroupId -RoleDefinitionId $RoleId -Scope $scope
            Write-StatusMessage "Assigned role to monitoring group" "SUCCESS"
        }
    }
    catch {
        Write-StatusMessage "Failed to assign role: $($_.Exception.Message)" "ERROR"
        throw
    }
}

# Main execution
try {
    Write-Host "🚀 Starting Azure Monitoring Infrastructure Setup" -ForegroundColor Magenta
    Write-Host "================================================" -ForegroundColor Magenta
    
    # Verify Azure connection
    $subscriptionId = Test-AzureConnection
    
    # Create custom role
    $roleId = New-CustomMonitoringRole -SubscriptionId $subscriptionId
    
    # Create Azure AD group
    $groupId = New-MonitoringADGroup
    
    # Create resource group  
    $resourceGroup = New-MonitoringResourceGroup
    
    # Assign role to group
    Set-MonitoringRoleAssignment -GroupId $groupId -RoleId $roleId -SubscriptionId $subscriptionId
    
    Write-Host "`n🎉 Azure Monitoring Infrastructure Setup Complete!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-StatusMessage "Created/verified resource group: $ResourceGroupName" "SUCCESS"
    Write-StatusMessage "Created/verified Azure AD group: $ResourceGroupName" "SUCCESS" 
    Write-StatusMessage "Created custom role: $RoleName" "SUCCESS"
    Write-StatusMessage "Assigned monitoring permissions to the group" "SUCCESS"
    
    Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Add users to the $ResourceGroupName Azure AD group" -ForegroundColor White
    Write-Host "2. Deploy the UI application" -ForegroundColor White
    Write-Host "3. Configure OIDC authentication in the UI" -ForegroundColor White
}
catch {
    Write-Host "`n💥 Setup failed!" -ForegroundColor Red
    Write-Host "================" -ForegroundColor Red
    Write-StatusMessage $_.Exception.Message "ERROR"
    exit 1
}