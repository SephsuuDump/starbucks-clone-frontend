export const recentProcurements = [
  {
    supplierName: "Supplier A",
    status: "PENDING",
    items: [
      { name: "Item 1", qty: 10 },
      { name: "Item 2", qty: 20 }
    ],
    type: "Local",
    orderDate: "2025-09-01",
    totalAmount: 1500
  },
  {
    supplierName: "Supplier B",
    status: "REJECTED",
    items: [
      { name: "Item 3", qty: 5 },
      { name: "Item 4", qty: 15 }
    ],
    type: "International",
    orderDate: "2025-08-25",
    totalAmount: 2000
  },
  {
    supplierName: "Supplier C",
    status: "PENDING",
    items: [
      { name: "Item 5", qty: 30 }
    ],
    type: "Local",
    orderDate: "2025-09-03",
    totalAmount: 900
  },
  {
    supplierName: "Supplier D",
    status: "REJECTED",
    items: [
      { name: "Item 6", qty: 12 },
      { name: "Item 7", qty: 8 }
    ],
    type: "Local",
    orderDate: "2025-08-30",
    totalAmount: 1300
  },
  {
    supplierName: "Supplier E",
    status: "APPROVED",
    items: [
      { name: "Item 8", qty: 50 },
      { name: "Item 9", qty: 25 }
    ],
    type: "International",
    orderDate: "2025-09-05",
    totalAmount: 4000
  },
  {
    supplierName: "Supplier F",
    status: "APPROVED",
    items: [
      { name: "Item 10", qty: 7 }
    ],
    type: "Local",
    orderDate: "2025-09-02",
    totalAmount: 350
  }
];

export const requestOrders = [
  {
    destination: "HR Department",
    supplierName: "St. Gerard Construction",
    supplierType: "Local",
    totalAmount: 120000,
    status: "PENDING",
    requestDate: "2025-09-05",
    orders: [
      { supplyName: "Cement Bags", qty: 50, unitPrice: 1200 },
      { supplyName: "Steel Rods", qty: 30, unitPrice: 800 },
    ],
  },
  {
    destination: "Finance Department",
    supplierName: "Global Supplies Inc.",
    supplierType: "International",
    totalAmount: 850000,
    status: "PENDING",
    requestDate: "2025-08-30",
    orders: [
      { supplyName: "Office Chairs", qty: 100, unitPrice: 3000 },
      { supplyName: "Desks", qty: 50, unitPrice: 5000 },
    ],
  },
  {
    destination: "IT Department",
    supplierName: "Tech Solutions Ltd.",
    supplierType: "Local",
    totalAmount: 300000,
    status: "PENDING",
    requestDate: "2025-08-30",
    orders: [
      { supplyName: "Laptops", qty: 10, unitPrice: 20000 },
      { supplyName: "Keyboards", qty: 20, unitPrice: 1500 },
    ],
  },
  {
    destination: "Marketing Department",
    supplierName: "Creative Works",
    supplierType: "Local",
    totalAmount: 450000,
    status: "PENDING",
    requestDate: "2025-08-30",
    orders: [
      { supplyName: "Projectors", qty: 5, unitPrice: 60000 },
      { supplyName: "Banners", qty: 30, unitPrice: 2000 },
    ],
  },
  {
    destination: "Operations",
    supplierName: "Logistics Partners",
    supplierType: "International",
    totalAmount: 670000,
    status: "PENDING",
    requestDate: "2025-08-30",
    orders: [
      { supplyName: "Shipping Containers", qty: 3, unitPrice: 200000 },
      { supplyName: "Pallets", qty: 50, unitPrice: 1400 },
    ],
  },
];

export const pendingOrders = [
  {
    orderId: "ORD001",
    destination: "New York, USA",
    supplierName: "Supplier A",
    totalAmount: 1500,
    status: "SENT",
    requestDate: "2025-09-01",
    supplierType: 'International'
  },
  {
    orderId: "ORD002",
    destination: "Tokyo, Japan",
    supplierName: "Supplier B",
    totalAmount: 2300,
    status: "SENT",
    requestDate: "2025-09-03",
    supplierType: 'International'
  },
  {
    orderId: "ORD003",
    destination: "Berlin, Germany",
    supplierName: "Supplier C",
    totalAmount: 1800,
    status: "CONFIRMED",
    requestDate: "2025-08-29",
    supplierType: 'International'
  },
  {
    orderId: "ORD004",
    destination: "Sydney, Australia",
    supplierName: "Supplier D",
    totalAmount: 1200,
    status: "DELIVERED",
    requestDate: "2025-09-05",
    supplierType: 'International'
  },
  {
    orderId: "ORD005",
    destination: "Toronto, Canada",
    supplierName: "Supplier E",
    totalAmount: 2700,
    status: "CANCELLED",
    requestDate: "2025-09-07",
    supplierType: 'International'

  }
];


