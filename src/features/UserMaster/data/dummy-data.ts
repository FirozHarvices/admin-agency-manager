import { Agency } from '../types';

export const dummyAgencies: Agency[] = [
  {
    id: 'agency-1',
    name: 'Pixel Perfect Inc.',
    phone: '+1 202-555-0175',
    email: 'contact@pixelperfect.io',
    user_role: 'Agency',
    storage: 51200, // 50 GB
    customers: [
      { id: 'cust-1a', name: 'Global Mart', website: 'globalmart.com', status: 'Active' },
      { id: 'cust-1b', name: 'Sunrise Cafe', website: 'sunrisecafe.net', status: 'Active' },
      { id: 'cust-1c', name: 'Urban Gear', website: 'urbangear.co', status: 'Inactive' },
    ],
  },
  {
    id: 'agency-2',
    name: 'Data Driven Digital',
    phone: '+44 20 7946 0958',
    email: 'info@datadriven.co',
    user_role: 'Agency',
    storage: 20480, // 20 GB
    customers: [
      { id: 'cust-2a', name: 'Legal Eagle', website: 'legaleagle-assoc.com', status: 'Active' },
    ],
  },
  {
    id: 'agency-3',
    name: 'Innovate Solutions',
    phone: '+1 310-555-0182',
    email: 'hello@innovate.tech',
    user_role: 'Agency',
    storage: 102400, // 100 GB
    customers: [], // This agency has no customers, for testing the empty state
  },
];


export const currencyOptions = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "CAD", label: "CAD (C$)", symbol: "C$" },
  { value: "AUD", label: "AUD (A$)", symbol: "A$" },
];

