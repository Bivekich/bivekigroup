'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { CloudTariffsModal } from './cloud-tariffs-modal';
import { useCloudTariffsModal } from '@/hooks/use-cloud-tariffs-modal';
import { ListFilter } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

export function CloudBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();
  const { isOpen, open, close } = useCloudTariffsModal();

  const fetchBalance = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/cloud/balance/${user.id}`);
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Баланс</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={open}
          >
            <ListFilter className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '...' : `${balance?.toFixed(2) || 0} ₽`}
          </div>
          <p className="text-xs text-muted-foreground">
            Списание происходит ежедневно
          </p>
        </CardContent>
      </Card>

      <CloudTariffsModal isOpen={isOpen} onClose={close} />
    </>
  );
}
