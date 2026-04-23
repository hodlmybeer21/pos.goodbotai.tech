// Restaurant Training Simulator — Menu & Layout Data

export interface MenuItem {
  id: string;
  name: string;
  price: number; // cents
  category: string;
  emoji: string;
}

export const MENU: MenuItem[] = [
  // Appetizers
  { id: 'app-01', name: 'Mozzarella Sticks', price: 899, category: 'Appetizers', emoji: '🧀' },
  { id: 'app-02', name: 'Buffalo Wings', price: 1099, category: 'Appetizers', emoji: '🍗' },
  { id: 'app-03', name: 'Nachos Supreme', price: 1199, category: 'Appetizers', emoji: '🌮' },
  { id: 'app-04', name: 'Spinach Dip', price: 899, category: 'Appetizers', emoji: '🥬' },
  { id: 'app-05', name: 'Bruschetta', price: 799, category: 'Appetizers', emoji: '🍅' },
  { id: 'app-06', name: 'Onion Rings', price: 699, category: 'Appetizers', emoji: '🧅' },
  // Entrees
  { id: 'ent-01', name: 'Grilled Salmon', price: 1899, category: 'Entrees', emoji: '🐟' },
  { id: 'ent-02', name: 'Ribeye Steak 12oz', price: 2499, category: 'Entrees', emoji: '🥩' },
  { id: 'ent-03', name: 'Chicken Alfredo', price: 1599, category: 'Entrees', emoji: '🍝' },
  { id: 'ent-04', name: 'Burger & Fries', price: 1299, category: 'Entrees', emoji: '🍔' },
  { id: 'ent-05', name: 'Fish & Chips', price: 1399, category: 'Entrees', emoji: '🐟🍟' },
  { id: 'ent-06', name: 'BBQ Ribs Half', price: 1899, category: 'Entrees', emoji: '🦴' },
  { id: 'ent-07', name: 'Veggie Stir Fry', price: 1299, category: 'Entrees', emoji: '🥦' },
  { id: 'ent-08', name: 'Club Sandwich', price: 1199, category: 'Entrees', emoji: '🥪' },
  { id: 'ent-09', name: 'Fish Tacos (3)', price: 1399, category: 'Entrees', emoji: '🌮' },
  // Sides
  { id: 'side-01', name: 'French Fries', price: 399, category: 'Sides', emoji: '🍟' },
  { id: 'side-02', name: 'Mashed Potatoes', price: 449, category: 'Sides', emoji: '🥔' },
  { id: 'side-03', name: 'House Salad', price: 549, category: 'Sides', emoji: '🥗' },
  { id: 'side-04', name: 'Coleslaw', price: 299, category: 'Sides', emoji: '🥬' },
  { id: 'side-05', name: 'Rice Pilaf', price: 349, category: 'Sides', emoji: '🍚' },
  { id: 'side-06', name: 'Steamed Broccoli', price: 399, category: 'Sides', emoji: '🥦' },
  // Desserts
  { id: 'des-01', name: 'Chocolate Cake', price: 699, category: 'Desserts', emoji: '🍫' },
  { id: 'des-02', name: 'Cheesecake', price: 749, category: 'Desserts', emoji: '🍰' },
  { id: 'des-03', name: 'Apple Pie Slice', price: 599, category: 'Desserts', emoji: '🥧' },
  { id: 'des-04', name: 'Ice Cream Sundae', price: 549, category: 'Desserts', emoji: '🍨' },
  // Beverages
  { id: 'bev-01', name: 'Soda', price: 249, category: 'Beverages', emoji: '🥤' },
  { id: 'bev-02', name: 'Iced Tea', price: 249, category: 'Beverages', emoji: '🧊' },
  { id: 'bev-03', name: 'Lemonade', price: 299, category: 'Beverages', emoji: '🍋' },
  { id: 'bev-04', name: 'Coffee', price: 249, category: 'Beverages', emoji: '☕' },
  { id: 'bev-05', name: 'Milkshake', price: 499, category: 'Beverages', emoji: '🥛' },
  { id: 'bev-06', name: 'Sparkling Water', price: 299, category: 'Beverages', emoji: '💧' },
];

export const MENU_CATEGORIES = [...new Set(MENU.map(m => m.category))];

// Table layout: positions on the seating chart
export interface Table {
  id: number;
  seats: number;
  x: number; // % position
  y: number; // % position
  label: string;
}

export const TABLES: Table[] = [
  { id: 1, seats: 2, x: 15, y: 20, label: 'T1' },
  { id: 2, seats: 2, x: 38, y: 20, label: 'T2' },
  { id: 3, seats: 4, x: 62, y: 20, label: 'T3' },
  { id: 4, seats: 4, x: 85, y: 20, label: 'T4' },
  { id: 5, seats: 4, x: 15, y: 50, label: 'T5' },
  { id: 6, seats: 6, x: 38, y: 50, label: 'T6' },
  { id: 7, seats: 6, x: 62, y: 50, label: 'T7' },
  { id: 8, seats: 2, x: 85, y: 50, label: 'T8' },
  { id: 9, seats: 4, x: 15, y: 80, label: 'T9' },
  { id: 10, seats: 4, x: 38, y: 80, label: 'T10' },
  { id: 11, seats: 2, x: 62, y: 80, label: 'T11' },
  { id: 12, seats: 8, x: 85, y: 80, label: 'T12' },
];

export interface WaitlistEntry {
  id: number;
  name: string;
  partySize: number;
  timeAdded: number; // timestamp
}

export interface TableSession {
  tableId: number;
  guests: { name: string }[];
  orders: { item: MenuItem; qty: number }[];
  tabOpen: boolean;
  status: 'seated' | 'ordering' | 'eating' | 'paying';
  openedAt: number;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
