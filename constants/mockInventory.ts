export interface InventoryItem {
  id: string;
  name: string;
  isVeg: boolean;
  isInStock: boolean;
  outOfStockUntil?: string;
  price: number;
  description?: string;
  status?: 'live' | 'not-live' | 'rejected' | 'no-photo';
  imageUrl?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  subtitle: string;
  items: InventoryItem[];
  isActive: boolean;
  subCategories?: {
    id: string;
    name: string;
    items: InventoryItem[];
  }[];
}

export const MOCK_INVENTORY: InventoryCategory[] = [
  {
    id: 'cat-1',
    name: 'Pizza',
    subtitle: 'Pizza & Pasta',
    isActive: true,
    items: [
      { 
        id: 'item-1-1', 
        name: 'Cheese Pizza', 
        isVeg: true, 
        isInStock: false, 
        outOfStockUntil: '10:50 PM, 18 Mar 2026', 
        price: 270,
        description: 'Classic cheese pizza with mozzarella',
        status: 'live',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
      },
      { 
        id: 'item-1-2', 
        name: 'Jain Pizza', 
        isVeg: true, 
        isInStock: true, 
        price: 280,
        description: 'Pizza made without onion and garlic',
        status: 'no-photo'
      },
      { 
        id: 'item-1-4', 
        name: 'Otc Pizza', 
        isVeg: true, 
        isInStock: true, 
        price: 485,
        description: 'Pizza Base With Topping',
        status: 'not-live'
      },
    ]
  },
  {
    id: 'cat-2',
    name: 'Pasta',
    subtitle: 'Pizza & Pasta',
    isActive: true,
    items: [
      { id: 'item-2-1', name: 'White Sauce Pasta', isVeg: true, isInStock: true, price: 350 },
      { id: 'item-2-2', name: 'Red Sauce Pasta', isVeg: true, isInStock: true, price: 320 },
      { id: 'item-2-3', name: 'Mixed Sauce Pasta', isVeg: true, isInStock: true, price: 380 },
    ]
  },
  {
    id: 'cat-3',
    name: 'Sandwiches',
    subtitle: 'Burgers & Sandwiches',
    isActive: true,
    items: [
      { id: 'item-3-1', name: 'Butter Sandwich', isVeg: true, isInStock: true, price: 120 },
      { id: 'item-3-2', name: 'Butter Jam Sandwich', isVeg: true, isInStock: true, price: 150 },
      { id: 'item-3-3', name: 'Veg Sandwich', isVeg: true, isInStock: true, price: 180 },
      { id: 'item-3-4', name: 'Aloo Sandwich', isVeg: true, isInStock: true, price: 140 },
    ]
  },
  {
    id: 'cat-4',
    name: 'Burgers',
    subtitle: 'Burgers & Sandwiches',
    isActive: false,
    items: [
      { id: 'item-4-1', name: 'Veg Burger', isVeg: true, isInStock: true, price: 200 },
      { id: 'item-4-2', name: 'Cheese Burger', isVeg: true, isInStock: true, price: 250 },
    ]
  }
];

export const MOCK_ADDONS: InventoryCategory[] = [
  {
    id: 'addon-1',
    name: 'Extra',
    subtitle: 'Minimum 0 & Maximum 1',
    isActive: true,
    items: [
      { id: 'addon-item-1', name: 'Cheese', isVeg: true, isInStock: true, price: 50 },
      { id: 'addon-item-2', name: 'Extra Dip', isVeg: true, isInStock: true, price: 30 },
    ]
  }
];
