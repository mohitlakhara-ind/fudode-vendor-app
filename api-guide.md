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
- **Headers**: `Authorization: Bearer <User Token>` (Requires standard User Token)
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

### 2.2 Get Owner Profile
`GET /restaurant/profile/get`
- **Headers**: `Authorization: Bearer <User Token>`
- **Response (200 OK)**:
  ```json
  {
    "status": true,
    "data": { "id": "...", "name": "...", "email": "...", ... }
  }
  ```

---

## 3. Restaurant Onboarding Flow (`/restaurant/onboard`)

### Step 1: Basic Identity
`POST /restaurant/onboard/step-1` | `PUT /restaurant/onboard/update-step-1`
- **Token**: User Token (for POST), Restaurant Scoped Token (for PUT)
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
- **Fetch Detail**: `GET /restaurant/onboard/get-step-1`
- **Note**: After the initial POST, you **must** call `/auth/update` to get a Scoped Token for subsequent steps.

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
- **Fetch Detail**: `GET /restaurant/onboard/get-step-2`

### Step 3: Contract Acceptance
`POST /restaurant/onboard/step-3`
- **Token**: Restaurant Scoped Token
- **Pre-requisite**: Fetch contract via `GET /restaurant/onboard/get-partener-contract`.
- **Fetch Detail**: `GET /restaurant/onboard/get-step-3`
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

*All Menu Item APIs require a **Restaurant Scoped Token**.*

#### 4.2.1 Create Menu Item (`POST /items`)

Registers a new menu item with associated variants, tags, and addon groups.

- **Endpoint**: `POST /restaurant/menu/items`
- **Method**: `POST`
- **Authentication**: `Authorization: Bearer <Restaurant Scoped Token>`
- **Request Body Fields**:

| Field | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `categoryId` | `UUID` | **Yes** | Valid UUID of an active category owned by the restaurant. |
| `name` | `String` | **Yes** | 2-120 characters. Trimmed and sanitized. |
| `description` | `String` | **Yes** | 5-500 characters. Sanitized. |
| `foodType` | `Enum` | **Yes** | One of: `VEG`, `NON_VEG`, `EGG`. |
| `prepTime` | `Int` | **Yes** | 0 to 300 minutes. |
| `imageUrl` | `String` | No | Valid image URL (must be a valid URL format). |
| `tags` | `Array` | No | Enums: `BESTSELLER`, `SPICY`, `NEW`, `CHEF_SPECIAL`. |
| `variants` | `Array` | **Yes** | Array of variant objects (1-20). |
| `addonGroupIds` | `Array` | No | Array of valid Addon Group UUIDs. |
| `nutrients` | `Object` | No | Nutritional data (see structure below). |

---

**Nested Object: Variants**
Each item must have at least one variant (e.g., "Regular").
- `name`: String (1-50, unique within item).
- `price`: Number (>0).
- `isDefault`: Boolean (Exactly **one** variant must be `true`).

---

**Nested Object: Nutrients (JSON)**
Optional but requires specific units if provided.
- `serving`: `{ "value": 100, "unit": "g" | "ml" }`
- `calories`: `{ "value": 500, "unit": "kcal" }`
- `protein` / `carbs` / `fat` / `fibre`: `{ "value": 10, "unit": "g" | "mg" }`

---

**Example Request Payload**:
```json
{
  "categoryId": "2919d854-c92c-4613-88e9-d456789abcde",
  "name": "Classic Margherita Pizza",
  "description": "Authentic sourdough crust, San Marzano tomato sauce, fresh mozzarella.",
  "foodType": "VEG",
  "prepTime": 15,
  "imageUrl": "https://cdn.fudode.com/images/pizza.jpg",
  "tags": ["BESTSELLER", "NEW"],
  "variants": [
    { "name": "Regular", "price": 299, "isDefault": true },
    { "name": "Large", "price": 499, "isDefault": false }
  ],
  "addonGroupIds": ["fd987654-0000-1111-2222-333344445555"],
  "nutrients": {
    "serving": { "value": 250, "unit": "g" },
    "calories": { "value": 650, "unit": "kcal" }
  }
}
```

