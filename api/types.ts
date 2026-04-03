export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

export interface ProfileResponse {
  status: boolean;
  phone: string;
  profileData: OwnerProfile;
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
  kycStatus?: KycStatus;
  message?: string;
}

export interface OwnerProfileDetails {
  name: string;
  email: string;
  alternateNo: string;
  aadhaarNo: string;
}

export interface OnboardingStep1 {
  name: string;
  alternateNo: string;
  lat: number;
  long: number;
  area: string;
  city: string;
  shopno: string;
  tower: string; // Mapped to 'floor' in UI
  landMark: string;
}

export interface OnboardingStep2 {
  legalName: string;
  fssai: string;
  PanNo: string;
  Gstin: string;
  paymentMethod: 'BANK_TRANSFER' | 'UPI';
  holderName?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  upiId?: string;
}

export interface OnboardingStep3 {
  contractAccepted: boolean;
  contractId: string;
  contractVersion: number;
}

export enum OnboardingStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface RestaurantStatus {
  id?: string;
  name?: string;
  address?: string;
  onboardingStep: number;
  onboardingStatus: OnboardingStatus;
  profileData?: {
    isOwnerProfileComplete: boolean;
  };
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
  VERIFIED = 'VERIFIED',
}

export interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  verificationStatus: OwnerProfileStatus;
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  order?: number;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  foodType: 'VEG' | 'NON_VEG' | 'EGG';
  variants: MenuVariant[];
  status: 'AVAILABLE' | 'SOLD_OUT';
  order?: number;
}

export interface MenuVariant {
  name: string;
  price: number;
  isDefault: boolean;
}
