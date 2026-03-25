export interface ChartDataPoint {
  value: number;
  label: string;
}

export interface DashboardStats {
  sales: {
    netSales: number;
    salesChange: number;
    ordersDelivered: number;
    ordersChange: number;
    avgOrderValue: number;
    avgChange: number;
    chartData: ChartDataPoint[];
    previousChartData: ChartDataPoint[];
  };
  serviceQuality: {
    rejectedOrders: number;
    rejectedChange: number;
    rejectedSales: number;
    complaints: number;
    complaintsChange: number;
    refundedPercent: number;
    poorRatedOrders: number;
    poorChange: number;
    onlineTimePercent: number;
    onlineChange: number;
    lostSales: number;
  };
  kitchenEfficiency: {
    avgPrepTime: string;
    kptDelayedOrders: number;
    kptDelayedChange: number;
    avgDelay: string;
    foodReadyAccuracy: number;
    foodReadyChange: number;
    riderHandoverTime: number;
    handoverChange: number;
    avgHandoverTime: string;
  };
  mealtimeKPT: {
    label: string,
    time: string,
    value: string,
    change: number,
    color: string
  }[];
  categorySales: ChartDataPoint[];
  ratingDistribution: ChartDataPoint[];
}

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  sales: {
    netSales: 45200,
    salesChange: 12.5,
    ordersDelivered: 156,
    ordersChange: 8.2,
    avgOrderValue: 289,
    avgChange: 4.1,
    chartData: [
      { label: '12am', value: 10 },
      { label: '4am', value: 5 },
      { label: '8am', value: 30 },
      { label: '12pm', value: 80 },
      { label: '4pm', value: 65 },
      { label: '8pm', value: 100 },
    ],
    previousChartData: [
      { label: '12am', value: 15 },
      { label: '4am', value: 8 },
      { label: '8am', value: 25 },
      { label: '12pm', value: 70 },
      { label: '4pm', value: 60 },
      { label: '8pm', value: 90 },
    ]
  },
  serviceQuality: {
    rejectedOrders: 2,
    rejectedChange: -50,
    rejectedSales: 450,
    complaints: 1,
    complaintsChange: 0,
    refundedPercent: 0,
    poorRatedOrders: 0,
    poorChange: 0,
    onlineTimePercent: 98,
    onlineChange: 2,
    lostSales: 120,
  },
  kitchenEfficiency: {
    avgPrepTime: '12 min 30 sec',
    kptDelayedOrders: 5,
    kptDelayedChange: -20,
    avgDelay: '2 min',
    foodReadyAccuracy: 94,
    foodReadyChange: 5,
    riderHandoverTime: 12,
    handoverChange: -10,
    avgHandoverTime: '1 min 15 sec',
  },
  mealtimeKPT: [
    { label: 'Breakfast', time: '(7:00 am - 11:00 am)', value: '10 min', change: -5, color: '#FF6600' },
    { label: 'Lunch', time: '(11:00 am - 4:00 pm)', value: '14 min', change: 12, color: '#00A144' },
    { label: 'Evening snacks', time: '(4:00 pm - 7:00 pm)', value: '11 min', change: 4, color: '#0066CC' },
    { label: 'Dinner', time: '(7:00 pm - 11:00 pm)', value: '18 min', change: 25, color: '#FFB800' },
    { label: 'Late night', time: '(11:00 pm - 7:00 am)', value: '15 min', change: 0, color: '#00D1FF' },
  ],
  categorySales: [
    { label: 'Pizza', value: 45000 },
    { label: 'Sides', value: 12000 },
    { label: 'Drinks', value: 8000 },
    { label: 'Dessert', value: 5000 },
  ],
  ratingDistribution: [
    { label: '5★', value: 120 },
    { label: '4★', value: 45 },
    { label: '3★', value: 15 },
    { label: '2★', value: 5 },
    { label: '1★', value: 2 },
  ]
};

export const DASHBOARD_MENU_ITEMS = [
  { id: '1', label: 'Manage outlets', icon: 'Storefront' },
  { id: '2', label: 'Offers and ads', icon: 'Megaphone' },
  { id: '3', label: 'Payouts', icon: 'CurrencyInr' },
  { id: '4', label: 'See all options', icon: 'DotsThreeOutline' },
];
