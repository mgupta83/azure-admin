# Azure Setup Scripts

This package contains scripts to set up the Azure infrastructure required for the monitoring UI.

## Prerequisites

### For Azure CLI (Node.js script)
- Azure CLI installed and logged in (`az login`)
- Node.js 18+ installed
- Appropriate permissions to create custom roles and Azure AD groups

### For PowerShell script
- Azure PowerShell module installed (`Install-Module -Name Az`)
- Connected to Azure (`Connect-AzAccount`)
- Appropriate permissions to create custom roles and Azure AD groups

## What the scripts create

1. **Azure AD Group**: `az_monitoring`
   - Group for users who need monitoring access

2. **Custom Role**: `Azure Monitoring Reader`
   - Read-only access to storage accounts (blobs and queues)
   - Read-only access to Cosmos DB (MongoDB API)
   - Read-only access to Function Apps and their settings
   - Read-only access to Key Vault certificates and secrets

3. **Resource Group**: `az_monitoring`
   - Container for monitoring-related resources

4. **Role Assignment**
   - Assigns the custom role to the Azure AD group at subscription level

## Usage

### Using Azure CLI (Node.js)
```bash
npm run setup
```

### Using PowerShell
```powershell
./Setup-Monitoring.ps1
```

### Custom parameters (PowerShell only)
```powershell
./Setup-Monitoring.ps1 -ResourceGroupName "custom-monitoring" -RoleName "Custom Monitoring Role" -Location "West US"
```

## Permissions Required

The user running these scripts needs:
- `User Access Administrator` or `Owner` role on the subscription
- `Global Administrator` or `Groups Administrator` role in Azure AD (to create groups)

## Security Considerations

The custom role provides read-only access with the following specific permissions:

### Storage Accounts
- Read blob contents (no write/delete)
- Preview queue messages (no add/delete)

### Cosmos DB (MongoDB API)
- Run find and aggregate queries only
- No insert/update/delete operations

### Function Apps
- Read application settings
- Read function status
- No configuration changes

### Key Vault
- Read certificate names and expiration dates
- Read secret names and values
- No create/update/delete operations

## Troubleshooting

1. **Authentication errors**: Ensure you're logged in to Azure CLI or PowerShell
2. **Permission errors**: Verify you have the required roles mentioned above
3. **Resource already exists**: Scripts handle existing resources gracefully
4. **Custom role creation fails**: May need to wait a few minutes for Azure AD propagation

## Next Steps

After running the setup:
1. Add users to the `az_monitoring` Azure AD group
2. Deploy the UI application
3. Configure the UI to use OIDC authentication with Azure AD