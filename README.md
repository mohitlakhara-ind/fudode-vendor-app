# Fudode Vendor - Premium Merchant Platform 🍱

Welcome to the **Fudode Vendor App**, a powerful, premium application designed for restaurant owners and merchants to manage their operations, orders, and growth within the Fudode ecosystem.

Built with **Expo** and **React Native**, this app provides a seamless, real-time experience across iOS and Android.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (LTS version)
- **PNPM** (recommended) or NPM
- **Expo Go** app on your mobile device (for development)

### 2. Installation
```bash
# Clone the repository
git clone [repository-url]
cd fudode-vendor-app

# Install dependencies
pnpm install
```

### 3. Running the App
```bash
# Start the Expo development server
pnpm run start

# Run specifically on Android or iOS
pnpm run android
pnpm run ios
```

---

## 📚 Documentation Center

For a deep dive into the application, please refer to the specialized documentation modules below:

### 🛠️ [Technical Architecture](./ARCHITECTURE.md)
*Frameworks, State Management (Redux), Networking (Axios/Interceptors), and Design System.*

### ✨ [Product Features](./FEATURES.md)
*Orders, Catalog (Menu), Growth (Analytics), Finance, and Settings overview.*

### 🔐 [Authentication Guide](./auth_implementation_guide.md)
*Deep dive into the secure authentication and token refresh strategy.*

### 📖 [API & Integration Guide](./api-guide.md)
*Reference for interacting with the Fudode backend services.*

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | [Expo SDK 54](https://expo.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Styling** | Native StyleSheet (Premium Design System) |
| **Networking** | Axios with Interceptors |
| **Utility** | Phosphor Icons, Reanimated, Blur |

---

## 🎨 Design Philosophy: "Premium Borderless"
The Fudode Vendor app follows a strict UX/UI standard:
- **Obsidian Dark Mode**: High-contrast, sleek surfaces (`#131313`).
- **Gold Accents**: Premium action cues (`#facb04`).
- **Interactive Micro-animations**: Using `reanimated` for physical-feeling transitions.
- **Glassmorphism**: Layered elevation with `expo-blur`.

---

## 📄 License
This project is private and proprietary. All rights reserved.
