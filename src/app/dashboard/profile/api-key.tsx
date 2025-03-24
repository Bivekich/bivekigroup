'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserWithoutPassword } from '@/lib/types';

interface ApiKeyProps {
  user: UserWithoutPassword;
  onApiKeyUpdate: (apiKey: string) => void;
}

export function ApiKeySection({ user, onApiKeyUpdate }: ApiKeyProps) {
  const [generatingKey, setGeneratingKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateApiKey = async () => {
    if (!user) return;

    setGeneratingKey(true);
    try {
      const res = await fetch(`/api/users/${user.id}/api-key`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        onApiKeyUpdate(data.api_key);
        toast({
          title: 'API ключ сгенерирован',
          description: 'Новый API ключ успешно создан и готов к использованию',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сгенерировать API ключ',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Ошибка генерации API ключа:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сгенерировать API ключ',
        variant: 'destructive',
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.api_key || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API ключ</CardTitle>
        <CardDescription>
          Используйте этот ключ для интеграции с внешними сервисами и добавления
          заявок через API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.api_key ? (
          <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto whitespace-nowrap">
            {user.api_key}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-7 w-7"
              onClick={copyToClipboard}
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground">
            У вас еще нет API ключа. Сгенерируйте его, чтобы начать использовать
            API.
          </div>
        )}

        <Button
          onClick={generateApiKey}
          disabled={generatingKey}
          className="w-full sm:w-auto"
        >
          {generatingKey ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Генерация...
            </>
          ) : (
            <>{user?.api_key ? 'Обновить API ключ' : 'Сгенерировать ключ'}</>
          )}
        </Button>

        {user?.api_key && (
          <p className="text-sm text-yellow-500 dark:text-yellow-400">
            Внимание: При обновлении ключа все текущие интеграции перестанут
            работать, и вам нужно будет обновить ключ в ваших приложениях.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
