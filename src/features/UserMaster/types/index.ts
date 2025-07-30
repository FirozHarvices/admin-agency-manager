// Represents the customers belonging to an agency
export interface Customer {
  id: string;
  name: string;
  website: string;
  status: 'Active' | 'Inactive';
}

// Represents the main "user" which is an Agency
export interface Agency {
  id: string;
  name: string;
  phone: string;
  email: string;
  user_role: 'Agency';
  storage: number; // in MB
  // Each Agency has a list of its customers
  customers: Customer[];
}