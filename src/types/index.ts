export interface User {
  id: string;
  email: string;
  businessType: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface DomainVerification {
  domain: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SiteState {
  siteInfo: {
    category: string;
    websiteName: string;
    description: string;
    email: string;
    domain?: string;
    siteId?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export type BusinessType = 'Restaurant' | 'Salon' | 'Fitness' | 'Retail' | 'Other';