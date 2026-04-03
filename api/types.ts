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
  floor: string;
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

export interface RestaurantStatus extends Partial<OnboardingStep1>, Partial<OnboardingStep2> {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  onboardingStep: number;
  onboardingStatus: OnboardingStatus;
    profileData?: {
      isOwnerProfileComplete: boolean;
      name?: string;
      email?: string;
      avatarUrl?: string;
      phone?: string;
      aadhaarNo?: string;
      aadhaarFrontUrl?: string;
      aadhaarBackUrl?: string;
      verificationStatus?: OwnerProfileStatus;
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

export interface CategoryCreateRequest {
  name: string;
  parentCategoryId?: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  sortOrder?: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  foodType: 'VEG' | 'NON_VEG' | 'EGG';
  prepTime?: number;
  imageUrl?: string;
  variants: MenuVariant[];
  tags?: string[];
  addonGroupIds?: string[];
  status: 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
  order?: number;
}

export interface MenuVariant {
  name: string;
  price: number;
  isDefault: boolean;
}

export interface ItemCreateRequest {
  categoryId: string;
  name: string;
  description: string;
  foodType: 'VEG' | 'NON_VEG' | 'EGG';
  prepTime: number;
  imageUrl?: string;
  variants: MenuVariant[];
  tags: string[];
  addonGroupIds: string[];
}

export interface ItemUpdateRequest extends Partial<Omit<ItemCreateRequest, 'categoryId' | 'name'>> {}

export interface ItemStatusUpdate {
  id: string;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
}

export interface AddonGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  addons?: any[]; // Detailed addon info if needed later
}

export interface AddonGroupCreateRequest {
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
}

export interface KycOverallStatus {
  status: boolean;
  message?: string;
  verificationStatus: string;
  details?: any;
}

export interface UserRestaurant {
  role: string;
  scopeId: string;
  status: string;
  restaurant: {
    id: string;
    name: string;
    address?: string;
  };
}
