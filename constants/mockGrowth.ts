import { ChartDataPoint } from './mockDashboard';

export interface GrowthGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GrowthOffer {
  id: string;
  title: string;
  badge: string;
  status: 'Active' | 'Scheduled' | 'Inactive';
  startDate: string;
  grossSales: number;
  ordersDelivered: number;
  discountGiven: number;
  effectiveDiscount: number;
  details: string[];
}

export interface GrowthPerformance {
  period: string;
  grossSales: { value: number; change: number; chart: ChartDataPoint[] };
  orders: { value: number; change: number; chart: ChartDataPoint[] };
  discount: { value: number; change: number; chart: ChartDataPoint[] };
  effectiveDiscount: { value: number; change: number; chart: ChartDataPoint[] };
  menuToOrder: { value: number; change: number; chart: ChartDataPoint[] };
}

export const MOCK_GROWTH_GOALS: GrowthGoal[] = [
  {
    id: 'customer_base',
    title: 'Grow your customer base',
    description: 'Offers to increase your customers and orders',
    icon: 'UsersThree',
  },
  {
    id: 'order_value',
    title: 'Increase your order value',
    description: 'Offers to encourage high-value orders and attract party orders',
    icon: 'BagSimple',
  },
  {
    id: 'mealtime',
    title: 'Get more mealtime orders',
    description: 'Offers to boost orders during a specific mealtime',
    icon: 'Clock',
  },
  {
    id: 'delight',
    title: 'Delight your customers',
    description: 'Offers such as freebies, BOGO, and more to boost menu to cart conversions',
    icon: 'Tag',
  },
];

export const MOCK_GROWTH_OFFERS: GrowthOffer[] = [
  {
    id: 'o1',
    title: '10% off upto ₹40',
    badge: 'Select users only',
    status: 'Active',
    startDate: '27 Jul 2025',
    grossSales: 0,
    ordersDelivered: 0,
    discountGiven: 0,
    effectiveDiscount: 0,
    details: [
      'Offer applicable for: Select users users on all menu items, valid for all distances, excluding MRP items',
      'Minimum order value: ₹199',
      'Valid at: Muggs Cafe, Balotra Locality',
      'Offer sharing: 100% of the discount value is being funded by you',
      'Created: Offline',
    ],
  },
];

export const MOCK_GROWTH_PERFORMANCE: GrowthPerformance = {
  period: 'Weekly (16 - 17 Mar)',
  grossSales: { 
    value: 0, 
    change: 0, 
    chart: [
      { label: 'W1', value: 0 },
      { label: 'W2', value: 0 },
      { label: 'W3', value: 0 },
      { label: 'W4', value: 0 },
      { label: 'W5', value: 0 },
    ] 
  },
  orders: { 
    value: 0, 
    change: 0, 
    chart: [
      { label: 'W1', value: 0 },
      { label: 'W2', value: 0 },
      { label: 'W3', value: 0 },
      { label: 'W4', value: 0 },
      { label: 'W5', value: 0 },
    ] 
  },
  discount: { 
    value: 0, 
    change: 0, 
    chart: [
      { label: 'W1', value: 0 },
      { label: 'W2', value: 0 },
      { label: 'W3', value: 0 },
      { label: 'W4', value: 0 },
      { label: 'W5', value: 0 },
    ] 
  },
  effectiveDiscount: { 
    value: 0, 
    change: 0, 
    chart: [
      { label: 'W1', value: 0 },
      { label: 'W2', value: 0 },
      { label: 'W3', value: 0 },
      { label: 'W4', value: 0 },
      { label: 'W5', value: 0 },
    ] 
  },
  menuToOrder: { 
    value: 0, 
    change: 0, 
    chart: [
      { label: 'W1', value: 0 },
      { label: 'W2', value: 0 },
      { label: 'W3', value: 0 },
      { label: 'W4', value: 0 },
      { label: 'W5', value: 0 },
    ] 
  },
};
