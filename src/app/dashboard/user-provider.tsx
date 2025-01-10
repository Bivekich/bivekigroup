'use client';

import { createContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user:', error));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
