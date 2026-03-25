export interface ChartDataPoint {
  value: number;
  label: string;
}

export interface MetricComparison {
  current: number;
  previous: number;
  growth: number;
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
    statusBreakdown: { status: string; count: number; color: string }[];
    hourlyDistribution: ChartDataPoint[];
    topItems: { name: string; revenue: number; orders: number }[];
  };
  funnel: {
    summary: {
      impressions: number;
      menuOpens: number;
      cartsBuilt: number;
      ordersPlaced: number;
      ordersDelivered: number;
    };
    steps: {
      label: string;
      count: number;
      percentage: number;
    }[];
    bySource: { source: string; impressions: number; menuOpens: number }[];
    byCustomerType: { type: string; impressions: number; orders: number }[];
  };
  serviceQuality: {
    complaints: number;
    refundedPercent: number;
    poorRatedOrders: number;
    onlineTimePercent: number;
    lostSales: number;
    rejectionReasons: { label: string; value: number }[];
    summary: {
      rejectedOrders: number;
      complaintCount: number;
      avgOnlineTime: number;
    };
    complaintsBreakdown: { type: string; count: number }[];
    poorRatedOrdersList: { orderId: string; rating: number }[];
  };
  kitchenEfficiency: {
    foodReadyAccuracy: number;
    foodReadyChange: number;
    riderHandoverTime: number;
    handoverChange: number;
    avgHandoverTime: number;
    avgPrepTime: number;
    kptDelayedOrders: number;
    kptDelayedChange: number;
    avgDelay: number;
    metrics: {
      avgPrepTime: number;
      delayedOrders: number;
      readyAccuracy: number;
      highHandoverTimeOrders: number;
    };
    delayedByMealtime: { mealTime: string; delayed: number }[];
  };
  customers: {
    segments: {
      type: 'new' | 'repeat' | 'loyal';
      count: number;
      spendingPotential: 'low' | 'medium' | 'high';
    }[];
    affinitySpending: { segment: string; users: number }[];
    distanceBreakup: { range: string; users: number }[];
    loyalty: ChartDataPoint[];
  };
  offers: {
    list: {
      id: string;
      discountType: 'flat' | 'percentage';
      discountValue: number;
      ordersGenerated: number;
      revenueGenerated: number;
      spend?: number;
    }[];
    summary: {
      grossSalesFromOffers: number;
      totalDiscount: number;
      ordersFromOffers: number;
      effectiveDiscount: number;
    };
    discountTypeBreakup: { type: string; usage: number }[];
  };
  ads: {
    list: {
      id: string;
      impressions: number;
      clicks: number;
      spend: number;
      revenueGenerated: number;
    }[];
    summary: {
      impressions: number;
      clicks: number;
      ctr: number;
      spend: number;
      revenue: number;
      roi: number;
    };
    adsVsOrganic: {
      adSales: number;
      totalSales: number;
      percentageFromAds: number;
    };
    conversionFunnel: { label: string; count: number; percentage: number }[];
    adsByCustomerType: { type: string; orders: number }[];
  };
  mealtimeOrders: { mealTime: string; orders: number }[];
  mealtimeKPT: { 
    label: string;
    time: string;
    value: string;
    change: number;
    color: string;
  }[];
  categorySales: ChartDataPoint[];
  aovTrend: { date: string; avgOrderValue: number }[];
  ratingDistribution: ChartDataPoint[];
}

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  sales: {
    netSales: 45200,
    salesChange: 18.9,
    ordersDelivered: 156,
    ordersChange: 20,
    avgOrderValue: 289,
    avgChange: 5.1,
    chartData: [
      { label: "20 Mar", value: 1200 },
      { label: "21 Mar", value: 1800 },
      { label: "22 Mar", value: 1500 },
      { label: "23 Mar", value: 2100 },
      { label: "24 Mar", value: 1900 },
    ],
    previousChartData: [
      { label: "20 Mar", value: 1000 },
      { label: "21 Mar", value: 1600 },
      { label: "22 Mar", value: 1400 },
      { label: "23 Mar", value: 1900 },
      { label: "24 Mar", value: 1800 },
    ],
    statusBreakdown: [
      { status: 'Delivered', count: 156, color: '#4CAF50' },
      { status: 'Cancelled', count: 12, color: '#F44336' },
      { status: 'Rejected', count: 5, color: '#FF9800' },
      { status: 'Accepted', count: 7, color: '#2196F3' },
    ],
    hourlyDistribution: [
      { label: '8 AM', value: 5 },
      { label: '10 AM', value: 12 },
      { label: '12 PM', value: 45 },
      { label: '2 PM', value: 30 },
      { label: '4 PM', value: 15 },
      { label: '6 PM', value: 25 },
      { label: '8 PM', value: 50 },
      { label: '10 PM', value: 40 },
    ],
    topItems: [
      { name: 'Margherita Pizza', revenue: 12500, orders: 45 },
      { name: 'Paneer Tikka', revenue: 8400, orders: 32 },
      { name: 'Veg Burger', revenue: 5200, orders: 28 },
      { name: 'Cold Coffee', revenue: 3100, orders: 22 },
      { name: 'Garlic Bread', revenue: 2800, orders: 40 },
    ],
  },
  funnel: {
    summary: {
      impressions: 5000,
      menuOpens: 1200,
      cartsBuilt: 450,
      ordersPlaced: 200,
      ordersDelivered: 180
    },
    steps: [
      { label: 'Impressions', count: 5000, percentage: 100 },
      { label: 'Menu Opens', count: 1200, percentage: 24 },
      { label: 'Carts Built', count: 450, percentage: 37.5 },
      { label: 'Orders Placed', count: 200, percentage: 44.4 },
      { label: 'Delivered', count: 180, percentage: 90 },
    ],
    bySource: [
      { source: "search", impressions: 3000, menuOpens: 800 },
      { source: "ads", impressions: 1500, menuOpens: 350 },
      { source: "direct", impressions: 500, menuOpens: 50 }
    ],
    byCustomerType: [
      { type: "new", impressions: 3000, orders: 80 },
      { type: "repeat", impressions: 2000, orders: 120 }
    ]
  },
  serviceQuality: {
    complaints: 8,
    refundedPercent: 2.5,
    poorRatedOrders: 4.2,
    onlineTimePercent: 98,
    lostSales: 1200,
    rejectionReasons: [
      { label: 'Out of Stock', value: 12 },
      { label: 'Closing Early', value: 5 },
      { label: 'Too Busy', value: 8 },
      { label: 'Delivery Issue', value: 3 },
    ],
    summary: {
      rejectedOrders: 5,
      complaintCount: 8,
      avgOnlineTime: 95
    },
    complaintsBreakdown: [
      { type: "Late delivery", count: 5 },
      { type: "Wrong item", count: 3 }
    ],
    poorRatedOrdersList: [
      { orderId: "8220", rating: 2 },
      { orderId: "8224", rating: 1 }
    ]
  },
  kitchenEfficiency: {
    foodReadyAccuracy: 92,
    foodReadyChange: 5,
    riderHandoverTime: 4,
    handoverChange: -12,
    avgHandoverTime: 45,
    avgPrepTime: 12.5,
    kptDelayedOrders: 15,
    kptDelayedChange: -8,
    avgDelay: 3,
    metrics: {
      avgPrepTime: 12.5,
      delayedOrders: 15,
      readyAccuracy: 92,
      highHandoverTimeOrders: 4
    },
    delayedByMealtime: [
      { mealTime: "lunch", delayed: 8 },
      { mealTime: "dinner", delayed: 7 }
    ]
  },
  customers: {
    segments: [
      { type: 'new', count: 150, spendingPotential: 'medium' },
      { type: 'repeat', count: 450, spendingPotential: 'high' },
      { type: 'loyal', count: 300, spendingPotential: 'high' },
    ],
    affinitySpending: [
      { segment: "high spenders", users: 150 },
      { segment: "medium spenders", users: 450 },
      { segment: "low spenders", users: 300 }
    ],
    distanceBreakup: [
      { range: "0-2km", users: 400 },
      { range: "2-5km", users: 350 },
      { range: "5km+", users: 150 }
    ],
    loyalty: [
      { label: 'New', value: 40 },
      { label: 'Repeat', value: 45 },
      { label: 'Loyal', value: 15 },
    ],
  },
  offers: {
    list: [
      { id: 'SUMMER50', discountType: 'percentage', discountValue: 50, ordersGenerated: 25, revenueGenerated: 8500, spend: 1200 },
      { id: 'FLAT100', discountType: 'flat', discountValue: 100, ordersGenerated: 20, revenueGenerated: 3500, spend: 600 },
    ],
    summary: {
      grossSalesFromOffers: 12000,
      totalDiscount: 1800,
      ordersFromOffers: 45,
      effectiveDiscount: 15
    },
    discountTypeBreakup: [
      { type: "flat", usage: 30 },
      { type: "percentage", usage: 15 }
    ]
  },
  ads: {
    list: [
      { id: 'AD_CAMPAIGN_1', impressions: 6000, clicks: 500, spend: 1500, revenueGenerated: 4500 },
      { id: 'AD_CAMPAIGN_2', impressions: 4000, clicks: 300, spend: 1000, revenueGenerated: 3000 },
    ],
    summary: {
      impressions: 10000,
      clicks: 800,
      ctr: 8,
      spend: 2500,
      revenue: 7500,
      roi: 3
    },
    adsVsOrganic: {
      adSales: 7500,
      totalSales: 45200,
      percentageFromAds: 16.6
    },
    conversionFunnel: [
      { label: 'Clicks', count: 800, percentage: 100 },
      { label: 'Menu Opens', count: 350, percentage: 43.7 },
      { label: 'Carts Built', count: 120, percentage: 34.2 },
      { label: 'Orders', count: 45, percentage: 37.5 },
    ],
    adsByCustomerType: [
      { type: "new", orders: 30 },
      { type: "repeat", orders: 15 }
    ]
  },
  mealtimeOrders: [
    { mealTime: "breakfast", orders: 40 },
    { mealTime: "lunch", orders: 120 },
    { mealTime: "dinner", orders: 90 }
  ],
  mealtimeKPT: [
    { label: 'Breakfast', time: '8 AM - 11 AM', value: '12 min', change: -5, color: '#FFD700' },
    { label: 'Lunch', time: '12 PM - 4 PM', value: '15 min', change: 8, color: '#FF8C00' },
    { label: 'Dinner', time: '7 PM - 11 PM', value: '14 min', change: 2, color: '#4169E1' },
  ],
  categorySales: [
    { label: 'Main Course', value: 25000 },
    { label: 'Starters', value: 12000 },
    { label: 'Desserts', value: 5000 },
    { label: 'Beverages', value: 3200 },
  ],
  aovTrend: [
    { date: "2026-03-20", avgOrderValue: 220 },
    { date: "2026-03-21", avgOrderValue: 260 },
    { date: "2026-03-22", avgOrderValue: 240 },
    { date: "2026-03-23", avgOrderValue: 290 },
    { date: "2026-03-24", avgOrderValue: 289 },
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
  { id: '1', label: 'Order History', icon: 'Storefront', route: '/orders/history', color: '#FFB800' },
  { id: '2', label: 'Complaints', icon: 'Megaphone', route: '/help', color: '#FF5E5E' },
  { id: '3', label: 'Payouts', icon: 'CurrencyInr', route: '/earnings', color: '#4CAF50' },
  { id: '4', label: 'More Options', icon: 'DotsThreeOutline', route: '/more', color: '#7C4DFF' },
];
