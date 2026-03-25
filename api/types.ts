export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export enum KycStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  kycStatus: KycStatus;
  message?: string;
}

export interface KycDetails {
  name: string;
  legalName: string;
  description?: string;
  fssai: string;
  docType: 'PAN_CARD' | 'GST';
  docNumber: string;
  addressDocType: 'SHOP_ACT' | 'MSME_REGISTRATION';
  addressDocNumber: string;
  paymentMethod: 'BANK_TRANSFER' | 'UPI';
  // If BANK_TRANSFER:
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  // If UPI:
  upiId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
}

export interface MyRestaurant {
  role: string;
  scopeId: string;
  status: string;
  restaurant: Restaurant;
}

export enum OwnerProfileStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface OwnerProfile {
  name: string;
  email: string;
  alternateNo: string;
  aadhaarNo: string;
  avatar?: string;
  aadhaarFront?: string;
  aadhaarBack?: string;
  status: OwnerProfileStatus;
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  foodType: 'VEG' | 'NON_VEG' | 'EGG';
  prepTime: number;
  imageUrl: string;
  variants: MenuVariant[];
  tags: string[];
  addonGroupIds: string[];
  status: 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
}

export interface MenuVariant {
  name: string;
  price: number;
  isDefault: boolean;
}
