export type UserRole = 'admin' | 'client';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export type WebsiteStatus = 'development' | 'active' | 'suspended';

export interface Website {
  id: number;
  name: string;
  domain: string;
  status: WebsiteStatus;
  client_id: number;
  created_at?: string;
  last_updated?: string;
}

export interface WebsiteChanges {
  name?: string;
  domain?: string;
  status?: string;
  ownership?: 'added' | 'removed';
}
