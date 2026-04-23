// Mock Data for SIA

export const mockMetrics = {
  totalShipments: 1284,
  activeInventory: 8432,
  demandAccuracy: 94.2,
  costSavings: 127500,
  onTimeDelivery: 96.8,
  avgTransitTime: 3.2,
};

export const mockDemandSupplyData = [
  { month: 'Jan', demand: 4200, supply: 4000 },
  { month: 'Feb', demand: 3800, supply: 3900 },
  { month: 'Mar', demand: 5100, supply: 4800 },
  { month: 'Apr', demand: 4600, supply: 4700 },
  { month: 'May', demand: 5400, supply: 5200 },
  { month: 'Jun', demand: 6100, supply: 5800 },
  { month: 'Jul', demand: 5800, supply: 6000 },
  { month: 'Aug', demand: 6200, supply: 6100 },
  { month: 'Sep', demand: 5500, supply: 5600 },
  { month: 'Oct', demand: 6800, supply: 6500 },
  { month: 'Nov', demand: 7200, supply: 7000 },
  { month: 'Dec', demand: 8100, supply: 7800 },
];

export const mockAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Product SKU-2847 is below minimum threshold',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'info',
    title: 'Shipment Delay',
    message: 'Shipment #SH-8921 delayed due to weather conditions',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'success',
    title: 'Demand Forecast Updated',
    message: 'Q2 predictions now available with 96% accuracy',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Route Optimization',
    message: 'Alternative route available for shipment #SH-8934',
    time: '1 day ago',
  },
];

export const mockInventory = [
  { id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', stock: 234, minStock: 50, status: 'In Stock', price: 79.99 },
  { id: 2, name: 'USB-C Cable', sku: 'UC-002', category: 'Accessories', stock: 1250, minStock: 200, status: 'In Stock', price: 12.99 },
  { id: 3, name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', stock: 45, minStock: 50, status: 'Low Stock', price: 49.99 },
  { id: 4, name: 'Mechanical Keyboard', sku: 'MK-004', category: 'Electronics', stock: 189, minStock: 30, status: 'In Stock', price: 129.99 },
  { id: 5, name: 'Monitor Arm', sku: 'MA-005', category: 'Accessories', stock: 28, minStock: 40, status: 'Low Stock', price: 89.99 },
  { id: 6, name: 'Webcam HD', sku: 'WC-006', category: 'Electronics', stock: 312, minStock: 50, status: 'In Stock', price: 69.99 },
  { id: 7, name: 'Mouse Pad', sku: 'MP-007', category: 'Accessories', stock: 890, minStock: 100, status: 'In Stock', price: 19.99 },
  { id: 8, name: 'Desk Lamp', sku: 'DL-008', category: 'Office', stock: 15, minStock: 25, status: 'Critical', price: 34.99 },
];

export const mockShipments = [
  { id: 'SH-8921', origin: 'Los Angeles, CA', destination: 'New York, NY', status: 'In Transit', eta: '2 days', progress: 65 },
  { id: 'SH-8922', origin: 'San Francisco, CA', destination: 'Seattle, WA', status: 'Delivered', eta: 'Delivered', progress: 100 },
  { id: 'SH-8923', origin: 'Chicago, IL', destination: 'Miami, FL', status: 'In Transit', eta: '1 day', progress: 80 },
  { id: 'SH-8924', origin: 'Boston, MA', destination: 'Austin, TX', status: 'Pending', eta: '3 days', progress: 10 },
  { id: 'SH-8925', origin: 'Denver, CO', destination: 'Portland, OR', status: 'In Transit', eta: '1 day', progress: 45 },
];

export const mockSupplies = [
  { id: 1, supplier: 'TechCorp Industries', product: 'Wireless Headphones', quantity: 500, unitPrice: 45.00, total: 22500, status: 'Active', route: 'Sea Freight' },
  { id: 2, supplier: 'Global Electronics', product: 'USB-C Cables', quantity: 2000, unitPrice: 5.50, total: 11000, status: 'Active', route: 'Air Freight' },
  { id: 3, supplier: 'Premium Accessories', product: 'Laptop Stands', quantity: 300, unitPrice: 28.00, total: 8400, status: 'Pending', route: 'Ground' },
  { id: 4, supplier: 'TechCorp Industries', product: 'Mechanical Keyboards', quantity: 150, unitPrice: 75.00, total: 11250, status: 'Active', route: 'Air Freight' },
];

export const mockInsights = [
  {
    title: 'Demand Surge Detected',
    description: 'Electronics category showing 23% increase in demand. Consider increasing inventory levels.',
    impact: 'high',
  },
  {
    title: 'Route Optimization Opportunity',
    description: 'Switching to alternative shipping routes could save $12,400 monthly.',
    impact: 'medium',
  },
  {
    title: 'Supplier Performance',
    description: 'TechCorp Industries consistently delivers 2 days early. Consider expanding partnership.',
    impact: 'low',
  },
];

export const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@sia.com',
  role: 'Supply Chain Manager',
  company: 'SIA',
  avatar: null,
};

export const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Supply', path: '/supply', icon: 'supply' },
  { name: 'Inventory', path: '/inventory', icon: 'inventory' },
  { name: 'Tracking', path: '/tracking', icon: 'tracking' },
  { name: 'Profile', path: '/profile', icon: 'profile' },
];
