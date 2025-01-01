import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Проверяем авторизацию при изменении URL
    const handleRouteChange = () => {
      checkAuth();
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return { isAuthenticated };
}
