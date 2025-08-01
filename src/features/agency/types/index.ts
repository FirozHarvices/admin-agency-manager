// The main structure for an Agency, based on your mock data and API
export interface Agency {
  id: number; // API uses number for ID
  name: string;
  phone: string;
  email: string;
  user_role: "Agency";
  is_active:  boolean;
  created_at: string; // ISO date string
  storage: number;
  storage_used: number;
  token_count: number;
  token_used: number;
  website_count: number;
  website_used: number;
  image_count: number;
  image_used: number;
  notes?: string;
  parent_user_id: number;
  total_website_count: number;
  total_storage: number; 
  total_image_count: number;  
  total_token_count: number;

}

// Stats for the top-level dashboard cards
export interface DashboardStats {
  totalAgencies: number;
  totalWebsites: number;
  totalStorageGB: number;
  totalTokensK: number;
}

// Data for the top-up history table
export interface TopUpHistoryItem {
  id: string;
  agency_id: number;
  agency_name: string;
  date: string;
  admin: string;
  resources: {
    storage?: number;
    tokens?: number;
    websites?: number;
    images?: number;
  };
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
}

// Payload for the create agency API endpoint
export interface CreateAgencyPayload {
  email: string;
  user_role: "Agency";
  name: string;
  phone: string;
  storage: number;
  token_count: number;
  website_count: number;
  image_count: number;
  amount: number; // You had amount/currency in the create curl
  currency: string;
  parent_user_id: number; // Assuming parent ID comes from auth state
  notes?: string;
}

// Payload for the top-up (update) agency API endpoint
export interface TopUpAgencyPayload {
  id: number;
  top_up: true;
  image_count: number;
  storage: number;
  token_count: number;
  website_count: number;
  amount: number;
  currency: string;
  phone?: string; // API shows phone, making it optional
  parent_user_id?: null; // API shows this
}

// A generic API response wrapper to handle business logic errors
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
}