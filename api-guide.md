# Restaurant API - Full Implementation Guide

This guide provides the complete technical details for integrating with the Restaurant Management System APIs.

## 1. Core Information

- **Base URL**: `http://localhost:4000/restaurant`
- **Authentication**: Bearer Token in `Authorization` header.
- **Standard Response Format**:
  ```json
  {
    "status": true,
    "message": "Success message",
    "data": { ... }
  }
  ```

---

## 2. Authentication Module (`/auth`)

### Request OTP
`POST /auth/request`  
Starts the login or registration process by sending a 6-digit OTP.

- **Request Body**:
  ```json
  {
    "number": "9876543210"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": true,
    "message": "OTP sent successfully",
    "userId": "uuid"
  }
  ```

### Verify OTP
`POST /auth/verify`  
Verifies the OTP and returns session tokens.

- **Request Body**:
  ```json
  {
    "number": "9876543210",
    "otp": "123456",
    "deviceId": "uuid-or-ssaid",
    "deviceType": "WEB" | "ANDROID" | "IOS"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": true,
    "message": "OTP verified successfully",
    "userId": "uuid",
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
  ```

### Refresh Token
`POST /auth/refresh`  
Obtains a new access token using a valid refresh token.

- **Request Body**:
  ```json
  {
    "refreshToken": "...",
    "deviceId": "..."
  }
  ```

### Update Scope (Select Restaurant)
`POST /auth/update`  
Upgrades a User Token to a Restaurant Scoped Token. Required for Menu and KYC APIs.

- **Request Body**:
  ```json
  {
    "refreshToken": "...",
    "deviceId": "...",
    "restaurantId": "uuid"
  }
  ```

### Logout
`POST /auth/logout`  
- **Request Body**: `{ "deviceId": "..." }`

---

## 3. Profile & KYC Module

### Get My Restaurants
`GET /get/my`  
Lists all restaurants where the user has a role.

- **Response**:
  ```json
  {
    "status": true,
    "data": [
      {
        "role": "RESTAURANT_OWNER",
        "scopeId": "uuid",
        "status": "ACTIVE",
        "restaurant": {
          "id": "uuid",
          "name": "Pizza Palace"
        }
      }
    ]
  }
  ```

### Create/Update Owner Profile
`POST /profile/set` | `PUT /profile/update`  
**Body Type**: `multipart/form-data`

- **Fields**:
  - `name`: string (required)
  - `email`: string (required)
  - `alternateNo`: string (10 digits)
  - `aadhaarNo`: string (12 digits)
- **Files**:
  - `avatar`: Profile image
  - `aadhaarFront`: Identity doc
  - `aadhaarBack`: Identity doc

### Restaurant KYC Onboarding
`POST /kyc/onboard`  
Submits restaurant legal and payout details.

- **Request Body**:
  ```json
  {
    "name": "Restaurant Name",
    "legalName": "Legal Entity Name",
    "description": "Optional text",
    "fssai": "14-digit-number",
    "docType": "PAN_CARD" | "GST",
    "docNumber": "string",
    "addressDocType": "SHOP_ACT" | "MSME_REGISTRATION",
    "addressDocNumber": "string",
    "paymentMethod": "BANK_TRANSFER" | "UPI",
    // If BANK_TRANSFER:
    "bankName": "string",
    "accountNo": "string",
    "ifscCode": "string",
    // If UPI:
    "upiId": "name@bank"
  }
  ```

---

## 4. Menu Management Module (`/menu`)

### Categories
- **List All**: `GET /menu/categories`
- **Create**: `POST /menu/categories`
  - Body: `{ "name": "Pizza", "parentCategoryId": "uuid" (optional) }`
- **Reorder**: `PATCH /menu/categories/reorder`
  - Body: `{ "categories": ["id1", "id2", ...], "parentCategoryId": "uuid" }`

### Menu Items
- **Create Item**: `POST /menu/items`
  - **Request Body**:
    ```json
    {
      "categoryId": "uuid",
      "name": "Margherita Pizza",
      "description": "Fresh basil and mozzarella",
      "foodType": "VEG" | "NON_VEG" | "EGG",
      "prepTime": 15,
      "imageUrl": "uri",
      "variants": [
        { "name": "Regular", "price": 299, "isDefault": true },
        { "name": "Large", "price": 499, "isDefault": false }
      ],
      "tags": ["BESTSELLER", "SPICY"],
      "addonGroupIds": ["uuid1", "uuid2"]
    }
    ```

- **Update Status**: `PATCH /menu/items/status`
  - Body: `{ "id": "uuid", "status": "AVAILABLE" | "SOLD_OUT" | "HIDDEN" }`

- **Get Detailed Item**: `GET /menu/items/:id`
  - Returns full item details including variants, category info, and addon groups.

---

## 5. Error Handling Reference

All errors arrive with a non-200 status code and the following body:
```json
{
  "status": false,
  "error": "Error description here"
}
```

| Code | Meaning | Common Cause |
| :--- | :--- | :--- |
| `400` | Bad Request | Validation failed (e.g. invalid IFSC code format) |
| `401` | Unauthorized | Token missing or expired |
| `403` | Forbidden | Account suspended or missing restaurant scope |
| `409` | Conflict | Duplicate resource (e.g. name already exists) |
| `429` | Rate Limit | OTP requested too frequently |
| `500` | Server Error | Unexpected crash or database timeout |
