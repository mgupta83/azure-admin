# Azure Admin UI

React-based monitoring dashboard for Azure infrastructure, providing read-only access to storage accounts, Cosmos DB, Function Apps, and Key Vaults.

## Features

- **OIDC Authentication** with Azure AD
- **Role-based Access Control** using Azure AD groups
- **Storage Monitoring**: View blobs and queue messages
- **Cosmos DB Shell**: Execute read-only MongoDB operations
- **Function Apps**: Monitor app settings and function status
- **Key Vault**: View certificates and secrets with expiration tracking
- **User Preferences**: Personalized quick access and subscription management

## Development

### Prerequisites

- Node.js 18+
- Azure CLI (for backend setup)
- Azure subscription with appropriate permissions

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure application details
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook

### Architecture

Built using atomic design principles:

- **Atoms**: Basic UI components (Button, Input, Card, etc.)
- **Molecules**: Composed components (Header, Sidebar, etc.)
- **Organisms**: Complex components (AppLayout, Dashboard, etc.)

### Tech Stack

- React 18 with TypeScript
- Ant Design + Tailwind CSS
- React Router for navigation
- Zustand for state management
- React Query for data fetching
- Vitest + React Testing Library for testing
- Storybook for component documentation

## Deployment

The application is designed to be deployed as a static site to Azure Static Web Apps or similar platforms.

### Azure Static Web Apps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy using Azure CLI**
   ```bash
   az staticwebapp create \
     --name azure-admin-ui \
     --resource-group az_monitoring \
     --source dist \
     --location "East US"
   ```

### Configuration

Ensure your Azure AD application has:
- Redirect URIs configured for your deployment URLs
- Required API permissions for Azure Management and Microsoft Graph
- Users assigned to the `az_monitoring` group for access