export type UserRole = 'admin' | 'client';

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
