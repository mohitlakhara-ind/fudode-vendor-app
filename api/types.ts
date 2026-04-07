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

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  sortOrder: number;
  status: CategoryStatus;
  items?: MenuItem[];
  subCategories?: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  parentCategoryId?: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  sortOrder?: number;
  status?: CategoryStatus;
}

export interface CategoryDeleteRequest {
  moveItemsTo?: string;
  deleteItems?: boolean;
}

export enum MenuItemStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  HIDDEN = 'HIDDEN',
}

export interface NutrientValue {
  value: number;
  unit: string;
}

export interface Nutrients {
  serving?: NutrientValue;
  calories?: NutrientValue;
  protein?: NutrientValue;
  carbs?: NutrientValue;
  fat?: NutrientValue;
  fibre?: NutrientValue;
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
  nutrients?: Nutrients;
  status: MenuItemStatus;
  sortOrder: number;
  isLive: boolean;
}

export enum VariantStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
}

export interface MenuVariant {
  id?: string;
  name: string;
  price: number;
  isDefault: boolean;
  status?: VariantStatus;
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
  nutrients?: Nutrients;
}

export interface ItemUpdateRequest extends Partial<Omit<ItemCreateRequest, 'categoryId' | 'name'>> {}

export interface ItemStatusUpdate {
  id: string;
  status: MenuItemStatus;
}

export interface ItemReorderRequest {
  categoryId: string;
  items: string[];
}

export interface VariantReorderRequest {
  itemId: string;
  variants: string[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  status: 'AVAILABLE' | 'SOLD_OUT';
}

export interface AddonGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  addons: Addon[];
}

export interface AddonGroupCreateRequest {
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  addons: Omit<Addon, 'id'>[];
}

export interface AddonOptionCreateRequest {
  name: string;
  price: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface AddonOptionUpdateRequest extends Partial<AddonOptionCreateRequest> {
  status?: 'AVAILABLE' | 'SOLD_OUT';
}

export interface AddonOptionReorderRequest {
  groupId: string;
  orderedOptionIds: string[];
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
