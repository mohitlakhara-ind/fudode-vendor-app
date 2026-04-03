# Fudode Restaurant API - Comprehensive Reference Guide

This document is the **canonical source of truth** for all Restaurant-side APIs on the Fudode platform, covering Authentication, Owner Profiles, Restaurant Onboarding, and Menu Management.

---

## 1. Authentication & Session Management (`/restaurant/auth`)

The platform uses a tiered authentication model. Initial login provides a **User Token**, which is then upgraded to a **Restaurant Scoped Token** after a restaurant is created or selected.

### 1.1 Request OTP
`POST /restaurant/auth/request`
- **Description**: Registers a new user or logs in an existing one by sending a 6-digit OTP.
- **Headers**: None
- **Body**:
  ```json
  { "number": "9876543210" }
  ```
- **Response (200 OK)**:
  ```json
  { "status": true, "message": "OTP sent successfully", "userId": "..." }
  ```

### 1.2 Verify OTP
`POST /restaurant/auth/verify`
- **Description**: Verifies the OTP and returns the initial **User Token**.
- **Body**:
  ```json
  {
    "number": "9876543210",
    "otp": "123456",
    "deviceId": "uuid-123",
    "deviceType": "ANDROID" | "IOS" | "WEB"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "accessToken": "eyJ...", // User Token (Short-lived)
    "refreshToken": "..."    // Long-lived
  }
  ```

### 1.3 Update to Scoped Token
`POST /restaurant/auth/update`
- **Description**: Upgrades a User Token to a **Restaurant Scoped Token**. This is **mandatory** for all Menu and Onboarding Step 2/3 APIs.
- **Headers**: `Authorization: Bearer <User Token>`
- **Body**:
  ```json
  {
    "refreshToken": "...",
    "deviceId": "...",
    "restaurantId": "RES_XYZ"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "accessToken": "eyJ...", // Restaurant Scoped Token
    "refreshToken": "..."
  }
  ```

### 1.4 Refresh Token
`POST /restaurant/auth/refresh`
- **Description**: Rotates both Access and Refresh tokens using a valid Refresh Token.
- **Body**:
  ```json
  { "refreshToken": "...", "deviceId": "..." }
  ```

### 1.5 Logout
`POST /restaurant/auth/logout`
- **Headers**: `Authorization: Bearer <Any Token>`
- **Body**:
  ```json
  { "deviceId": "..." }
  ```

---

## 2. Owner Profile Setup (`/restaurant/profile`)

*Requires standard User Token.*

### 2.1 Set/Update Owner Profile
`POST /restaurant/profile/set` | `PUT /restaurant/profile/update`
- **Format**: `multipart/form-data`
- **Fields**:
  - `name`: string (Required)
  - `email`: string (Required)
  - `aadhaarNo`: string (12 digits, Required)
- **Files** (All Mandatory):
  - `avatar`: Profile image
  - `aadhaarFront`: Document Image
  - `aadhaarBack`: Document Image
- **Response**: `{ "status": true, "profileData": { ... } }`

---

## 3. Restaurant Onboarding Flow (`/restaurant/onboard`)

### Step 1: Basic Identity
`POST /restaurant/onboard/step-1`
- **Token**: User Token
- **Body**:
  ```json
  {
    "name": "Pizza Palace",
    "alternateNo": "9876543210",
    "lat": 12.9716,
    "long": 77.5946,
    "city": "Bengaluru",
    "area": "Indiranagar",
    "shopno": "123",
    "floor": "Ground",
    "landMark": "Near Metro"
  }
  ```
- **Note**: After this step, you **must** call `/auth/update` to get a Scoped Token for the next steps.

### Step 2: KYC & Payout
`POST /restaurant/onboard/step-2`
- **Token**: Restaurant Scoped Token
- **Body**:
  ```json
  {
    "legalName": "Business Name",
    "fssai": "14-digit number",
    "PanNo": "ABCDE1234F",
    "Gstin": "29ABCDE1234F1Z5", // Optional
    "paymentMethod": "BANK_TRANSFER" | "UPI",
    "holderName": "...", // Required if BANK_TRANSFER
    "bankName": "...",   // Required if BANK_TRANSFER
    "accountNo": "...",  // Required if BANK_TRANSFER
    "ifscCode": "...",   // Required if BANK_TRANSFER
    "upiId": "..."       // Required if UPI
  }
  ```

### Step 3: Contract Acceptance
`POST /restaurant/onboard/step-3`
- **Token**: Restaurant Scoped Token
- **Pre-requisite**: Fetch contract via `GET /restaurant/onboard/get-partener-contract`.
- **Body**:
  ```json
  {
    "contractId": "...",
    "contractVersion": "...",
    "contractAccepted": true
  }
  ```

---

## 4. Menu Management (`/restaurant/menu`)

*All Menu APIs require a **Restaurant Scoped Token**.*

### 4.1 Categories
- **Create**: `POST /categories` | Body: `{ "name": "Desserts", "parentCategoryId?": "..." }`
- **List All**: `GET /categories`
- **Update**: `PATCH /categories/:categoryId` | Body: `{ "name": "...", "sortOrder": 10 }`
- **Delete**: `DELETE /categories/:categoryId` (Deletes all nested items)
- **Reorder**: `PATCH /categories/reorder` | Body: `{ "categories": ["id1", "id2"], "parentCategoryId?": null }`

### 4.2 Menu Items
- **Create**: `POST /items`
  ```json
  {
    "categoryId": "...",
    "name": "Margherita Pizza",
    "description": "Cheese & Tomato",
    "foodType": "VEG" | "NON_VEG" | "EGG",
    "prepTime": 15,
    "imageUrl": "...",
    "variants": [
      { "name": "Regular", "price": 299, "isDefault": true },
      { "name": "Large", "price": 499, "isDefault": false }
    ],
    "tags": ["BESTSELLER", "NEW"],
    "addonGroupIds": ["addon_id_1"]
  }
  ```
- **List All**: `GET /items?categoryId=...&page=1&limit=20`
- **Get Detail**: `GET /items/:id`
- **Update Status**: `PATCH /items/status` | Body: `{ "id": "...", "status": "AVAILABLE" | "SOLD_OUT" | "HIDDEN" }`
- **Update Item**: `PATCH /items/:id` (Same body as create, except `categoryId` and `name` are immutable).

### 4.3 Addon Groups
- **Create**: `POST /addon-groups`
  ```json
  {
    "name": "Extra Toppings",
    "minSelect": 0,
    "maxSelect": 5,
    "isRequired": false
  }
  ```
- **List All**: `GET /addon-groups`
- **Update**: `PATCH /addon-groups/:id`
- **Delete**: `DELETE /addon-groups/:id` (Blocked if linked to items)

---

## 5. Maintenance & Utility

### Get My Restaurants
`GET /restaurant/get/my`
- **Token**: User Token
- **Returns**: List of all restaurants associated with the user.

### Check Onboarding Status
`GET /restaurant/onboard/get`
- **Token**: Restaurant Scoped Token
- **Returns**: `onboardingStep` (1, 2, or 3) and `onboardingStatus`.

### KYC Overall Status
`GET /restaurant/onboard/get-kycStatus`
- **Returns**: Detailed verification status for the restaurant.

---

## 6. Validation Constraints

- **Phone**: 10 digits, starts with 6-9.
- **PAN**: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`
- **GSTIN**: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$`
- **FSSAI**: 14 digits.
- **IFSC**: `^[A-Z]{4}0[A-Z0-9]{6}$`
- **Image Formats**: `.jpg`, `.jpeg`, `.png`, `.webp` only.
d)
