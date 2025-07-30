import { ComponentType } from 'react';

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  total: number;
  icon: ComponentType<{ className?: string }>;
}

export interface AgencyData {
  remaining_ai_token: number;
  remaining_storage: number;
  remaining_website_count: number;
  total_ai_token: number;
  total_storage: number | null; 
  total_website_count: number;
  remaining_image_count:number;
  total_images: number;
}

export interface Customer {
  id: number;
  name: string;
}

export interface Site {
  id: number;
  websiteName: string;
  host: string;
  is_active: boolean;
  home_page_id: number;
}

export interface CustomerWithSites {
  customer: Customer;
  sites: Site[];
}

export interface DashboardApiResponse {
  data: {
    agency_data: AgencyData;
    customers: CustomerWithSites[];
  };
  message: string;
  status: boolean;
}