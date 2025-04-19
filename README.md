# 🌟 VanillaSwap App

## 📋 Project Overview

VanillaSwap is a decentralized exchange application built on the XRPL (XRP Ledger), focusing on providing a simple and efficient trading experience.

### 🛠 Tech Stack
- **Framework**: Next.js 15.3.1 with App Router
- **Language**: TypeScript
- **UI**: Material-UI (MUI) v7
- **Wallet Integration**: GemWallet API
- **XRPL Integration**: XRPL.js
- **State Management**: React Context
- **Notifications**: Notistack

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Yarn v4.9.1
- GemWallet browser extension

### Installation

```bash
# Install dependencies
yarn install

# Start development server with Turbopack
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 🏗 Project Structure

```
src/
├── app/ # Next.js App Router pages and layouts
├── components/ # Reusable UI components
├── constants/ # Global constants and configuration
├── contexts/ # React Context providers
├── hooks/ # Custom React hooks
├── libs/ # External library integrations
├── providers/ # Global providers (MUI, GemWallet, etc.)
├── types/ # TypeScript type definitions
└── utils/ # Utility functions
```

## 🔧 Core Features

### Wallet Integration (GemWallet)
- Wallet connection and state management
- Address and network information retrieval
- Transaction signing and submission
- NFT management capabilities

Example:
```typescript
import { getAddress, getNetwork } from "@gemwallet/api";

// Get user's wallet address
const addressResponse = await getAddress();
const address = addressResponse.result?.address;

// Get current network info
const networkResponse = await getNetwork();
const network = networkResponse.result?.network;
```

### XRPL Integration
- Direct interaction with XRP Ledger
- Transaction submission and monitoring
- Account information retrieval
- Payment channel operations

Example:
```typescript
import { Client } from "xrpl";

const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

// Get account info
const response = await client.request({
  command: "account_info",
  account: address,
  ledger_index: "validated",
});
```

### Trading Interface
- Token pair selection
- Price and amount input
- Slippage tolerance settings
- Transaction confirmation

### Transaction Management
- Transaction status tracking
- Historical transaction view
- Error handling and notifications

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## 📚 Development Guidelines

### Code Style
- Using Biome for formatting and linting
- Run `yarn format` to format code
- Run `yarn lint` to check for issues

### Component Structure
- Functional components with TypeScript
- Custom hooks for logic separation
- Props interface definitions
- JSDoc comments for complex logic

### State Management
- React Context for global state
- Local state for component-specific data
- Custom hooks for shared logic

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_XRPL_NETWORK=testnet
NEXT_PUBLIC_GEMWALLET_API_KEY=your_api_key
NEXT_PUBLIC_XRPL_NODE_URL=wss://s.altnet.rippletest.net:51233
```

## 📦 Dependencies

### Core
- `@gemwallet/api`: ^3.8.0
- `xrpl`: ^4.2.0
- `next`: 15.3.1
- `react`: ^19.0.0
- `@mui/material`: ^7.0.2

### Development
- `@biomejs/biome`: 1.9.4
- `typescript`: ^5

## 🔗 Important Links

### XRPL Resources
- [XRPL.js Documentation](https://js.xrpl.org/)
- [XRPL Developer Portal](https://xrpl.org)
- [XRPL Code Samples](https://github.com/XRPLF/xrpl.js/tree/main/packages/xrpl/test/integration)

### GemWallet Resources
- [GemWallet API Reference](https://gemwallet.app/docs/api/gemwallet-api-reference)
- [GemWallet Documentation](https://gemwallet.app/docs)
- [GemWallet Discord](https://discord.gg/gemwallet)

## 🚨 Error Handling

The application uses `notistack` for error notifications, configured in the `PageLayout` component. All error handling should follow this pattern:

### Global Configuration

```typescript
// src/components/features/layout/PageLayout/index.tsx
<SnackbarProvider
  maxSnack={3}
  autoHideDuration={3000}
  action={(snackbarId) => (
    <button onClick={() => closeSnackbar(snackbarId)}>
      Close
    </button>
  )}
>
  {children}
</SnackbarProvider>
```

### Error Handling Pattern

1. **In Hooks/Services**: Throw errors with descriptive messages
```typescript
// Example from useWallet hook
try {
  // ... wallet connection logic
} catch (error: any) {
  console.error('[useWallet] Error connecting to wallet: ', error)
  throw error
}
```

2. **In Components**: Catch and display errors using notistack
```typescript
// Example from WalletConnectDialog
try {
  await connect(wallet.label as WalletType)
} catch (error: any) {
  enqueueSnackbar(error.message, {
    variant: 'error',
  })
} finally {
  onClose()
}
```

### Error Variants

Use appropriate variants for different types of notifications:
- `error`: For error messages
- `warning`: For warning messages
- `info`: For information messages
- `success`: For success messages

Example:
```typescript
import { enqueueSnackbar } from 'notistack'

// Error notification
enqueueSnackbar('Failed to connect wallet', { variant: 'error' })

// Success notification
enqueueSnackbar('Successfully connected to wallet', { variant: 'success' })

// Warning notification
enqueueSnackbar('Network connection is unstable', { variant: 'warning' })

// Info notification
enqueueSnackbar('Please confirm the transaction in your wallet', { variant: 'info' })
```

### Common Error Scenarios

1. **Wallet Connection Errors**
```typescript
// Wallet not installed
throw new Error('GemWallet is not installed')

// User rejected request
throw new Error('User rejected the request')

// Network error
throw new Error('Failed to connect to network')
```

2. **Transaction Errors**
```typescript
// Insufficient balance
throw new Error('Insufficient balance for transaction')

// Transaction failed
throw new Error('Transaction failed to execute')

// Network congestion
throw new Error('Network is congested, please try again')
```

3. **API Errors**
```typescript
// XRPL node connection error
throw new Error('Failed to connect to XRPL node')

// Invalid response
throw new Error('Invalid response from server')
```

### Best Practices

1. **Error Logging**
   - Always log errors in the console before throwing
   - Include context in the log message
   - Use consistent error prefixes for easy filtering

2. **Error Messages**
   - Keep messages user-friendly
   - Include actionable information when possible
   - Maintain consistency in error message format

3. **Error Recovery**
   - Clean up resources in finally blocks
   - Provide retry mechanisms for transient errors
   - Reset state to a known good state after errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
