export type UserRole = 'admin' | 'client';

export interface UserWithoutPassword {
  id: number;
  email: string;
  role: UserRole;
  created_at?: string;
  api_key?: string | null;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface CloudService {
  id: number;
  name: string;
  type: 'server' | 'database' | 'storage' | 'email' | 'apps';
  description: string;
  price: number;
  status: 'active' | 'suspended' | 'terminated';
  created_at: string;
  updated_at?: string;
  user_id: number;
}

export interface CloudOperation {
  id: number;
  user_id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method?: 'invoice' | 'online';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export type WebsiteStatus = 'development' | 'active' | 'suspended';

export interface Website {
  id: number;
  name: string;
  domain: string;
  client_id: number;
  client_email?: string;
  status: WebsiteStatus;
  created_at: string;
  last_updated: string;
}

export interface WebsiteChanges {
  name?: string;
  domain?: string;
  status?: WebsiteStatus;
  ownership?: 'added' | 'removed';
}

// CRM types
export type LeadStatus =
  | 'new'
  | 'in_progress'
  | 'waiting'
  | 'completed'
  | 'rejected';

export interface CRMSubscription {
  id: number;
  user_id: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CRMLead {
  id: number;
  user_id: number;
  name: string;
  phone?: string;
  email?: string;
  amount?: number;
  status: LeadStatus;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ExportLeadsRequest {
  dateFrom: string;
  dateTo: string;
  format: 'xlsx' | 'csv';
  email: string;
}
