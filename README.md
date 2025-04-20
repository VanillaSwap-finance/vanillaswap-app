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

## 📚 ドキュメント

詳細なドキュメントは以下のリンクから参照できます：

- [コア機能](docs/features/core-features.md)
- [エラーハンドリング](docs/development/error-handling.md)
- [開発ガイドライン](docs/development/guidelines.md)
- [テスト](docs/development/testing.md)
- [環境変数](docs/development/environment.md)
- [依存関係](docs/development/dependencies.md)
- [重要なリンク](docs/resources/links.md)
- [貢献](docs/contributing.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
