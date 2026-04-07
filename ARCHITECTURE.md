# Architecture Guide - Fudode Vendor App

This document outlines the technical architecture, development patterns, and core systems of the Fudode Vendor Application.

## 1. Project Organization

The application follows a modular, feature-oriented structure designed for scalability and maintainability.

- **`app/`**: Root directory for [Expo Router](https://docs.expo.dev/router/introduction/). We use file-based routing for all screens.
  - `(auth)`: Onboarding, Login, and Registration flows.
  - `(tabs)`: Core dashboard sections (Dashboard, Orders, Catalog, More).
- **`components/`**: Atomic and complex UI components.
  - `ui/`: Fundamental building blocks (Buttons, Inputs, etc.) reflecting the design system.
  - `common/`: Reusable layouts and complex components.
  - `orders`, `menu`, `growth`, etc.: Components dedicated to specific feature areas.
- **`api/`**: Centralized networking logic.
  - `api.ts`: Base Axios client with request/response interceptors for silent token refresh.
  - `types.ts`: TypeScript definitions for all API request/responses.
- **`store/`**: Global state management using [Redux Toolkit](https://redux-toolkit.js.org/).
- **`constants/`**: Theme tokens, colors, typography, and mock data for development.
- **`hooks/`**: Custom React hooks for business logic and UI interactions.

## 2. Navigation System

We utilize **Expo Router v3 (v6 in router terms)**. This provides a web-like routing experience on mobile.

- **Layouts**: Defined in `_layout.tsx` at various levels to manage shared UI (like tab bars or navigation headers).
- **Dynamic Routing**: Used in `menu/[id].tsx` and similar paths for detail screens.
- **Authentication Guarding**: Managed in the root `_layout.tsx` using Redux state and router redirects.

## 3. State Management

### Global State (Redux)
We use a centralized store located in `store/store.ts`. Key slices include:

- **`auth`**: Manages user tokens, login state, and device identifiers.
- **`restaurant`**: Holds information about the vendor's outlet, status, and configuration.
- **`menu`**: Handles the product catalog, including categories, subcategories, and items.
- **`orders`**: Real-time order tracking and history.
- **`profile`**: User-specific profile details.
- **`ui`**: Ephemeral UI states like loading overlays or global modals.

### Persistance
Sensitive tokens (Access/Refresh) are stored in `Expo SecureStore`, while non-sensitive data uses `AsyncStorage`.

## 4. Networking & API

The application communicates with the backend via the Axios client in `api/api.ts`.

- **Interceptors**: 
  - *Request*: Automatically adds the Bearer token to headers.
  - *Response*: Handles 401 Unauthorized errors by attempting a silent refresh using the stored Refresh Token.
- **Multi-Module Routing**: The `API_BASE_URL` is configured to handle different backend modules (auth, restaurant, catalog).

## 5. Design System & Styling

The app uses a "Premium Borderless" aesthetic characterized by:
- **Typography**: Poppins for headers and Inter for body text.
- **Color Palette**: Gold (`#facb04`) for primary actions and Obsidian (`#131313`) for dark mode surfaces.
- **Glassmorphism**: Subtle blur effects (`expo-blur`) for overlays and headers.
- **Animations**: `react-native-reanimated` for smooth transitions and interactive micro-animations.

Tokens are defined in `constants/theme.ts` and should be used via the `Colors` and `Typography` exports.
