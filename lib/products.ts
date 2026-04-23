export interface Product {
  id: string;
  name: string;
  price: number; // in cents
  category: string;
  brand: string;
  image?: string;
}

export const PRODUCTS: Product[] = [
  // Grocery
  { id: 'wgl-001', name: 'Great Value Milk 1 Gallon', price: 449, category: 'Dairy', brand: 'Walmart' },
  { id: 'wgl-002', name: 'Great Value Eggs 12ct', price: 349, category: 'Dairy', brand: 'Walmart' },
  { id: 'wgl-003', name: 'Great Value Bread Loaf', price: 149, category: 'Bakery', brand: 'Walmart' },
  { id: 'wgl-004', name: 'Bananas 1lb', price: 67, category: 'Produce', brand: 'Produce' },
  { id: 'wgl-005', name: 'Red Apples 1lb', price: 199, category: 'Produce', brand: 'Produce' },
  { id: 'wgl-006', name: 'Baby Carrots 1lb', price: 249, category: 'Produce', brand: 'Produce' },
  { id: 'wgl-007', name: 'Lay\'s Classic Chips', price: 349, category: 'Snacks', brand: 'Lay\'s' },
  { id: 'wgl-008', name: 'Coca-Cola 12-Pack', price: 699, category: 'Beverages', brand: 'Coca-Cola' },
  { id: 'wgl-009', name: 'Pepsi 12-Pack', price: 649, category: 'Beverages', brand: 'Pepsi' },
  { id: 'wgl-010', name: 'Dasani Water 24-Pack', price: 449, category: 'Beverages', brand: 'Coca-Cola' },
  { id: 'wgl-011', name: 'Minute Maid Orange Juice 52oz', price: 499, category: 'Beverages', brand: 'Minute Maid' },
  { id: 'wgl-012', name: 'Tropicana Orange Juice 52oz', price: 549, category: 'Beverages', brand: 'Tropicana' },
  { id: 'wgl-013', name: 'Campbell\'s Tomato Soup', price: 199, category: 'Canned Goods', brand: 'Campbell\'s' },
  { id: 'wgl-014', name: 'Heinz Tomato Ketchup', price: 379, category: 'Condiments', brand: 'Heinz' },
  { id: 'wgl-015', name: 'Hidden Valley Ranch', price: 549, category: 'Condiments', brand: 'Hidden Valley' },
  { id: 'wgl-016', name: 'Jif Peanut Butter 16oz', price: 399, category: 'Spreads', brand: 'Jif' },
  { id: 'wgl-017', name: 'Wonder Bread White', price: 299, category: 'Bakery', brand: 'Wonder' },
  { id: 'wgl-018', name: 'Taco Bell Seasoning', price: 179, category: 'Pantry', brand: 'Taco Bell' },
  { id: 'wgl-019', name: 'Barilla Pasta Spaghetti', price: 199, category: 'Pantry', brand: 'Barilla' },
  { id: 'wgl-020', name: 'Ragu Pasta Sauce', price: 399, category: 'Pantry', brand: 'Ragu' },
  { id: 'wgl-021', name: 'Chef Boyardee Ravioli', price: 199, category: 'Canned Goods', brand: 'Chef Boyardee' },
  { id: 'wgl-022', name: 'Kellogg\'s Frosted Flakes', price: 499, category: 'Cereal', brand: 'Kellogg\'s' },
  { id: 'wgl-023', name: 'Cheerios 18oz', price: 549, category: 'Cereal', brand: 'General Mills' },
  { id: 'wgl-024', name: 'Lucky Charms', price: 499, category: 'Cereal', brand: 'General Mills' },
  { id: 'wgl-025', name: 'Rice Krispies Treats 8ct', price: 499, category: 'Snacks', brand: 'Kellogg\'s' },
  // Household
  { id: 'wgl-030', name: 'Swiffer WetJet Refill', price: 899, category: 'Cleaning', brand: 'Swiffer' },
  { id: 'wgl-031', name: 'Paper Towels 6-Pack', price: 1299, category: 'Paper Goods', brand: 'Great Value' },
  { id: 'wgl-032', name: 'Toilet Paper 12-Pack', price: 1599, category: 'Paper Goods', brand: 'Great Value' },
  { id: 'wgl-033', name: 'Dish Soap Dawn 24oz', price: 399, category: 'Cleaning', brand: 'Dawn' },
  { id: 'wgl-034', name: 'Tide Laundry Detergent 100oz', price: 1499, category: 'Laundry', brand: 'Tide' },
  { id: 'wgl-035', name: 'Clorox Disinfecting Wipes 75ct', price: 549, category: 'Cleaning', brand: 'Clorox' },
  // Personal Care
  { id: 'wgl-040', name: 'Dove Soap 4-Pack', price: 599, category: 'Personal Care', brand: 'Dove' },
  { id: 'wgl-041', name: 'Schick Hydro 4ct', price: 1299, category: 'Personal Care', brand: 'Schick' },
  { id: 'wgl-042', name: 'Colgate Toothpaste 6oz', price: 449, category: 'Personal Care', brand: 'Colgate' },
  { id: 'wgl-043', name: 'Crest Toothbrush 2ct', price: 399, category: 'Personal Care', brand: 'Crest' },
  { id: 'wgl-044', name: 'Suave Shampoo 22oz', price: 349, category: 'Personal Care', brand: 'Suave' },
  { id: 'wgl-045', name: 'Degree Deodorant', price: 599, category: 'Personal Care', brand: 'Degree' },
  { id: 'wgl-046', name: 'Vaseline 4oz', price: 399, category: 'Personal Care', brand: 'Vaseline' },
  // Apparel
  { id: 'wgl-050', name: 'Hanes Crew Socks 6-Pack', price: 1099, category: 'Apparel', brand: 'Hanes' },
  { id: 'wgl-051', name: 'Fruit of the Loom Underwear 5ct', price: 999, category: 'Apparel', brand: 'Fruit of the Loom' },
  { id: 'wgl-052', name: 'Capezio T-Shirt', price: 699, category: 'Apparel', brand: 'Capezio' },
  // Electronics
  { id: 'wgl-060', name: 'USB-C Cable 6ft', price: 999, category: 'Electronics', brand: 'Great Value' },
  { id: 'wgl-061', name: 'AAA Batteries 8-Pack', price: 999, category: 'Electronics', brand: 'Duracell' },
  { id: 'wgl-062', name: 'Earbuds Wired', price: 499, category: 'Electronics', brand: 'Great Value' },
  { id: 'wgl-063', name: 'Phone Charger Block', price: 1299, category: 'Electronics', brand: 'Great Value' },
  // Sporting Goods
  { id: 'wgl-070', name: 'Wilson Basketball', price: 2999, category: 'Sports', brand: 'Wilson' },
  { id: 'wgl-071', name: 'Nike Soccer Ball', price: 2499, category: 'Sports', brand: 'Nike' },
  { id: 'wgl-072', name: 'Adidas Mini Ball', price: 1999, category: 'Sports', brand: 'Adidas' },
  { id: 'wgl-073', name: 'Resistance Bands Set', price: 1499, category: 'Sports', brand: 'Pro Fitness' },
  { id: 'wgl-074', name: 'Yoga Mat', price: 1999, category: 'Sports', brand: 'Great Value' },
  { id: 'wgl-075', name: 'Tennis Racket', price: 2499, category: 'Sports', brand: 'Wilson' },
  // Hardware / Auto
  { id: 'wgl-080', name: 'WD-40 12oz', price: 699, category: 'Hardware', brand: 'WD-40' },
  { id: 'wgl-081', name: 'Duct Tape Silver', price: 599, category: 'Hardware', brand: 'Duck' },
  { id: 'wgl-082', name: 'Light Bulbs LED 4-Pack', price: 899, category: 'Hardware', brand: 'Great Value' },
  { id: 'wgl-083', name: 'Car Air Freshener', price: 499, category: 'Auto', brand: 'Little Trees' },
  // Seasonal / Gift
  { id: 'wgl-090', name: 'Gift Card $25', price: 2500, category: 'Gift Cards', brand: 'Gift Card' },
  { id: 'wgl-091', name: 'Gift Card $50', price: 5000, category: 'Gift Cards', brand: 'Gift Card' },
  { id: 'wgl-092', name: 'Roses Bouquet', price: 1999, category: 'Floral', brand: 'Floral' },
  { id: 'wgl-093', name: 'Balloon Bundle 18ct', price: 899, category: 'Party', brand: 'Party' },
  // Misc / High Value
  { id: 'wgl-100', name: 'PlayStation 5 Controller', price: 7499, category: 'Electronics', brand: 'Sony' },
  { id: 'wgl-101', name: 'Fishing Line Spool', price: 1299, category: 'Sports', brand: 'Stren' },
  { id: 'wgl-102', name: 'Dog Food 12lb', price: 1899, category: 'Pet', brand: 'Pedigree' },
  { id: 'wgl-103', name: 'Cat Food 12lb', price: 1599, category: 'Pet', brand: 'Purina' },
  { id: 'wgl-104', name: 'Charcoal Grill 22 inch', price: 4999, category: 'Outdoor', brand: 'Weber' },
  { id: 'wgl-105', name: 'Camping Lantern', price: 1499, category: 'Outdoor', brand: 'Coleman' },
];

export const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))].sort();

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}