---

#### 4.2.2 Deleting Menu Item (`DELETE /items/:id`)

Removes a menu item permanently from the catalog.

> [!CAUTION]
> This is a **Hard Delete**. Once performed, the item, its variants, and its verification history are permanently removed. This action **cannot be undone**.

- **Endpoint**: `DELETE /restaurant/menu/items/:id`
- **Method**: `DELETE`
- **Authentication**: `Authorization: Bearer <Restaurant Scoped Token>`
- **Response (200 OK)**:
  ```json
  {
    "message": "Menu item deleted successfully",
    "data": { ... }
  }
  ```

---

#### 4.2.3 Updating Item Status (`PATCH /items/status`)

Used for quick availability changes (e.g., marking an item as Sold Out during a rush).

- **Endpoint**: `PATCH /restaurant/menu/items/status`
- **Method**: `PATCH`
- **Authentication**: `Authorization: Bearer <Restaurant Scoped Token>`
- **Body**:
  ```json
  {
    "id": "ITEM_UUID",
    "status": "AVAILABLE" | "SOLD_OUT" | "HIDDEN"
  }
  ```
- **Note**: This update is **immediate** and does not require admin verification.

---

#### 4.2.4 Comprehensive Item Update (`PATCH /items/:id`)

Updates item details, variants, and addon groups.

- **Endpoint**: `PATCH /restaurant/menu/items/:id`
- **Method**: `PATCH`
- **Authentication**: `Authorization: Bearer <Restaurant Scoped Token>`
- **Body**: Same as **Create Item** (see 4.2.1), with the following specific constraints:

> [!IMPORTANT]
> **Verification Workflow**: Any update using this endpoint sets the item's `verificationStatus` to **`PENDING`**. The changes will **not reflect** on the customer-facing menu until an admin approves the update. During this time, the previous approved version of the item remains visible.

> [!WARNING]
> **Immutable Fields**: The `categoryId` and `name` are immutable for existing items. To change these, you must delete the item and create a new one.

- **Replacement Logic**: The `variants` and `addonGroupIds` arrays are **fully replaced**. You must send the entire desired state for these fields; any variant or addon group omitted from the payload will be removed from the item.
- **Example**: Sending only one variant in an update will delete all other existing variants for that item.

---

#### 4.2.5 Querying & Reordering Items
- **List All**: `GET /restaurant/menu/items?categoryId=...&page=1&limit=20`
- **Get Detail**: `GET /restaurant/menu/items/:id` (Includes categories, variants, and addon groups)
- **Reorder Items**: `PATCH /restaurant/menu/items/reorder`
  - Body: `{ "categoryId": "...", "items": ["id1", "id2", ...] }`
- **Reorder Variants**: `PATCH /restaurant/menu/variants/reorder`
  - Body: `{ "itemId": "...", "variants": ["id1", "id2", ...] }`


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
- **Get Detail**: `GET /addon-groups/:id` (Returns group details with all options)
- **Update**: `PATCH /addon-groups/:id`
- **Delete**: `DELETE /addon-groups/:id` (Blocked if linked to items)

### 4.4 Addon Options
- **Create**: `POST /addon-groups/:groupId/options`
  ```json
  {
    "name": "Extra Cheese",
    "price": 50,
    "minQuantity": 0,
    "maxQuantity": 1
  }
  ```
- **List Options**: `GET /addon-groups/:groupId/options`
- **Update Option**: `PATCH /addon-groups/:optionId/options`
  ```json
  {
    "name": "Extra Cheese",
    "price": 60,
    "status": "AVAILABLE" | "SOLD_OUT",
    "minQuantity": 0,
    "maxQuantity": 1
  }
  ```
- **Delete Option**: `DELETE /addon-groups/:optionId/options` (Soft delete)
- **Reorder Options**: `PATCH /addon-groups/reorder/options`
  ```json
  {
    "groupId": "...",
    "orderedOptionIds": ["id1", "id2", ...]
  }
  ```

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
