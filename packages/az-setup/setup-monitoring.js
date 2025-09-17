#!/usr/bin/env node

/**
 * Azure Setup Script for Monitoring Infrastructure
 * 
 * This script creates:
 * - Azure resource group 'az_monitoring'  
 * - Custom roles for monitoring access
 * - Role assignments for storage accounts, cosmos db, function apps, key vaults
 */

import { execSync } from 'child_process';
import {writeFileSync, unlinkSync} from 'fs';

const LOCATION = 'East US2';
const RESOURCE_GROUP = 'az_monitoring'; // Azure Resource Group name
const AZURE_AD_GROUP = 'az_monitoring_ad'; // Azure AD Group name
const ROLE_NAME = 'Azure Monitoring Reader';

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  console.log(`Running: ${command}`);
  
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`✅ Success: ${description} | Output: ${output.trim()}`);
    return output;
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    console.error(error.message);
    throw error;
  }
}

function createCustomRole() {
  const roleDefinition = {
    "Name": ROLE_NAME,
    "Description": "Custom role for Azure monitoring with read-only access to storage, cosmos db, function apps, and key vaults",
    "Actions": [
      // Storage Account permissions
      "Microsoft.Storage/storageAccounts/read",
      "Microsoft.Storage/storageAccounts/blobServices/containers/read",
      "Microsoft.Storage/storageAccounts/queueServices/queues/read",
      
      // Cosmos DB permissions  
      "Microsoft.DocumentDB/databaseAccounts/read",
      "Microsoft.DocumentDB/databaseAccounts/readonlyKeys/action",
      "Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/read",
      "Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/read",
      
      // Function App permissions
      "Microsoft.Web/sites/read",
      "Microsoft.Web/sites/config/read",
      "Microsoft.Web/sites/functions/read",
      
      // Key Vault permissions
      "Microsoft.KeyVault/vaults/read",
      "Microsoft.KeyVault/vaults/secrets/read"
    ],
    "NotActions": [],
    "DataActions": [
      // Blob read access
      "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
      
      // Queue message preview
      "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read",
      
      // Key Vault data access
      "Microsoft.KeyVault/vaults/certificates/read",
      "Microsoft.KeyVault/vaults/secrets/getSecret/action"
    ],
    "NotDataActions": [],
    "AssignableScopes": [
      "/subscriptions/{{SUBSCRIPTION_ID}}"
    ]
  };

  // Get current subscription ID
  const subscriptionId = runCommand(
    'az account show --query id --output tsv',
    'Getting current subscription ID'
  ).trim();

  // Replace subscription ID in role definition
  roleDefinition.AssignableScopes[0] = roleDefinition.AssignableScopes[0].replace('{{SUBSCRIPTION_ID}}', subscriptionId);

  const roleDefPath = './azure-monitoring-role.json';
  try{
    // Write role definition to temp file
    writeFileSync(roleDefPath, JSON.stringify(roleDefinition, null, 2));
    // Create the custom role
    runCommand(
      `az role definition create --role-definition "${roleDefPath}"`,
      'Creating custom Azure Monitoring Reader role'
    );
  } catch (error) {
    console.error('❌ Failed to create custom role.', error.message);
    throw error;
  } finally {
    // Clean up temp file
    unlinkSync(roleDefPath);
  }

  return subscriptionId;
}

function createResourceGroup(subscriptionId) {
  // Check if resource group exists
  try {
    runCommand(
      `az group show --name ${RESOURCE_GROUP}`,
      'Checking if resource group exists'
    );
    console.log(`ℹ️  Resource group ${RESOURCE_GROUP} already exists`);
  } catch (error) {
    // Create resource group if it doesn't exist
    runCommand(
      `az group create --name ${RESOURCE_GROUP} --location "${LOCATION}"`,
      `Creating resource group ${RESOURCE_GROUP}`
    );
  }
}

function assignRoleToGroup(subscriptionId) {
  // Get the role definition ID
  const roleId = runCommand(
    `az role definition list --name "${ROLE_NAME}" --query '[0].id' --output tsv`,
    'Getting custom role ID'
  ).trim();

  // Get the Azure AD group object ID
  const groupId = runCommand(
    `az ad group show --group ${AZURE_AD_GROUP} --query id --output tsv`,
    `Getting ${AZURE_AD_GROUP} Azure AD group object ID`
  ).trim();

  // Assign role to the group at subscription level
  runCommand(
    `az role assignment create --assignee ${groupId} --role "${roleId}" --scope "/subscriptions/${subscriptionId}"`,
    `Assigning ${ROLE_NAME} role to ${AZURE_AD_GROUP} Azure AD group`
  );
}

function createAzureADGroup() {
  // Check if Azure AD group exists
  try {
    runCommand(
      `az ad group show --group ${AZURE_AD_GROUP}`,
      'Checking if Azure AD group exists'
    );
    console.log(`ℹ️  Azure AD group ${AZURE_AD_GROUP} already exists`);
  } catch (error) {
    // Create Azure AD group if it doesn't exist
    runCommand(
      `az ad group create --display-name ${AZURE_AD_GROUP} --mail-nickname ${AZURE_AD_GROUP}`,
      `Creating Azure AD group ${AZURE_AD_GROUP}`
    );
  }
}

function main() {
  console.log('🚀 Starting Azure Monitoring Infrastructure Setup');
  console.log('================================================');

  try {
    // Check if Azure CLI is logged in
    runCommand('az account show', 'Verifying Azure CLI authentication');
    
    // Create custom role
    const subscriptionId = createCustomRole();
    
  // Create Azure AD group
  createAzureADGroup();

  // Create resource group
  createResourceGroup(subscriptionId);

  // Assign role to Azure AD group
  assignRoleToGroup(subscriptionId);

  console.log('\n🎉 Azure Monitoring Infrastructure Setup Complete!');
  console.log('==================================================');
  console.log(`✅ Created/verified resource group: ${RESOURCE_GROUP}`);
  console.log(`✅ Created/verified Azure AD group: ${AZURE_AD_GROUP}`);
  console.log(`✅ Created custom role: ${ROLE_NAME}`);
  console.log(`✅ Assigned monitoring permissions to the Azure AD group`);
  console.log('\n📝 Next steps:');
  console.log(`1. Add users to the ${AZURE_AD_GROUP} Azure AD group`);
  console.log('2. Deploy the UI application');
  console.log('3. Configure OIDC authentication in the UI');
    
  } catch (error) {
    console.error('\n💥 Setup failed!');
    console.error('================');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}