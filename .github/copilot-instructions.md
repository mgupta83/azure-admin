# Azure Administration Tool

Azure Admin is a TypeScript-based tool for managing Azure resources through both the Azure SDK and Azure CLI. The repository is structured as an ES module Node.js application with TypeScript support.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup
- Ensure Node.js v20+ and npm are available (verified: Node.js v20.19.5, npm 10.8.2)
- Azure CLI is pre-installed (verified: Azure CLI 2.77.0 with azure-devops extension)
- Initialize the project as an ES module Node.js application:
  - `npm init -y`
  - Add `"type": "module"` to package.json
  - Update main entry point to `"main": "dist/index.js"`

### Dependencies Installation
- Install Azure SDK packages: `npm install @azure/identity @azure/arm-resourcegraph @azure/arm-resources`
- Install development dependencies: `npm install --save-dev typescript eslint jest ts-jest @types/jest`
- **Installation time: Takes 30-60 seconds. NEVER CANCEL.**

### TypeScript Configuration
- Initialize TypeScript: `npx tsc --init`
- Update tsconfig.json to configure:
  - `"rootDir": "./src"`
  - `"outDir": "./dist"`
  - Add `"exclude": ["tests/**/*", "dist/**/*"]`
- TypeScript compilation: `npm run build` or `npx tsc`
- **Build time: Takes 1-2 seconds. Very fast, no timeout concerns.**

### ESLint Setup
- Initialize ESLint: `npx eslint --init`
- Choose: JavaScript modules (ESM), No framework, TypeScript: Yes, Node environment
- Linting: `npm run lint` or `npx eslint src/**/*.ts`
- **Lint time: Takes 1-2 seconds. Very fast, no timeout concerns.**

### Package.json Scripts
Update package.json scripts section:
```json
"scripts": {
  "build": "tsc",
  "test": "npm run build && node -e \"import('./dist/index.js').then(m => console.log('✓ Module loads successfully'))\"",
  "lint": "eslint src/**/*.ts",
  "dev": "tsc --watch"
}
```

### Development Workflow
- Create source files in `src/` directory
- Main entry point: `src/index.ts`
- Build the project: `npm run build`
- Run the compiled code: `node dist/index.js`
- Watch mode for development: `npm run dev`

## Validation

### Manual Testing Scenarios
Always validate your changes by:
1. **Build verification**: Run `npm run build` and ensure no TypeScript errors
2. **Module loading test**: Run `npm test` to verify the module loads correctly
3. **Azure SDK integration**: Test that Azure SDK components can be imported and instantiated
4. **Linting compliance**: Run `npm run lint` to ensure code style compliance

### Azure CLI Testing
- Test Azure CLI availability: `az --version`
- **Note**: Azure CLI authentication (`az login`) is required for actual Azure operations
- Common Azure CLI commands to validate:
  - `az account show` (requires authentication)
  - `az account list-locations --output table` (requires authentication)
  - `az --help` (works without authentication)

### Example Code Structure
Create a basic Azure admin tool structure:
```typescript
// src/index.ts
import { DefaultAzureCredential } from '@azure/identity';

export class AzureAdmin {
    private credential: DefaultAzureCredential;

    constructor() {
        this.credential = new DefaultAzureCredential();
    }

    public getCredential(): DefaultAzureCredential {
        return this.credential;
    }
}

export default AzureAdmin;
```

### Testing Commands to Run Before Committing
Always run these commands to ensure changes are valid:
1. `npm run lint` - Ensure code style compliance
2. `npm run build` - Verify TypeScript compilation succeeds  
3. `npm test` - Verify module loading works correctly
4. Manual verification: `node -e "import('./dist/index.js').then(m => console.log('✓ Success'))"`

## Common Tasks

### Repository Structure
```
azure-admin/
├── .github/
│   └── copilot-instructions.md
├── .gitignore           # Node.js gitignore template
├── README.md           # Basic project description
├── package.json        # Node.js project configuration
├── tsconfig.json       # TypeScript configuration
├── eslint.config.js    # ESLint configuration
├── src/               # Source TypeScript files
│   └── index.ts       # Main entry point
└── dist/              # Compiled JavaScript output
    └── index.js       # Compiled main entry point
```

### Key Information for Development
- **Project Type**: ES Module Node.js application with TypeScript
- **Target Runtime**: Node.js v20+
- **Module System**: ES modules (`import`/`export`)
- **Build Tool**: TypeScript compiler (`tsc`)
- **Linter**: ESLint with TypeScript support
- **Azure Integration**: Azure SDK v4+ and Azure CLI 2.77+

### Environment Variables and Authentication
- Azure authentication uses `DefaultAzureCredential` from `@azure/identity`
- For local development, use `az login` to authenticate with Azure CLI
- For CI/CD, set appropriate Azure service principal environment variables:
  - `AZURE_CLIENT_ID`
  - `AZURE_CLIENT_SECRET`
  - `AZURE_TENANT_ID`

### Troubleshooting Common Issues
- **"Cannot use import statement"**: Ensure `"type": "module"` is in package.json
- **TypeScript compilation errors**: Check that `rootDir` and `outDir` are correctly configured
- **Azure authentication failures**: Run `az login` for local development
- **Module not found errors**: Ensure relative imports end with `.js` extension for compiled output

### Performance Notes
- **Build**: Very fast (~1-2 seconds), no special timeout needed
- **Lint**: Very fast (~1-2 seconds), no special timeout needed  
- **npm install**: Takes 30-60 seconds for full dependency installation
- **Jest testing**: May require additional configuration for ES modules

This is a minimal repository that serves as a foundation for Azure administration tools. The structure supports both Azure SDK-based programmatic access and Azure CLI command execution for comprehensive Azure resource management.